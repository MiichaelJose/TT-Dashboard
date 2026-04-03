import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuthToken } from "@/lib/apiAuth";
import { Ticket } from "@/types/tomTicket";
import { buildDashboardDetails } from "@/services/metrics.service";

const TOMTICKET_API_BASE = process.env.TOMTICKET_API_BASE;

/**
 * Normaliza o token garantindo que seja sempre uma string limpa
 */
function parseIntegrationToken(token: unknown): string {
  if (typeof token === 'object' && token !== null) {
    const objToken = token as Record<string, unknown>;
    return String(objToken.token || objToken.key || JSON.stringify(token)).trim();
  }
  return String(token).trim();
}

/**
 * Adapter Pattern: Converte a estrutura recebida da API externa (muitas vezes em PT-BR)
 * para a interface padronizada interna 'Ticket'.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTomTicketToInternal(t: any): Ticket {
  const statusValue = String(t.status || t.situation || "");
  const isClosed = statusValue.toLowerCase().includes('fechado') || t.status === 2 || t.status === 3;
  
  return {
    id: String(t.id_chamado || t.id || Math.random().toString(36).substring(2, 11)),
    protocol: t.protocolo || t.protocol || 0,
    subject: t.assunto || t.subject || "Sem Assunto",
    message: t.mensagem || t.message || "",
    status: t.situacao || t.status || (isClosed ? "Fechado" : "Aberto"), 
    situation: t.situacao || "Normal",
    priority: t.prioridade || t.priority || 1,
    created_at: t.data_inclusao || t.data_criacao || t.created_at || new Date().toISOString(),
    updated_at: t.data_alteracao || t.updated_at || new Date().toISOString(),
    operator: t.nome_atendente || t.operator || "Sem Operador",
    department: t.nome_departamento || t.department || "Geral",
    category: t.nome_categoria || t.category || "Geral",
    customer_name: t.nome_cliente || t.customer_name || "Desconhecido",
    customer_email: t.email_cliente || t.customer_email || ""
  };
}

/**
 * Engine responsável unicamente no networking (HTTP Fetch) e repasse para o Adapter.
 */
async function fetchTomTicketTickets(rawToken: unknown): Promise<Ticket[]> {
  try {
    const token = parseIntegrationToken(rawToken);
    
    const res = await fetch(`${TOMTICKET_API_BASE}/ticket/list`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`Status HTTP Inesperado: ${res.status} ao acessar a API do TomTicket.`);
    }

    const payload = await res.json();
    
    // Previne quebras assumindo que a payload possa encapsular o array na prop 'data'
    const rawArray = Array.isArray(payload) ? payload : (payload.data || []);

    return rawArray.map(mapTomTicketToInternal);

  } catch (error) {
    console.error("[TomTicket Fetch Error]:", error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const uid = await verifyAuthToken(req);
    const { companyId } = await req.json();

    if (!companyId || typeof companyId !== 'string') {
      return NextResponse.json({ error: "ID de empresa inválido." }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: "Banco de dados não disponível." }, { status: 500 });
    }

    // Valida se o usuário pertece à empresa
    const memberRef = adminDb.ref(`members/${companyId}/${uid}`);
    const memberSnap = await memberRef.once("value");
    if (!memberSnap.exists()) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    // Busca o Token do Tomticket
    const tokenRef = adminDb.ref(`integrations/${companyId}/tomticket/token`);
    const tokenSnap = await tokenRef.once("value");
    if (!tokenSnap.exists() || !tokenSnap.val()) {
      return NextResponse.json({ error: "Integração TomTicket não configurada ou Token Ausente." }, { status: 400 });
    }
    const token = tokenSnap.val();

    // Controle Anti-F5
    const syncRef = adminDb.ref(`sync/${companyId}`);
    
    // Check state before applying transaction
    const syncSnap = await syncRef.once('value');
    const syncData = syncSnap.val() || {};
    
    // Se está sincornizando ou sincronizou há menos de 60s
    if (syncData.isSyncing || (Date.now() - (syncData.lastSyncAt || 0) < 60000)) {
       return NextResponse.json({ status: "cached" });
    }

    // Tranca a flag isSyncing usando os privilégios do painel
    await syncRef.update({ isSyncing: true });

    try {
      // Busca dados reais de produção
      const tickets = await fetchTomTicketTickets(token);

      // Mapeamento em massa (Batch Update) para o Firebase Realtime Database
      const updates: Record<string, any> = {};
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tickets.forEach((ticket: any) => {
        updates[`tickets/${companyId}/${ticket.id}`] = ticket;
      });

      const period = new Date().toISOString().slice(0, 7); // Format: YYYY-MM
      const details = buildDashboardDetails(tickets, period);

      updates[`metrics/${companyId}/overview/current`] = details;
      updates[`metrics/${companyId}/overview/${period}`] = details;
      
      updates[`sync/${companyId}/lastSyncAt`] = Date.now();
      updates[`sync/${companyId}/isSyncing`] = false;

      await adminDb.ref().update(updates);

      return NextResponse.json({ status: "synced", count: tickets.length, timestamp: Date.now() });
      
    } catch (syncError) {
      // Libera o lock se houver erro ao buscar ou parsear os dados
      await syncRef.update({ isSyncing: false });
      throw syncError;
    }

  } catch (error) {
    console.error("Error generating sync payload:", error);
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message === 'Invalid or expired token')) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }
    return NextResponse.json({ error: "Erro interno do servidor.", details: String(error) }, { status: 500 });
  }
}

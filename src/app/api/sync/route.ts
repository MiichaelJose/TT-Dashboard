import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuthToken } from "@/lib/apiAuth";
import { Ticket } from "@/types/tomTicket";

// Simulation of external API Call
async function fetchMockTickets(): Promise<Ticket[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  return [
    {
      id: "t1",
      protocol: 12345,
      subject: "Erro ao gerar nota fiscal",
      message: "O sistema trava ao tentar emitir a nota fiscal.",
      status: "Em atendimento",
      situation: "Aguardando equipe técnica",
      priority: 3,
      created_at: "2026-03-25T10:00:00Z",
      updated_at: "2026-03-26T11:00:00Z",
      operator: "João Silva",
      department: "Suporte N2",
      category: "Colibri POS",
      customer_name: "Restaurante Sabor & Arte",
      customer_email: "contato@saborearte.com"
    },
    {
      id: "t2",
      protocol: 12346,
      subject: "Dúvida sobre fechamento de caixa",
      message: "Como configurar as sangrias corretamente?",
      status: "Fechado",
      situation: "Resolvido",
      priority: 1,
      created_at: "2026-03-23T09:00:00Z",
      updated_at: "2026-03-23T10:30:00Z",
      operator: "Maria Souza",
      department: "Atendimento N1",
      category: "Manager - PDV Gold",
      customer_name: "Pizzaria Bella Napoli",
      customer_email: "gerencia@bellanapoli.com"
    },
    {
      id: "t3",
      protocol: 12347,
      subject: "Equipamento não conecta na rede",
      message: "A balança perdeu a comunicação com o PDV.",
      status: "Em aberto",
      situation: "Novo",
      priority: 4,
      created_at: "2026-03-27T08:15:00Z",
      updated_at: "2026-03-27T08:15:00Z",
      operator: "Sem operador",
      department: "Infraestrutura",
      category: "Infraestrutura",
      customer_name: "Lanchonete Express",
      customer_email: "express@lanchonete.com.br"
    },
    {
      id: "t4",
      protocol: 12348,
      subject: "Solicitação de novo usuário",
      message: "Favor criar usuário para o novo gerente.",
      status: "Fechado",
      situation: "Resolvido",
      priority: 2,
      created_at: "2026-03-20T14:20:00Z",
      updated_at: "2026-03-21T09:10:00Z",
      operator: "Maria Souza",
      department: "Atendimento N1",
      category: "Habibs Bordéro",
      customer_name: "Cafeteria Central",
      customer_email: "admin@cafeteria.com"
    },
    {
      id: "t5",
      protocol: 12349,
      subject: "Integração iFood não desce pedidos",
      message: "Os pedidos do iFood pararam de integrar no Colibri Fácil há 30 min.",
      status: "Em atendimento",
      situation: "Análise",
      priority: 5,
      created_at: "2026-03-27T10:05:00Z",
      updated_at: "2026-03-27T10:45:00Z",
      operator: "João Silva",
      department: "Suporte N2",
      category: "Colibri Fácil",
      customer_name: "Burger & Co",
      customer_email: "delivery@burgerco.com"
    }
  ];
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
      // API call realocada com mock no momento
      const tickets = await fetchMockTickets();

      // Mapeamento em massa (Batch Update) para o Firebase Realtime Database
      const updates: Record<string, Ticket | string | number | boolean> = {};
      
      tickets.forEach((ticket) => {
        updates[`tickets/${companyId}/${ticket.id}`] = ticket;
      });
      
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
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuthToken } from "@/lib/apiAuth";

export async function GET(req: Request) {
  try {
    const uid = await verifyAuthToken(req);
    
    // extrai query params 
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId');

    if (!companyId || typeof companyId !== 'string') {
      return NextResponse.json({ error: "ID de empresa inválido." }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: "Banco de dados não disponível." }, { status: 500 });
    }

    // Valida permissões
    const memberRef = adminDb.ref(`members/${companyId}/${uid}`);
    const memberSnap = await memberRef.once("value");
    if (!memberSnap.exists()) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    // Busca os tickets armazenados
    const ticketsRef = adminDb.ref(`tickets/${companyId}`);
    const ticketsSnap = await ticketsRef.once("value");
    
    // Converte o Object do Firebase para um Array retornado para o Frontend
    const ticketsData = ticketsSnap.val();
    const ticketsArray = ticketsData ? Object.values(ticketsData) : [];

    return NextResponse.json(ticketsArray);
  } catch (error) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message === 'Invalid or expired token')) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}

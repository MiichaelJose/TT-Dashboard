import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuthToken } from "@/lib/apiAuth";

export async function GET(req: Request) {
  try {
    const uid = await verifyAuthToken(req);
    
    // extrai query params 
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId');
    const period = searchParams.get('period') || 'current'; // Defaults to current

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

    // Busca as métricas pré-calculadas armazenadas
    const metricsRef = adminDb.ref(`metrics/${companyId}/overview/${period}`);
    const metricsSnap = await metricsRef.once("value");
    
    if (!metricsSnap.exists()) {
      return NextResponse.json(null, { status: 404 });
    }

    const metricsData = metricsSnap.val();

    return NextResponse.json(metricsData);
  } catch (error) {
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message === 'Invalid or expired token')) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }
    return NextResponse.json({ error: "Erro interno do servidor.", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

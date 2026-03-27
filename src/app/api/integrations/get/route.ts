import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuthToken } from "@/lib/apiAuth";

export async function GET(req: Request) {
  try {
    const uid = await verifyAuthToken(req);

    // Get companyId from query params
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");

    if (!companyId || typeof companyId !== 'string') {
      return NextResponse.json({ error: "ID de empresa inválido." }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: "Banco de dados não disponível." }, { status: 500 });
    }

    // Check if the user is a member of the company
    const memberRef = adminDb.ref(`members/${companyId}/${uid}`);
    const memberSnapshot = await memberRef.once("value");

    if (!memberSnapshot.exists()) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    // Get the integration status
    const integrationRef = adminDb.ref(`integrations/${companyId}/tomticket`);
    const snapshot = await integrationRef.once("value");

    if (snapshot.exists()) {
      const data = snapshot.val();
      return NextResponse.json({
        active: data.active === true,
        hasToken: !!data.token,
      });
    }
    
    return NextResponse.json({ active: false, hasToken: false });

  } catch (error) {
    console.error("Error getting integration token:", error);
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message === 'Invalid or expired token')) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}

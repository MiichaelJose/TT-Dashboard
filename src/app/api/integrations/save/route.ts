import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuthToken } from "@/lib/apiAuth";

export async function POST(req: Request) {
  try {
    const uid = await verifyAuthToken(req);
    const { companyId, token } = await req.json();

    if (!companyId || typeof companyId !== 'string') {
      return NextResponse.json({ error: "ID de empresa inválido." }, { status: 400 });
    }

    if (!token || typeof token !== 'string' || !token.trim()) {
      return NextResponse.json({ error: "O token não pode estar vazio." }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: "Banco de dados não disponível." }, { status: 500 });
    }

    // Check if the user is a member of the company
    const memberRef = adminDb.ref(`members/${companyId}/${uid}`);
    const snapshot = await memberRef.once("value");

    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const updates: Record<string, string | boolean> = {};
    updates[`integrations/${companyId}/tomticket/token`] = token.trim();
    updates[`integrations/${companyId}/tomticket/active`] = true;
    
    await adminDb.ref().update(updates);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error saving integration token:", error);
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message === 'Invalid or expired token')) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}

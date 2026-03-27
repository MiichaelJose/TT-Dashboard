import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuthToken } from "@/lib/apiAuth";

export async function POST(req: Request) {
  try {
    const uid = await verifyAuthToken(req);
    const { inviteCode } = await req.json();

    if (!inviteCode || typeof inviteCode !== 'string') {
      return NextResponse.json({ error: "Código de convite inválido." }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: "Banco de dados não disponível." }, { status: 500 });
    }

    // Buscar empresa pelo código de convite
    const companiesRef = adminDb.ref("companies");
    const snapshot = await companiesRef.orderByChild("inviteCode").equalTo(inviteCode).once("value");

    if (!snapshot.exists()) {
      return NextResponse.json({ error: "Código de convite inválido ou empresa não encontrada." }, { status: 404 });
    }

    const companies = snapshot.val();
    const companyId = Object.keys(companies)[0];

    if (!companyId) {
      return NextResponse.json({ error: "Falha ao encontrar empresa." }, { status: 500 });
    }

    const updates: Record<string, any> = {};

    // 1. Add user to members list as agent
    updates[`members/${companyId}/${uid}`] = "agent";

    // 2. Update user profile to point to company
    updates[`users/${uid}/companyId`] = companyId;
    updates[`users/${uid}/role`] = "agent";

    // Execute atomic update
    await adminDb.ref().update(updates);

    return NextResponse.json({ companyId });

  } catch (error) {
    console.error("Error joining company:", error);
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message === 'Invalid or expired token')) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}

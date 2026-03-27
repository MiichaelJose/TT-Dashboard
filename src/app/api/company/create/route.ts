import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuthToken } from "@/lib/apiAuth";
import * as admin from 'firebase-admin';

function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(req: Request) {
  try {
    const uid = await verifyAuthToken(req);
    const { name } = await req.json();

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: "Nome de empresa inválido." }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: "Banco de dados não disponível." }, { status: 500 });
    }

    const companiesRef = adminDb.ref("companies");
    const newCompanyRef = companiesRef.push();
    const companyId = newCompanyRef.key;

    if (!companyId) {
      return NextResponse.json({ error: "Erro ao gerar ID da empresa." }, { status: 500 });
    }

    const inviteCode = generateInviteCode();
    const updates: Record<string, any> = {};

    // 1. Create company record
    updates[`companies/${companyId}`] = {
      name,
      ownerId: uid,
      inviteCode,
      createdAt: admin.database.ServerValue.TIMESTAMP,
    };

    // 2. Link user as owner in members list
    updates[`members/${companyId}/${uid}`] = "owner";

    // 3. Update user profile to point to company
    updates[`users/${uid}/companyId`] = companyId;
    updates[`users/${uid}/role`] = "owner";

    // Execute atomic update
    await adminDb.ref().update(updates);

    return NextResponse.json({ companyId });

  } catch (error) {
    console.error("Error creating company:", error);
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message === 'Invalid or expired token')) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}

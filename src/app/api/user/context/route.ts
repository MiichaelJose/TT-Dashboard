import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuthToken } from "@/lib/apiAuth";

export async function GET(req: Request) {
  try {
    const uid = await verifyAuthToken(req);

    if (!adminDb) {
      return NextResponse.json({ error: "Banco de dados não disponível." }, { status: 500 });
    }

    const userRef = adminDb.ref(`users/${uid}`);
    const snapshot = await userRef.once('value');

    if (snapshot.exists()) {
      const data = snapshot.val();
      if (data.companyId && data.role) {
        return NextResponse.json({
          companyId: data.companyId,
          role: data.role,
        });
      }
    }

    return NextResponse.json(null);

  } catch (error) {
    console.error("Error fetching user context:", error);
    if (error instanceof Error && (error.message === 'Unauthorized' || error.message === 'Invalid or expired token')) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}

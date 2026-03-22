import { rdb } from "@/lib/firebase";
import { ref, get, update, push, query, orderByChild, equalTo, serverTimestamp } from "firebase/database";

export interface UserContext {
  companyId: string;
  role: "owner" | "agent";
}

/**
 * Searches the RDB for a user's company context
 */
export async function getUserContext(uid: string): Promise<UserContext | null> {
  const userRef = ref(rdb, `users/${uid}`);
  const snapshot = await get(userRef);
  
  if (snapshot.exists()) {
    const data = snapshot.val();
    if (data.companyId && data.role) {
      return {
        companyId: data.companyId,
        role: data.role,
      };
    }
  }
  return null;
}

/**
 * Generates a random invite code
 */
function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * Finds a company ID by its invite code
 */
export async function getCompanyByInviteCode(inviteCode: string): Promise<string | null> {
  const companiesRef = ref(rdb, "companies");
  const q = query(companiesRef, orderByChild("inviteCode"), equalTo(inviteCode));
  const snapshot = await get(q);

  if (snapshot.exists()) {
    // snapshot.val() will be an object with the companyId as key
    const companies = snapshot.val();
    const companyId = Object.keys(companies)[0];
    return companyId || null;
  }
  return null;
}

/**
 * Creates a new company and links the user as owner
 */
export async function createCompany(uid: string, name: string): Promise<string> {
  const companiesRef = ref(rdb, "companies");
  const newCompanyRef = push(companiesRef);
  const companyId = newCompanyRef.key;

  if (!companyId) {
    throw new Error("Failed to generate company ID");
  }

  const inviteCode = generateInviteCode();
  
  // Prepare multi-path update object
  const updates: Record<string, string | object | number | boolean | null> = {};

  // 1. Create company record
  updates[`companies/${companyId}`] = {
    name,
    ownerId: uid,
    inviteCode,
    createdAt: serverTimestamp(),
  };

  // 2. Link user as owner in members list
  updates[`members/${companyId}/${uid}`] = "owner";

  // 3. Update user profile to point to company
  updates[`users/${uid}/companyId`] = companyId;
  updates[`users/${uid}/role`] = "owner";

  // Execute atomic update
  await update(ref(rdb), updates);

  return companyId;
}

/**
 * Joins an existing company using an invite code
 */
export async function joinCompany(uid: string, inviteCode: string): Promise<string> {
  const companyId = await getCompanyByInviteCode(inviteCode);

  if (!companyId) {
    throw new Error("Código de convite inválido ou empresa não encontrada.");
  }

  // Prepara multi-path update object
  const updates: Record<string, string | object | number | boolean | null> = {};

  // 1. Add user to members list as agent
  updates[`members/${companyId}/${uid}`] = "agent";

  // 2. Update user profile to point to company
  updates[`users/${uid}/companyId`] = companyId;
  updates[`users/${uid}/role`] = "agent";

  // Execute atomic update
  await update(ref(rdb), updates);

  return companyId;
}

/**
 * Salva o token de integração do TomTicket no Realtime Database
 */
export async function saveIntegrationToken(companyId: string, token: string): Promise<void> {
  if (!token.trim()) {
    throw new Error("O token não pode estar vazio.");
  }
  
  const updates: Record<string, string | boolean> = {};
  updates[`integrations/${companyId}/tomticket/token`] = token.trim();
  updates[`integrations/${companyId}/tomticket/active`] = true;
  
  await update(ref(rdb), updates);
}

/**
 * Busca o token de integração do TomTicket
 */
export async function getIntegrationToken(companyId: string): Promise<string | null> {
  const tokenRef = ref(rdb, `integrations/${companyId}/tomticket/token`);
  const snapshot = await get(tokenRef);
  
  if (snapshot.exists()) {
    return snapshot.val();
  }
  
  return null;
}

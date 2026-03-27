import { auth } from "@/lib/firebase";

export interface UserContext {
  companyId: string;
  role: "owner" | "agent";
}

async function getAuthToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Usuário não autenticado.");
  }
  return await user.getIdToken();
}

/**
 * Searches the RDB for a user's company context
 */
export async function getUserContext(_uid: string): Promise<UserContext | null> {
  try {
    const token = await getAuthToken();
    const response = await fetch("/api/user/context", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data || null;
  } catch (error) {
    console.error("Failed to fetch user context", error);
    return null;
  }
}

/**
 * Creates a new company and links the user as owner
 */
export async function createCompany(_uid: string, name: string): Promise<string> {
  const token = await getAuthToken();
  const response = await fetch("/api/company/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Erro ao criar empresa");
  }

  return data.companyId;
}

/**
 * Joins an existing company using an invite code
 */
export async function joinCompany(_uid: string, inviteCode: string): Promise<string> {
  const token = await getAuthToken();
  const response = await fetch("/api/company/join", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ inviteCode })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Erro ao entrar na empresa");
  }

  return data.companyId;
}

/**
 * Salva o token de integração do TomTicket no Realtime Database via API Route
 */
export async function saveIntegrationToken(companyId: string, token: string): Promise<void> {
  if (!token.trim()) {
    throw new Error("O token não pode estar vazio.");
  }
  
  const authToken = await getAuthToken();
  const response = await fetch("/api/integrations/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`
    },
    body: JSON.stringify({ companyId, token: token.trim() })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Erro ao salvar token");
  }
}

/**
 * Busca o status de integração do TomTicket
 * Nota: Retorna apenas se o token existe e está ativo p/ n expor a chave cliente.
 * Se houver necessidade do hash token no frontend (não recomendado), reverte.
 */
export async function getIntegrationToken(companyId: string): Promise<string | null> {
  const authToken = await getAuthToken();
  const response = await fetch(`/api/integrations/get?companyId=${companyId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });

  if (!response.ok) {
    return null;
  }
  
  const data = await response.json();
  // Para manter compatibilidade com o hook atual de Settings que espera um token
  // Retorna uma string fixa se estiver ok
  if (data.active && data.hasToken) {
    return "********-****-****-****-************";
  }
  
  return null;
}

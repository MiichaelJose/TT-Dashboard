"use client";

import { useState } from "react";
import { Loader2, Building, Key } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { setCompanyContext } from "@/lib/redux/slices/authSlice";
import { createCompany, joinCompany } from "@/lib/services/companyService";

export function OnboardingModal() {
  const { user, isContextLoaded } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  const [companyName, setCompanyName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Segurança principal: Nao bloqueia a renderização se já tiver companyId
  // Aguarda o isContextLoaded para evitar flicker
  if (!isContextLoaded || !user || user.companyId) {
    return null;
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setError("O nome da empresa é obrigatório.");
      return;
    }
    
    setError("");
    setLoading(true);

    try {
      const newCompanyId = await createCompany(user.uid, companyName);
      
      // Atualiza o contexto do usuário localmente para liberar a tela
      dispatch(setCompanyContext({ companyId: newCompanyId, role: "owner" }));
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar empresa. Tente novamente.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      setError("O código de convite é obrigatório.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const companyId = await joinCompany(user.uid, inviteCode);
      
      // Atualiza contexto Redux apontando para empresa encontrada
      dispatch(setCompanyContext({ companyId, role: "agent" }));
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Código de convite inválido ou erro de permissão.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-999 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden text-zinc-900 dark:text-zinc-100 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-6 pt-8 pb-6 text-center border-b border-zinc-100 dark:border-zinc-800/50">
          <div className="w-14 h-14 bg-[#3169d3]/10 text-[#3169d3] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Bem-vindo(a)!</h2>
          <p className="text-[15px] text-zinc-500 dark:text-zinc-400">
            Para continuar utilizando o dashboard, vincule seu usuário a uma empresa.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <button
            onClick={() => { setActiveTab("create"); setError(""); }}
            className={`flex-1 py-3.5 text-[14px] font-medium transition-colors border-b-2 ${
              activeTab === "create" 
                ? "border-[#3169d3] text-[#3169d3]" 
                : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            Criar nova empresa
          </button>
          <button
            onClick={() => { setActiveTab("join"); setError(""); }}
            className={`flex-1 py-3.5 text-[14px] font-medium transition-colors border-b-2 ${
              activeTab === "join" 
                ? "border-[#3169d3] text-[#3169d3]" 
                : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            Entrar com código
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-5 p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[13.5px] font-medium border border-red-200 dark:border-red-900/30 text-center">
              {error}
            </div>
          )}

          {activeTab === "create" ? (
            <form onSubmit={handleCreate} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[13.5px] font-medium text-zinc-700 dark:text-zinc-300">
                  Nome da Empresa
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Building className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={loading}
                    placeholder="Ex: Minha Empresa LTDA"
                    autoFocus
                    className="w-full h-11 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-700 rounded-md pl-10 pr-4 text-[14.5px] focus:outline-none focus:border-[#3169d3] focus:ring-1 focus:ring-[#3169d3] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !companyName.trim()}
                className="w-full h-11 bg-[#3169d3] hover:bg-[#2855b0] text-white rounded-md text-[15px] font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Criar empresa"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[13.5px] font-medium text-zinc-700 dark:text-zinc-300">
                  Código de Convite
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Key className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    disabled={loading}
                    placeholder="Cole o código fornecido"
                    autoFocus
                    className="w-full h-11 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-700 rounded-md pl-10 pr-4 text-[14.5px] focus:outline-none focus:border-[#3169d3] focus:ring-1 focus:ring-[#3169d3] uppercase transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !inviteCode.trim()}
                className="w-full h-11 bg-[#3169d3] hover:bg-[#2855b0] text-white rounded-md text-[15px] font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar na empresa"}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

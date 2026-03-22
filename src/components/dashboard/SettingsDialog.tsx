"use client";

import { useState, useEffect } from "react";
import { X, Settings, Link as LinkIcon, Save, Eye, EyeOff, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { saveIntegrationToken, getIntegrationToken } from "@/lib/services/companyService";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function SettingsDialog({ isOpen, onClose }: Props) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState("integrations");
  
  // Form State
  const [tomTicketToken, setTomTicketToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchIntegrationSettings = async () => {
      if (!user?.companyId) return;
      setIsLoading(true);
      setSaveMessage({ type: "", text: "" });
      try {
        const token = await getIntegrationToken(user.companyId);
        if (token) {
          setTomTicketToken(token);
        }
      } catch (e) {
        console.error("Error fetching settings:", e);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && user?.companyId && activeTab === "integrations") {
      fetchIntegrationSettings();
    }
  }, [isOpen, user?.companyId, activeTab]);

  const handleSave = async () => {
    if (!user?.companyId) return;
    
    if (!tomTicketToken.trim()) {
      setSaveMessage({ type: "error", text: "O token não pode estar vazio." });
      return;
    }
    
    setIsSaving(true);
    setSaveMessage({ type: "", text: "" });

    try {
      await saveIntegrationToken(user.companyId, tomTicketToken);
      setSaveMessage({ type: "success", text: "Token salvo com sucesso!" });
    } catch (e) {
      console.error("Erro ao salvar:", e);
      const errMessage = e instanceof Error ? e.message : "Erro ao salvar integração.";
      setSaveMessage({ type: "error", text: errMessage });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage({ type: "", text: "" }), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
      <div className="bg-white dark:bg-[#1A1A1A] w-full max-w-[800px] h-[600px] flex rounded-xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
        
        {/* Sidebar */}
        <div className="w-[240px] border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#151515] p-4 flex flex-col">
          <h2 className="text-xl font-bold mb-6 text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-zinc-500" />
            Configurações
          </h2>
          
          <nav className="flex flex-col gap-1">
            <button 
              onClick={() => setActiveTab("integrations")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-[14.5px] font-medium transition-colors ${
                activeTab === "integrations" 
                  ? "bg-[#3169d3]/10 text-[#3169d3] dark:bg-[#3169d3]/20 dark:text-[#8aaef6]" 
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800"
              }`}
            >
              <LinkIcon className="w-[18px] h-[18px]" />
              Integrações
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col relative text-zinc-900 dark:text-zinc-100 bg-white dark:bg-[#1A1A1A]">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8 pb-10 flex-1 overflow-y-auto w-full">
            {activeTab === "integrations" && (
              <div className="max-w-[480px]">
                <h3 className="text-2xl font-bold mb-1 tracking-tight text-zinc-900 dark:text-white">Integrações</h3>
                <p className="text-[15px] text-zinc-500 dark:text-zinc-400 mb-8">
                  Conecte o TomTicket informando o token de Webhook para sincronizar painéis e métricas.
                </p>

                <div className="space-y-6">
                  {/* TomTicket Panel */}
                  <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#151515] rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 bg-[#3169d3]/10 dark:bg-[#3169d3]/20 text-[#3169d3] dark:text-[#8aaef6] rounded flex items-center justify-center font-bold text-lg">
                        TT
                      </div>
                      <div>
                        <h4 className="font-semibold text-[16px] text-zinc-900 dark:text-zinc-100">TomTicket Webhook</h4>
                        <p className="text-[13px] text-zinc-500 dark:text-zinc-400">Sincronização de dados via Webhook API.</p>
                      </div>
                    </div>

                    <div className="space-y-2 relative">
                      <label className="text-[14px] font-medium text-zinc-700 dark:text-zinc-300">
                        Token de Autenticação
                      </label>
                      <div className="relative">
                        <input 
                          type={showToken ? "text" : "password"}
                          value={tomTicketToken}
                          onChange={(e) => setTomTicketToken(e.target.value)}
                          placeholder="Cole seu token do TomTicket aqui"
                          className="w-full h-11 bg-white dark:bg-[#1A1A1A] border border-zinc-300 dark:border-zinc-700 rounded-md px-4 pr-12 text-[14.5px] focus:outline-none focus:border-[#3169d3] focus:ring-1 focus:ring-[#3169d3] text-zinc-900 dark:text-zinc-100 transition-colors"
                          disabled={isLoading || isSaving}
                        />
                        <button 
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                          onClick={() => setShowToken(!showToken)}
                        >
                          {showToken ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                        </button>
                      </div>
                      <p className="text-[12.5px] text-zinc-500 dark:text-zinc-500 mt-1">
                        Utilize o painel do TomTicket para gerar uma chave para sua conta.
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800/80">
                      {saveMessage.text && (
                        <span className={`text-[13.5px] font-medium ${saveMessage.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
                          {saveMessage.text}
                        </span>
                      )}
                      
                      <button
                        onClick={handleSave}
                        disabled={isSaving || isLoading}
                        className="bg-[#3169d3] hover:bg-[#2855b0] text-white px-5 py-2 rounded-md text-[14px] font-medium flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" /> Salvar Token
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

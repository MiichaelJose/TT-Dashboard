"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { OverviewSection } from "@/components/dashboard/OverviewSection";
import { AnalyticsSection } from "@/components/dashboard/AnalyticsSection";
import { useTriggerSyncMutation } from "@/lib/redux/slices/tomTicketApi";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const companyId = user?.companyId as string;

  const [triggerSync, { isLoading: isSyncing }] = useTriggerSyncMutation();
  
  // Hook centralizado para as métricas (faz a ponte entre Front e Service/API)
  const { details, loading: isFetchingMetrics } = useDashboardData(companyId);

  const [syncMessage, setSyncMessage] = useState<{ text: string; type: 'info' | 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!companyId) return;

    // Trigger sync on mount para aquecer os mocks e Firebase
    triggerSync(companyId)
      .unwrap()
      .then((res) => {
        if (res.status === 'synced') {
          setSyncMessage({ text: "Dados atualizados com sucesso!", type: 'success' });
        } else if (res.status === 'cached') {
          setSyncMessage({ text: "Dados recentes carregados.", type: 'info' });
        }
      })
      .catch(() => {
        setSyncMessage({ text: "Problema ao sincronizar chamados. Mostrando dados locais.", type: 'error' });
      })
      .finally(() => {
        setTimeout(() => setSyncMessage(null), 5000);
      });
  }, [companyId, triggerSync]);

  const accountName = user?.displayName || user?.email?.split('@')[0] || "usuário";

  const isLoading = isSyncing || isFetchingMetrics;

  return (
    <div className="max-w-[1400px] w-full mx-auto relative">
      
      {/* Toast flutuante rudimentar para exibir status da refatoração */}
      {syncMessage && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg text-sm font-medium animate-in slide-in-from-top-4 fade-in duration-300
          ${syncMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
            syncMessage.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 
            'bg-blue-50 text-blue-700 border border-blue-200'}`}
        >
          {syncMessage.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
          {syncMessage.type === 'error' && <AlertCircle className="w-4 h-4" />}
          {syncMessage.type === 'info' && <CheckCircle2 className="w-4 h-4" />}
          {syncMessage.text}
        </div>
      )}

      {/* Greeting section */}
      <div className="mb-11">
        <h1 className="text-[36px] font-semibold text-zinc-800 dark:text-zinc-50 tracking-tight mb-4">
          Olá, <span className="text-[#3169d3] font-bold">{accountName}</span>.
        </h1>
        <p className="text-[17px] text-zinc-500 dark:text-zinc-400 max-w-[880px] leading-relaxed">
          Utilize todos os gráficos nesse dashboard para controlar as finanças da sua empresa, 
          conhecer as vendas de cada produto, analisar informações da empresa e muito mais!
        </p>
      </div>

      {isLoading && !details ? (
        <div className="flex flex-col items-center justify-center p-20 text-zinc-500 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#3169d3]" />
          <p className="text-sm font-medium">Extraindo métricas do Dashboard...</p>
        </div>
      ) : details ? (
        <>
          <OverviewSection 
            summary={details.summary} 
            sla={details.sla} 
            time={details.time} 
            csat={details.csat} 
          />
          <AnalyticsSection charts={details.charts} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-20 text-zinc-500 gap-4">
          <AlertCircle className="w-8 h-8 text-orange-400" />
          <p className="text-sm font-medium">Nenhum dado encontrado para exibição.</p>
        </div>
      )}

    </div>
  );
}

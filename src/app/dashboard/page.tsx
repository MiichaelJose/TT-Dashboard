"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { OverviewSection } from "@/components/dashboard/OverviewSection";

export default function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth);

  // Deriva o nome do usuário a partir do displayName ou do email da sessão
  const accountName = user?.displayName || user?.email?.split('@')[0] || "usuário";

  return (
    <div className="max-w-[1400px] w-full mx-auto">
      {/* Greeting section matching mockup exactly */}
      <div className="mb-11">
        <h1 className="text-[36px] font-semibold text-zinc-800 dark:text-zinc-50 tracking-tight mb-4">
          Olá, <span className="text-[#3169d3] font-bold">{accountName}</span>.
        </h1>
        <p className="text-[17px] text-zinc-500 dark:text-zinc-400 max-w-[880px] leading-relaxed">
          Utilize todos os gráficos nesse dashboard para controlar as finanças da sua empresa, 
          conhecer as vendas de cada produto, analisar informações da empresa e muito mais!
        </p>
      </div>

      {/* Visão Geral (Overview) */}
      <OverviewSection />

      {/* 
        Aviso para o desenvolvedor: 
        Abaixo entraria a parte "Estátisticas Gerais" e "Faturamento" que o usuário demarcou de vermelho, 
        que será implementada no futuro.
      */}
      <div className="h-4 flex items-center justify-center border-t border-dashed border-zinc-200 dark:border-zinc-800 mt-12 py-12">
        <p className="text-zinc-400 dark:text-zinc-600 text-sm">Área de Gráficos e Filtros (Aguardando implementação)</p>
      </div>
    </div>
  );
}

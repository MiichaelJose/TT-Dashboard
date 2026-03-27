"use client";

import { BarChart3 } from "lucide-react";
import { TicketsOpenVsClosedChart } from "./charts/TicketsOpenVsClosedChart";
import { OpenTicketsByCategoryChart } from "./charts/OpenTicketsByCategoryChart";
import { TicketTypesPieChart } from "./charts/TicketTypesPieChart";
import { TicketsByCategoryChart } from "./charts/TicketsByCategoryChart";
import { TopRequestersChart } from "./charts/TopRequestersChart";

export function AnalyticsSection() {
  return (
    <section className="mb-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both mt-12">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[20px] font-bold text-zinc-800 dark:text-zinc-100 tracking-tight flex items-center gap-2">
          Análises de Chamados
        </h2>
        {/* Optional decorative icon or button */}
        <div className="hidden sm:flex items-center gap-2 text-[13px] font-medium text-zinc-500 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-md shadow-sm">
          <BarChart3 className="w-4 h-4 text-[#3169d3]" />
          Visualização Analítica
        </div>
      </div>

      {/* Row 1: Abaertos vs Fechados & Em Aberto Por Categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <TicketsOpenVsClosedChart />
        <OpenTicketsByCategoryChart />
      </div>

      {/* Row 2: Tipo de Chamados & Chamados por Categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-1">
          <TicketTypesPieChart />
        </div>
        <div className="lg:col-span-2">
          <TicketsByCategoryChart />
        </div>
      </div>

      {/* Row 3: Top 10 Solicitantes */}
      <div className="grid grid-cols-1 gap-4">
        <TopRequestersChart />
      </div>

    </section>
  );
}

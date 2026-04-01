"use client";

import { 
  TicketCheck, 
  Ticket as TicketIcon, 
  Clock, 
  AlertCircle, 
  Target 
} from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { OverviewMetrics } from "@/types/dashboard";

ChartJS.register(ArcElement, Tooltip, Legend);

interface OverviewSectionProps {
  data: OverviewMetrics;
}

export function OverviewSection({ data }: OverviewSectionProps) {
  const gaugeData = {
    labels: ["SLA Atual", "Faltante para Meta"],
    datasets: [
      {
        data: [data.csat.score, 100 - data.csat.score],
        backgroundColor: [
          data.csat.status === "ok" ? "#10b981" : "#f97316", 
          "#f4f4f5"
        ],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
        cutout: "80%",
      },
    ],
  };

  const gaugeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    events: [],
  };

  return (
    <section className="mb-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-[20px] font-bold text-zinc-800 dark:text-zinc-100 mb-5 tracking-tight flex items-center gap-2">
        Visão Geral
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        
        {/* CARD 1: Total de Chamados */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs flex flex-col transition-shadow hover:shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-[14.5px] font-medium text-zinc-500 dark:text-zinc-400 leading-tight">
              Total de Chamados
            </h3>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
              <TicketIcon className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-auto">
            <p className="text-[32px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-none mb-1">
              {data.totalTickets.toLocaleString("pt-BR")}
            </p>
            <p className="text-[12.5px] text-zinc-400 dark:text-zinc-500 font-medium">
              Volume no período
            </p>
          </div>
        </div>

        {/* CARD 2: Total Fechados */}
        <div className="bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-5 shadow-xs flex flex-col relative overflow-hidden transition-shadow hover:shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 dark:bg-emerald-900/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <div className="flex items-start justify-between mb-4 relative z-10">
            <h3 className="text-[14.5px] font-medium text-zinc-500 dark:text-zinc-400 leading-tight">
              Total Fechados
            </h3>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <TicketCheck className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-auto relative z-10">
            <p className="text-[32px] font-bold text-emerald-600 dark:text-emerald-400 tracking-tight leading-none mb-2">
              {data.totalClosed.toLocaleString("pt-BR")}
            </p>
            <div className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 text-[12px] font-medium text-emerald-700 dark:text-emerald-400">
              {data.closureRate}% taxa de fechamento
            </div>
          </div>
        </div>

        {/* CARD 3: Em Aberto */}
        <div className="bg-white dark:bg-zinc-900 border border-orange-100 dark:border-orange-900/30 rounded-xl p-5 shadow-xs flex flex-col relative overflow-hidden transition-shadow hover:shadow-sm">
          <div className="absolute top-0 left-0 w-24 h-24 bg-orange-50 dark:bg-orange-900/10 rounded-full blur-2xl -ml-8 -mt-8 pointer-events-none" />
          <div className="flex items-start justify-between mb-4 relative z-10">
            <h3 className="text-[14.5px] font-medium text-zinc-500 dark:text-zinc-400 leading-tight">
              Em Aberto
            </h3>
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <AlertCircle className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-auto relative z-10">
            <p className="text-[32px] font-bold text-orange-500 dark:text-orange-400 tracking-tight leading-none mb-1">
              {data.totalOpen.toLocaleString("pt-BR")}
            </p>
            <p className="text-[12.5px] text-orange-600/70 dark:text-orange-400/70 font-medium">
              Aguardando atendimento
            </p>
          </div>
        </div>

        {/* CARD 4: SLA e Tempo */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs flex flex-col transition-shadow hover:shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-[14.5px] font-medium text-zinc-500 dark:text-zinc-400 leading-tight">
              SLA e Tempo
            </h3>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Clock className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-auto space-y-3">
            <div className="flex items-center justify-between text-[13px] font-medium">
              <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded">
                {data.sla.attendedPercentage}% atendido
              </span>
              <span className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded">
                {data.sla.overduePercentage}% extrapolado
              </span>
            </div>
            {/* ProgressBar Visual SLA */}
            <div className="w-full h-1.5 rounded-full bg-red-100 dark:bg-red-900/30 overflow-hidden flex">
              <div className="h-full bg-emerald-500" style={{ width: `${data.sla.attendedPercentage}%` }} />
              <div className="h-full bg-red-500" style={{ width: `${data.sla.overduePercentage}%` }} />
            </div>
            <div className="flex flex-col gap-0.5 pt-1">
              <div className="flex justify-between items-center text-[13px] text-zinc-600 dark:text-zinc-300">
                <span>TME:</span>
                <span className="font-semibold text-zinc-900 dark:text-white">{data.time.tme}</span>
              </div>
              <div className="flex justify-between items-center text-[13px] text-zinc-600 dark:text-zinc-300">
                <span>TMA:</span>
                <span className="font-semibold text-zinc-900 dark:text-white">{data.time.tma}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 5: Indicador de Meta (Gauge) */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs flex flex-col items-center justify-between transition-shadow hover:shadow-sm">
          <div className="w-full flex items-start justify-between mb-2">
            <h3 className="text-[14.5px] font-medium text-zinc-500 dark:text-zinc-400 leading-tight">
              CSAT (Satisfação)
            </h3>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
              <Target className="w-4.5 h-4.5" />
            </div>
          </div>
          
          <div className="relative w-full h-[70px] flex items-end justify-center mt-2">
            <div className="absolute inset-0 pb-2">
              <Doughnut data={gaugeData} options={gaugeOptions} />
            </div>
            <div className="flex flex-col items-center translate-y-2">
              <span className="text-[22px] font-bold text-zinc-900 dark:text-white leading-none">
                91.7%
              </span>
              <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider mt-1">
                Meta 95%
              </span>
            </div>
          </div>
          
          <div className="w-full text-center mt-4">
            <span className="inline-block text-[12px] font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2.5 py-1 rounded-md">
              Abaixo da meta
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

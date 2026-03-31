"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Ticket } from "@/types/tomTicket";
import { useMemo } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TicketsOpenVsClosedChartProps {
  tickets: Ticket[];
}

export function TicketsOpenVsClosedChart({ tickets }: TicketsOpenVsClosedChartProps) {
  const data = useMemo(() => {
    // Group by month-year
    const group: Record<string, { open: number; closed: number }> = {};

    tickets.forEach((t) => {
      const date = new Date(t.created_at);
      const monthStr = date.toLocaleString('pt-BR', { month: 'short' });
      const yearStr = date.toLocaleString('pt-BR', { year: '2-digit' });
      const label = `${monthStr.charAt(0).toUpperCase() + monthStr.slice(1)}/${yearStr}`;

      if (!group[label]) group[label] = { open: 0, closed: 0 };

      const isClosed = (t.status || '').toLowerCase().includes('fechado');
      if (isClosed) group[label].closed += 1;
      else group[label].open += 1;
    });

    // Sort labels chronologically (simplification: assume keys are somewhat ordered by creation or we just use extracted keys)
    // A more robust apporach would sort them by Date.
    const labels = Object.keys(group).sort((a,b) => {
      // Very basic sort because the mock format is MM/YY
      return a.localeCompare(b);
    });

    return {
      labels,
      datasets: [
        {
          label: "Fechados",
          data: labels.map((l) => group[l].closed),
          backgroundColor: "#10b981", // Emerald-500
          borderRadius: 4,
          barPercentage: 0.6,
          categoryPercentage: 0.8,
        },
        {
          label: "Abertos",
          data: labels.map((l) => group[l].open),
          backgroundColor: "#3169d3", // Brand Blue
          borderRadius: 4,
          barPercentage: 0.6,
          categoryPercentage: 0.8,
        },
      ],
    };
  }, [tickets]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        align: "end" as const,
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          color: "#71717a", // zinc-500
          font: {
            size: 13,
            family: "'Inter', sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: "#18181b", // zinc-900
        titleColor: "#e4e4e7", // zinc-200
        bodyColor: "#a1a1aa", // zinc-400
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#71717a",
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "#e4e4e7", // zinc-200
          drawBorder: false,
          borderDash: [5, 5],
        },
        ticks: {
          color: "#71717a",
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs flex flex-col h-[380px] transition-shadow hover:shadow-sm">
      <h3 className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-100 mb-6 tracking-tight">
        Chamados Abertos vs Fechados
      </h3>
      <div className="flex-1 w-full relative">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

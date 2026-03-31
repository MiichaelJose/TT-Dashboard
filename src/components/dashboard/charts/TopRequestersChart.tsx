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

interface TopRequestersChartProps {
  tickets: Ticket[];
}

export function TopRequestersChart({ tickets }: TopRequestersChartProps) {
  const data = useMemo(() => {
    const group: Record<string, number> = {};
    
    tickets.forEach(t => {
      const customer = t.customer_name || "Sem Nome";
      group[customer] = (group[customer] || 0) + 1;
    });

    const sortedCustomers = Object.keys(group).sort((a, b) => group[b] - group[a]).slice(0, 10);

    return {
      labels: sortedCustomers,
      datasets: [
        {
          label: "Solicitações",
          data: sortedCustomers.map(c => group[c]),
          // Using a gradient-like approach or emerald color for ranking
          backgroundColor: "#10b981", // Emerald-500
          borderRadius: 4,
          barPercentage: 0.6,
        },
      ],
    };
  }, [tickets]);

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#18181b",
        titleColor: "#e4e4e7",
        bodyColor: "#a1a1aa",
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          color: "#e4e4e7",
          drawBorder: false,
          borderDash: [5, 5],
        },
        ticks: {
          color: "#71717a",
          font: { size: 12 },
        },
        border: { display: false },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#52525b",
          font: { size: 12, weight: "bold" as const },
        },
        border: { display: false },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs flex flex-col h-[420px] transition-shadow hover:shadow-sm">
      <h3 className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-100 mb-6 tracking-tight">
        Top 10 Solicitantes por Chamados
      </h3>
      <div className="flex-1 w-full relative">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

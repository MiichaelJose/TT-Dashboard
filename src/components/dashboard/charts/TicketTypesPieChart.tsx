"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export function TicketTypesPieChart() {
  const data = {
    labels: [
      "Dúvida/Orientação",
      "Incidente",
      "Melhoria/Sugestão",
      "Requisição",
    ],
    datasets: [
      {
        data: [45, 25, 15, 15],
        backgroundColor: [
          "#3169d3", // Blue
          "#ef4444", // Red
          "#10b981", // Emerald
          "#f59e0b", // Amber
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          padding: 20,
          color: "#71717a",
          font: {
            size: 13,
            family: "'Inter', sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: "#18181b",
        titleColor: "#e4e4e7",
        bodyColor: "#a1a1aa",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function (context: any) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed !== null) {
              label += context.parsed + "%";
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs flex flex-col h-[340px] transition-shadow hover:shadow-sm">
      <h3 className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-100 mb-4 tracking-tight">
        Tipos de Chamados
      </h3>
      <div className="flex-1 w-full relative flex items-center justify-center">
        <div className="w-[85%] h-[85%]">
          <Pie data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

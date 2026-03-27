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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function OpenTicketsByCategoryChart() {
  const data = {
    labels: [
      "Colibri POS",
      "Habibs Bordéro",
      "Manager - PDV Gold",
      "Colibri Fácil",
      "Infraestrutura",
      "Dúvidas Nuvem",
    ],
    datasets: [
      {
        label: "Em Aberto",
        data: [42, 28, 24, 18, 12, 8],
        backgroundColor: "#f97316", // Orange-500
        borderRadius: 4,
        barPercentage: 0.5,
      },
    ],
  };

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
          font: { size: 12, weight: "bold" },
        },
        border: { display: false },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs flex flex-col h-[380px] transition-shadow hover:shadow-sm">
      <h3 className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-100 mb-6 tracking-tight">
        Chamados em Aberto por Categoria
      </h3>
      <div className="flex-1 w-full relative">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

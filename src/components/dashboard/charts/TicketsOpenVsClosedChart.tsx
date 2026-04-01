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
import { TimeSeriesData } from "@/types/dashboard";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TicketsOpenVsClosedChartProps {
  data: TimeSeriesData;
}

export function TicketsOpenVsClosedChart({ data }: TicketsOpenVsClosedChartProps) {
  const chartData = {
    labels: data.map(d => d.period),
    datasets: [
      {
        label: "Fechados",
        data: data.map(d => d.closed),
        backgroundColor: "#10b981", // Emerald-500
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
      {
        label: "Abertos",
        data: data.map(d => d.opened),
        backgroundColor: "#3169d3", // Brand Blue
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
    ],
  };

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
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Ticket } from "@/types/tomTicket";
import { useMemo } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

interface TicketTypesPieChartProps {
  tickets: Ticket[];
}

export function TicketTypesPieChart({ tickets }: TicketTypesPieChartProps) {
  const data = useMemo(() => {
    const group: Record<string, number> = {};
    
    tickets.forEach(t => {
      const dept = t.department || "Sem Departamento";
      group[dept] = (group[dept] || 0) + 1;
    });

    const labels = Object.keys(group);
    
    // Brand Colors
    const bgColors = [
      "#3169d3", // Blue
      "#ef4444", // Red
      "#10b981", // Emerald
      "#f59e0b", // Amber
      "#8b5cf6", // Purple
      "#06b6d4", // Cyan
    ];

    return {
      labels,
      datasets: [
        {
          data: labels.map(l => group[l]),
          backgroundColor: bgColors.slice(0, labels.length),
          borderWidth: 2,
          borderColor: "#ffffff",
          hoverOffset: 4,
        },
      ],
    };
  }, [tickets]);

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
          label: function (context: { label?: string; parsed?: number }) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed !== null) {
              // Showing count instead of percent for now since we have precise data
              label += context.parsed + " chamados";
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
        Chamados por Departamento
      </h3>
      <div className="flex-1 w-full relative flex items-center justify-center">
        <div className="w-[85%] h-[85%]">
          <Pie data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

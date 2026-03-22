"use client";

import Link from "next/link";
import { Home, BarChart2, Folder, ChevronRight, ChevronDown, LogOut, PanelLeftOpen, Settings } from "lucide-react";
import { useState } from "react";
import { useAuthActions } from "@/hooks/useAuth";
import { SettingsDialog } from "./SettingsDialog";

const SUB_LINKS = [
  { label: "Estatísticas Gerais", href: "#estatisticas" },
  { label: "Faturamento", href: "#faturamento" },
  { label: "Canais", href: "#canais" },
  { label: "Cancelados", href: "#cancelados" },
  { label: "Caixas", href: "#caixas" },
];

export function Sidebar() {
  const [isHomeOpen, setIsHomeOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { handleLogout } = useAuthActions();

  return (
    <aside className="w-[264px] shrink-0 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col relative h-full">
      {/* Floating collapse button (indicative only for mockup precision) */}
      <button className="absolute -right-3 top-24 z-10 w-6 h-6 bg-[#3169d3] text-white rounded cursor-pointer flex items-center justify-center shadow-md">
        <PanelLeftOpen className="w-3.5 h-3.5 rotate-180" />
      </button>

      <div className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
        
        {/* Home Group */}
        <div className="flex flex-col mb-1">
          <button 
            onClick={() => setIsHomeOpen(!isHomeOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#3169d3] text-white rounded-md mb-1 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Home className="w-[20px] h-[20px]" />
              <span className="text-[15.5px] font-medium">Home</span>
            </div>
            {isHomeOpen ? <ChevronDown className="w-4.5 h-4.5" /> : <ChevronRight className="w-4.5 h-4.5" />}
          </button>
          
          {isHomeOpen && (
            <div className="flex flex-col ml-[1.1rem] pl-4 border-l border-zinc-200 dark:border-zinc-800 space-y-1">
              {SUB_LINKS.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className="px-2 py-2 text-[14.5px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Other menu items */}
        {/* <Link 
          href="#"
          className="w-full flex items-center justify-between px-4 py-3 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 rounded-md transition-colors"
        >
          <div className="flex items-center gap-3">
            <BarChart2 className="w-[20px] h-[20px]" />
            <span className="text-[15.5px] font-medium">Mais Indicadores</span>
          </div>
          <ChevronRight className="w-4.5 h-4.5" />
        </Link> */}
        
        {/* <Link 
          href="#"
          className="w-full flex items-center justify-between px-4 py-3 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 rounded-md transition-colors"
        >
          <div className="flex items-center gap-3">
            <Folder className="w-[20px] h-[20px]" />
            <span className="text-[15.5px] font-medium">Relatórios</span>
          </div>
          <ChevronRight className="w-4.5 h-4.5" />
        </Link> */}

      </div>

      {/* Bottom actions pinned */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-1">
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-md transition-colors"
        >
          <Settings className="w-[19px] h-[19px]" />
          <span className="text-[14.5px] font-medium">Configurações</span>
        </button>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-md transition-colors"
        >
          <LogOut className="w-[19px] h-[19px] opacity-70" />
          <span className="text-[14.5px] font-medium">Sair do portal</span>
        </button>
      </div>

      <SettingsDialog 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </aside>
  );
}

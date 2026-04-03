"use client";

import { useState, useRef, useEffect } from "react";
import { Ticket, HelpCircle, Sun, Moon, LogOut, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { clearUser } from "@/lib/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { SettingsDialog } from "./SettingsDialog";

export function Header() {
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  
  const user = useSelector((state: RootState) => state.auth.user);
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(clearUser());
    document.cookie = "auth-token=; path=/; max-age=0";
    router.push("/login");
  };

  const initial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : "P";
  const name = user?.displayName || "Usuário";
  const email = user?.email || "usuario@email.com";

  return (
    <header className="h-[80px] flex items-center justify-between px-7 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shrink-0">
      
      {/* Left side: Logo */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-start leading-none text-zinc-900 dark:text-zinc-100">
          <div className="flex items-center gap-1 font-bold text-3xl tracking-tighter">
            <div className="w-10 h-10 rounded-full border-[3px] border-zinc-900 dark:border-zinc-100 flex items-center justify-center">
              <Ticket className="w-6 h-6" strokeWidth={3} />
            </div>
            <span>TT</span>
          </div>
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase ml-[44px] mt-[-4px]">
            Dashboard
          </span>
        </div>
      </div>

      {/* Right side: Action icons */}
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded flex items-center justify-center border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
          <HelpCircle className="w-[20px] h-[20px]" />
        </button>
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-10 h-10 rounded flex items-center justify-center border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
        >
          {mounted ? (
            theme === 'dark' ? <Moon className="w-[20px] h-[20px]" /> : <Sun className="w-[20px] h-[20px]" />
          ) : (
            <div className="w-[20px] h-[20px]" />
          )}
        </button>
        
        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-10 h-10 rounded flex items-center justify-center border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors font-semibold text-[16.5px]"
          >
            {initial}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#1A1A1A] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-2xl z-50 text-zinc-900 dark:text-white overflow-hidden py-1">
              <div className="flex flex-col items-center pt-6 pb-4 px-4 text-center">
                <div className="w-14 h-14 rounded-2xl border border-zinc-300 dark:border-zinc-600 flex items-center justify-center text-xl font-medium mb-3">
                  {initial}
                </div>
                <h3 className="text-[16px] font-semibold text-zinc-900 dark:text-white mb-1">{name}</h3>
                <p className="text-[14px] text-zinc-500 dark:text-zinc-400 truncate w-full">{email}</p>
              </div>
              
              <div className="h-px bg-zinc-200 dark:bg-zinc-800 w-full" />
              
              <div className="flex flex-col w-full">
                <button 
                  onClick={() => {
                    setDropdownOpen(false);
                    setIsSettingsOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-6 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-zinc-600 dark:text-zinc-300 text-[14px] font-medium"
                >
                  <Settings className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  Configurações
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-6 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors text-zinc-600 dark:text-zinc-300 text-[14px] font-medium"
                >
                  <LogOut className="w-4 h-4 text-zinc-500 dark:text-zinc-400 rotate-180" />
                  Sair do portal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <SettingsDialog 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </header>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { setUser, setError } from "@/lib/redux/slices/authSlice";
import { RootState } from "@/lib/redux/store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2, Ticket } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const dispatch = useDispatch();
  const router = useRouter();
  const { error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    dispatch(setError(null));

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      dispatch(setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        companyId: null,
        role: null,
      }));

      // Set cookie for middleware access
      document.cookie = `auth-token=true; path=/; max-age=86400; samesite=strict`;

      router.push("/dashboard");
    } catch {
      dispatch(setError("E-mail ou senha incorretos."));
      setIsLoggingIn(false); // Só volta para false se der erro
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center relative p-8 sm:p-12 md:p-16 lg:px-24 xl:px-32">
        {/* Logo Header */}
        {/* <div className="absolute top-8 left-8 sm:top-12 sm:left-12 flex items-center gap-2">
          <div className="flex flex-col items-start leading-none text-zinc-900">
            <div className="flex items-center gap-1 font-bold text-3xl tracking-tighter">
              <div className="w-10 h-10 rounded-full border-[3px] border-zinc-900 flex items-center justify-center">
                <Power className="w-6 h-6 stroke-3" />
              </div>
              <span>RS</span>
            </div>
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase ml-[44px] mt-[-4px]">
              Solutions
            </span>
          </div>
        </div> */}
        
        <div className="w-full max-w-[440px] mx-auto mt-20 lg:mt-0">
          <div className="mb-10">
            <h1 className="text-[40px] font-bold mb-5 text-zinc-900">Login</h1>
            <p className="text-[16px] leading-relaxed text-zinc-500">
              Faça login para acessar o Dashboard de Monitoramento e acompanhar o suporte da sua empresa de forma eficiente!
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input 
                id="email" 
                type="email" 
                placeholder="E-mail" 
                className="h-[60px] bg-zinc-100/80 border-0 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-md text-[16px] px-5"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                className="h-[60px] bg-zinc-100/80 border-0 focus-visible:ring-1 focus-visible:ring-blue-500 rounded-md text-[16px] px-5 pr-14"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border-l-4 border-red-500">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-[#3169d3] hover:bg-[#2855b0] text-white rounded-md h-[56px] text-[16px] font-medium transition-colors mt-3"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Right Column - Visual (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-linear-to-b from-[#3b7ae6] via-[#2d64c8] to-[#1e4695] flex-col items-center justify-center p-12 text-white relative overflow-hidden">
        
        <div className="relative z-10 text-center max-w-xl mb-14 flex flex-col items-center">
          {/* Logo TT Dashboard conforme Imagem */}
          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 rounded-full border-[4px] border-white flex items-center justify-center bg-white/10 backdrop-blur-sm shadow-md">
              <Ticket className="w-10 h-10" />
            </div>
            <div className="flex flex-col items-start leading-[0.82]">
              <span className="text-[72px] font-black tracking-tight drop-shadow-sm">TT</span>
              <span className="text-[16px] font-bold tracking-[0.3em] text-blue-200 mt-2 ml-1 drop-shadow-sm">DASHBOARD</span>
            </div>
          </div>
          
          <p className="text-blue-100/90 text-[18.5px] leading-relaxed max-w-[460px] mx-auto mt-6">
            Uma visão centralizada para acompanhar todos os indicadores de suporte técnico e fila de chamados em tempo real.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useDispatch } from "react-redux";
import { setUser, clearUser, setCompanyContext, setContextLoaded } from "@/lib/redux/slices/authSlice";
import { getUserContext } from "@/lib/services/companyService";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Popula primeiro os dados básicos pra não travar a tela
        dispatch(
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            companyId: null,
            role: null,
          })
        );
        
        // Busca o contexto de empresa do banco
        try {
          const context = await getUserContext(firebaseUser.uid);
          if (context) {
            dispatch(setCompanyContext({ companyId: context.companyId, role: context.role }));
          }
        } catch (error) {
          console.error("Falha ao buscar contexto da empresa no RDB", error);
        } finally {
          dispatch(setContextLoaded(true));
        }
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
}

"use client";

import { useAppDispatch } from "@/lib/redux/hooks";
import { clearUser } from "@/lib/redux/slices/authSlice";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export function useAuthActions() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      document.cookie = `auth-token=; path=/; max-age=0; samesite=strict`;
      router.push("/login");
    } catch (error) {
      console.error("Falha ao deslogar", error);
    }
  };

  return { handleLogout };
}

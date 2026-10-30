import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { api } from "@/services/api";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem("gd_token");
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Verify session on mount via /auth/me (cookie-based or token-based)
  useEffect(() => {
    api
      .get<{ user: User }>("/auth/me")
      .then((res: any) => {
        const u = res.user || res.data?.user;
        if (u) {
          setUser(u);
          const t = res.token || res.data?.token || "cookie-session";
          setToken(t);
          localStorage.setItem("gd_token", t);
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem("gd_token");
        }
      })
      .catch(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("gd_token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res: any = await api.post("/auth/login", { email, password });
    const u = res.user || res.data?.user;
    const t = res.token || res.data?.token || "cookie-session";
    setToken(t);
    try {
      localStorage.setItem("gd_token", t);
    } catch {
      // ignore
    }
    setUser(u);
    return res;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem("gd_token");
    } catch {
      // ignore
    }
    api.post("/auth/logout").catch(() => {});
  }, []);

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: Boolean(token || user),
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default useAuth;

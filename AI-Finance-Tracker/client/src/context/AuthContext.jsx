import { createContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";
export const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("finance_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((r) => setUser(r.data.user))
      .catch(() => localStorage.removeItem("finance_token"))
      .finally(() => setLoading(false));
  }, []);
  const value = useMemo(
    () => ({
      user,
      loading,
      async login(values) {
        const r = await api.post("/auth/login", values);
        localStorage.setItem("finance_token", r.data.token);
        setUser(r.data.user);
      },
      async register(values) {
        const r = await api.post("/auth/register", values);
        localStorage.setItem("finance_token", r.data.token);
        setUser(r.data.user);
      },
      async logout() {
        try {
          await api.post("/auth/logout");
        } finally {
          localStorage.removeItem("finance_token");
          setUser(null);
        }
      },
      setUser,
    }),
    [user, loading],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

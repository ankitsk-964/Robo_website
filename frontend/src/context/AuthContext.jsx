import { createContext, useContext, useState, useEffect } from "react";

const BASE = import.meta.env.VITE_API_BASE ?? "";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/api/admin/session`, { credentials: "include" }) // ✅ fixed endpoint + base URL
      .then((r) => r.json())
      .then((data) => setIsAdmin(data.isAdmin === true))
      .catch(() => setIsAdmin(false))
      .finally(() => setChecking(false));
  }, []);

  const login = async (username, password) => {
    const res = await fetch(`${BASE}/api/admin/login`, { // ✅ base URL added
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Invalid credentials");
    setIsAdmin(true);
  };

  const logout = async () => {
    await fetch(`${BASE}/api/admin/logout`, { method: "POST", credentials: "include" }); // ✅ base URL added
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, checking, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiRequest } from "../utils/api";

interface User {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        // Only redirect to login if we are not on public pages
        if (pathname !== "/login" && pathname !== "/signup") {
          router.push("/login");
        }
        return;
      }

      try {
        const userData = await apiRequest("/auth/me");
        setUser(userData);
      } catch (error) {
        console.error("Failed to load user:", error);
        localStorage.removeItem("token");
        setUser(null);
        if (pathname !== "/login" && pathname !== "/signup") {
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [pathname, router]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Build form-data for OAuth2PasswordRequestForm
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const data = await apiRequest("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      localStorage.setItem("token", data.access_token);
      const userData = await apiRequest("/auth/me");
      setUser(userData);
      router.push("/tasks");
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", data.access_token);
      const userData = await apiRequest("/auth/me");
      setUser(userData);
      router.push("/tasks");
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

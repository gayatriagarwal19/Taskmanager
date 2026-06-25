"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function RootPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push("/tasks");
      } else {
        router.push("/login");
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Modern clean animated loading pulse */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-brand-purple/20" />
          <div className="absolute inset-0 rounded-full border-4 border-t-brand-purple animate-spin" />
        </div>
        <p className="text-text-muted text-sm font-medium tracking-wide animate-pulse">
          Loading Vivid Tasks...
        </p>
      </div>
    </div>
  );
}

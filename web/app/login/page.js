"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import EmployeeLogin from "@/components/control-center/EmployeeLogin";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("shivodaya_operator");
      if (saved) {
        router.replace("/control-center");
      }
    } catch (e) {}
  }, [router]);

  const handleLoginSuccess = (callsign) => {
    try {
      localStorage.setItem("shivodaya_operator", callsign || "ABC");
    } catch (e) {}
    router.push("/control-center");
  };

  return <EmployeeLogin onLoginSuccess={handleLoginSuccess} />;
}

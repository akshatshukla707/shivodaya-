"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MeshRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/mesh-network");
  }, [router]);
  return null;
}

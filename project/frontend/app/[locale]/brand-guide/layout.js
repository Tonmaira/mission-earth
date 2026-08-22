"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLocalePath } from "@/lib/useLocalePath";

export default function BrandLayout({ children }) {
  const path = useLocalePath();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push(path("/login"));
    });
  }, [router, path]);

  return <>{children}</>;
}

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useSupabaseList<T>(table: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from(table)
      .select("*")
      .order("sort_order")
      .then(({ data: rows }) => {
        setData((rows as T[]) ?? []);
        setLoading(false);
      });
  }, [table]);

  return { data, loading };
}

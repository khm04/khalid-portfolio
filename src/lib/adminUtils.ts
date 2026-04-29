import { supabase } from "@/lib/supabase";

export async function moveItem<T extends { id: string; sort_order: number }>(
  table: string,
  items: T[],
  index: number,
  direction: "up" | "down"
): Promise<T[]> {
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= items.length) return items;

  // Reorder in memory first, then write clean sequential sort_order values
  const reordered = [...items];
  [reordered[index], reordered[swapIndex]] = [reordered[swapIndex], reordered[index]];

  const normalized = reordered.map((item, i) => ({ ...item, sort_order: i }));

  const results = await Promise.all(
    normalized.map((item) =>
      supabase.from(table).update({ sort_order: item.sort_order }).eq("id", item.id)
    )
  );

  const failed = results.find((r) => r.error);
  if (failed?.error) throw new Error(failed.error.message);

  return normalized;
}

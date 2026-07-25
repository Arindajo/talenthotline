import { supabase } from "./supabase";

export async function generateContestantNumber(): Promise<string> {
  const { data, error } = await supabase
    .from("users")
    .select("contestant_number")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error("Failed to fetch last contestant number");
  }

  let nextNum = 1;
  if (data?.contestant_number) {
    const lastNum = parseInt(data.contestant_number.replace("TH-", ""), 10);
    if (!isNaN(lastNum)) {
      nextNum = lastNum + 1;
    }
  }

  return `TH-${String(nextNum).padStart(4, "0")}`;
}

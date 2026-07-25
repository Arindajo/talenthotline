import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("id, phone, name, contestant_number, role, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Query error:", error);
      throw error;
    }

    return NextResponse.json({ success: true, users });
  } catch (err) {
    console.error("List users error:", err);
    return NextResponse.json(
      { error: "Failed to list users" },
      { status: 500 }
    );
  }
}

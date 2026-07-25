import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { contestantNumber } = await req.json();

    if (!contestantNumber) {
      return NextResponse.json(
        { error: "Contestant number is required" },
        { status: 400 }
      );
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("id, phone, name, contestant_number, role")
      .eq("contestant_number", contestantNumber)
      .eq("role", "talent")
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: "Invalid contestant number" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        contestantNumber: user.contestant_number,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

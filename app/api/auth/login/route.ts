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
      .select("id, phone_number, username, unique_id")
      .eq("unique_id", contestantNumber)
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
        phone: user.phone_number,
        name: user.username,
        contestantNumber: user.unique_id,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

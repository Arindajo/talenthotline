import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("phone", email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const { data: user, error: insertError } = await supabase
      .from("users")
      .insert({
        phone: email,
        name,
        contestant_number: `REC-${Date.now().toString(36).toUpperCase()}`,
        role: "recruiter",
        password_hash: password,
      })
      .select("id, name, phone, contestant_number, role")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.phone,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Recruiter registration error:", err);
    return NextResponse.json(
      { error: "Failed to register" },
      { status: 500 }
    );
  }
}

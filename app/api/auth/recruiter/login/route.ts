import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("id, phone, name, contestant_number, role, password_hash")
      .eq("phone", email)
      .eq("role", "recruiter")
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (user.password_hash !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
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
    console.error("Recruiter login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

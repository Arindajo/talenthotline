import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendSMS } from "@/lib/sms";
import { generateContestantNumber } from "@/lib/contestant-number";

export async function POST(req: Request) {
  try {
    const { username, phone_number } = await req.json();

    if (!phone_number || !username) {
      return NextResponse.json(
        { error: "Phone and name are required" },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("phone_number", phone_number)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Phone number already registered" },
        { status: 409 }
      );
    }

    const contestantNumber = await generateContestantNumber();

    const { data: user, error: insertError } = await supabase
      .from("users")
      .insert({
        username,
        phone_number,
        unique_id: contestantNumber,
      })
      .select("id, unique_id")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw insertError;
    }

    const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/login`;
    const message = `Welcome to CreatorConnect, ${username}! Your contestant number is ${contestantNumber}. Use this to login at ${loginUrl}`;

    await sendSMS([phone_number], message);

    return NextResponse.json({
      success: true,
      contestantNumber: user.unique_id,
      message: "Account created. SMS sent with login credentials.",
    });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Failed to register" },
      { status: 500 }
    );
  }
}

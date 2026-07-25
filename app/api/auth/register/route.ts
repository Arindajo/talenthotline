import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendSMS } from "@/lib/sms";
import { generateContestantNumber } from "@/lib/contestant-number";

export async function POST(req: Request) {
  try {
    const { username, phone_number } = await req.json();

    if (!phone_number || !username) {
      return NextResponse.json(
        { error: "Phone number and name are required." },
        { status: 400 }
      );
    }

    // Keep the '+' sign, but remove spaces and dashes
    const cleanPhone = phone_number.replace(/[\s\-]/g, '').trim();

    const { data: existing, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("phone_number", cleanPhone)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      return NextResponse.json(
        { error: `Could not verify phone number: ${checkError.message}` },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { error: "This phone number is already registered." },
        { status: 409 }
      );
    }

    const contestantNumber = await generateContestantNumber();

    const { data: user, error: insertError } = await supabase
      .from("users")
      .insert({
        username,
        phone_number: cleanPhone,
        unique_id: contestantNumber,
      })
      .select("id, unique_id")
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: `Could not create account: ${insertError.message}` },
        { status: 500 }
      );
    }

    const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/login`;
    const message = `Welcome to CreatorConnect, ${username}! Your contestant number is ${contestantNumber}. Use this to login at ${loginUrl}`;

    let smsSent = false;
    try {
      await sendSMS([cleanPhone], message);
      smsSent = true;
    } catch (smsErr) {
      console.error("SMS failed:", smsErr instanceof Error ? smsErr.message : smsErr);
    }

    return NextResponse.json({
      success: true,
      contestantNumber: user.unique_id,
      smsSent,
      message: smsSent
        ? "Account created. SMS sent with your contestant number."
        : `Account created. SMS failed to send. Your contestant number is ${contestantNumber}.`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: `Registration failed: ${message}` },
      { status: 500 }
    );
  }
}
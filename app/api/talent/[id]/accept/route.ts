import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendSMS } from "@/lib/sms";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: talent, error: fetchError } = await supabase
      .from("talents")
      .select("id, status, users (phone_number, username)")
      .eq("id", id)
      .single();

    if (fetchError || !talent) {
      return NextResponse.json({ error: "Talent not found" }, { status: 404 });
    }

    if (talent.status !== "pending") {
      return NextResponse.json(
        { error: "Talent has already been reviewed" },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from("talents")
      .update({ status: "accepted" })
      .eq("id", id);

    if (updateError) {
      console.error("Update error:", updateError);
      throw updateError;
    }

    const user = talent.users as unknown as { phone_number: string; username: string };
    const message = `Hey ${user.username}! Great news — a recruiter on TalentHotline is interested in your talent. They will reach out to you soon. Keep creating!`;

    const atPhone = user.phone_number.startsWith('+') ? user.phone_number : '+' + user.phone_number;
    await sendSMS([atPhone], message);

    return NextResponse.json({
      success: true,
      message: "Talent accepted. SMS notification sent.",
    });
  } catch (err) {
    console.error("Accept talent error:", err);
    return NextResponse.json(
      { error: "Failed to accept talent" },
      { status: 500 }
    );
  }
}

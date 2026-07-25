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
      .update({ status: "rejected" })
      .eq("id", id);

    if (updateError) {
      console.error("Update error:", updateError);
      throw updateError;
    }

    const user = talent.users as unknown as { phone_number: string; username: string };
    const message = `Hey ${user.username}, thank you for sharing your talent on TalentHotline. Unfortunately, it wasn't the right fit this time. Keep creating and try again!`;

    const atPhone = user.phone_number.startsWith('+') ? user.phone_number : '+' + user.phone_number;
    await sendSMS([atPhone], message);

    return NextResponse.json({
      success: true,
      message: "Talent rejected. SMS notification sent.",
    });
  } catch (err) {
    console.error("Reject talent error:", err);
    return NextResponse.json(
      { error: "Failed to reject talent" },
      { status: 500 }
    );
  }
}

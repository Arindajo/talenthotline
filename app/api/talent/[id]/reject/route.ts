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
    const message = `Thank you for your submission, ${user.username}. Unfortunately, your talent was not selected at this time on CreatorConnect. Keep creating!`;

    await sendSMS([user.phone_number], message);

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

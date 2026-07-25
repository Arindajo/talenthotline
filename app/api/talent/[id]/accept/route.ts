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
      .select("id, status, users (phone, name)")
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

    const user = talent.users as unknown as { phone: string; name: string };
    const message = `Congratulations, ${user.name}! Your talent has been accepted by a recruiter on CreatorConnect. They will contact you soon.`;

    await sendSMS([user.phone], message);

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

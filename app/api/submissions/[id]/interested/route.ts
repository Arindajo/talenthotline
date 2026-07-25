import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendSMS } from "@/lib/sms";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { recruiter_name, recruiter_phone, message } = await req.json();

    if (!recruiter_name || !recruiter_phone) {
      return NextResponse.json(
        { error: "Your name and phone number are required." },
        { status: 400 }
      );
    }

    const { data: submission, error: fetchError } = await supabase
      .from("media_submissions")
      .select("id, artist_phone, username")
      .eq("id", id)
      .single();

    if (fetchError || !submission) {
      return NextResponse.json(
        { error: "Submission not found." },
        { status: 404 }
      );
    }

    let cleanRecruiterPhone = recruiter_phone.replace(/[\s\-]/g, '').trim();
    if (!cleanRecruiterPhone.startsWith('+') && cleanRecruiterPhone.length >= 9) {
      cleanRecruiterPhone = '+' + cleanRecruiterPhone;
    }

    const customMessage = message || "I'm interested in your talent!";

    const smsText = `Hey ${submission.username}! Good news — ${recruiter_name} is interested in your talent on TalentHotline. They said: "${customMessage}" Contact them at ${cleanRecruiterPhone}. Keep creating!`;

    let cleanArtistPhone = submission.artist_phone;
    if (!cleanArtistPhone.startsWith('+')) {
      cleanArtistPhone = '+' + cleanArtistPhone;
    }

    let smsSent = false;
    try {
      await sendSMS([cleanArtistPhone], smsText);
      smsSent = true;
    } catch (smsErr) {
      console.error("Interested SMS failed:", smsErr instanceof Error ? smsErr.message : smsErr);
    }

    return NextResponse.json({
      success: true,
      smsSent,
      message: smsSent
        ? `Interest sent! ${submission.username} will be notified via SMS.`
        : `Interest noted, but SMS could not be delivered. ${submission.username}'s number is ${submission.artist_phone}.`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Interested error:", err);
    return NextResponse.json(
      { error: `Failed to send interest: ${message}` },
      { status: 500 }
    );
  }
}

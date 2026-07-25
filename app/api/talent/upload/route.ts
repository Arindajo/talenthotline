import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const userId = formData.get("userId") as string;
    const categoryId = formData.get("categoryId") as string;
    const file = formData.get("file") as File;

    if (!userId || !categoryId || !file) {
      return NextResponse.json(
        { error: "userId, categoryId, and file are required" },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "audio/mpeg",
      "audio/wav",
      "audio/mp3",
      "audio/ogg",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "File must be a video (mp4, webm, mov) or audio (mp3, wav, ogg)" },
        { status: 400 }
      );
    }

    const mediaType = file.type.startsWith("video/") ? "video" : "audio";
    const ext = file.name.split(".").pop() || (mediaType === "video" ? "mp4" : "mp3");
    const filePath = `talents/${userId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(filePath, file, { contentType: file.type });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    const { data: urlData } = supabase.storage.from("media").getPublicUrl(filePath);

    const { data: talent, error: insertError } = await supabase
      .from("talents")
      .insert({
        user_id: userId,
        category_id: categoryId,
        media_url: urlData.publicUrl,
        media_type: mediaType,
        status: "pending",
      })
      .select("id, media_url, media_type, status, created_at")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      talent,
      message: "Content uploaded. You will be contacted once a talent outsourcer accepts you.",
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Failed to upload talent" },
      { status: 500 }
    );
  }
}

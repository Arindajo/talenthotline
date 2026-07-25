import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const recruiterId = url.searchParams.get("recruiterId");
    const categoryId = url.searchParams.get("categoryId");
    const status = url.searchParams.get("status");

    let query = supabase
      .from("talents")
      .select(`
        id,
        media_url,
        media_type,
        status,
        created_at,
        users!inner (id, name, phone, contestant_number),
        categories!inner (id, name)
      `);

    if (recruiterId) {
      const { data: rcData } = await supabase
        .from("recruiter_categories")
        .select("category_id")
        .eq("recruiter_id", recruiterId);

      if (rcData && rcData.length > 0) {
        const categoryIds = rcData.map((rc) => rc.category_id);
        query = query.in("category_id", categoryIds);
      }
    }

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    if (status) {
      query = query.eq("status", status);
    }

    query = query.order("created_at", { ascending: false });

    const { data: talents, error } = await query;

    if (error) {
      console.error("Query error:", error);
      throw error;
    }

    return NextResponse.json({ success: true, talents });
  } catch (err) {
    console.error("List talents error:", err);
    return NextResponse.json(
      { error: "Failed to list talents" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from("categories")
      .select("id, name, description")
      .order("name");

    if (error) {
      console.error("Query error:", error);
      throw error;
    }

    return NextResponse.json({ success: true, categories });
  } catch (err) {
    console.error("List categories error:", err);
    return NextResponse.json(
      { error: "Failed to list categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const { data: category, error: insertError } = await supabase
      .from("categories")
      .insert({ name, description: description || null })
      .select("id, name, description")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw insertError;
    }

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (err) {
    console.error("Create category error:", err);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

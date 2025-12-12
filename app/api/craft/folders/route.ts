"use server";

import { NextResponse } from "next/server";
import { craftFetch } from "@/lib/craft-server";

export async function POST(request: Request) {
  try {
    const { blob } = (await request.json()) as { blob?: string };
    if (!blob) {
      return NextResponse.json({ error: "blob is required" }, { status: 400 });
    }
    const data = await craftFetch(blob, "folders");
    return NextResponse.json(data);
  } catch (error) {
    console.error("[craft/folders] error", error);
    return NextResponse.json(
      { error: "Failed to fetch folders" },
      { status: 500 }
    );
  }
}

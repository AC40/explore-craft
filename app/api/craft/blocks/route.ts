"use server";

import { NextResponse } from "next/server";
import { craftFetch } from "@/lib/craft-server";

type BlocksRequest = {
  blob?: string;
  id?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BlocksRequest;
    if (!body?.blob) {
      return NextResponse.json({ error: "blob is required" }, { status: 400 });
    }
    if (!body?.id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const data = await craftFetch(body.blob, "blocks", {
      query: { id: body.id },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("[craft/blocks] error", error);
    return NextResponse.json(
      { error: "Failed to fetch blocks" },
      { status: 500 }
    );
  }
}

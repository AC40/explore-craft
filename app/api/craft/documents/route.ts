"use server";

import { NextResponse } from "next/server";
import { craftFetch } from "@/lib/craft-server";

type DocumentsRequest = {
  blob?: string;
  location?: "unsorted" | "trash" | "templates" | "daily_notes";
  folderId?: string;
  fetchMetadata?: boolean;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DocumentsRequest;
    if (!body?.blob) {
      return NextResponse.json({ error: "blob is required" }, { status: 400 });
    }

    const data = await craftFetch(body.blob, "documents", {
      query: {
        location: body.location,
        folderId: body.folderId,
        fetchMetadata: body.fetchMetadata ? "true" : undefined,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("[craft/documents] error", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

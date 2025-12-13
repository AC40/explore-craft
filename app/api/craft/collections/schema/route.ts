"use server";

import { NextResponse } from "next/server";
import { craftFetch } from "@/lib/craft-server";

type CollectionSchemaRequest = {
  blob?: string;
  collectionId?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CollectionSchemaRequest;
    if (!body?.blob) {
      return NextResponse.json(
        { error: "blob is required" },
        { status: 400 }
      );
    }
    if (!body.collectionId) {
      return NextResponse.json(
        { error: "collectionId is required" },
        { status: 400 }
      );
    }

    const data = await craftFetch(
      body.blob,
      `collections/${body.collectionId}/schema`
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error("[craft/collections/schema] error", error);
    return NextResponse.json(
      { error: "Failed to fetch collection schema" },
      { status: 500 }
    );
  }
}


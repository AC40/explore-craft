"use server";

import { NextResponse } from "next/server";
import { craftFetch } from "@/lib/craft-server";

type TestRequest = {
  apiUrl?: string;
  apiKey?: string;
  type?: "folders" | "documents" | "daily_notes";
};

const endpointByType: Record<NonNullable<TestRequest["type"]>, string> = {
  folders: "folders",
  documents: "documents",
  daily_notes: "tasks?scope=active",
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TestRequest;
    if (!body.apiUrl || !body.type) {
      return NextResponse.json(
        { error: "apiUrl and type are required" },
        { status: 400 }
      );
    }

    const endpoint = endpointByType[body.type];
    const url = `${body.apiUrl.replace(/\/+$/, "")}/${endpoint}`;

    const headers: Record<string, string> = {};
    if (body.apiKey) {
      headers.Authorization = `Bearer ${body.apiKey}`;
    }

    const response = await fetch(url, {
      headers,
      cache: "no-store",
    });

    if (!response.ok && response.status !== 304) {
      return NextResponse.json(
        { ok: false, status: response.status, statusText: response.statusText },
        { status: 200 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[craft/test] error", error);
    return NextResponse.json(
      { error: "Connection test failed" },
      { status: 500 }
    );
  }
}

"use server";

import { NextResponse } from "next/server";
import { craftFetch } from "@/lib/craft-server";

type TasksRequest = {
  blob?: string;
  scope: "active" | "upcoming" | "inbox" | "logbook";
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TasksRequest;
    if (!body?.blob) {
      return NextResponse.json({ error: "blob is required" }, { status: 400 });
    }
    if (!body.scope) {
      return NextResponse.json({ error: "scope is required" }, { status: 400 });
    }

    const data = await craftFetch(body.blob, "tasks", {
      query: { scope: body.scope },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("[craft/tasks] error", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

"use server";

import { NextResponse } from "next/server";
import { encryptPayload, requireMasterKey } from "@/lib/server-crypto";

type EncryptRequest = {
  apiUrl: string;
  apiKey?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EncryptRequest;
    if (!body?.apiUrl) {
      return NextResponse.json(
        { error: "apiUrl is required" },
        { status: 400 }
      );
    }

    const masterKey = await requireMasterKey();
    const blob = await encryptPayload(
      {
        apiUrl: body.apiUrl,
        apiKey: body.apiKey || "",
      },
      masterKey
    );

    return NextResponse.json({ blob });
  } catch (error) {
    console.error("[encrypt] error", error);
    return NextResponse.json({ error: "Encryption failed" }, { status: 500 });
  }
}

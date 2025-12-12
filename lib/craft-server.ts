"use server";

import { decryptPayload, requireMasterKey } from "@/lib/server-crypto";

type Secrets = {
  apiUrl: string;
  apiKey: string;
};

export async function decryptSecrets(blob: string): Promise<Secrets> {
  const masterKey = await requireMasterKey();
  return decryptPayload<Secrets>(blob, masterKey);
}

export async function craftFetch(
  blob: string,
  path: string,
  options?: { query?: Record<string, string | undefined> }
) {
  const secrets = await decryptSecrets(blob);
  const query = new URLSearchParams();
  if (options?.query) {
    Object.entries(options.query).forEach(([k, v]) => {
      if (v !== undefined) query.set(k, v);
    });
  }
  const url = `${secrets.apiUrl.replace(/\/+$/, "")}/${path}${
    query.toString() ? `?${query}` : ""
  }`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (secrets.apiKey) {
    headers.Authorization = `Bearer ${secrets.apiKey}`;
  }

  const response = await fetch(url, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Craft API error ${response.status}: ${text || response.statusText}`
    );
  }

  return response.json();
}

export async function craftHead(blob: string, path: string) {
  const secrets = await decryptSecrets(blob);
  const url = `${secrets.apiUrl.replace(/\/+$/, "")}/${path}`;
  const headers: Record<string, string> = {};
  if (secrets.apiKey) {
    headers.Authorization = `Bearer ${secrets.apiKey}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
    cache: "no-store",
  });
  if (!response.ok && response.status !== 304) {
    const text = await response.text();
    throw new Error(
      `Craft API error ${response.status}: ${text || response.statusText}`
    );
  }
  return response;
}

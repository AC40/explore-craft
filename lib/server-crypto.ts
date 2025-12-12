"use server";

import { webcrypto } from "crypto";

const cryptoImpl: Crypto =
  (globalThis.crypto as Crypto) || (webcrypto as unknown as Crypto);

const ALGORITHM = "AES-GCM";
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const ITERATIONS = 100_000;
const KEY_LENGTH = 256;

function base64UrlEncode(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer;
  const base64 = Buffer.from(bytes).toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(input: string): Uint8Array {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad =
    normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return new Uint8Array(Buffer.from(normalized + pad, "base64"));
}

async function getKeyFromPassword(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await cryptoImpl.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return cryptoImpl.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt.buffer as ArrayBuffer,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptPayload<T>(
  payload: T,
  password: string
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(payload));

  const salt = cryptoImpl.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = cryptoImpl.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await getKeyFromPassword(password, salt);

  const encrypted = await cryptoImpl.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    data
  );

  const combined = new Uint8Array(
    salt.length + iv.length + encrypted.byteLength
  );
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);

  return base64UrlEncode(combined);
}

export async function decryptPayload<T>(
  ciphertext: string,
  password: string
): Promise<T> {
  try {
    const combined = base64UrlDecode(ciphertext);
    const salt = combined.slice(0, SALT_LENGTH);
    const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const encrypted = combined.slice(SALT_LENGTH + IV_LENGTH);

    const key = await getKeyFromPassword(password, salt);
    const decrypted = await cryptoImpl.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      encrypted
    );

    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decrypted)) as T;
  } catch (error) {
    throw new Error("Decryption failed. Check master key or ciphertext.");
  }
}

export async function requireMasterKey(): Promise<string> {
  const masterKey = process.env.MASTER_KEY;
  if (!masterKey) {
    throw new Error("Server configuration error: MASTER_KEY not set");
  }
  return masterKey;
}

export type SharePayload = Record<string, unknown>;

function toBase64Url(base64: string): string {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  return base64 + padding;
}

function encodeUtf8ToBase64(value: string): string {
  if (typeof globalThis.btoa === "function") {
    const bytes = new TextEncoder().encode(value);
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return globalThis.btoa(binary);
  }
  return Buffer.from(value, "utf8").toString("base64");
}

function decodeBase64ToUtf8(value: string): string {
  if (typeof globalThis.atob === "function") {
    const binary = globalThis.atob(value);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
  return Buffer.from(value, "base64").toString("utf8");
}

export function encodeSharePayload(payload: SharePayload): string {
  const json = JSON.stringify(payload);
  return toBase64Url(encodeUtf8ToBase64(json));
}

export function decodeSharePayload<T extends SharePayload>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(decodeBase64ToUtf8(fromBase64Url(value))) as T;
  } catch {
    return null;
  }
}

export function buildShareUrl(pathname: string, payload: SharePayload): string {
  const encoded = encodeSharePayload(payload);
  if (typeof window === "undefined") return `https://nolza.fun${pathname}?s=${encoded}`;
  return `${window.location.origin}${pathname}?s=${encoded}`;
}

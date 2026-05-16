export type SharePayload = Record<string, unknown>;

function toBase64Url(base64: string): string {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  return base64 + padding;
}

export function encodeSharePayload(payload: SharePayload): string {
  const json = JSON.stringify(payload);
  if (typeof window !== "undefined" && typeof window.btoa === "function") {
    const bytes = new TextEncoder().encode(json);
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return toBase64Url(window.btoa(binary));
  }
  return toBase64Url(Buffer.from(json, "utf8").toString("base64"));
}

export function decodeSharePayload<T extends SharePayload>(value: string | null): T | null {
  if (!value) return null;
  try {
    if (typeof window !== "undefined" && typeof window.atob === "function") {
      const binary = window.atob(fromBase64Url(value));
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      return JSON.parse(new TextDecoder().decode(bytes)) as T;
    }
    return JSON.parse(Buffer.from(fromBase64Url(value), "base64").toString("utf8")) as T;
  } catch {
    return null;
  }
}

export function buildShareUrl(pathname: string, payload: SharePayload): string {
  const encoded = encodeSharePayload(payload);
  if (typeof window === "undefined") return `https://nolza.fun${pathname}?s=${encoded}`;
  return `${window.location.origin}${pathname}?s=${encoded}`;
}

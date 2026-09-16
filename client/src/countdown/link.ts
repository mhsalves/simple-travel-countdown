import { CountdownConfig } from './config';
import { decodeCountdownPayload, encodeCountdownPayload } from './binary';

// Link rules from docs/specs/countdown-link.md.

export const COUNTDOWN_PATH = 'countdown';

const BASE64URL = /^[A-Za-z0-9_-]+$/;

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(token: string): Uint8Array {
  if (!BASE64URL.test(token)) {
    throw new Error('Invalid base64url token');
  }
  const base64 = token.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '='));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export function encodeCountdownToken(config: CountdownConfig): string {
  return toBase64Url(encodeCountdownPayload(config));
}

export function buildCountdownLink(token: string): string {
  return new URL(`${import.meta.env.BASE_URL}${COUNTDOWN_PATH}/${token}`, window.location.origin).toString();
}

export function decodeCountdownToken(token: string): CountdownConfig | null {
  try {
    return decodeCountdownPayload(fromBase64Url(token));
  } catch {
    return null;
  }
}

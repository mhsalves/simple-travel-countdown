import dayjs from 'dayjs';
import {
  Background,
  CountdownConfig,
  IMAGE_URL_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  isHexColor,
  isHttpUrl,
} from './config';

// Link rules from docs/specs/countdown-link.md.

export const COUNTDOWN_PATH = 'countdown';

const PAYLOAD_VERSION = 1;
const BASE64URL = /^[A-Za-z0-9_-]+$/;
const ISO_UTC_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

interface CountdownPayload {
  v: typeof PAYLOAD_VERSION;
  title: string;
  finishDate: string;
  background: Background;
  titleColor: string;
  counterColor: string;
}

type JsonObject = Record<string, unknown>;

function toBase64Url(text: string): string {
  let binary = '';
  new TextEncoder().encode(text).forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(token: string): string {
  if (!BASE64URL.test(token)) {
    throw new Error('Invalid base64url token');
  }
  const base64 = token.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '='));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

function normalizeBackground(background: Background): Background {
  switch (background.type) {
    case 'solid':
      return { type: 'solid', color: background.color.toUpperCase() };
    case 'gradient':
      return { type: 'gradient', from: background.from.toUpperCase(), to: background.to.toUpperCase() };
    case 'image':
      return { type: 'image', url: background.url };
  }
}

export function encodeCountdownToken(config: CountdownConfig): string {
  if (!config.finishDate?.isValid()) {
    throw new Error('A valid finish date is required to encode a countdown');
  }

  const payload: CountdownPayload = {
    v: PAYLOAD_VERSION,
    title: config.title.trim(),
    finishDate: config.finishDate.toDate().toISOString(),
    background: normalizeBackground(config.background),
    titleColor: config.titleColor.toUpperCase(),
    counterColor: config.counterColor.toUpperCase(),
  };

  return toBase64Url(JSON.stringify(payload));
}

export function buildCountdownLink(token: string): string {
  return new URL(`${import.meta.env.BASE_URL}${COUNTDOWN_PATH}/${token}`, window.location.origin).toString();
}

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isColor(value: unknown): value is string {
  return typeof value === 'string' && isHexColor(value);
}

function parseBackground(value: unknown): Background | null {
  if (!isObject(value)) {
    return null;
  }

  switch (value.type) {
    case 'solid':
      return isColor(value.color) ? { type: 'solid', color: value.color } : null;
    case 'gradient':
      return isColor(value.from) && isColor(value.to) ? { type: 'gradient', from: value.from, to: value.to } : null;
    case 'image':
      return typeof value.url === 'string' && value.url.length <= IMAGE_URL_MAX_LENGTH && isHttpUrl(value.url)
        ? { type: 'image', url: value.url }
        : null;
    default:
      return null;
  }
}

function isValidTitle(value: unknown): value is string {
  return typeof value === 'string' && value.trim() === value && value.length > 0 && value.length <= TITLE_MAX_LENGTH;
}

function isValidFinishDate(value: unknown): value is string {
  return typeof value === 'string' && ISO_UTC_DATE.test(value) && !Number.isNaN(Date.parse(value));
}

export function decodeCountdownToken(token: string): CountdownConfig | null {
  let payload: unknown;
  try {
    payload = JSON.parse(fromBase64Url(token));
  } catch {
    return null;
  }

  if (!isObject(payload) || payload.v !== PAYLOAD_VERSION) {
    return null;
  }

  const { title, finishDate, titleColor, counterColor } = payload;
  const background = parseBackground(payload.background);

  if (!isValidTitle(title) || !isValidFinishDate(finishDate) || !background || !isColor(titleColor) || !isColor(counterColor)) {
    return null;
  }

  return { title, finishDate: dayjs(finishDate), background, titleColor, counterColor };
}

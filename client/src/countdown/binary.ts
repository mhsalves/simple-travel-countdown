import dayjs from 'dayjs';
import {
  Background,
  BackgroundType,
  CountdownConfig,
  IMAGE_URL_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  isHttpUrl,
} from './config';

// Binary payload layout from docs/specs/countdown-link.md (section 3).
// Encodes the countdown as fixed-width fields (RGB bytes, epoch seconds)
// instead of JSON text, so the token is far shorter than JSON+base64url.

export const BINARY_FORMAT_VERSION = 1;

const BACKGROUND_TYPE_CODES: Record<BackgroundType, number> = {
  solid: 0,
  gradient: 1,
  image: 2,
};

const BACKGROUND_TYPE_NAMES: readonly BackgroundType[] = ['solid', 'gradient', 'image'];

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder('utf-8', { fatal: true });

class ByteWriter {
  private readonly bytes: number[] = [];

  writeUint8(value: number): void {
    this.bytes.push(value & 0xff);
  }

  writeUint16(value: number): void {
    this.bytes.push((value >>> 8) & 0xff, value & 0xff);
  }

  writeUint32(value: number): void {
    this.bytes.push((value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff);
  }

  writeBytes(bytes: Uint8Array): void {
    bytes.forEach((byte) => this.bytes.push(byte));
  }

  writeColor(hex: string): void {
    this.writeUint8(parseInt(hex.slice(1, 3), 16));
    this.writeUint8(parseInt(hex.slice(3, 5), 16));
    this.writeUint8(parseInt(hex.slice(5, 7), 16));
  }

  toUint8Array(): Uint8Array {
    return Uint8Array.from(this.bytes);
  }
}

class ByteReader {
  private offset = 0;

  constructor(private readonly bytes: Uint8Array) {}

  private require(length: number): void {
    if (this.offset + length > this.bytes.length) {
      throw new Error('Unexpected end of binary payload');
    }
  }

  readUint8(): number {
    this.require(1);
    return this.bytes[this.offset++];
  }

  readUint16(): number {
    this.require(2);
    const value = (this.bytes[this.offset] << 8) | this.bytes[this.offset + 1];
    this.offset += 2;
    return value;
  }

  readUint32(): number {
    this.require(4);
    const value =
      this.bytes[this.offset] * 2 ** 24 +
      this.bytes[this.offset + 1] * 2 ** 16 +
      this.bytes[this.offset + 2] * 2 ** 8 +
      this.bytes[this.offset + 3];
    this.offset += 4;
    return value;
  }

  readBytes(length: number): Uint8Array {
    this.require(length);
    const slice = this.bytes.slice(this.offset, this.offset + length);
    this.offset += length;
    return slice;
  }

  readColor(): string {
    const [r, g, b] = this.readBytes(3);
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  atEnd(): boolean {
    return this.offset === this.bytes.length;
  }
}

function toHex(byte: number): string {
  return byte.toString(16).padStart(2, '0').toUpperCase();
}

export function encodeCountdownPayload(config: CountdownConfig): Uint8Array {
  if (!config.finishDate?.isValid()) {
    throw new Error('A valid finish date is required to encode a countdown');
  }

  const writer = new ByteWriter();
  writer.writeUint8(BINARY_FORMAT_VERSION);

  const titleBytes = textEncoder.encode(config.title.trim());
  writer.writeUint8(titleBytes.length);
  writer.writeBytes(titleBytes);

  writer.writeUint32(Math.floor(config.finishDate.toDate().getTime() / 1000));

  writer.writeUint8(BACKGROUND_TYPE_CODES[config.background.type]);
  writeBackground(writer, config.background);

  writer.writeColor(config.titleColor);
  writer.writeColor(config.counterColor);

  return writer.toUint8Array();
}

function writeBackground(writer: ByteWriter, background: Background): void {
  switch (background.type) {
    case 'solid':
      writer.writeColor(background.color);
      return;
    case 'gradient':
      writer.writeColor(background.from);
      writer.writeColor(background.to);
      return;
    case 'image': {
      const urlBytes = textEncoder.encode(background.url);
      writer.writeUint16(urlBytes.length);
      writer.writeBytes(urlBytes);
      return;
    }
  }
}

export function decodeCountdownPayload(bytes: Uint8Array): CountdownConfig | null {
  try {
    const reader = new ByteReader(bytes);

    if (reader.readUint8() !== BINARY_FORMAT_VERSION) {
      return null;
    }

    const titleLength = reader.readUint8();
    const title = textDecoder.decode(reader.readBytes(titleLength));
    if (!title || title !== title.trim() || title.length > TITLE_MAX_LENGTH) {
      return null;
    }

    const finishDate = dayjs(reader.readUint32() * 1000);

    const backgroundType = BACKGROUND_TYPE_NAMES[reader.readUint8()];
    if (!backgroundType) {
      return null;
    }
    const background = readBackground(reader, backgroundType);
    if (!background) {
      return null;
    }

    const titleColor = reader.readColor();
    const counterColor = reader.readColor();

    if (!reader.atEnd()) {
      return null;
    }

    return { title, finishDate, background, titleColor, counterColor };
  } catch {
    return null;
  }
}

function readBackground(reader: ByteReader, type: BackgroundType): Background | null {
  switch (type) {
    case 'solid':
      return { type, color: reader.readColor() };
    case 'gradient':
      return { type, from: reader.readColor(), to: reader.readColor() };
    case 'image': {
      const length = reader.readUint16();
      const url = textDecoder.decode(reader.readBytes(length));
      if (url.length > IMAGE_URL_MAX_LENGTH || !isHttpUrl(url)) {
        return null;
      }
      return { type, url };
    }
  }
}

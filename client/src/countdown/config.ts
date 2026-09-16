import { CSSProperties } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import happyBirthdayImage from '../assets/backgrounds/happy-birthday.jpg';
import happyNewYearImage from '../assets/backgrounds/happy-new-year.jpg';
import orlandoParkImage from '../assets/backgrounds/orlando-park.jpg';

export const TITLE_MAX_LENGTH = 60;
export const IMAGE_URL_MAX_LENGTH = 1000;

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

export type Background =
  | { type: 'solid'; color: string }
  | { type: 'gradient'; from: string; to: string }
  | { type: 'image'; url: string };

export type BackgroundType = Background['type'];

export interface CountdownConfig {
  title: string;
  finishDate: Dayjs | null;
  background: Background;
  titleColor: string;
  counterColor: string;
}

export interface GradientPreset {
  name: string;
  from: string;
  to: string;
  fontColor: string;
}

// Presets from docs/specs/style-guide.md (1.4 Countdown background presets).
export const GRADIENT_PRESETS: GradientPreset[] = [
  { name: 'Ocean', from: '#0B6E99', to: '#0A7A94', fontColor: '#FFFFFF' },
  { name: 'Sunset', from: '#F4845F', to: '#F7C35F', fontColor: '#1F2A33' },
  { name: 'Palm', from: '#1E7A4F', to: '#0F6B6B', fontColor: '#FFFFFF' },
  { name: 'Night', from: '#0E1620', to: '#2B4A66', fontColor: '#FFFFFF' },
];

const [DEFAULT_PRESET] = GRADIENT_PRESETS;
const IMAGE_FONT_COLOR = '#FFFFFF';

export interface ImagePreset {
  name: string;
  asset: string;
  fontColor: string;
}

// Bundled preset photos for the Image background option. Assets are resolved
// relative to the app's base URL, so they load correctly wherever this app is deployed.
// Font colors are picked by contrast against the text's actual position (centered,
// under the 0.4 black overlay), not the image's whole-frame average: white wins the
// worst-case contrast on all three despite looking closest on the lighter two.
export const IMAGE_PRESETS: ImagePreset[] = [
  { name: 'New Year', asset: happyNewYearImage, fontColor: '#FFFFFF' },
  { name: 'Birthday', asset: happyBirthdayImage, fontColor: '#FFFFFF' },
  { name: 'Orlando', asset: orlandoParkImage, fontColor: '#FFFFFF' },
];

export function resolveAssetUrl(asset: string): string {
  return new URL(asset, window.location.origin).toString();
}

export function createDefaultConfig(): CountdownConfig {
  return {
    title: '',
    finishDate: dayjs().add(30, 'day').hour(9).minute(0).second(0).millisecond(0),
    background: { type: 'gradient', from: DEFAULT_PRESET.from, to: DEFAULT_PRESET.to },
    titleColor: DEFAULT_PRESET.fontColor,
    counterColor: DEFAULT_PRESET.fontColor,
  };
}

export function createBackground(type: BackgroundType): Background {
  switch (type) {
    case 'solid':
      return { type, color: DEFAULT_PRESET.from };
    case 'gradient':
      return { type, from: DEFAULT_PRESET.from, to: DEFAULT_PRESET.to };
    case 'image':
      return { type, url: '' };
  }
}

export function getDefaultFontColor(type: BackgroundType): string {
  return type === 'image' ? IMAGE_FONT_COLOR : DEFAULT_PRESET.fontColor;
}

export function isHexColor(value: string): boolean {
  return HEX_COLOR.test(value);
}

export function isHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

const FALLBACK_BACKGROUND = '#1F2A33';

export function getBackgroundStyle(background: Background): CSSProperties {
  switch (background.type) {
    case 'solid':
      return { background: background.color };
    case 'gradient':
      return { background: `linear-gradient(135deg, ${background.from}, ${background.to})` };
    case 'image':
      if (!isHttpUrl(background.url)) {
        return { background: FALLBACK_BACKGROUND };
      }
      return {
        backgroundColor: FALLBACK_BACKGROUND,
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${JSON.stringify(background.url)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
  }
}

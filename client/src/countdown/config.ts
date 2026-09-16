import { CSSProperties } from 'react';

export const TITLE_MAX_LENGTH = 60;

export type Background =
  | { type: 'solid'; color: string }
  | { type: 'gradient'; from: string; to: string }
  | { type: 'image'; url: string };

export type BackgroundType = Background['type'];

export interface CountdownConfig {
  title: string;
  finishDate: string;
  background: Background;
  titleColor: string;
  counterColor: string;
}

function toDateTimeLocalValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function createDefaultConfig(): CountdownConfig {
  const finishDate = new Date();
  finishDate.setDate(finishDate.getDate() + 30);
  finishDate.setHours(9, 0, 0, 0);

  return {
    title: '',
    finishDate: toDateTimeLocalValue(finishDate),
    background: { type: 'gradient', from: '#1f6feb', to: '#7c3aed' },
    titleColor: '#ffffff',
    counterColor: '#ffffff',
  };
}

export function createBackground(type: BackgroundType): Background {
  switch (type) {
    case 'solid':
      return { type, color: '#1f6feb' };
    case 'gradient':
      return { type, from: '#1f6feb', to: '#7c3aed' };
    case 'image':
      return { type, url: '' };
  }
}

function isHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

const FALLBACK_BACKGROUND = '#1b2230';

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

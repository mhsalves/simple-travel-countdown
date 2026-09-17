import { ImageOrientation } from './shareImage';

// Share rules from docs/specs/share-action.md (3.3 Share targets, 3.4 Message).

export type NativeShareResult = 'shared' | 'cancelled' | 'failed';

interface NavigatorWithUserAgentData extends Navigator {
  userAgentData?: { mobile: boolean };
}

export function isMobileDevice(): boolean {
  const { userAgentData, userAgent, maxTouchPoints } = navigator as NavigatorWithUserAgentData;
  if (userAgentData) {
    return userAgentData.mobile;
  }
  const isTouchIpad = /Macintosh/.test(userAgent) && maxTouchPoints > 1;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent) || isTouchIpad;
}

export function canShareFiles(files: File[]): boolean {
  return typeof navigator.share === 'function' && typeof navigator.canShare === 'function' && navigator.canShare({ files });
}

export function buildShareMessage(title: string, link: string): string {
  return `Countdown to ${title}: ${link}`;
}

export function getWhatsAppShareUrl(title: string, link: string): string {
  return `https://wa.me/?text=${encodeURIComponent(buildShareMessage(title, link))}`;
}

export function getTelegramShareUrl(title: string, link: string): string {
  return `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(`Countdown to ${title}`)}`;
}

function slugify(text: string): string {
  const slug = text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'countdown';
}

export function getShareImageFileName(title: string, orientation: ImageOrientation): string {
  return `travel-countdown-${slugify(title)}-${orientation}.png`;
}

export function downloadFile(file: File) {
  const url = URL.createObjectURL(file);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = file.name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function openInNewTab(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

export async function shareNatively(file: File, title: string, link: string): Promise<NativeShareResult> {
  try {
    await navigator.share({
      title: `${title} · Travel Countdown`,
      text: buildShareMessage(title, link),
      files: [file],
    });
    return 'shared';
  } catch (error) {
    return error instanceof DOMException && error.name === 'AbortError' ? 'cancelled' : 'failed';
  }
}

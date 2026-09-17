// Share rules from docs/specs/countdown-link.md (5. Share action).

export type ShareResult = 'shared' | 'cancelled' | 'unsupported' | 'failed';

export async function shareCountdownLink(link: string, title: string): Promise<ShareResult> {
  const data: ShareData = {
    title: `${title} · Travel Countdown`,
    text: `Countdown to ${title}`,
    url: link,
  };

  if (typeof navigator.share !== 'function' || (navigator.canShare && !navigator.canShare(data))) {
    return 'unsupported';
  }

  try {
    await navigator.share(data);
    return 'shared';
  } catch (error) {
    return error instanceof DOMException && error.name === 'AbortError' ? 'cancelled' : 'failed';
  }
}

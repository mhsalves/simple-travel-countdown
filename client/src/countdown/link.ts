export const COUNTDOWN_PATH = 'countdown';

export interface CountdownConfig {
  title: string;
  date: Date;
}

export function buildCountdownLink({ title, date }: CountdownConfig): string {
  const url = new URL(`${import.meta.env.BASE_URL}${COUNTDOWN_PATH}`, window.location.origin);
  url.searchParams.set('title', title);
  url.searchParams.set('date', date.toISOString());
  return url.toString();
}

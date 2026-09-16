import { useEffect, useState } from 'react';

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
}

export function getTimeLeft(target: Date, now: number): TimeLeft {
  const totalSeconds = Math.max(0, Math.floor((target.getTime() - now) / 1000));

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor(totalSeconds / 3600) % 24,
    minutes: Math.floor(totalSeconds / 60) % 60,
    seconds: totalSeconds % 60,
    finished: totalSeconds === 0,
  };
}

export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}

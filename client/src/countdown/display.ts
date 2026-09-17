import { CountdownConfig } from './config';
import { getTimeLeft } from './timeLeft';

const TITLE_PLACEHOLDER = 'Your trip title';

export interface CountdownUnit {
  label: string;
  value: string;
}

export interface CountdownDisplay {
  title: string;
  units: CountdownUnit[];
  status: string;
}

export function getCountdownDisplay(config: CountdownConfig, now: number): CountdownDisplay {
  const target = config.finishDate?.isValid() ? config.finishDate.toDate() : null;
  const timeLeft = getTimeLeft(target ?? new Date(now), now);
  const pad = (value: number) => String(value).padStart(2, '0');

  let status = '';
  if (!target) {
    status = 'Choose a finish date';
  } else if (timeLeft.finished) {
    status = 'The countdown has finished';
  }

  return {
    title: config.title.trim() || TITLE_PLACEHOLDER,
    units: [
      { label: 'Days', value: pad(timeLeft.days) },
      { label: 'Hours', value: pad(timeLeft.hours) },
      { label: 'Minutes', value: pad(timeLeft.minutes) },
      { label: 'Seconds', value: pad(timeLeft.seconds) },
    ],
    status,
  };
}

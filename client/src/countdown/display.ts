import { Translate } from '../i18n/I18nProvider';
import { CountdownConfig } from './config';
import { getTimeLeft } from './timeLeft';

export interface CountdownUnit {
  label: string;
  value: string;
}

export interface CountdownDisplay {
  title: string;
  units: CountdownUnit[];
  status: string;
}

export function getCountdownDisplay(config: CountdownConfig, now: number, t: Translate): CountdownDisplay {
  const target = config.finishDate?.isValid() ? config.finishDate.toDate() : null;
  const timeLeft = getTimeLeft(target ?? new Date(now), now);
  const pad = (value: number) => String(value).padStart(2, '0');

  let status = '';
  if (!target) {
    status = t('countdown.chooseDate');
  } else if (timeLeft.finished) {
    status = t('countdown.finished');
  }

  return {
    title: config.title.trim() || t('countdown.titlePlaceholder'),
    units: [
      { label: t('countdown.days'), value: pad(timeLeft.days) },
      { label: t('countdown.hours'), value: pad(timeLeft.hours) },
      { label: t('countdown.minutes'), value: pad(timeLeft.minutes) },
      { label: t('countdown.seconds'), value: pad(timeLeft.seconds) },
    ],
    status,
  };
}

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

export function getCountdownDisplay(config: CountdownConfig, now: number): CountdownDisplay {
  const target = config.finishDate?.isValid() ? config.finishDate.toDate() : null;
  const timeLeft = getTimeLeft(target ?? new Date(now), now);
  const pad = (value: number) => String(value).padStart(2, '0');

  let status = '';
  if (!target) {
    status = 'Escolha a data final';
  } else if (timeLeft.finished) {
    status = 'A contagem terminou';
  }

  return {
    title: config.title.trim() || 'Título da sua viagem',
    units: [
      { label: 'Dias', value: pad(timeLeft.days) },
      { label: 'Horas', value: pad(timeLeft.hours) },
      { label: 'Minutos', value: pad(timeLeft.minutes) },
      { label: 'Segundos', value: pad(timeLeft.seconds) },
    ],
    status,
  };
}

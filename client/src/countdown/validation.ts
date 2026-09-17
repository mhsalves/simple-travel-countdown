import { CountdownConfig, isHttpUrl } from './config';

// Share validation rules from docs/specs/countdown-link.md (4.1).

export interface CountdownFormErrors {
  title?: string;
  finishDate?: string;
  imageUrl?: string;
}

export const IMAGE_URL_ERROR = 'Digite uma URL começando com http:// ou https://';

export function validateCountdownConfig(config: CountdownConfig, now = Date.now()): CountdownFormErrors {
  const errors: CountdownFormErrors = {};

  if (!config.title.trim()) {
    errors.title = 'Digite um título para sua contagem.';
  }

  if (!config.finishDate?.isValid()) {
    errors.finishDate = 'Escolha a data final.';
  } else if (config.finishDate.valueOf() <= now) {
    errors.finishDate = 'Escolha uma data e hora no futuro.';
  }

  if (config.background.type === 'image' && !isHttpUrl(config.background.url)) {
    errors.imageUrl = IMAGE_URL_ERROR;
  }

  return errors;
}

export function hasErrors(errors: CountdownFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

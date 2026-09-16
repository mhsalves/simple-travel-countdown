import { CountdownConfig, isHttpUrl } from './config';

// Generation rules from docs/specs/countdown-link.md (4.1).

export interface CountdownFormErrors {
  title?: string;
  finishDate?: string;
  imageUrl?: string;
}

export const IMAGE_URL_ERROR = 'Enter a URL starting with http:// or https://';

export function validateCountdownConfig(config: CountdownConfig, now = Date.now()): CountdownFormErrors {
  const errors: CountdownFormErrors = {};

  if (!config.title.trim()) {
    errors.title = 'Enter a title for your countdown.';
  }

  if (!config.finishDate?.isValid()) {
    errors.finishDate = 'Choose the finish date.';
  } else if (config.finishDate.valueOf() <= now) {
    errors.finishDate = 'Choose a date and time in the future.';
  }

  if (config.background.type === 'image' && !isHttpUrl(config.background.url)) {
    errors.imageUrl = IMAGE_URL_ERROR;
  }

  return errors;
}

export function hasErrors(errors: CountdownFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

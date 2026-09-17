import { TranslationKey } from '../i18n/translations';
import { CountdownConfig, isHttpUrl } from './config';

// Share validation rules from docs/specs/countdown-link.md (4.1).
// Errors are translation keys; the form turns them into messages.

export interface CountdownFormErrors {
  title?: TranslationKey;
  finishDate?: TranslationKey;
  imageUrl?: TranslationKey;
}

export const IMAGE_URL_ERROR: TranslationKey = 'validation.imageUrl';

export function validateCountdownConfig(config: CountdownConfig, now = Date.now()): CountdownFormErrors {
  const errors: CountdownFormErrors = {};

  if (!config.title.trim()) {
    errors.title = 'validation.title';
  }

  if (!config.finishDate?.isValid()) {
    errors.finishDate = 'validation.finishDate';
  } else if (config.finishDate.valueOf() <= now) {
    errors.finishDate = 'validation.finishDateFuture';
  }

  if (config.background.type === 'image' && !isHttpUrl(config.background.url)) {
    errors.imageUrl = IMAGE_URL_ERROR;
  }

  return errors;
}

export function hasErrors(errors: CountdownFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

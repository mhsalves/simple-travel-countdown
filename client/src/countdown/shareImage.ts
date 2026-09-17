import dayjs from 'dayjs';
import { Translate } from '../i18n/I18nProvider';
import { Background, CountdownConfig, FALLBACK_BACKGROUND, IMAGE_OVERLAY, isHttpUrl } from './config';
import { getCountdownDisplay } from './display';

// Image rules from docs/specs/share-action.md (4. Image).

export type ImageOrientation = 'landscape' | 'vertical';

export const IMAGE_SIZES: Record<ImageOrientation, { width: number; height: number }> = {
  landscape: { width: 1600, height: 900 },
  vertical: { width: 1080, height: 1920 },
};

export interface ShareImage {
  blob: Blob;
  backgroundIncluded: boolean;
}

const FONT_FAMILY = '"Inter Variable", Inter, system-ui, sans-serif';
const PREVIEW_HEIGHT = 360;
const CONTENT_WIDTH_RATIO = 0.86;
const TITLE_MAX_LINES = 3;
const DETAIL_OPACITY = 0.7;
const LABEL_OPACITY = 0.85;
const APP_NAME = 'Travel Countdown';
const LOGO_URL = `${import.meta.env.BASE_URL}favicon.svg`;

function loadImage(src: string, crossOrigin?: 'anonymous'): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    if (crossOrigin) {
      image.crossOrigin = crossOrigin;
    }
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load image: ${src}`));
    image.src = src;
  });
}

function font(weight: number, size: number): string {
  return `${weight} ${Math.round(size)}px ${FONT_FAMILY}`;
}

function setLetterSpacing(ctx: CanvasRenderingContext2D, value: string) {
  if ('letterSpacing' in ctx) {
    ctx.letterSpacing = value;
  }
}

async function drawBackground(
  ctx: CanvasRenderingContext2D,
  background: Background,
  width: number,
  height: number,
): Promise<boolean> {
  switch (background.type) {
    case 'solid':
      ctx.fillStyle = background.color;
      ctx.fillRect(0, 0, width, height);
      return true;

    case 'gradient': {
      // Same geometry as CSS linear-gradient(135deg, ...).
      const angle = (135 * Math.PI) / 180;
      const dx = Math.sin(angle);
      const dy = -Math.cos(angle);
      const halfLength = (Math.abs(width * dx) + Math.abs(height * dy)) / 2;
      const gradient = ctx.createLinearGradient(
        width / 2 - dx * halfLength,
        height / 2 - dy * halfLength,
        width / 2 + dx * halfLength,
        height / 2 + dy * halfLength,
      );
      gradient.addColorStop(0, background.from);
      gradient.addColorStop(1, background.to);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      return true;
    }

    case 'image': {
      ctx.fillStyle = FALLBACK_BACKGROUND;
      ctx.fillRect(0, 0, width, height);

      let included = false;
      if (isHttpUrl(background.url)) {
        try {
          const image = await loadImage(background.url, 'anonymous');
          const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
          const drawWidth = image.naturalWidth * scale;
          const drawHeight = image.naturalHeight * scale;
          ctx.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
          included = true;
        } catch {
          included = false;
        }
      }

      ctx.fillStyle = IMAGE_OVERLAY;
      ctx.fillRect(0, 0, width, height);
      return included;
    }
  }
}

function breakWord(ctx: CanvasRenderingContext2D, word: string, maxWidth: number): string[] {
  const pieces: string[] = [];
  let current = '';
  for (const char of Array.from(word)) {
    if (current && ctx.measureText(current + char).width > maxWidth) {
      pieces.push(current);
      current = char;
    } else {
      current += char;
    }
  }
  if (current) {
    pieces.push(current);
  }
  return pieces;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const lines: string[] = [];
  let current = '';

  for (const word of text.split(/\s+/)) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
      continue;
    }
    if (current) {
      lines.push(current);
    }
    const pieces = breakWord(ctx, word, maxWidth);
    current = pieces.pop() ?? '';
    lines.push(...pieces);
  }
  if (current) {
    lines.push(current);
  }

  if (lines.length <= maxLines) {
    return lines;
  }

  const visible = lines.slice(0, maxLines);
  let last = `${visible[maxLines - 1]}…`;
  while (ctx.measureText(last).width > maxWidth && last.length > 1) {
    last = `${Array.from(last).slice(0, -2).join('')}…`;
  }
  visible[maxLines - 1] = last;
  return visible;
}

export function formatGeneratedAt(date: Date): string {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
}

export async function renderShareImage(
  config: CountdownConfig,
  orientation: ImageOrientation,
  generatedAt: Date,
  t: Translate,
): Promise<ShareImage> {
  const { width, height } = IMAGE_SIZES[orientation];
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas is not supported');
  }

  const shortSide = Math.min(width, height);
  const scale = shortSide / PREVIEW_HEIGHT;
  const contentWidth = width * CONTENT_WIDTH_RATIO;
  const { title, units, status } = getCountdownDisplay(config, generatedAt.getTime(), t);

  await Promise.all([
    document.fonts.load(font(700, 64)),
    document.fonts.load(font(600, 24)),
    document.fonts.load(font(500, 24)),
  ]);
  const [backgroundIncluded, logo] = await Promise.all([
    drawBackground(ctx, config.background, width, height),
    loadImage(LOGO_URL).catch(() => null),
  ]);

  // Sizes from the preview (docs/specs/style-guide.md 2.1), scaled to the canvas.
  const titleSize = 36 * scale;
  const titleLineHeight = titleSize * 1.2;
  const blockGap = 24 * scale;
  const statusSize = 16 * scale;

  ctx.font = font(700, titleSize);
  const titleLines = wrapText(ctx, title, contentWidth, TITLE_MAX_LINES);

  let valueSize = 64 * scale;
  let labelSize = 12 * scale;
  let unitGap = 32 * scale;
  const measureUnits = () => {
    const widths = units.map(({ label, value }) => {
      ctx.font = font(700, valueSize);
      const valueWidth = ctx.measureText(value).width;
      ctx.font = font(500, labelSize);
      setLetterSpacing(ctx, `${labelSize * 0.08}px`);
      const labelWidth = ctx.measureText(label.toUpperCase()).width;
      setLetterSpacing(ctx, '0px');
      return Math.max(valueWidth, labelWidth);
    });
    return { widths, total: widths.reduce((sum, w) => sum + w, 0) + unitGap * (units.length - 1) };
  };

  let row = measureUnits();
  if (row.total > contentWidth) {
    const fit = contentWidth / row.total;
    valueSize *= fit;
    labelSize *= fit;
    unitGap *= fit;
    row = measureUnits();
  }

  const valueLineHeight = valueSize * 1.1;
  const labelLineHeight = labelSize * 1.5;
  const unitsHeight = valueLineHeight + labelLineHeight;
  const blockHeight =
    titleLines.length * titleLineHeight + blockGap + unitsHeight + (status ? blockGap + statusSize * 1.5 : 0);

  let y = (height - blockHeight) / 2;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = config.titleColor;
  ctx.font = font(700, titleSize);
  for (const line of titleLines) {
    ctx.fillText(line, width / 2, y + titleLineHeight / 2);
    y += titleLineHeight;
  }
  y += blockGap;

  ctx.fillStyle = config.counterColor;
  let x = (width - row.total) / 2;
  units.forEach(({ label, value }, index) => {
    const center = x + row.widths[index] / 2;
    ctx.font = font(700, valueSize);
    ctx.fillText(value, center, y + valueLineHeight / 2);

    ctx.globalAlpha = LABEL_OPACITY;
    ctx.font = font(500, labelSize);
    setLetterSpacing(ctx, `${labelSize * 0.08}px`);
    ctx.fillText(label.toUpperCase(), center, y + valueLineHeight + labelLineHeight / 2);
    setLetterSpacing(ctx, '0px');
    ctx.globalAlpha = 1;

    x += row.widths[index] + unitGap;
  });
  y += unitsHeight;

  if (status) {
    y += blockGap;
    ctx.font = font(600, statusSize);
    ctx.fillText(status, width / 2, y + (statusSize * 1.5) / 2);
  }

  // Baseline details: generation time on the left, watermark on the right.
  const inset = shortSide * 0.035;
  const detailSize = shortSide * 0.022;
  const baseline = height - inset;

  ctx.globalAlpha = DETAIL_OPACITY;
  ctx.fillStyle = config.counterColor;
  ctx.textBaseline = 'alphabetic';
  if (config.background.type === 'image') {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 4;
  }

  ctx.font = font(500, detailSize);
  ctx.textAlign = 'left';
  ctx.fillText(formatGeneratedAt(generatedAt), inset, baseline);

  ctx.font = font(600, detailSize);
  ctx.textAlign = 'right';
  ctx.fillText(APP_NAME, width - inset, baseline);

  if (logo) {
    const logoSize = detailSize * 1.3;
    const nameWidth = ctx.measureText(APP_NAME).width;
    const logoX = width - inset - nameWidth - detailSize * 0.5 - logoSize;
    // Align the mark's bottom with the text baseline area.
    ctx.drawImage(logo, logoX, baseline - logoSize + detailSize * 0.2, logoSize, logoSize);
  }

  ctx.globalAlpha = 1;
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => (result ? resolve(result) : reject(new Error('Could not export image'))), 'image/png');
  });

  return { blob, backgroundIncluded };
}

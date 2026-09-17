import { FormEvent, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ColorField from './ColorField';
import {
  Background,
  BackgroundType,
  CountdownConfig,
  GRADIENT_PRESETS,
  GradientPreset,
  IMAGE_PRESETS,
  IMAGE_URL_MAX_LENGTH,
  ImagePreset,
  TITLE_MAX_LENGTH,
  createBackground,
  getDefaultFontColor,
  isHttpUrl,
  resolveAssetUrl,
} from './config';
import { IMAGE_URL_ERROR, hasErrors, validateCountdownConfig } from './validation';

const BACKGROUND_OPTIONS: { type: BackgroundType; label: string }[] = [
  { type: 'solid', label: 'Solid color' },
  { type: 'gradient', label: 'Gradient' },
  { type: 'image', label: 'Image' },
];

interface CountdownFormProps {
  config: CountdownConfig;
  onChange: (config: CountdownConfig) => void;
  onShare: () => void;
}

function CountdownForm({ config, onChange, onShare }: CountdownFormProps) {
  const { background } = config;
  const [submitted, setSubmitted] = useState(false);
  const errors = submitted ? validateCountdownConfig(config) : {};

  function update(changes: Partial<CountdownConfig>) {
    onChange({ ...config, ...changes });
  }

  function updateBackground(changes: Partial<Background>) {
    update({ background: { ...background, ...changes } as Background });
  }

  function changeBackgroundType(type: BackgroundType | null) {
    if (!type || type === background.type) {
      return;
    }
    const fontColor = getDefaultFontColor(type);
    update({ background: createBackground(type), titleColor: fontColor, counterColor: fontColor });
  }

  const selectedPreset =
    background.type === 'gradient'
      ? GRADIENT_PRESETS.find(({ from, to }) => from === background.from && to === background.to)
      : undefined;

  function applyPreset(preset: GradientPreset) {
    update({
      background: { type: 'gradient', from: preset.from, to: preset.to },
      titleColor: preset.fontColor,
      counterColor: preset.fontColor,
    });
  }

  const selectedImagePreset =
    background.type === 'image' ? IMAGE_PRESETS.find((preset) => resolveAssetUrl(preset.asset) === background.url) : undefined;
  const isCustomImage = background.type === 'image' && !selectedImagePreset;

  function applyImagePreset(preset: ImagePreset) {
    update({
      background: { type: 'image', url: resolveAssetUrl(preset.asset) },
      titleColor: preset.fontColor,
      counterColor: preset.fontColor,
    });
  }

  function switchToCustomImage() {
    if (isCustomImage) {
      return;
    }
    const fontColor = getDefaultFontColor('image');
    update({ background: { type: 'image', url: '' }, titleColor: fontColor, counterColor: fontColor });
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (!hasErrors(validateCountdownConfig(config))) {
      onShare();
    }
  }

  const imageUrlError =
    errors.imageUrl ??
    (background.type === 'image' && background.url !== '' && !isHttpUrl(background.url) ? IMAGE_URL_ERROR : undefined);

  return (
    <Card variant="outlined" component="form" noValidate onSubmit={handleSubmit}>
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Stack spacing={2.5}>
          <TextField
            label="Title"
            placeholder="Trip to Lisbon"
            value={config.title}
            onChange={(event) => update({ title: event.target.value })}
            error={Boolean(errors.title)}
            helperText={errors.title ?? `${config.title.length}/${TITLE_MAX_LENGTH}`}
            slotProps={{ htmlInput: { maxLength: TITLE_MAX_LENGTH } }}
          />

          <DateTimePicker
            label="Finish date"
            value={config.finishDate}
            onChange={(value) => update({ finishDate: value })}
            disablePast
            slotProps={{
              textField: {
                fullWidth: true,
                error: errors.finishDate ? true : undefined,
                helperText: errors.finishDate,
              },
            }}
          />

          <Stack spacing={1.5}>
            <FormLabel component="legend" id="background-label">
              Background
            </FormLabel>
            <ToggleButtonGroup
              exclusive
              fullWidth
              color="primary"
              size="small"
              aria-labelledby="background-label"
              value={background.type}
              onChange={(_event, value: BackgroundType | null) => changeBackgroundType(value)}
            >
              {BACKGROUND_OPTIONS.map(({ type, label }) => (
                <ToggleButton key={type} value={type}>
                  {label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            {background.type === 'solid' && (
              <ColorField label="Background color" value={background.color} onChange={(color) => updateBackground({ color })} />
            )}

            {background.type === 'gradient' && (
              <>
                <Box
                  role="group"
                  aria-label="Gradient presets"
                  sx={{ display: 'grid', gap: 1, gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' } }}
                >
                  {GRADIENT_PRESETS.map((preset) => (
                    <ToggleButton
                      key={preset.name}
                      value={preset.name}
                      color="primary"
                      size="small"
                      selected={selectedPreset === preset}
                      onChange={() => applyPreset(preset)}
                      sx={{ gap: 1 }}
                    >
                      <Box
                        aria-hidden
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          flexShrink: 0,
                          background: `linear-gradient(135deg, ${preset.from}, ${preset.to})`,
                        }}
                      />
                      {preset.name}
                    </ToggleButton>
                  ))}
                </Box>
                <Stack direction="row" spacing={1.5}>
                  <ColorField label="Start color" value={background.from} onChange={(from) => updateBackground({ from })} />
                  <ColorField label="End color" value={background.to} onChange={(to) => updateBackground({ to })} />
                </Stack>
              </>
            )}

            {background.type === 'image' && (
              <>
                <Box role="group" aria-label="Image presets" sx={{ display: 'grid', gap: 1, gridTemplateColumns: 'repeat(2, 1fr)' }}>
                  {IMAGE_PRESETS.map((preset) => (
                    <ToggleButton
                      key={preset.name}
                      value={preset.name}
                      color="primary"
                      size="small"
                      selected={selectedImagePreset === preset}
                      onChange={() => applyImagePreset(preset)}
                      sx={{ gap: 1, justifyContent: 'flex-start', minWidth: 0 }}
                    >
                      <Box
                        component="img"
                        src={preset.asset}
                        alt=""
                        aria-hidden
                        sx={{ width: 20, height: 20, borderRadius: 0.5, flexShrink: 0, objectFit: 'cover' }}
                      />
                      <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {preset.name}
                      </Box>
                    </ToggleButton>
                  ))}
                  <ToggleButton
                    value="custom"
                    color="primary"
                    size="small"
                    selected={isCustomImage}
                    onChange={switchToCustomImage}
                    sx={{ gap: 1, justifyContent: 'flex-start', minWidth: 0 }}
                  >
                    <AddPhotoAlternateRoundedIcon aria-hidden sx={{ width: 20, height: 20, flexShrink: 0 }} />
                    <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Custom
                    </Box>
                  </ToggleButton>
                </Box>
                {isCustomImage && (
                  <TextField
                    label="Image URL"
                    type="url"
                    placeholder="https://example.com/beach.jpg"
                    value={background.url}
                    error={Boolean(imageUrlError)}
                    helperText={imageUrlError ?? ' '}
                    onChange={(event) => updateBackground({ url: event.target.value })}
                    slotProps={{ htmlInput: { maxLength: IMAGE_URL_MAX_LENGTH } }}
                  />
                )}
              </>
            )}
          </Stack>

          <Stack spacing={1.5}>
            <FormLabel component="legend">Font colors</FormLabel>
            <Stack direction="row" spacing={1.5}>
              <ColorField label="Title color" value={config.titleColor} onChange={(titleColor) => update({ titleColor })} />
              <ColorField
                label="Counter color"
                value={config.counterColor}
                onChange={(counterColor) => update({ counterColor })}
              />
            </Stack>
          </Stack>

          <Button type="submit" variant="contained" size="large" fullWidth startIcon={<ShareRoundedIcon />}>
            Share
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default CountdownForm;

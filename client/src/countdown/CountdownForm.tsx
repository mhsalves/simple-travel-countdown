import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ColorField from './ColorField';
import {
  Background,
  BackgroundType,
  CountdownConfig,
  GRADIENT_PRESETS,
  GradientPreset,
  TITLE_MAX_LENGTH,
  createBackground,
  getDefaultFontColor,
  isHttpUrl,
} from './config';

const BACKGROUND_OPTIONS: { type: BackgroundType; label: string }[] = [
  { type: 'solid', label: 'Solid color' },
  { type: 'gradient', label: 'Gradient' },
  { type: 'image', label: 'Image' },
];

interface CountdownFormProps {
  config: CountdownConfig;
  onChange: (config: CountdownConfig) => void;
}

function CountdownForm({ config, onChange }: CountdownFormProps) {
  const { background } = config;

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

  const imageUrlInvalid = background.type === 'image' && background.url !== '' && !isHttpUrl(background.url);

  return (
    <Card variant="outlined" component="form" onSubmit={(event: React.FormEvent) => event.preventDefault()}>
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Stack spacing={2.5}>
          <TextField
            label="Title"
            placeholder="Trip to Lisbon"
            value={config.title}
            onChange={(event) => update({ title: event.target.value })}
            helperText={`${config.title.length}/${TITLE_MAX_LENGTH}`}
            slotProps={{ htmlInput: { maxLength: TITLE_MAX_LENGTH } }}
          />

          <DateTimePicker
            label="Finish date"
            value={config.finishDate}
            onChange={(value) => update({ finishDate: value })}
            disablePast
            slotProps={{ textField: { fullWidth: true } }}
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
              <TextField
                label="Image URL"
                type="url"
                placeholder="https://example.com/beach.jpg"
                value={background.url}
                error={imageUrlInvalid}
                helperText={imageUrlInvalid ? 'Enter a URL starting with http:// or https://' : ' '}
                onChange={(event) => updateBackground({ url: event.target.value })}
              />
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

          <Button type="button" variant="contained" size="large" fullWidth>
            Generate link
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default CountdownForm;

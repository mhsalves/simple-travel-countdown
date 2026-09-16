import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { isHexColor } from './config';

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorField({ label, value, onChange }: ColorFieldProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  function handleTextChange(text: string) {
    setDraft(text);
    if (isHexColor(text)) {
      onChange(text.toUpperCase());
    }
  }

  return (
    <TextField
      label={label}
      value={draft}
      error={!isHexColor(draft)}
      onChange={(event) => handleTextChange(event.target.value)}
      onBlur={() => setDraft(value)}
      slotProps={{
        htmlInput: { maxLength: 7, spellCheck: false },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Box
                component="input"
                type="color"
                aria-label={`${label} picker`}
                value={value}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value.toUpperCase())}
                sx={{
                  width: 28,
                  height: 28,
                  p: 0,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: 'transparent',
                  cursor: 'pointer',
                  '&::-webkit-color-swatch-wrapper': { p: 0 },
                  '&::-webkit-color-swatch': { border: 0, borderRadius: '6px' },
                  '&::-moz-color-swatch': { border: 0, borderRadius: '6px' },
                }}
              />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

export default ColorField;

import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded';
import InputAdornment from '@mui/material/InputAdornment';
import { useTranslation } from '../i18n/I18nProvider';
import { LANGUAGES, LANGUAGE_CODES, LANGUAGE_NAMES, Language } from '../i18n/translations';

function LanguageSelector() {
  const { language, setLanguage, t } = useTranslation();

  return (
    <TextField
      select
      size="small"
      fullWidth={false}
      label={undefined}
      aria-label={t('header.language')}
      value={language}
      onChange={(event) => setLanguage(event.target.value as Language)}
      slotProps={{
        htmlInput: { 'aria-label': t('header.language') },
        input: {
          startAdornment: (
            <InputAdornment position="start" sx={{ mr: 0.5, display: { xs: 'none', sm: 'flex' } }}>
              <TranslateRoundedIcon fontSize="small" />
            </InputAdornment>
          ),
        },
        select: {
          renderValue: (value) => LANGUAGE_CODES[value as Language],
        },
      }}
      sx={{ flexShrink: 0, '& .MuiSelect-select': { py: 0.75, pl: 0 } }}
    >
      {LANGUAGES.map((option) => (
        <MenuItem key={option} value={option}>
          {LANGUAGE_NAMES[option]}
        </MenuItem>
      ))}
    </TextField>
  );
}

export default LanguageSelector;

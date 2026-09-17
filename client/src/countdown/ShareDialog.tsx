import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CropLandscapeRoundedIcon from '@mui/icons-material/CropLandscapeRounded';
import CropPortraitRoundedIcon from '@mui/icons-material/CropPortraitRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import { useTranslation } from '../i18n/I18nProvider';
import ShareTargets from './ShareTargets';
import { CountdownConfig } from './config';
import { getShareImageFileName } from './share';
import { ImageOrientation, renderShareImage } from './shareImage';

type CopyStatus = 'idle' | 'copied' | 'failed';

type RenderedImage =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; file: File; url: string; backgroundIncluded: boolean };

const ORIENTATIONS = [
  { value: 'landscape', labelKey: 'share.landscape', imageKey: 'share.landscapeImage', icon: <CropLandscapeRoundedIcon /> },
  { value: 'vertical', labelKey: 'share.vertical', imageKey: 'share.verticalImage', icon: <CropPortraitRoundedIcon /> },
] as const;

interface ShareDialogProps {
  open: boolean;
  link: string;
  config: CountdownConfig;
  generatedAt: Date;
  onClose: () => void;
}

function ShareDialog({ open, link, config, generatedAt, onClose }: ShareDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  const title = config.title.trim();

  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const [orientation, setOrientation] = useState<ImageOrientation>('landscape');
  const [images, setImages] = useState<Record<ImageOrientation, RenderedImage>>({
    landscape: { status: 'loading' },
    vertical: { status: 'loading' },
  });

  useEffect(() => {
    let active = true;
    const urls: string[] = [];

    ORIENTATIONS.forEach(({ value }) => {
      renderShareImage(config, value, generatedAt, t)
        .then(({ blob, backgroundIncluded }) => {
          if (!active) {
            return;
          }
          const file = new File([blob], getShareImageFileName(title, value), { type: 'image/png' });
          const url = URL.createObjectURL(file);
          urls.push(url);
          setImages((previous) => ({ ...previous, [value]: { status: 'ready', file, url, backgroundIncluded } }));
        })
        .catch(() => {
          if (active) {
            setImages((previous) => ({ ...previous, [value]: { status: 'error' } }));
          }
        });
    });

    return () => {
      active = false;
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [config, generatedAt, title, t]);

  const image = images[orientation];
  const selectedOrientation = ORIENTATIONS.find(({ value }) => value === orientation) ?? ORIENTATIONS[0];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      aria-labelledby="share-dialog-title"
    >
      <DialogTitle id="share-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <ShareRoundedIcon color="primary" />
        {t('share.title')}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Stack spacing={1.5}>
            <FormLabel component="p">{t('share.link')}</FormLabel>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <TextField
                label={t('share.linkField')}
                size="small"
                value={link}
                onFocus={(event) => event.target.select()}
                slotProps={{ htmlInput: { readOnly: true } }}
              />
              <Button
                variant="outlined"
                color={copyStatus === 'copied' ? 'success' : 'primary'}
                startIcon={copyStatus === 'copied' ? <CheckRoundedIcon /> : <ContentCopyRoundedIcon />}
                onClick={handleCopy}
                sx={{ flexShrink: 0 }}
              >
                {copyStatus === 'copied' ? t('share.copied') : t('share.copy')}
              </Button>
            </Stack>
            {copyStatus === 'failed' && (
              <Alert severity="error">{t('share.copyFailed')}</Alert>
            )}
          </Stack>

          <Divider />

          <Stack spacing={1.5}>
            <FormLabel component="p" id="share-image-label">
              {t('share.image')}
            </FormLabel>
            <ToggleButtonGroup
              exclusive
              fullWidth
              color="primary"
              size="small"
              aria-labelledby="share-image-label"
              value={orientation}
              onChange={(_event, value: ImageOrientation | null) => value && setOrientation(value)}
            >
              {ORIENTATIONS.map(({ value, labelKey, icon }) => (
                <ToggleButton key={value} value={value} sx={{ gap: 1 }}>
                  {icon}
                  {t(labelKey)}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 280,
                p: 1.5,
                borderRadius: 1,
                bgcolor: 'background.default',
                border: 1,
                borderColor: 'divider',
              }}
            >
              {image.status === 'loading' && <CircularProgress aria-label={t('share.rendering')} />}
              {image.status === 'error' && <Alert severity="error">{t('share.imageError')}</Alert>}
              {image.status === 'ready' && (
                <Box
                  component="img"
                  src={image.url}
                  alt={t('share.imageAlt', { orientation: t(selectedOrientation.labelKey), title })}
                  sx={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '6px', boxShadow: 2 }}
                />
              )}
            </Box>
            {image.status === 'ready' && !image.backgroundIncluded && (
              <Alert severity="info">{t('share.backgroundNotice')}</Alert>
            )}
          </Stack>

          <Divider />

          {image.status === 'ready' ? (
            <ShareTargets file={image.file} imageName={t(selectedOrientation.imageKey)} title={title} link={link} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              {image.status === 'loading' ? t('share.preparing') : t('share.imageNeeded')}
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose}>{t('action.close')}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ShareDialog;

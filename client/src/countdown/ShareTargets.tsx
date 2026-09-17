import { ReactNode, useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import TelegramIcon from '@mui/icons-material/Telegram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useTranslation } from '../i18n/I18nProvider';
import {
  NativeShareResult,
  copyImageToClipboard,
  downloadFile,
  getNativeShareSupport,
  getPasteShortcut,
  getTelegramShareUrl,
  getWhatsAppShareUrl,
  isImageClipboardAllowed,
  isMobileDevice,
  openInNewTab,
  shareNatively,
} from './share';

// Share target rules from docs/specs/share-action.md (3.3 Share targets).

type AppTarget = 'WhatsApp' | 'Telegram';
type Target = AppTarget | 'Other';

type Feedback = {
  severity: 'success' | 'error';
  message: string;
  action?: { label: string; url: string };
} | null;

interface Instructions {
  steps: ReactNode[];
  note?: string;
  actionLabel?: string;
  action?: () => void;
}

const TARGETS: { value: Target; icon: JSX.Element }[] = [
  { value: 'WhatsApp', icon: <WhatsAppIcon /> },
  { value: 'Telegram', icon: <TelegramIcon /> },
  { value: 'Other', icon: <ShareRoundedIcon /> },
];

interface ShareTargetsProps {
  file: File;
  imageName: string;
  title: string;
  link: string;
}

function ShareTargets({ file, imageName, title, link }: ShareTargetsProps) {
  const { t } = useTranslation();
  const isMobile = useMemo(isMobileDevice, []);
  const nativeSupport = useMemo(() => getNativeShareSupport(file), [file]);
  const [clipboardAllowed, setClipboardAllowed] = useState<boolean | null>(null);
  const [target, setTarget] = useState<Target | null>(isMobile ? 'Other' : null);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useEffect(() => {
    let active = true;
    isImageClipboardAllowed().then((allowed) => active && setClipboardAllowed(allowed));
    return () => {
      active = false;
    };
  }, []);

  function showNativeResult(result: NativeShareResult) {
    if (result === 'shared') {
      setFeedback({ severity: 'success', message: t('targets.shared') });
    } else if (result === 'failed') {
      setFeedback({ severity: 'error', message: t('targets.shareFailed') });
    }
  }

  async function shareToApp(app: AppTarget) {
    const url = app === 'WhatsApp' ? getWhatsAppShareUrl(title, link) : getTelegramShareUrl(title, link);
    const copied = clipboardAllowed ? await copyImageToClipboard(file) : false;
    if (!copied) {
      downloadFile(file);
    }
    const opened = openInNewTab(url);

    let message = t('targets.copiedFeedback', { app, shortcut: getPasteShortcut() });
    if (!copied) {
      message = clipboardAllowed
        ? t('targets.copyFailedFeedback', { app, file: file.name })
        : t('targets.downloadedFeedback', { app, file: file.name });
    }
    setFeedback({
      severity: 'success',
      message,
      action: opened ? undefined : { label: t('targets.openApp', { app }), url },
    });
  }

  async function shareWithSystem() {
    showNativeResult(await shareNatively(nativeSupport === 'image' ? file : null, title, link));
  }

  function getAppInstructions(app: AppTarget): Instructions {
    const opens = t('targets.opensStep', { app });
    if (clipboardAllowed) {
      return {
        steps: [
          t('targets.copyStep', { image: imageName }),
          opens,
          t('targets.pasteStep', { shortcut: getPasteShortcut() }),
        ],
        actionLabel: t('targets.copyAction', { app }),
        action: () => shareToApp(app),
      };
    }
    return {
      steps: [t('targets.downloadStep', { image: imageName, file: file.name }), opens, t('targets.attachStep')],
      actionLabel: t('targets.downloadAction', { app }),
      action: () => shareToApp(app),
    };
  }

  function getNativeInstructions(): Instructions {
    const options = isMobile ? t('targets.phoneOptions') : t('targets.systemOptions');
    if (nativeSupport === 'image') {
      return {
        steps: [t('targets.nativeStep', { options, image: imageName }), t('targets.nativeChooseStep')],
        note: t('targets.nativeNote'),
        actionLabel: t('targets.nativeAction'),
        action: shareWithSystem,
      };
    }
    if (nativeSupport === 'link') {
      return {
        steps: [t('targets.linkOnlyStep'), t('targets.linkOnlyOptionsStep', { options })],
        actionLabel: t('targets.linkOnlyAction'),
        action: shareWithSystem,
      };
    }
    return {
      steps: [isMobile ? t('targets.unsupportedMobile') : t('targets.unsupportedWeb')],
    };
  }

  let instructions: Instructions | null = null;
  if (target === 'Other') {
    instructions = getNativeInstructions();
  } else if (target) {
    instructions = getAppInstructions(target);
  }
  const loading = target !== null && target !== 'Other' && clipboardAllowed === null;

  return (
    <Stack spacing={1.5}>
      <FormLabel component="p" id="share-targets-label">
        {t('targets.label')}
      </FormLabel>

      {!isMobile && (
        <ToggleButtonGroup
          exclusive
          fullWidth
          color="primary"
          aria-labelledby="share-targets-label"
          value={target}
          onChange={(_event, value: Target | null) => {
            setTarget(value);
            setFeedback(null);
          }}
        >
          {TARGETS.map(({ value, icon }) => (
            <ToggleButton key={value} value={value} sx={{ gap: 1 }}>
              {icon}
              {value === 'Other' ? t('targets.other') : value}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}

      {!target && (
        <Typography variant="body2" color="text.secondary">
          {t('targets.choose')}
        </Typography>
      )}

      {instructions && !loading && (
        <Box
          sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'background.default' }}
          aria-live="polite"
        >
          <Stack spacing={1.5}>
            <Box component="ol" sx={{ m: 0, pl: 2.5, typography: 'body2', '& li + li': { mt: 0.75 } }}>
              {instructions.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </Box>
            {instructions.note && (
              <Typography variant="body2" color="text.secondary">
                {instructions.note}
              </Typography>
            )}
            {instructions.action && (
              <Button
                variant="contained"
                fullWidth
                startIcon={TARGETS.find(({ value }) => value === target)?.icon}
                onClick={instructions.action}
              >
                {instructions.actionLabel}
              </Button>
            )}
          </Stack>
        </Box>
      )}

      {feedback && (
        <Alert
          severity={feedback.severity}
          onClose={() => setFeedback(null)}
          action={
            feedback.action && (
              <Button color="inherit" size="small" href={feedback.action.url} target="_blank" rel="noopener noreferrer">
                {feedback.action.label}
              </Button>
            )
          }
        >
          {feedback.message}
        </Alert>
      )}
    </Stack>
  );
}

export default ShareTargets;

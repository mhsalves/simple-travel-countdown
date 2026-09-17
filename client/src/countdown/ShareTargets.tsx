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

const APP_TEXT_DROP_NOTE =
  'Some apps keep only the image and drop the message. If the link is missing, copy it above and paste it in the chat.';

interface ShareTargetsProps {
  file: File;
  orientationLabel: string;
  title: string;
  link: string;
}

function ShareTargets({ file, orientationLabel, title, link }: ShareTargetsProps) {
  const isMobile = useMemo(isMobileDevice, []);
  const nativeSupport = useMemo(() => getNativeShareSupport(file), [file]);
  const [clipboardAllowed, setClipboardAllowed] = useState<boolean | null>(null);
  const [target, setTarget] = useState<Target | null>(isMobile ? 'Other' : null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const image = `${orientationLabel.toLowerCase()} image`;

  useEffect(() => {
    let active = true;
    isImageClipboardAllowed().then((allowed) => active && setClipboardAllowed(allowed));
    return () => {
      active = false;
    };
  }, []);

  function showNativeResult(result: NativeShareResult) {
    if (result === 'shared') {
      setFeedback({ severity: 'success', message: 'Countdown shared' });
    } else if (result === 'failed') {
      setFeedback({ severity: 'error', message: 'Couldn’t open the share options. Copy the link above instead.' });
    }
  }

  async function shareToApp(app: AppTarget) {
    const url = app === 'WhatsApp' ? getWhatsAppShareUrl(title, link) : getTelegramShareUrl(title, link);
    const copied = clipboardAllowed ? await copyImageToClipboard(file) : false;
    if (!copied) {
      downloadFile(file);
    }
    const opened = openInNewTab(url);

    let message = `Image copied. Choose a chat in ${app} and paste it (${getPasteShortcut()}) to attach it.`;
    if (!copied) {
      message = clipboardAllowed
        ? `Couldn’t copy the image, so it was downloaded instead. Attach ${file.name} to the ${app} chat.`
        : `Image downloaded. Attach ${file.name} to the ${app} chat.`;
    }
    setFeedback({ severity: 'success', message, action: opened ? undefined : { label: `Open ${app}`, url } });
  }

  async function shareWithSystem() {
    showNativeResult(await shareNatively(nativeSupport === 'image' ? file : null, title, link));
  }

  function getAppInstructions(app: AppTarget): Instructions {
    const opens = `${app} opens in a new tab with a message containing the countdown link.`;
    if (clipboardAllowed) {
      return {
        steps: [
          `The ${image} is copied to your clipboard.`,
          opens,
          `Choose a chat and paste the image (${getPasteShortcut()}) to attach it.`,
        ],
        actionLabel: `Copy image and open ${app}`,
        action: () => shareToApp(app),
      };
    }
    return {
      steps: [
        <>
          Your browser can’t copy images, so the {image} is downloaded to your computer as <strong>{file.name}</strong>.
        </>,
        opens,
        'Choose a chat and attach the downloaded image.',
      ],
      actionLabel: `Download image and open ${app}`,
      action: () => shareToApp(app),
    };
  }

  function getNativeInstructions(): Instructions {
    const shareOptions = isMobile ? 'Your phone’s share options' : 'Your system’s share options';
    if (nativeSupport === 'image') {
      return {
        steps: [
          `${shareOptions} open with the ${image} and a message containing the countdown link.`,
          'Choose WhatsApp, Telegram or any other app to send them.',
        ],
        note: APP_TEXT_DROP_NOTE,
        actionLabel: 'Share image and link',
        action: shareWithSystem,
      };
    }
    if (nativeSupport === 'link') {
      return {
        steps: [
          'Your browser can share the link but not images.',
          `${shareOptions} open with a message containing the countdown link, without the image.`,
        ],
        actionLabel: 'Share link',
        action: shareWithSystem,
      };
    }
    return {
      steps: [
        isMobile
          ? 'Your browser doesn’t support sharing. Copy the link above and paste it in any app.'
          : 'Your browser doesn’t support system sharing. Use WhatsApp, Telegram or copy the link above.',
      ],
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
        Share to
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
              {value}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}

      {!target && (
        <Typography variant="body2" color="text.secondary">
          Choose where to share to see how the image and link are sent.
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

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

interface ShareTargetsProps {
  file: File;
  imageName: string;
  title: string;
  link: string;
}

function ShareTargets({ file, imageName, title, link }: ShareTargetsProps) {
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
      setFeedback({ severity: 'success', message: 'Contagem compartilhada' });
    } else if (result === 'failed') {
      setFeedback({
        severity: 'error',
        message: 'Não foi possível abrir as opções de compartilhamento. Copie o link acima.',
      });
    }
  }

  async function shareToApp(app: AppTarget) {
    const url = app === 'WhatsApp' ? getWhatsAppShareUrl(title, link) : getTelegramShareUrl(title, link);
    const copied = clipboardAllowed ? await copyImageToClipboard(file) : false;
    if (!copied) {
      downloadFile(file);
    }
    const opened = openInNewTab(url);

    let message = `Imagem copiada. Escolha uma conversa no ${app} e cole (${getPasteShortcut()}) para anexá-la.`;
    if (!copied) {
      message = clipboardAllowed
        ? `Não foi possível copiar a imagem, então ela foi baixada. Anexe ${file.name} à conversa do ${app}.`
        : `Imagem baixada. Anexe ${file.name} à conversa do ${app}.`;
    }
    setFeedback({
      severity: 'success',
      message,
      action: opened ? undefined : { label: `Abrir o ${app}`, url },
    });
  }

  async function shareWithSystem() {
    showNativeResult(await shareNatively(nativeSupport === 'image' ? file : null, title, link));
  }

  function getAppInstructions(app: AppTarget): Instructions {
    const opens = `O ${app} abre em uma nova aba com uma mensagem contendo o link da contagem.`;
    if (clipboardAllowed) {
      return {
        steps: [
          `A ${imageName} é copiada para sua área de transferência.`,
          opens,
          `Escolha uma conversa e cole a imagem (${getPasteShortcut()}) para anexá-la.`,
        ],
        actionLabel: `Copiar imagem e abrir o ${app}`,
        action: () => shareToApp(app),
      };
    }
    return {
      steps: [
        `Seu navegador não copia imagens, então a ${imageName} é baixada no seu computador como ${file.name}.`,
        opens,
        'Escolha uma conversa e anexe a imagem baixada.',
      ],
      actionLabel: `Baixar imagem e abrir o ${app}`,
      action: () => shareToApp(app),
    };
  }

  function getNativeInstructions(): Instructions {
    const options = isMobile
      ? 'As opções de compartilhamento do seu celular'
      : 'As opções de compartilhamento do seu sistema';
    if (nativeSupport === 'image') {
      return {
        steps: [
          `${options} abrem com a ${imageName} e uma mensagem contendo o link da contagem.`,
          'Escolha WhatsApp, Telegram ou qualquer outro app para enviar.',
        ],
        note:
          'Alguns apps mantêm apenas a imagem e descartam a mensagem. ' +
          'Se o link faltar, copie-o acima e cole na conversa.',
        actionLabel: 'Compartilhar imagem e link',
        action: shareWithSystem,
      };
    }
    if (nativeSupport === 'link') {
      return {
        steps: [
          'Seu navegador compartilha o link, mas não imagens.',
          `${options} abrem com uma mensagem contendo o link da contagem, sem a imagem.`,
        ],
        actionLabel: 'Compartilhar link',
        action: shareWithSystem,
      };
    }
    return {
      steps: [
        isMobile
          ? 'Seu navegador não suporta compartilhamento. Copie o link acima e cole em qualquer app.'
          : 'Seu navegador não suporta o compartilhamento do sistema. Use WhatsApp, Telegram ou copie o link acima.',
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
        Compartilhar com
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
              {value === 'Other' ? 'Outros' : value}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}

      {!target && (
        <Typography variant="body2" color="text.secondary">
          Escolha onde compartilhar para ver como a imagem e o link são enviados.
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

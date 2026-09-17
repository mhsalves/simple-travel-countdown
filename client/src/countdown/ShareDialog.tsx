import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';

type CopyStatus = 'idle' | 'copied' | 'failed';

interface ShareDialogProps {
  open: boolean;
  link: string;
  title: string;
  onClose: () => void;
}

function ShareDialog({ open, link, title, onClose }: ShareDialogProps) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const copied = copyStatus === 'copied';

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
      aria-labelledby="share-dialog-title"
      aria-describedby="share-dialog-description"
    >
      <DialogTitle id="share-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <ShareRoundedIcon color="primary" />
        Share your countdown
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.5}>
          <DialogContentText id="share-dialog-description">
            Copy this link and send it to anyone to show the countdown for “{title}”.
          </DialogContentText>
          <TextField
            label="Countdown link"
            value={link}
            onFocus={(event) => event.target.select()}
            slotProps={{ htmlInput: { readOnly: true } }}
          />
          {copyStatus === 'failed' && (
            <Alert severity="error">Couldn’t copy automatically. Select the link and copy it manually.</Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          color={copied ? 'success' : 'primary'}
          startIcon={copied ? <CheckRoundedIcon /> : <ContentCopyRoundedIcon />}
          onClick={handleCopy}
        >
          {copied ? 'Copied' : 'Copy link'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ShareDialog;

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
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';

type CopyStatus = 'idle' | 'copied' | 'failed';

interface LinkDialogProps {
  open: boolean;
  link: string;
  title: string;
  onClose: () => void;
}

function LinkDialog({ open, link, title, onClose }: LinkDialogProps) {
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
      aria-labelledby="link-dialog-title"
      aria-describedby="link-dialog-description"
    >
      <DialogTitle id="link-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <CheckCircleRoundedIcon color="success" />
        Your countdown link is ready
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.5}>
          <DialogContentText id="link-dialog-description">
            Share this link with anyone to show the countdown for “{title}”.
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

export default LinkDialog;

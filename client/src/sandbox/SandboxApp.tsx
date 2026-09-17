import { useState } from 'react';
import { Button, ButtonToolbar, Form, Input, Modal, Panel, Stack } from 'rsuite';

function SandboxApp() {
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7fa', padding: 32 }}>
      <Stack direction="column" alignItems="stretch" spacing={24} style={{ maxWidth: 420, margin: '0 auto' }}>
        <header>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>React Suite sandbox</h1>
          <p style={{ fontSize: 13, color: '#5a6670', marginTop: 4 }}>
            Isolated evaluation page — not wired into the real app. Compare against <code>CountdownForm.tsx</code> (MUI).
          </p>
        </header>

        <Panel header="Form fields" bordered>
          <Form fluid>
            <Form.Group>
              <Form.ControlLabel>Title</Form.ControlLabel>
              <Input placeholder="Trip to Lisbon" value={title} onChange={setTitle} />
            </Form.Group>
          </Form>
        </Panel>

        <Panel header="Button variants" bordered>
          <ButtonToolbar>
            <Button appearance="primary">Default</Button>
            <Button appearance="default">Outline</Button>
            <Button appearance="subtle">Ghost</Button>
            <Button appearance="primary" size="sm">
              Small
            </Button>
            <Button appearance="primary" size="lg">
              Large
            </Button>
          </ButtonToolbar>
        </Panel>

        <Panel header="Modal (React Suite)" bordered>
          <Button appearance="primary" onClick={() => setOpen(true)}>
            Generate link
          </Button>
          <Modal open={open} onClose={() => setOpen(false)}>
            <Modal.Header>
              <Modal.Title>Your countdown link is ready</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p style={{ marginBottom: 12 }}>
                Share this link with anyone to show the countdown for &ldquo;{title || 'Your trip title'}&rdquo;.
              </p>
              <Input readOnly value="http://localhost:3029/countdown/AQ5UcmlwIHRvIExpc2JvbmuRNDgBC26ZCnqU________" />
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setOpen(false)} appearance="subtle">
                Close
              </Button>
              <Button appearance="primary">Copy link</Button>
            </Modal.Footer>
          </Modal>
        </Panel>
      </Stack>
    </div>
  );
}

export default SandboxApp;

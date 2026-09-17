import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import 'rsuite/dist/rsuite.min.css';
import SandboxApp from './SandboxApp';

ReactDOM.render(
  <StrictMode>
    <SandboxApp />
  </StrictMode>,
  document.getElementById('root'),
);

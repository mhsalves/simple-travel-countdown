import CountdownPage from './pages/CountdownPage';
import Home from './pages/Home';
import { COUNTDOWN_PATH } from './countdown/link';

function App() {
  const basePath = import.meta.env.BASE_URL;
  const path = window.location.pathname;
  const relativePath = path.startsWith(basePath) ? path.slice(basePath.length) : path.replace(/^\//, '');
  const [routeName, token] = relativePath.split('/');

  if (routeName === COUNTDOWN_PATH && token) {
    return <CountdownPage token={token} />;
  }

  return <Home />;
}

export default App;

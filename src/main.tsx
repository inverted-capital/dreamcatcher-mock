import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import App from './app/App';
import './index.css';

// Create the root and render the App directly without the authentication wrapper
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
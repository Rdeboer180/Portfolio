import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './styles/styles.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root') as HTMLElement;

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Prerendered routes ship with server-rendered markup inside #root, so hydrate
// them; a fresh (non-prerendered) load renders from scratch.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

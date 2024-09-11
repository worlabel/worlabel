// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App.tsx';
// import './index.css';

// async function enableMocking() {
//   if (!import.meta.env.DEV) {
//     return;
//   }

//   try {
//     const { worker } = await import('./mocks/browser.ts');
//     await worker.start();
//     console.log('[MSW] Mocking enabled. Service Worker is running.');
//   } catch (error) {
//     console.error('[MSW] Failed to start the Service Worker:', error);
//   }
// }

// enableMocking().then(() => {
//   ReactDOM.createRoot(document.getElementById('root')!).render(
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   );
// });

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

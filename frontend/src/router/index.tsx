import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>home</div>,
    children: [
      {
        index: true,
        element: <div>index</div>,
      },
    ],
  },
]);

export default router;

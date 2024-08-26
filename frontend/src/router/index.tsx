import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>home</div>,
    children: [
      {
        index: true,
      },
    ],
  },
]);

export default router;

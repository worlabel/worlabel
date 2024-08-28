import WorkspaceLayout from '@/components/WorkspaceLayout';
import { createBrowserRouter } from 'react-router-dom';

export const webPath = {
  home: () => '/',
  workspace: () => '/workspace',
};

const router = createBrowserRouter([
  {
    path: webPath.home(),
    element: <div>home</div>,
    children: [
      {
        index: true,
        element: <div>index</div>,
      },
    ],
  },
  {
    path: webPath.workspace(),
    element: <WorkspaceLayout />,
    children: [
      {
        index: true,
        element: <div>workspace</div>,
      },
    ],
  },
]);

export default router;

import PageLayout from '@/components/PageLayout';
import WorkspaceLayout from '@/components/WorkspaceLayout';
import WorkspaceBrowsePage from '@/pages/WorkspaceBrowsePage';
import { createBrowserRouter } from 'react-router-dom';

export const webPath = {
  home: () => '/',
  workspace: () => '/workspace',
};

const router = createBrowserRouter([
  {
    path: webPath.home(),
    element: <PageLayout />,
    children: [
      {
        index: true,
        element: <WorkspaceBrowsePage />,
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

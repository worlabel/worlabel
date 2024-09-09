import PageLayout from '@/components/PageLayout';
import Home from '@/components/Home';
import WorkspaceBrowseDetail from '@/components/WorkspaceBrowseDetail';
import WorkspaceBrowseLayout from '@/components/WorkspaceBrowseLayout';
import WorkspaceLayout from '@/components/WorkspaceLayout';

import { createBrowserRouter } from 'react-router-dom';

export const webPath = {
  home: () => '/',
  browse: () => '/browse',
  workspace: () => '/workspace',
};

const router = createBrowserRouter([
  {
    path: webPath.home(),
    element: <PageLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: webPath.browse(),
    element: <WorkspaceBrowseLayout />,
    children: [
      {
        index: true,
        element: <WorkspaceBrowseDetail />,
      },
      {
        path: ':workspaceId',
        element: <WorkspaceBrowseDetail />,
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

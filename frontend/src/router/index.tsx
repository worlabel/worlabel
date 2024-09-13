import PageLayout from '@/components/PageLayout';
import ImageCanvas from '@/components/ImageCanvas';
import Home from '@/components/Home';
import WorkspaceBrowseDetail from '@/components/WorkspaceBrowseDetail';
import WorkspaceBrowseLayout from '@/components/WorkspaceBrowseLayout';
import WorkspaceLayout from '@/components/WorkspaceLayout';
import AdminLayout from '@/components/AdminLayout';
import ReviewList from '@/components/ReviewList';
import AdminMemberManage from '@/components/AdminMemberManage';
import OAuthCallback from '@/components/OAuthCallback';
import { createBrowserRouter } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

export const webPath = {
  home: () => '/',
  browse: () => '/browse',
  workspace: () => '/workspace',
  // workspace: (workspaceId: string, projectId?: string) =>
  //   projectId ? `/workspace/${workspaceId}/project/${projectId}` : `/workspace/${workspaceId}`,
  admin: (workspaceId: string) => `/admin/${workspaceId}`,
  oauthCallback: () => '/redirect/oauth2',
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
    path: `${webPath.workspace()}/:workspaceId`,
    element: <WorkspaceLayout />,
    children: [
      {
        index: true,
        element: <ImageCanvas />,
      },
      {
        path: 'project/:projectId',
        element: <ImageCanvas />,
      },
    ],
  },
  {
    path: webPath.admin(':workspaceId'),
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="review" />,
      },
      {
        path: 'review',
        element: <ReviewList />,
      },
      {
        path: 'members',
        element: <AdminMemberManage />,
      },
    ],
  },
  {
    path: webPath.oauthCallback(),
    element: <OAuthCallback />,
  },
]);

export default router;

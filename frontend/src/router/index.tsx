import PageLayout from '@/components/PageLayout';
import ImageCanvas from '@/components/ImageCanvas';
import Home from '@/pages/Home';
import WorkspaceBrowseDetail from '@/pages/WorkspaceBrowseDetail';
import WorkspaceBrowseLayout from '@/components/WorkspaceBrowseLayout';
import WorkspaceLayout from '@/components/WorkspaceLayout';
import AdminLayout from '@/components/AdminLayout';
import ReviewList from '@/components/ReviewList';
import AdminMemberManage from '@/components/AdminMemberManage';
import OAuthCallback from '@/components/OAuthCallback';
import { createBrowserRouter } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import WorkspaceBrowseIndex from '@/pages/WorkspaceBrowseIndex';

export const webPath = {
  home: () => '/',
  browse: () => '/browse',
  workspace: () => '/workspace',
  // workspace: (workspaceId: string, projectId?: string) =>
  //   projectId ? `/workspace/${workspaceId}/project/${projectId}` : `/workspace/${workspaceId}`,
  admin: () => `/admin`,
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
    // FIXME: index에서 오류나지 않게 수정
    path: webPath.browse(),
    element: (
      <Suspense fallback={<div></div>}>
        <WorkspaceBrowseLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <WorkspaceBrowseIndex />,
      },
      {
        path: ':workspaceId',
        element: <WorkspaceBrowseDetail />,
      },
    ],
  },
  {
    // FIXME: index에서 오류나지 않게 수정
    path: `${webPath.workspace()}/:workspaceId`,
    element: (
      <Suspense fallback={<div></div>}>
        <WorkspaceLayout />
      </Suspense>
    ),
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
    path: `${webPath.admin()}/:workspaceId`,
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

import PageLayout from '@/components/PageLayout';
// import ImageCanvas from '@/components/ImageCanvas';
import Home from '@/pages/Home';
import WorkspaceBrowseDetail from '@/pages/WorkspaceBrowseDetail';
import WorkspaceBrowseLayout from '@/components/WorkspaceBrowseLayout';
import WorkspaceLayout from '@/components/WorkspaceLayout';
import AdminLayout from '@/components/AdminLayout';
import ReviewList from '@/components/ReviewList';
import AdminMemberManage from '@/components/AdminMemberManage';
import OAuthCallback from '@/components/OAuthCallback';
import { createBrowserRouter } from 'react-router-dom';
import { Suspense } from 'react';
import WorkspaceBrowseIndex from '@/pages/WorkspaceBrowseIndex';
import AdminIndex from '@/pages/AdminIndex';
import LabelCanvas from '@/pages/LabelCanvas';
import ReviewDetail from '@/components/ReviewDetail';
import ImageFolderUploadTest from '@/pages/ImageFolderUploadTest';

export const webPath = {
  home: () => '/',
  browse: () => '/browse',
  workspace: () => '/workspace',
  admin: () => `/admin`,
  oauthCallback: () => '/redirect/oauth2',
  imageFolderUploadTest: () => '/imagefolderuploadtest',
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
        element: <LabelCanvas />,
      },
      {
        path: ':projectId',
        element: <LabelCanvas />,
      },
    ],
  },
  {
    path: `${webPath.admin()}/:workspaceId`,
    element: (
      <Suspense fallback={<div></div>}>
        <AdminLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <AdminIndex />,
      },
      {
        path: 'reviews',
        element: <ReviewList />,
      },
      {
        path: 'reviews/:projectId/:reviewId',
        element: <ReviewDetail />,
      },
      {
        path: 'members',
        element: <AdminMemberManage />,
      },
    ],
  },
  {
    path: webPath.oauthCallback(),
    element: (
      <Suspense fallback={<div></div>}>
        <OAuthCallback />
      </Suspense>
    ),
  },
  {
    path: `${webPath.imageFolderUploadTest()}/:projectId`,
    element: <ImageFolderUploadTest />,
  },
]);

export default router;

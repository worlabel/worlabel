import PageLayout from '@/components/PageLayout';
// import ImageCanvas from '@/components/ImageCanvas';
import WorkspaceBrowseDetail from '@/pages/WorkspaceBrowseDetail';
import WorkspaceBrowseLayout from '@/components/WorkspaceBrowseLayout';
import WorkspaceLayout from '@/components/WorkspaceLayout';
import AdminLayout from '@/components/AdminLayout';
import WorkspaceReviewList from '@/pages/WorkspaceReviewList';
import ProjectReviewList from '@/pages/ProjectReviewList';
import WorkspaceMemberManage from '@/pages/WorkspaceMemberManage';
import ProjectMemberManage from '@/pages/ProjectMemberManage';
import OAuthCallback from '@/components/OAuthCallback';
import { createBrowserRouter } from 'react-router-dom';
import { Suspense } from 'react';
import Home from '@/pages/Home';
import WorkspaceBrowseIndex from '@/pages/WorkspaceBrowseIndex';
import AdminIndex from '@/pages/AdminIndex';
import LabelCanvas from '@/pages/LabelCanvas';
import ReviewDetail from '@/pages/ReviewDetail';
import NotFound from '@/pages/NotFound';
import ReviewRequest from '@/pages/ReviewRequest';
import ModelIndex from '@/pages/ModelIndex';
import ModelDetail from '@/pages/ModelDetail';
import FirebaseTest from '@/pages/FirebaseTest';

export const webPath = {
  home: () => '/',
  browse: () => '/browse',
  workspace: () => '/workspace',
  admin: () => `/admin`,
  oauthCallback: () => '/redirect/oauth2',
  firebaseTest: () => '/firebaseTest',
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
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: webPath.browse(),
    element: (
      <Suspense fallback={<PageLayout />}>
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
        children: [
          {
            index: true,
            element: <WorkspaceReviewList />,
          },
          {
            path: 'request',
            element: <ReviewRequest />,
          },
          {
            path: ':projectId',
            element: <ProjectReviewList />,
          },
          {
            path: ':projectId/:reviewId',
            element: <ReviewDetail />,
          },
        ],
      },
      {
        path: 'members',
        children: [
          {
            index: true,
            element: <WorkspaceMemberManage />,
          },
          {
            path: ':projectId',
            element: <ProjectMemberManage />,
          },
        ],
      },
      {
        path: 'models',
        children: [
          {
            index: true,
            element: <ModelIndex />,
          },
          {
            path: ':projectId',
            element: <ModelDetail />,
          },
        ],
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
    path: webPath.firebaseTest(),
    element: (
      <Suspense fallback={<div></div>}>
        <FirebaseTest />
      </Suspense>
    ),
  },
]);

export default router;

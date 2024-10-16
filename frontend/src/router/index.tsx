import PageLayout from '@/components/PageLayout';
// import ImageCanvas from '@/components/ImageCanvas';
import WorkspaceBrowseDetail from '@/pages/WorkspaceBrowseDetail';
import WorkspaceBrowseLayout from '@/components/WorkspaceBrowseLayout';
import WorkspaceLayout from '@/components/WorkspaceLayout';
import WorkspaceReviewList from '@/pages/WorkspaceReviewList';
import ProjectReviewList from '@/pages/ProjectReviewList';
import WorkspaceMemberManage from '@/pages/WorkspaceMemberManage';
import ProjectMemberManage from '@/pages/ProjectMemberManage';
import OAuthCallback from '@/components/OAuthCallback';
import { createBrowserRouter } from 'react-router-dom';
import { Suspense } from 'react';
import Home from '@/pages/Home';
import WorkspaceBrowseIndex from '@/pages/WorkspaceBrowseIndex';
import LabelCanvas from '@/pages/LabelCanvas';
import ReviewDetail from '@/pages/ReviewDetail';
import NotFound from '@/pages/NotFound';
import ReviewRequest from '@/pages/ReviewRequest';
import ModelIndex from '@/pages/ModelIndex';
import ModelDetail from '@/pages/ModelDetail';
import ManageLayout from '@/components/ManageLayout';

export const webPath = {
  home: () => '/',
  browse: () => '/browse',
  workspace: () => '/workspace',
  review: () => '/review',
  model: () => '/model',
  member: () => '/member',
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
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
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
    path: `${webPath.review()}/:workspaceId`,
    element: (
      <Suspense fallback={<div></div>}>
        <ManageLayout tabTitle="review" />
      </Suspense>
    ),
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
    path: `${webPath.model()}/:workspaceId`,
    element: (
      <Suspense fallback={<div></div>}>
        <ManageLayout tabTitle="model" />
      </Suspense>
    ),
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
  {
    path: `${webPath.member()}/:workspaceId`,
    element: (
      <Suspense fallback={<div></div>}>
        <ManageLayout tabTitle="member" />
      </Suspense>
    ),
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
    path: webPath.oauthCallback(),
    element: (
      <Suspense fallback={<div></div>}>
        <OAuthCallback />
      </Suspense>
    ),
  },
]);

export default router;

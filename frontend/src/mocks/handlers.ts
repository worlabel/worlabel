import { authHandlers } from './authHandlers';
import { labelHandlers } from './labelHandlers';
import { reviewHandlers } from './reviewHandlers';
import { categoryHandlers } from './categoryHandlers';
import { memberHandlers } from './memberHandlers';
import { workspaceHandlers } from './workspaceHandlers';
import { folderHandlers } from './folderHandler';
// import { modelHandlers } from './modelHandlers';
import { imageHandlers } from './imageHandlers';
import { projectHandlers } from './projectHandlers';

// 모든 핸들러를 배열로 통합
export const handlers = [
  ...authHandlers,
  ...labelHandlers,
  ...reviewHandlers,
  ...categoryHandlers,
  ...memberHandlers,
  ...workspaceHandlers,
  ...folderHandlers,
  // ...modelHandlers,
  ...imageHandlers,
  ...projectHandlers,
];

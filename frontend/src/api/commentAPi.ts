import api from '@/api/axiosConfig';
import { CommentRequest, CommentResponse } from '@/types';

export async function getComment(projectId: number, commentId: number) {
  return api.get<CommentResponse>(`/projects/${projectId}/comments/${commentId}`).then(({ data }) => data);
}

export async function updateComment(projectId: number, commentId: number, commentData: CommentRequest) {
  return api.put<CommentResponse>(`/projects/${projectId}/comments/${commentId}`, commentData).then(({ data }) => data);
}

export async function deleteComment(projectId: number, commentId: number) {
  return api.delete(`/projects/${projectId}/comments/${commentId}`).then(({ data }) => data);
}

export async function createComment(projectId: number, imageId: number, commentData: CommentRequest) {
  return api
    .post<CommentResponse>(`/projects/${projectId}/comments/images/${imageId}`, commentData)
    .then(({ data }) => data);
}

export async function getCommentList(projectId: number, imageId: number) {
  return api.get<CommentResponse[]>(`/projects/${projectId}/comments/images/${imageId}`).then(({ data }) => data);
}

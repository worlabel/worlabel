import { create } from 'zustand';
import { CommentResponse } from '@/types';

interface CommentWithToggle extends CommentResponse {
  isOpen?: boolean;
}
interface CommentState {
  comments: CommentWithToggle[];
  addComment: (comment: CommentResponse) => void;
  updateComment: (updatedComment: CommentResponse) => void;
  deleteComment: (commentId: number) => void;
  toggleComment: (commentId: number) => void;
}

const useCommentStore = create<CommentState>((set) => ({
  comments: [],

  addComment: (comment) =>
    set((state) => ({
      comments: [...state.comments, { ...comment, isOpen: false }],
    })),

  updateComment: (updatedComment) =>
    set((state) => ({
      comments: state.comments.map((comment) =>
        comment.id === updatedComment.id ? { ...updatedComment, isOpen: comment.isOpen } : comment
      ),
    })),

  deleteComment: (commentId) =>
    set((state) => ({
      comments: state.comments.filter((comment) => comment.id !== commentId),
    })),

  toggleComment: (commentId) =>
    set((state) => ({
      comments: state.comments.map((comment) =>
        comment.id === commentId ? { ...comment, isOpen: !comment.isOpen } : comment
      ),
    })),
}));

export default useCommentStore;

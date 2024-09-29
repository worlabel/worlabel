import { create } from 'zustand';
import { CommentResponse } from '@/types';

interface CommentWithToggle extends CommentResponse {
  isOpen?: boolean;
}

interface CommentState {
  comments: CommentWithToggle[];
  setComments: (comments: CommentWithToggle[]) => void;
  addComment: (comment: CommentWithToggle) => void;
  updateComment: (updatedComment: CommentWithToggle) => void;
  deleteComment: (commentId: number) => void;
  toggleComment: (commentId: number) => void;
}

const useCommentStore = create<CommentState>((set) => ({
  comments: [],
  setComments: (comments) => set({ comments }),
  addComment: (comment) =>
    set((state) => ({
      comments: [...state.comments, { ...comment, isOpen: true }],
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

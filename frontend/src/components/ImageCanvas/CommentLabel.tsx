import { useState } from 'react';
import { Group, Rect, Text, Image } from 'react-konva';
import { CommentResponse } from '@/types';
import useImage from 'use-image';

import deleteIconSrc from '@/assets/icons/delete.svg';
import toggleUpIconSrc from '@/assets/icons/chevron-up.svg';
import toggleDownIconSrc from '@/assets/icons/chevron-down.svg';
import Konva from 'konva';

interface CommentLabelProps {
  comment: CommentResponse & { isOpen?: boolean };
  updateComment: (comment: CommentResponse) => void;
  deleteComment: (commentId: number) => void;
  toggleComment: (commentId: number) => void;
}

export default function CommentLabel({ comment, updateComment, deleteComment, toggleComment }: CommentLabelProps) {
  const [content, setContent] = useState(comment.content);
  const [deleteIcon] = useImage(deleteIconSrc);
  const [toggleUpIcon] = useImage(toggleUpIconSrc);
  const [toggleDownIcon] = useImage(toggleDownIconSrc);

  const handleEdit = () => {
    const newContent = prompt('댓글을 입력하세요', content);
    if (newContent !== null) {
      setContent(newContent);
      updateComment({ ...comment, content: newContent });
    }
  };

  const handleDelete = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    deleteComment(comment.id);
  };

  const handleToggle = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    toggleComment(comment.id);
  };

  return (
    <Group
      x={comment.positionX}
      y={comment.positionY}
      draggable
      onDragEnd={(e) => {
        const newX = e.target.x();
        const newY = e.target.y();
        updateComment({ ...comment, positionX: newX, positionY: newY });
      }}
    >
      <Rect
        width={comment.isOpen ? 200 : 50}
        height={comment.isOpen ? 100 : 30}
        fill="white"
        stroke="black"
        onClick={handleEdit}
      />
      {comment.isOpen && (
        <Text
          x={5}
          y={5}
          width={190}
          text={content || '내용 없음'}
          fontSize={16}
          fill="black"
          onClick={handleEdit}
        />
      )}
      {deleteIcon && (
        <Image
          image={deleteIcon}
          x={comment.isOpen ? 175 : 25}
          y={5}
          width={20}
          height={20}
          onClick={handleDelete}
        />
      )}

      {comment.isOpen
        ? toggleUpIcon && (
            <Image
              image={toggleUpIcon}
              x={comment.isOpen ? 150 : 0}
              y={5}
              width={20}
              height={20}
              onClick={handleToggle}
            />
          )
        : toggleDownIcon && (
            <Image
              image={toggleDownIcon}
              x={comment.isOpen ? 150 : 0}
              y={5}
              width={20}
              height={20}
              onClick={handleToggle}
            />
          )}
    </Group>
  );
}

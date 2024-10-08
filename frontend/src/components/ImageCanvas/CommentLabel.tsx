import { useEffect, useRef, useState } from 'react';
import { Group, Rect, Text, Image } from 'react-konva';
import { CommentResponse } from '@/types';
import useImage from 'use-image';

import deleteIconSrc from '@/assets/icons/delete.svg';
import toggleUpIconSrc from '@/assets/icons/chevron-up.svg';
import toggleDownIconSrc from '@/assets/icons/chevron-down.svg';
import Konva from 'konva';
import { TRANSFORM_CHANGE_STR } from '@/constants';

interface CommentLabelProps {
  stage: Konva.Stage;
  comment: CommentResponse & { isOpen?: boolean };
  updateComment: (comment: CommentResponse) => void;
  deleteComment: (commentId: number) => void;
  toggleComment: (commentId: number) => void;
}

export default function CommentLabel({
  stage,
  comment,
  updateComment,
  deleteComment,
  toggleComment,
}: CommentLabelProps) {
  const groupRef = useRef<Konva.Group>(null);
  // const stage = groupRef.current?.getStage();
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
    confirm('정말 삭제하시겠습니까?') && deleteComment(comment.id);
  };

  const handleToggle = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    toggleComment(comment.id);
  };

  useEffect(() => {
    const transformEvents = TRANSFORM_CHANGE_STR.join(' ');

    stage?.on(transformEvents, () => {
      if (!groupRef.current) return;

      groupRef.current?.scale({
        x: 1 / stage.getAbsoluteScale().x,
        y: 1 / stage.getAbsoluteScale().y,
      });
    });

    return () => {
      stage?.off(transformEvents);
    };
  }, [stage]);

  return (
    stage && (
      <Group
        ref={groupRef}
        x={comment.positionX}
        y={comment.positionY}
        draggable
        onDragEnd={(e) => {
          const newX = e.target.x();
          const newY = e.target.y();
          updateComment({ ...comment, positionX: newX, positionY: newY });
        }}
        strokeScaleEnabled={false}
        scale={{ x: 1 / stage.getAbsoluteScale().x, y: 1 / stage.getAbsoluteScale().y }}
        perfectDrawEnabled={false}
        shadowForStrokeEnabled={false}
      >
        <Rect
          width={comment.isOpen ? 200 : 60}
          height={comment.isOpen ? 100 : 30}
          fill="white"
          stroke="#080808"
          strokeWidth={1}
          cornerRadius={5}
        />
        {comment.isOpen && (
          <Text
            x={10}
            y={35}
            width={190}
            text={content || '내용 없음'}
            fontSize={16}
            fill="#080808"
            onClick={handleEdit}
          />
        )}
        <Image
          image={comment.isOpen ? toggleUpIcon : toggleDownIcon}
          x={5}
          y={5}
          width={20}
          height={20}
          onClick={handleToggle}
        />
        <Image
          image={deleteIcon}
          x={35}
          y={5}
          width={20}
          height={20}
          onClick={handleDelete}
        />
      </Group>
    )
  );
}

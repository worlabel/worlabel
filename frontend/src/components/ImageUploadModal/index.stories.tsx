import '@/index.css';
import { useState } from 'react';
import ImageUploadModal from './index';

export default {
  title: 'Modal/ImageUploadModal',
  component: ImageUploadModal,
};

export const Default = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    isModalOpen && (
      <ImageUploadModal
        title="파일 업로드"
        buttonText="업로드"
        onClose={handleClose}
      />
    )
  );
};

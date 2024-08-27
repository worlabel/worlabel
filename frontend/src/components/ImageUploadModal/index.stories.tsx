import '@/index.css';
import ImageUploadModal from './index';
import { useState } from 'react';

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

export const WithFiles = () => {
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

export const Uploading = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    isModalOpen && (
      <ImageUploadModal
        title="파일 업로드"
        buttonText="업로드 중..."
        onClose={handleClose}
      />
    )
  );
};

export const UploadComplete = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    isModalOpen && (
      <ImageUploadModal
        title="파일 업로드 완료"
        buttonText="다른 파일 업로드"
        onClose={handleClose}
      />
    )
  );
};

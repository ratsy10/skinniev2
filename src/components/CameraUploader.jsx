import React, { useState, useRef } from 'react';
import styled from 'styled-components';

const UploaderContainer = styled.div`
  background-color: var(--context-light);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  color: var(--deep-rose-red);
  margin-bottom: 15px;
`;

const CameraButton = styled.button`
  background-color: var(--deep-rose-red);
  color: var(--off-white);
  border-radius: 25px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--dark-maroon);
    transform: translateY(-2px);
  }
  
  svg {
    margin-right: 8px;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const UploadButton = styled.button`
  background-color: transparent;
  color: var(--deep-rose-red);
  font-size: 0.9rem;
  text-decoration: underline;
  margin: 0 auto;
  
  &:hover {
    color: var(--dark-maroon);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const PreviewContainer = styled.div`
  margin-top: 15px;
  position: relative;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  border-radius: 8px;
  max-height: 200px;
  object-fit: cover;
`;

const HiddenInput = styled.input`
  display: none;
`;

const CameraIcon = () => (
  <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 13.5C11.6569 13.5 13 12.1569 13 10.5C13 8.84315 11.6569 7.5 10 7.5C8.34315 7.5 7 8.84315 7 10.5C7 12.1569 8.34315 13.5 10 13.5Z" fill="currentColor"/>
    <path d="M7 1.5L5.17 4.5H2C0.9 4.5 0 5.4 0 6.5V15.5C0 16.6 0.9 17.5 2 17.5H18C19.1 17.5 20 16.6 20 15.5V6.5C20 5.4 19.1 4.5 18 4.5H14.83L13 1.5H7ZM10 15.5C7.24 15.5 5 13.26 5 10.5C5 7.74 7.24 5.5 10 5.5C12.76 5.5 15 7.74 15 10.5C15 13.26 12.76 15.5 10 15.5Z" fill="currentColor"/>
  </svg>
);

const CameraUploader = ({ onImageCapture }) => {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleCapture = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(URL.createObjectURL(file));
      
      if (onImageCapture) {
        setIsUploading(true);
        try {
          await onImageCapture(file);
        } finally {
          setIsUploading(false);
        }
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <UploaderContainer>
      <Title>Take a Photo of Your Skin</Title>
      
      <CameraButton onClick={handleCapture} disabled={isUploading}>
        <CameraIcon /> {isUploading ? 'Analyzing...' : 'Capture Photo'}
      </CameraButton>
      
      <UploadButton onClick={handleUploadClick} disabled={isUploading}>
        Or upload from gallery
      </UploadButton>
      
      <HiddenInput 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileChange}
        capture="user"
      />
      
      {image && (
        <PreviewContainer>
          <ImagePreview src={image} alt="Skin preview" />
        </PreviewContainer>
      )}
    </UploaderContainer>
  );
};

export default CameraUploader;
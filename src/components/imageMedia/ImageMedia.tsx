import React, { useRef, useState, useEffect } from "react";
import { FileUpload, type FileUploadHandlerEvent } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import "./ImageMedia.scss";

import { Image } from "primereact/image";
import type { ImageFile } from "../../utils/interfaces";
import {
  IMAGEKIT_PARAMS,
  MAX_FILE_SIZE_MB,
  MAX_IMAGES,
} from "../../utils/constants";

interface ImageUploadProps {
  onChange?: (files: File[]) => void;
  onUrlChange?: (files: ImageFile[]) => void;
  initialImages?: ImageFile[];
  isReadOnly?: boolean;
}

const ImageSlot: React.FC<{
  content: ImageFile | File;
  index: number;
  onRemove: (index: number) => void;
  isReadOnly?: boolean;
}> = ({ content, index, onRemove, isReadOnly }) => {
  const imageUrl =
    content instanceof File
      ? URL.createObjectURL(content)
      : content.url + IMAGEKIT_PARAMS;

  return (
    <div className="image-slot filled">
      <Image
        src={imageUrl}
        preview
        className="w-full img-preview h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
      />
      {!isReadOnly && (
        <Button
          icon="pi pi-trash"
          className="p-button-danger p-button-rounded p-button-text delete-button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(index);
          }}
          aria-label="Remove Image"
        />
      )}
    </div>
  );
};

const EmptySlot = () => (
  <div className="image-slot empty-slot">
    <i style={{ fontSize: "2rem" }} className="pi pi-image mb-2" />
    <span>Slot Available</span>
  </div>
);

const ImageMedia: React.FC<ImageUploadProps> = ({
  onChange,
  initialImages = [],
  onUrlChange,
  isReadOnly,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [existingMedia, setExistingMedia] = useState<ImageFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileUploadRef = useRef<FileUpload>(null);

  useEffect(() => {
    if (initialImages.length > 0) {
      setUploadedFiles([]);
      setExistingMedia(initialImages);
    }
  }, [initialImages]);

  const allMedia = [...existingMedia, ...uploadedFiles];
  const totalSlots = MAX_IMAGES;
  const slotsToFill = totalSlots - allMedia.length;

  const onSelect = (e: FileUploadHandlerEvent) => {
    console.log("HI");
    setError(null);
    let selectedFiles = Array.from(e.files as File[]);

    if (allMedia.length + selectedFiles.length > MAX_IMAGES) {
      selectedFiles = selectedFiles.slice(0, MAX_IMAGES - allMedia.length);
    }

    const newFilesToAdd: File[] = [];
    console.log(selectedFiles, "HELLO");

    for (const file of selectedFiles) {
      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        setError("Only PNG, JPEG, or JPG files are allowed.");
        fileUploadRef.current?.clear();
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`Each file must be under ${MAX_FILE_SIZE_MB} MB.`);
        fileUploadRef.current?.clear();
        return;
      }
      if (
        !allMedia.some(
          (media) =>
            media instanceof File &&
            media.name === file.name &&
            media.size === file.size
        )
      ) {
        newFilesToAdd.push(file);
      }
    }

    const updatedFiles = [...uploadedFiles, ...newFilesToAdd];
    setUploadedFiles(updatedFiles);
    onChange?.(updatedFiles);
    fileUploadRef.current?.clear();
  };

  const onRemove = (index: number) => {
    if (index < existingMedia.length) {
      const updatedUrls = existingMedia.filter((_, i) => i !== index);
      setExistingMedia(updatedUrls);
      onUrlChange?.(updatedUrls);
    } else {
      const fileIndex = index - existingMedia.length;
      const updatedFiles = uploadedFiles.filter((_, i) => i !== fileIndex);
      setUploadedFiles(updatedFiles);
      onChange?.(updatedFiles);
    }
  };

  return (
    <div
      className={`${
        isReadOnly ? "w-full" : ""
      } manage-profile-media-container`}>
      <h2 className="header-title">
        {isReadOnly ? "Profile Images" : "Manage Profile Media"}
      </h2>
      {!isReadOnly && (
        <>
          <div className="upload-controls">
            <FileUpload
              name="images"
              mode="basic"
              ref={fileUploadRef}
              accept="image/png, image/jpeg, image/jpg"
              chooseLabel="Select Images"
              customUpload
              auto
              multiple
              uploadHandler={onSelect}
              disabled={allMedia.length >= MAX_IMAGES}
              className="p-button-warning select-images-button"
              maxFileSize={MAX_FILE_SIZE_MB * 1024 * 1024}
              onValidationFail={() => {
                setError(`Each file must be under ${MAX_FILE_SIZE_MB} MB.`);
              }}
            />
            <span className="file-info">
              Max {MAX_IMAGES} files | PNG, JPEG, JPG | Max {MAX_FILE_SIZE_MB}MB
              each
            </span>
          </div>

          {error && (
            <Message
              severity="error"
              text={error}
              className="image-upload-error-message"
            />
          )}
        </>
      )}

      <div className="image-slots-grid">
        {allMedia.map((media, index) => (
          <ImageSlot
            key={index}
            content={media}
            index={index}
            onRemove={onRemove}
            isReadOnly={isReadOnly}
          />
        ))}

        {!isReadOnly &&
          Array.from({ length: slotsToFill }).map((_, index) => (
            <EmptySlot key={`empty-${index}`} />
          ))}
      </div>
    </div>
  );
};

export default ImageMedia;

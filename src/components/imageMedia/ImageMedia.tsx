import React, { useRef, useState } from "react";
import { FileUpload, type FileUploadHandlerEvent } from "primereact/fileupload";
import { Card } from "primereact/card";
import { Image } from "primereact/image";
import { Message } from "primereact/message";
import "./ImageMedia.scss";

interface ImageUploadProps {
    onChange?: (files: File[]) => void;
}


const ImageMedia: React.FC<ImageUploadProps> = ({ onChange }) => {
    const [images, setImages] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const fileUploadRef = useRef<FileUpload>(null);

    const onSelect = (e: FileUploadHandlerEvent) => {
        const selectedFiles = Array.from(e.files as File[]);

        // Validation
        for (const file of selectedFiles) {
            if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
                setError("Only PNG, JPEG, or JPG files are allowed.");
                fileUploadRef.current?.clear();
                return;
            }
            if (file.size > 1000 * 1024) {
                setError("Each file must be under 1 MB.");
                fileUploadRef.current?.clear();
                return;
            }
        }

        // Prevent duplicates (same name & size)
        const newFiles = selectedFiles.filter(
            (file) => !images.some((f) => f.name === file.name && f.size === file.size)
        );

        const totalFiles = [...images, ...newFiles];
        if (totalFiles.length > 3) {
            setError("You can upload a maximum of 3 images.");
            fileUploadRef.current?.clear();
            return;
        }

        setError(null);
        setImages(totalFiles);
        onChange?.(totalFiles);

        // Clear internal input so re-selecting the same file triggers again
        fileUploadRef.current?.clear();
    };


    const onRemove = (index: number) => {
        const updated = images.filter((_, i) => i !== index);
        setImages(updated);
        onChange?.(updated);
    };


    return (
        <Card className="image-upload-card">
            <h3 className="text-xl font-semibold mb-3">Upload Images</h3>

            <FileUpload
                name="images"
                mode="basic"
                ref={fileUploadRef}
                accept="image/png, image/jpeg"
                chooseLabel="Select Images"
                customUpload
                auto
                multiple
                uploadHandler={onSelect}
                disabled={images.length >= 3}
                className="image-upload-btn"
            />

            {error && <Message severity="error" text={error} className="mt-3" />}

            <div className="preview-grid">
                {images.map((file, index) => {
                    const objectUrl = URL.createObjectURL(file);
                    return (
                        <div className="preview-item" key={index}>
                            <Image src={objectUrl} alt={`preview-${index}`} preview width="120" height="120" />
                            <button
                                type="button"
                                className="remove-btn pi pi-times"
                                onClick={() => onRemove(index)}
                            ></button>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default ImageMedia;

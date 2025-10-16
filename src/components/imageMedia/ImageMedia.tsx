import React, { useEffect, useRef, useState } from "react";
import { FileUpload, type FileUploadHandlerEvent } from "primereact/fileupload";
import { Card } from "primereact/card";
import { Image } from "primereact/image";
import { Message } from "primereact/message";
import "./ImageMedia.scss";

interface ImageUploadProps {
    onChange?: (files: File[]) => void;
    onUrlChange?: (files: string[]) => void;
    initialImages?: string[];
}

const ImageMedia: React.FC<ImageUploadProps> = ({ onChange, initialImages = [], onUrlChange }) => {

    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [existingUrls, setExistingUrls] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const fileUploadRef = useRef<FileUpload>(null);

    useEffect(() => {
        setExistingUrls(initialImages)
    }, [initialImages])
    // Handle file selection
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

        // Prevent duplicates
        const newFiles = selectedFiles.filter(
            (file) => !uploadedFiles.some((f) => f.name === file.name && f.size === file.size)
        );


        setError(null);
        const updatedFiles = [...uploadedFiles, ...newFiles];
        setUploadedFiles(updatedFiles);
        onChange?.(updatedFiles);

        fileUploadRef.current?.clear();
    };



    // Handle remove for existing or new images
    const onRemove = (index: number, isExisting: boolean) => {
        if (isExisting) {
            const updatedUrls = existingUrls.filter((_, i) => i !== index);
            setExistingUrls(updatedUrls);
            onUrlChange?.(updatedUrls);
        } else {
            const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
            setUploadedFiles(updatedFiles);
            onChange?.(updatedFiles);
        }
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
                disabled={existingUrls.length + uploadedFiles.length >= 3}
                className="image-upload-btn"
            />

            {error && <Message severity="error" text={error} className="mt-3" />}
            <div className="preview-grid">
                {existingUrls.map((url, index) => (
                    <div className="preview-item" key={`existing-${index}`}>
                        <Image
                            src={url}
                            alt={`uploaded-${index}`}
                            preview
                            width="120"
                            height="120"
                        />
                        <button
                            type="button"
                            className="remove-btn pi pi-times"
                            onClick={() => onRemove(index, true)}
                        ></button>
                    </div>
                ))}

                {uploadedFiles.map((file, index) => {
                    const objectUrl = URL.createObjectURL(file);
                    return (
                        <div className="preview-item" key={`file-${index}`}>
                            <Image
                                src={objectUrl}
                                alt={`preview-${index}`}
                                preview
                                width="120"
                                height="120"
                            />
                            <button
                                type="button"
                                className="remove-btn pi pi-times"
                                onClick={() => onRemove(index, false)}
                            ></button>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default ImageMedia;

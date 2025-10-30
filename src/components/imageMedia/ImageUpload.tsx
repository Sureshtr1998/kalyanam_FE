import React, { useEffect, useRef, useState } from "react";
import { FileUpload, type FileUploadHandlerEvent } from "primereact/fileupload";
import { Message } from "primereact/message";
import { Card } from "primereact/card";
import "./ImageMedia.scss";

interface ImageUploadProps {
    onChange?: (files: File[]) => void;
    onUrlChange?: (files: string[]) => void;
    initialImages?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    onChange,
    onUrlChange,
    initialImages = [],
}) => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [existingUrls, setExistingUrls] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const fileUploadRef = useRef<FileUpload>(null);

    useEffect(() => {
        if (initialImages.length > 0) setExistingUrls(initialImages);
    }, [initialImages]);

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
            (file) =>
                !uploadedFiles.some(
                    (f) => f.name === file.name && f.size === file.size
                )
        );

        const updatedFiles = [...uploadedFiles, ...newFiles];
        setUploadedFiles(updatedFiles);
        setError(null);
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

    // Convert File objects to local URLs for preview
    const filePreviews = uploadedFiles.map((file) => URL.createObjectURL(file));
    const allImages = [...existingUrls, ...filePreviews];

    return (
        <Card className="p-4 shadow-sm border border-gray-200 rounded-xl">
            <div className="relative mb-4">
                <div
                    className={`border-2 border-dashed rounded-xl p-6 transition duration-300 cursor-pointer flex flex-col items-center justify-center
            ${allImages.length < 3
                            ? "border-amber-500 hover:bg-amber-50"
                            : "border-gray-300 bg-gray-100 cursor-not-allowed"
                        }`}
                >
                    <label
                        htmlFor="image-upload-input"
                        className="cursor-pointer flex flex-col items-center justify-center text-gray-600"
                    >
                        <i style={{ fontSize: '2rem' }}
                            className={`w-8 h-8 mb-2 pi pi-upload ${allImages.length < 3 ? "text-amber-600" : "text-gray-400"
                                }`}
                        />
                        <span className="font-semibold mb-1 text-sm">
                            Upload Images (Max 3)
                        </span>
                        <span className="text-xs text-gray-500">
                            {`Selected: ${allImages.length} / 3 | JPEG or PNG under 1MB`}
                        </span>
                        <FileUpload
                            name="images"
                            mode="basic"
                            ref={fileUploadRef}
                            accept="image/png, image/jpeg"
                            customUpload
                            auto
                            multiple
                            uploadHandler={onSelect}
                            disabled={allImages.length >= 3}
                            className="hidden"
                            chooseLabel=""
                        />
                        <input
                            id="image-upload-input"
                            type="file"
                            accept="image/png,image/jpeg"
                            multiple
                            className="hidden"
                            onChange={(e) =>
                                e.target.files &&
                                onSelect({ files: e.target.files } as unknown as FileUploadHandlerEvent)
                            }
                            disabled={allImages.length >= 3}
                        />
                    </label>
                </div>

                {error && <Message severity="error" text={error} className="mt-3" />}
            </div>

            {/* Image previews */}
            {allImages.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-2">
                    {allImages.map((src, index) => {
                        const isExisting = index < existingUrls.length;
                        return (
                            <div
                                key={index}
                                className="relative aspect-square rounded-lg overflow-hidden shadow group"
                            >
                                <img
                                    src={src}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                                />
                                <button
                                    type="button"
                                    onClick={() => onRemove(index, isExisting)}
                                    className="absolute cursor-pointer top-1 right-1 text-red p-1  hover:text-red-700"
                                    aria-label={`Remove image ${index + 1}`}
                                >
                                    <i className=" pi pi-times" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
};

export default ImageUpload;

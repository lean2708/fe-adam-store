"use client";

import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiImageUploadProps {
  onChange: (files: File[]) => void;
  initialImageUrls?: { id: number; url: string }[];
  onRemoveInitialImage?: (id: number) => void;
}

export function MultiImageUpload({
  onChange,
  initialImageUrls = [],
  onRemoveInitialImage,
}: MultiImageUploadProps) {
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const newUrls = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(newUrls);

    // Cleanup object URLs on component unmount or when files change
    return () => {
      newUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newFiles]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      const updatedFiles = [...newFiles, ...selectedFiles];
      setNewFiles(updatedFiles);
      onChange(updatedFiles);
    }
  };

  const handleRemoveNewFile = (index: number) => {
    const updatedFiles = newFiles.filter((_, i) => i !== index);
    setNewFiles(updatedFiles);
    onChange(updatedFiles);
  };

  const handleRemoveInitialImage = (id: number) => {
    if (onRemoveInitialImage) {
      onRemoveInitialImage(id);
    }
  };

  return (
    <div className="">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {/* Render initial images */}
        {initialImageUrls.map((image) => (
          <div key={image.id} className="relative group">
            <img
              src={image.url}
              alt="Existing product image"
              className="w-full h-24 object-cover rounded-lg"
            />
            {onRemoveInitialImage && (
              <button
                type="button"
                onClick={() => handleRemoveInitialImage(image.id)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}

        {/* Render previews for new files */}
        {previewUrls.map((url, index) => (
          <div key={index} className="relative group">
            <img
              src={url}
              alt={`Preview ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => handleRemoveNewFile(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {/* Upload trigger */}
        <label
          htmlFor="multi-image-upload"
          className={cn(
            "cursor-pointer w-full h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors",
            {
              "col-span-full":
                previewUrls.length === 0 && initialImageUrls.length == 0,
            }
          )}
        >
          <Upload className="h-8 w-8 mb-2" />
          <span className="text-xs text-center">Upload Images</span>
        </label>
      </div>
      <input
        id="multi-image-upload"
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

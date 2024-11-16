import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function ProductImageUpload({
  imageFiles = [],
  setImageFiles,
  uploadedImageUrls = [],
  setUploadedImageUrls,
  imageLoadingState = false,
  setImageLoadingState,
  isEditMode = false,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);
  const [currentUploadIndex, setCurrentUploadIndex] = useState(0);

  useEffect(() => {
    if (imageFiles.length > 0 && currentUploadIndex < imageFiles.length) {
      // Trigger a single upload
      uploadImage();
    }
  }, [currentUploadIndex]);

  // Upload Image Function
  async function uploadImage() {
    setImageLoadingState(true);
    const file = imageFiles[currentUploadIndex];
    const url = await uploadImageToCloudinary(file);

    if (url) {
      setUploadedImageUrls((prev) => [...prev, url]);
      setCurrentUploadIndex((prev) => prev + 1);
    } else {
      console.error("Image upload failed");
    }

    setImageLoadingState(false);
  }

  function handleImageFileChange(event) {
    const selectedFiles = Array.from(event.target.files).slice(0, 5);
    setImageFiles(selectedFiles);
    setCurrentUploadIndex(0);  // Reset index for new uploads
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files).slice(0, 5);
    setImageFiles(droppedFiles);
    setCurrentUploadIndex(0);  // Reset index for new uploads
  }

  function handleRemoveImage(index) {
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);

    const newUploadedImageUrls = [...uploadedImageUrls];
    newUploadedImageUrls.splice(index, 1);
    setUploadedImageUrls(newUploadedImageUrls);
  }

  async function uploadImageToCloudinary(file) {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/products/upload-image",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      conso
      if (response?.data?.success) {
        console.log("Upload successful", response.data.url);
        return response.data.url;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    return null;
  }

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label>Upload Product Images</Label>
      <div
        className={`border-dashed border-2 border-gray-300 p-6 text-center rounded-md mt-2 ${isCustomStyling ? "bg-gray-100" : "bg-white"}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={inputRef}
          multiple
          onChange={handleImageFileChange}
          className="hidden"
        />z
        <div className="flex flex-col items-center justify-center space-y-3">
          <UploadCloudIcon className="w-10 h-10 text-gray-400" />
          <p className="text-gray-500">Drag and drop or click to upload images</p>
          <Button
            variant="outline"
            onClick={() => inputRef.current.click()}
          >
            Choose Images
          </Button>
        </div>
      </div>
      <div className="mt-4">
        {imageFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {imageFiles.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-full h-auto object-cover rounded-md"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        {uploadedImageUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            {uploadedImageUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Uploaded Image ${index}`}
                  className="w-full h-auto object-cover rounded-md"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {imageLoadingState && (
        <div className="mt-4">
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      )}
    </div>
  );
}

export default ProductImageUpload;

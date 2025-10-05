"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useState } from "react";
import { Upload, X } from "lucide-react";
import clsx from "clsx";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  parentId: string | null;
  onSuccess: () => void;
}

export default function UploadModal({
  isOpen,
  onClose,
  userId,
  parentId,
  onSuccess,
}: UploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", onEsc);
    }
    return () => window.removeEventListener("keydown", onEsc);
  }, [isOpen, onClose]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    if (
      !selectedFile.type.startsWith("image/") &&
      selectedFile.type !== "application/pdf"
    ) {
      setError("Only images and PDF files are supported");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("userId", userId);
      if (parentId) {
        formData.append("parentId", parentId);
      }

      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Panel */}
      <div className="relative bg-white w-full max-w-2xl mx-auto rounded-xl shadow-lg z-50 overflow-hidden animate-fadeIn">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-black">Upload File</h2>
          <p className="text-sm text-gray-600">
            Upload images and PDF files (max 20MB)
          </p>
        </div>

        <div className="p-6">
          <div
            className={clsx(
              "border-2 border-dashed rounded-lg p-8 text-center transition",
              dragActive
                ? "border-[#39FF14] bg-[#39FF14]/10"
                : "border-gray-300 hover:border-[#39FF14]"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Upload className="w-6 h-6 text-[#39FF14]" />
                  <div>
                    <p className="text-black font-medium">{selectedFile.name}</p>
                    <p className="text-gray-600 text-sm">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="p-2 rounded hover:bg-gray-200 transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-black font-medium text-lg mb-2">
                  Drag and drop your file here
                </p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <label>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,application/pdf"
                    onChange={handleFileSelect}
                  />
                  <span className="inline-block px-6 py-2 bg-[#39FF14] text-black font-semibold rounded-lg cursor-pointer hover:bg-[#2ecc71] transition">
                    Browse Files
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-4">
                  Supported: JPG, PNG, GIF, PDF — Max 20MB
                </p>
              </>
            )}
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 p-3 rounded-md text-sm text-red-600">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end items-center gap-3 px-6 py-4 border-t">
          <button
            onClick={handleClose}
            disabled={uploading}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="px-4 py-2 text-sm bg-[#39FF14] hover:bg-[#2ecc71] text-black font-semibold rounded-md transition disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

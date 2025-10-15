"use client";

import { useEffect, useRef, useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";
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

  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEsc);

    const t = setTimeout(() => panelRef.current?.focus(), 40);

    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onEsc);
    };
  }, [isOpen, onClose]);

  const handleClose = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    setDragActive(false);
    onClose();
  }, [onClose]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) {
      setSelectedFile(f);
      setError(null);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (f) {
      setSelectedFile(f);
      setError(null);
    }
  }, []);

  const selectedFileInfo = useMemo(() => {
    if (!selectedFile) return null;
    const mb = selectedFile.size / 1024 / 1024;
    return {
      name: selectedFile.name,
      sizeMb: mb.toFixed(2),
      type: selectedFile.type || "unknown",
    };
  }, [selectedFile]);

  const handleUpload = useCallback(async () => {
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

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("userId", userId);
      if (parentId) formData.append("parentId", parentId);


      const resp = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (!resp.ok) {
        const errJson = await resp.json().catch(() => null);
        throw new Error(errJson?.error || "Upload failed");
      }

      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [selectedFile, userId, parentId, onSuccess, handleClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-hidden={!isOpen}
    >
      <div
        className="fixed inset-0 bg-black/18"
        onClick={handleClose}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        ref={panelRef}
        onClick={(e) => e.stopPropagation()} // important: clicking inside does not close
        className={clsx(
          "relative z-50 w-full mx-4",
          "h-full sm:h-auto sm:max-h-[90vh]",
          "max-w-3xl",
          "bg-white rounded-none sm:rounded-xl shadow-lg overflow-hidden",
          "transform transition-all duration-150 ease-out"
        )}
        style={{ WebkitTapHighlightColor: "transparent" }} // avoid mobile tap highlight
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-md bg-[#39FF14]/10">
              <Upload className="w-5 h-5 text-[#39FF14]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black select-none">Upload File</h3>
              <p className="text-xs text-gray-500 select-none">Images & PDFs — max 20MB</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-md hover:bg-gray-100 transition"
            aria-label="Close upload dialog"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div
          className={clsx(
            "p-5 sm:p-6 overflow-auto",
            "h-[calc(100vh-96px)] sm:h-auto"
          )}
        >
          <div
            className={clsx(
              "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
              dragActive ? "border-[#39FF14] bg-[#39FF14]/8" : "border-gray-200 hover:border-[#39FF14]"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 rounded-lg gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 bg-white border rounded-md flex items-center justify-center">
                    <Upload className="w-6 h-6 text-[#39FF14]" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-sm font-medium text-black truncate">{selectedFileInfo?.name}</p>
                    <p className="text-xs text-gray-500">
                      {selectedFileInfo?.sizeMb} MB — {selectedFileInfo?.type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="px-3 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-100 transition"
                    type="button"
                  >
                    Remove
                  </button>
                  <span className="text-xs text-gray-400 select-none">Ready</span>
                </div>
              </div>
            ) : (
              <>
                <Upload className="w-14 h-14 text-gray-400 mx-auto mb-4" />
                <p className="text-black font-medium text-lg mb-2 select-none">Drag & drop your file here</p>
                <p className="text-sm text-gray-500 mb-4 select-none">or</p>

                <label>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,application/pdf"
                    onChange={handleFileSelect}
                  />
                  <span className="inline-block px-5 py-2 bg-[#39FF14] text-black font-semibold rounded-md cursor-pointer hover:bg-[#2ecc71] transition select-none">
                    Browse files
                  </span>
                </label>

                <p className="text-xs text-gray-500 mt-4 select-none">
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

        {/* FOOTER */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-end px-5 py-4 border-t">
          <button
            onClick={handleClose}
            disabled={uploading}
            className="w-full sm:w-auto px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50"
            type="button"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full sm:w-auto px-4 py-2 text-sm bg-[#39FF14] hover:bg-[#2ecc71] text-black font-semibold rounded-md transition disabled:opacity-50"
            type="button"
            aria-live="polite"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

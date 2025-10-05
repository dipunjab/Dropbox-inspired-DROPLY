"use client";

import { useEffect } from "react";
import { FolderPlus, X } from "lucide-react";
import { Input, Button } from "@heroui/react";
import { useState } from "react";
import clsx from "clsx";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  parentId: string | null;
  onSuccess: () => void;
}

export default function CreateFolderModal({
  isOpen,
  onClose,
  userId,
  parentId,
  onSuccess,
}: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!folderName.trim()) {
      setError("Folder name is required");
      return;
    }

    try {
      setCreating(true);
      setError(null);

      const response = await fetch("/api/folders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: folderName.trim(),
          userId: userId,
          parentId: parentId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create folder");
      }

      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.message || "Failed to create folder");
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setFolderName("");
    setError(null);
    onClose();
  };

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md mx-auto rounded-xl shadow-xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-black">Create New Folder</h2>
          <p className="text-sm text-gray-600">
            Enter a name for your new folder
          </p>
        </div>

        {/* Icon + Info */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-4">
          <div className="p-3 bg-[#39FF14]/10 rounded-lg">
            <FolderPlus className="w-6 h-6 text-[#39FF14]" />
          </div>
          <div>
            <p className="font-medium text-black">New Folder</p>
            <p className="text-xs text-gray-600">Organize your files</p>
          </div>
        </div>

        {/* Input */}
        <Input
          placeholder="Enter folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleCreate();
          }}
          variant="bordered"
          classNames={{
            input: "text-black",
            label: "text-black",
            inputWrapper: "border-gray-300 focus:border-[#39FF14]",
          }}
          autoFocus
        />

        {/* Error Message */}
        {error && (
          <div className="p-3 mt-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="light" onPress={handleClose} isDisabled={creating}>
            Cancel
          </Button>
          <Button
            className="bg-[#39FF14] text-black font-semibold hover:bg-[#2ecc71]"
            onPress={handleCreate}
            isLoading={creating}
            isDisabled={!folderName.trim()}
          >
            {creating ? "Creating..." : "Create Folder"}
          </Button>
        </div>
      </div>
    </div>
  );
}

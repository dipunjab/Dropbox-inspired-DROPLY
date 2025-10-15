"use client";

import { useEffect, useRef, useCallback } from "react";
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
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    const t = setTimeout(() => panelRef.current?.focus(), 30);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  const handleCreate = useCallback(async () => {
    if (!folderName.trim()) {
      setError("Folder name is required");
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const response = await fetch("/api/folders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: folderName.trim(),
          userId,
          parentId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to create folder");
      }

      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err?.message || "Failed to create folder");
    } finally {
      setCreating(false);
    }
  }, [folderName, userId, parentId, onSuccess]);

  const handleClose = useCallback(() => {
    setFolderName("");
    setError(null);
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/20"
        onClick={handleClose}
        aria-hidden
      />

      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={clsx(
          "relative z-50 w-full mx-4",
          "max-w-md",
          "bg-white shadow-xl",
          "sm:rounded-xl",
          "sm:mx-auto",
          "overflow-hidden",
          "transform transition-all duration-150"
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-md bg-[#39FF14]/10">
              <FolderPlus className="w-5 h-5 text-[#39FF14]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black">Create New Folder</h3>
              <p className="text-xs text-gray-500">Enter a name for your new folder</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-md hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg mb-4">
            <div className="p-2 bg-[#39FF14]/10 rounded-lg">
              <FolderPlus className="w-5 h-5 text-[#39FF14]" />
            </div>
            <div>
              <p className="font-medium text-black">New Folder</p>
              <p className="text-xs text-gray-600">Organize your files</p>
            </div>
          </div>

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

          {error && (
            <div className="p-3 mt-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
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
    </div>
  );
}

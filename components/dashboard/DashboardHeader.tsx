"use client";

import { useState } from "react";
import { Upload, FolderPlus, Search, Menu, X } from "lucide-react";
import { Button } from "@heroui/react";
import CreateFolderModal from "./CreateFolderModal";
import UploadModal from "./UploadModal";
import SearchBar from "../SearchBar";

interface DashboardHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  userId: string;
  currentFolderId: string | null;
  onRefresh: () => void | undefined;
}

export default function DashboardHeader({
  sidebarOpen,
  setSidebarOpen,
  userId,
  currentFolderId,
  onRefresh,
}: DashboardHeaderProps) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-14 sm:h-16 bg-white border-b border-gray-200 z-50 flex items-center px-3 sm:px-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-[#39FF14] to-[#2ecc71] bg-clip-text text-transparent select-none">
              Droply
            </h1>
          </div>

          <div className="flex-1 max-w-2xl mx-3 sm:mx-8 hidden md:block">
            <div className="relative">
              <SearchBar userId={userId} />
            </div>
          </div>

          <div className="flex items-center gap-2">

            <Button
              size="sm"
              className="bg-[#39FF14] text-black font-semibold hover:bg-[#2ecc71] flex items-center gap-2 p-2 sm:px-3"
              startContent={<Upload className="w-4 h-4" />}
              onPress={() => setUploadModalOpen(true)}
              aria-label="Upload files"
              title="Upload files"
            >
              <span className="hidden sm:inline">Upload</span>
            </Button>

            <Button
              size="sm"
              className="bg-black text-white hover:bg-gray-800 flex items-center gap-2 p-2 sm:px-3"
              startContent={<FolderPlus className="w-4 h-4" />}
              onPress={() => setFolderModalOpen(true)}
              aria-label="Create new folder"
              title="Create new folder"
            >
              <span className="hidden sm:inline">New Folder</span>
            </Button>
          </div>
        </div>

        {mobileSearchOpen && (
          <div className="absolute left-0 right-0 top-full bg-white border-b border-gray-200 px-4 py-3 shadow-sm md:hidden">
            <div className="max-w-md mx-auto">
              <SearchBar userId={userId} />
            </div>
          </div>
        )}
      </header>

      <div className="h-14 sm:h-16" />

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        userId={userId}
        parentId={currentFolderId}
        onSuccess={onRefresh}
      />

      <CreateFolderModal
        isOpen={folderModalOpen}
        onClose={() => setFolderModalOpen(false)}
        userId={userId}
        parentId={currentFolderId}
        onSuccess={onRefresh}
      />
    </>
  );
}

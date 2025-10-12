"use client";

import { useState } from 'react';
import { Upload, FolderPlus, Search, Menu, X } from 'lucide-react';
import { Button } from '@heroui/react';
import CreateFolderModal from './CreateFolderModal';
import UploadModal from './UploadModal';
import SearchBar from '../SearchBar';

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
  onRefresh
}: DashboardHeaderProps) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center px-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#39FF14] to-[#2ecc71] bg-clip-text text-transparent">
              Droply
            </h1>
          </div>

          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <div className="relative">
              <SearchBar userId={userId} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="bg-[#39FF14] text-black font-semibold hover:bg-[#2ecc71] flex items-center justify-center p-2"
              startContent={<Upload className="w-4 h-4" />}
              onPress={() => setUploadModalOpen(true)}
            >
              Upload
            </Button>
            <Button
              size="sm"
              className="bg-black text-white hover:bg-gray-800 flex items-center justify-center p-2"
              startContent={<FolderPlus className="w-4 h-4" />}
              onPress={() => {setFolderModalOpen(true)}}
            >
              New Folder
            </Button>
          </div>
        </div>
      </header>

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
"use client";

import { useState } from 'react';
import { Upload, FolderPlus, Share2 } from 'lucide-react';
import { Card, CardBody } from '@heroui/react';
import CreateFolderModal from './CreateFolderModal';
import UploadModal from './UploadModal';


interface QuickActionsProps {
  userId: string;
  currentFolderId: string | null;
  onRefresh: () => void;
}

export default function QuickActions({ userId, currentFolderId, onRefresh }: QuickActionsProps) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card 
          isPressable 
          className="bg-gradient-to-br from-[#39FF14]/5 to-white border border-gray-200 hover:shadow-lg"
          onPress={() => setUploadModalOpen(true)}
        >
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#39FF14]/10 rounded-lg">
                <Upload className="w-6 h-6 text-[#39FF14]" />
              </div>
              <div>
                <h3 className="font-semibold text-black">Upload Files</h3>
                <p className="text-xs text-gray-600">Drag & drop or browse</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card 
          isPressable 
          className="bg-gradient-to-br from-black/5 to-white border border-gray-200 hover:shadow-lg"
          onPress={() => setFolderModalOpen(true)}
        >
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-black/10 rounded-lg">
                <FolderPlus className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="font-semibold text-black">New Folder</h3>
                <p className="text-xs text-gray-600">Organize your files</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card 
          isPressable 
          className="bg-gradient-to-br from-[#39FF14]/5 to-white border border-gray-200 hover:shadow-lg"
        >
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#39FF14]/10 rounded-lg">
                <Share2 className="w-6 h-6 text-[#39FF14]" />
              </div>
              <div>
                <h3 className="font-semibold text-black">Share Files</h3>
                <p className="text-xs text-gray-600">Collaborate easily</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

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

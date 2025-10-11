"use client";

import { Star, MoreVertical, Folder, FileText, Image, File, Trash2 } from 'lucide-react';
import { Card, CardBody, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@heroui/react';
import { useState } from 'react';

interface FileGridProps {
  files: any[];
  onRefresh: () => void;
  userId: string;
}

export default function FileGrid({ files, onRefresh, userId }: FileGridProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const getFileIcon = (type: string, isFolder: boolean) => {
    if (isFolder) return <Folder className="w-5 h-5 text-[#39FF14]" />;
    if (type === 'application/pdf') return <FileText className="w-5 h-5 text-red-500" />;
    if (type.startsWith('image/')) return <Image className="w-5 h-5 text-blue-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const handleStar = async (fileId: string) => {
    try {
      setLoading(fileId);
      const response = await fetch(`/api/files/${fileId}/star`, {
        method: 'PATCH',
      });
      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error starring file:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleTrash = async (fileId: string) => {
    try {
      setLoading(fileId);
      const response = await fetch(`/api/files/${fileId}/trash`, {
        method: 'PATCH',
      });
      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error trashing file:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleDownload = (file: any) => {
    if (file.fileUrl) {
      window.open(file.fileUrl, '_blank');
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {files.map((file) => (
        <Card
          key={file.id}
          className="group hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-[#39FF14] relative"
        >
          <CardBody className="p-4">
            {/* Star indicator - always visible if starred */}
            {file.isStarred && (
              <div className="absolute top-2 left-2 z-10">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              </div>
            )}

            {/* More options dropdown - always visible on hover */}
            <div className="absolute top-2 right-2 z-10">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="bg-white/90 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    isLoading={loading === file.id}
                  >
                    <MoreVertical className="w-4 h-4 text-gray-700" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="File actions"
                  className="bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px]"
                >
                  <DropdownItem
                    key="star"
                    onPress={() => handleStar(file.id)}
                    className="px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 cursor-pointer flex items-center gap-2"
                    startContent={<Star className={`w-4 h-4 ${file.isStarred ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />}
                  >
                    {file.isStarred ? 'Unstar' : 'Add to Starred'}
                  </DropdownItem>
                  
                  {!file.isFolder ? (
                    <DropdownItem
                      key="download"
                      onPress={() => handleDownload(file)}
                      className="px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 cursor-pointer flex items-center gap-2"
                      startContent={<File className="w-4 h-4 text-gray-400" />}
                    >
                      Download
                    </DropdownItem>
                  ): null}
                  
                  <DropdownItem
                    key="trash"
                    onPress={() => handleTrash(file.id)}
                    className="px-4 py-2 hover:bg-red-50 text-sm text-red-600 cursor-pointer flex items-center gap-2"
                    startContent={<Trash2 className="w-4 h-4" />}
                  >
                    Move to Trash
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>

            {/* File icon */}
            <div className="flex items-center justify-center mb-3 mt-6">
              <div className="p-4 bg-gray-50 rounded-lg group-hover:bg-[#39FF14]/10 transition-colors">
                {getFileIcon(file.type, file.isFolder)}
              </div>
            </div>

            {/* File name */}
            {file.isFolder ? (
              <a
                href={`/dashboard/folder/${file.id}`}
                className="font-semibold text-black mb-2 truncate hover:text-[#39FF14] block text-center transition-colors"
              >
                {file.name}
              </a>
            ) : (
              <a className="font-semibold text-black mb-2 truncate text-center" href={file.fileUrl}>{file.name}</a>
            )}

            {/* File info */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
              <span className="truncate">{file.isFolder ? 'Folder' : formatSize(file.size)}</span>
              <span className="truncate">{formatDate(file.createdAt)}</span>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
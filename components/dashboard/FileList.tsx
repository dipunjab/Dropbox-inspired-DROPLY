"use client";

import { Star, Download, MoreVertical, Folder, FileText, Image, File } from 'lucide-react';
import { Card, CardBody, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@heroui/react';
import { useState } from 'react';

interface FileListProps {
  files: any[];
  onRefresh: () => void;
  userId: string;
}

export default function FileList({ files, onRefresh, userId }: FileListProps) {
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
    <div className="space-y-2">
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-gray-600 uppercase">
        <div className="col-span-5">Name</div>
        <div className="col-span-2">Size</div>
        <div className="col-span-3">Modified</div>
        <div className="col-span-2">Actions</div>
      </div>
      {files.map((file) => (
        <Card key={file.id} className="hover:bg-gray-50 border border-gray-200">
          <CardBody className="p-4">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-5 flex items-center gap-3">
                {getFileIcon(file.type, file.isFolder)}
                {file.isFolder ? (
                  <a
                    href={`/dashboard/folder/${file.id}`}
                    className="font-medium text-black truncate"
                  >
                    {file.name}
                  </a>
                ) : (
                  <a className="font-medium text-black truncate" href={file.fileUrl}>{file.name}</a>
                )}
                {file.isStarred && <Star className="w-4 h-4 text-[#39FF14] fill-[#39FF14]" />}
              </div>
              <div className="col-span-2 text-sm text-gray-600">
                {file.isFolder ? 'Folder' : formatSize(file.size)}
              </div>
              <div className="col-span-3 text-sm text-gray-600">{formatDate(file.createdAt)}</div>
              <div className="col-span-2 flex items-center gap-2">
                {!file.isFolder && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => handleDownload(file)}
                  >
                    <Download className="w-4 h-4 text-gray-600" />
                  </Button>
                )}
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      isLoading={loading === file.id}
                    >
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="File actions">
                    <DropdownItem key="star" onPress={() => handleStar(file.id)}>
                      {file.isStarred ? 'Unstar' : 'Star'}
                    </DropdownItem>
                    <DropdownItem key="trash" className="text-danger" color="danger" onPress={() => handleTrash(file.id)}>
                      Move to Trash
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

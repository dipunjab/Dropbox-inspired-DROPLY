"use client";

import { Grid3x3, List } from "lucide-react";
import { Button } from "@heroui/react";
import QuickActions from "./QuickActions";
import FileGrid from "./FileGrid";
import FileList from "./FileList";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface DashboardContentProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  files: any[];
  loading: boolean;
  userId: string;
  currentFolderId: string | null;
  onRefresh: () => void;
}

export default function DashboardContent({
  viewMode,
  setViewMode,
  files,
  loading,
  userId,
  currentFolderId,
  onRefresh,
}: DashboardContentProps) {
  const [folderName, setFolderName] = useState<string | null>(null);
  const pathname = usePathname();

  // Check if we're on a special page (recent, starred, trash)
  const isSpecialPage = pathname?.includes('/recent') || 
                        pathname?.includes('/starred') || 
                        pathname?.includes('/trash');

  const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0);
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  useEffect(() => {
    const fetchFolderName = async () => {
      if (!currentFolderId) {
        setFolderName(null); 
        return;
      }

      try {
        const res = await fetch(`/api/folders/${currentFolderId}?userId=${userId}`);
        console.log(res);
        
        if (!res.ok) throw new Error("Failed to fetch folder");
        
        const folder = await res.json();
        setFolderName(folder.name);
      } catch (err) {
        console.error("Error fetching folder name:", err);
        setFolderName("Unknown Folder");
      }
    };

    fetchFolderName();
  }, [currentFolderId, userId]);

  // Get page title based on current route
  const getPageTitle = () => {
    if (pathname?.includes('/recent')) return "Recent";
    if (pathname?.includes('/starred')) return "Starred";
    if (pathname?.includes('/trash')) return "Trash";
    return folderName || "My Files";
  };

  return (
    <main className="flex-1 p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-black">
            {getPageTitle()}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {files.length} items • {formatSize(totalSize)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            size="sm"
            className={
              viewMode === "grid"
                ? "bg-[#39FF14] text-black"
                : "bg-gray-100 text-gray-600"
            }
            onPress={() => setViewMode("grid")}
          >
            <Grid3x3 className="w-5 h-5" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            className={
              viewMode === "list"
                ? "bg-[#39FF14] text-black"
                : "bg-gray-100 text-gray-600"
            }
            onPress={() => setViewMode("list")}
          >
            <List className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Only show QuickActions on main pages, not on recent/starred/trash */}
      {!isSpecialPage && (
        <QuickActions
          userId={userId}
          currentFolderId={currentFolderId}
          onRefresh={onRefresh}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#39FF14]"></div>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {isSpecialPage 
              ? `No ${getPageTitle().toLowerCase()} files or folders yet.`
              : "No files or folders yet. Start by uploading or creating a folder!"
            }
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <FileGrid files={files} onRefresh={onRefresh} userId={userId} />
      ) : (
        <FileList files={files} onRefresh={onRefresh} userId={userId} />
      )}
    </main>
  );
}
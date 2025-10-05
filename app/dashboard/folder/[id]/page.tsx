"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardContent from "@/components/dashboard/DashboardContent";
import Breadcrumb from "@/components/dashboard/Breadcrumb";

export default function FolderPage() {
  const { user, isLoaded } = useUser();
  const { id: folderId } = useParams();
  const router = useRouter();

  const [files, setFiles] = useState([]);
  const [breadcrumbPath, setBreadcrumbPath] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (isLoaded && !user) router.push("/sign-in");
  }, [isLoaded, user]);

  useEffect(() => {
    if (user && folderId) {
      fetchFiles();
      fetchBreadcrumb();
    }
  }, [user, folderId]);

const fetchFiles = async () => {
  try {
    setLoading(true);
    const params = new URLSearchParams({
      userId: user!.id,
      parentId: folderId as string,
    });

    const res = await fetch(`/api/files?${params}`);
    const data = await res.json();

    // Filter out trashed files
    setFiles(data.filter((file: any) => !file.isTrash));
    
  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    setLoading(false);
  }
};


  const fetchBreadcrumb = async () => {
    const params = new URLSearchParams({
      id: folderId as string,
      userId: user!.id,
    });

    const res = await fetch(`/api/folders/path?${params}`);
    const path = await res.json();
    setBreadcrumbPath(path);
  };

if (!isLoaded) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="h-10 w-10 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

if (!user) {
  router.push("/sign-in");
  return null;
}


  return (
    <DashboardLayout
      userId={user.id}
      currentFolderId={folderId as string}
      onRefresh={fetchFiles}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <Breadcrumb path={breadcrumbPath} />
        <DashboardContent
          files={files}
          loading={loading}
          userId={user.id}
          currentFolderId={folderId as string}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onRefresh={fetchFiles}
        />
      </div>
    </DashboardLayout>
  );
}

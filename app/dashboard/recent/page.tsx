"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import DashboardContent from "@/components/dashboard/DashboardContent";

export default function RecentPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (isLoaded && !user) router.push("/sign-in");
  }, [isLoaded, user]);

  useEffect(() => {
    if (user) fetchFiles();
  }, [user]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/files?userId=${user!.id}`);
      const data = await res.json();
      
      // Filter out trashed files and sort by creation date (most recent first)
      const filtered = data
        .filter((file: any) => !file.isTrash)
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 50); // Show last 50 recent items
      
      setFiles(filtered);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
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
      <div className="px-4 sm:px-6 lg:px-8">
        <DashboardContent
          files={files}
          loading={loading}
          userId={user.id}
          currentFolderId={null}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onRefresh={fetchFiles}
        />
      </div>
  );
}
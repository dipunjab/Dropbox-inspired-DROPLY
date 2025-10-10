"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import DashboardContent from "@/components/dashboard/DashboardContent";

export default function DashboardPage() {
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
      const filtered = data.filter((file: any) => !file.isTrash);
      setFiles(filtered);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !user) return <div>Loading...</div>;

  return (
    <DashboardContent
      files={files}
      loading={loading}
      userId={user.id}
      currentFolderId={null}
      viewMode={viewMode}
      setViewMode={setViewMode}
      onRefresh={fetchFiles}
    />
  );
}

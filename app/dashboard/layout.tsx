"use client";

import { useUser } from "@clerk/nextjs";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { ReactNode, useState } from "react";

export default function DashboardLayout({
  currentFolderId,
  onRefresh,
  children,
}: {
  currentFolderId: string | null;
  onRefresh: () => void;
  children: ReactNode;
}) {
  const { user } = useUser(); 
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!user) return null; 

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userId={user.id} 
        currentFolderId={currentFolderId}
        onRefresh={onRefresh}
      />
      <div className="flex pt-16">
        <DashboardSidebar sidebarOpen={sidebarOpen} />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}

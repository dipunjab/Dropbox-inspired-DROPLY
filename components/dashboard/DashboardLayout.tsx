"use client";

import { ReactNode, useState } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout({
  userId,
  currentFolderId,
  onRefresh,
  children,
}: {
  userId: string;
  currentFolderId: string | null;
  onRefresh: () => void;
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userId={userId}
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

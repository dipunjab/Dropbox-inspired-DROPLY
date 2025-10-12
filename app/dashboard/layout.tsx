"use client";

import { useUser } from "@clerk/nextjs";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { ReactNode, useCallback, useState } from "react";

export default function DashboardLayout({

  children,
}: {
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
        currentFolderId={null}
        onRefresh={() => {}}
      />
      <div className="flex pt-16">
        <DashboardSidebar sidebarOpen={sidebarOpen} />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}

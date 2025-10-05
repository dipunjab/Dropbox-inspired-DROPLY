"use client";

import { Home, Clock, Star, Trash2, LogOut } from 'lucide-react';
import { Button } from '@heroui/react';
import { useClerk } from '@clerk/nextjs';

interface DashboardSidebarProps {
  sidebarOpen: boolean;
}

export default function DashboardSidebar({ sidebarOpen }: DashboardSidebarProps) {
  const { signOut } = useClerk();

  return (
    <aside
      className={`fixed lg:sticky top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-40 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="flex flex-col justify-between h-full">
        {/* Navigation */}
        <nav className="p-4 space-y-1">
          <Button
            fullWidth
            variant="flat"
            className="justify-start bg-gray-100 text-black font-medium flex rounded-xl mb-4"
            startContent={<Home className="w-5 h-5" />}
          >
            My Files
          </Button>
          <Button
            fullWidth
            variant="light"
            className="justify-start text-gray-700 flex rounded-xl mb-4"
            startContent={<Clock className="w-5 h-5" />}
          >
            Recent
          </Button>
          <Button
            fullWidth
            variant="light"
            className="justify-start text-gray-700 flex rounded-xl mb-4"
            startContent={<Star className="w-5 h-5" />}
          >
            Starred
          </Button>
          <Button
            fullWidth
            variant="light"
            className="justify-start text-gray-700 flex rounded-xl mb-4"
            startContent={<Trash2 className="w-5 h-5" />}
          >
            Trash
          </Button>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <Button
            fullWidth
            variant="light"
            className="justify-start text-red-600 hover:bg-red-50 flex rounded-xl"
            startContent={<LogOut className="w-5 h-5" />}
            onPress={() => signOut()}
          >
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}

"use client";

import { useEffect } from "react";
import { Home, Clock, Star, Trash2, LogOut } from "lucide-react";
import { Button } from "@heroui/react";
import { useClerk, useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

interface DashboardSidebarProps {
  sidebarOpen: boolean;
  onClose?: () => void;
}

export default function DashboardSidebar({ sidebarOpen, onClose }: DashboardSidebarProps) {
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  

  useEffect(() => {
    if (sidebarOpen && onClose) onClose();
  }, [pathname]);

  const handleNavigate = (path: string) => {
    router.push(path);
    if (onClose) onClose();
  };

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { name: "My Files", icon: Home, path: "/dashboard" },
    { name: "Recent", icon: Clock, path: "/dashboard/recent" },
    { name: "Starred", icon: Star, path: "/dashboard/starred" },
    { name: "Trash", icon: Trash2, path: "/dashboard/trash" },
  ];

  return (
    <aside
      className={`fixed lg:sticky top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-40 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="flex flex-col justify-between h-full">
        <div className="p-4 border-b border-gray-100">
          {isLoaded && user ? (
            <div
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-md p-2 transition"
              onClick={() => handleNavigate('/dashboard/profile')}
            >
              <Image
                src={user?.imageUrl || '/avatar-placeholder.png'}
                alt={user.fullName || 'User avatar'}
                className="w-12 h-12 rounded-full object-cover"
                width={12} height={12}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.fullName || 'No name'}</p>
                <p className="text-xs text-gray-500 truncate">{user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || ''}</p>
              </div>
            </div>
          ) : (
            <div className="h-14 flex items-center">
              <div className="h-12 w-12 bg-gray-100 rounded-full animate-pulse" />
              <div className="ml-3 flex-1">
                <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mt-2 animate-pulse" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map(({ name, icon: Icon, path }) => (
            <Button
              key={name}
              fullWidth
              variant={isActive(path) ? "flat" : "light"}
              className={`justify-start flex rounded-xl mb-3 transition-all duration-200 ${
                isActive(path)
                  ? "bg-[#39FF14]/20 text-[#111] font-semibold shadow-[0_0_10px_rgba(57,255,20,0.18)]"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              startContent={<Icon className="w-5 h-5" />}
              onPress={() => handleNavigate(path)}
            >
              {name}
            </Button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <Button
            fullWidth
            variant="light"
            className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-[#39FF14] to-[#2ecc71]"
            style={{ WebkitBackgroundClip: "text" }}
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

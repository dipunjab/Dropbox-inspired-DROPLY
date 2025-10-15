"use client";

import { useEffect } from "react";
import { Home, Clock, Star, Trash2, LogOut } from "lucide-react";
import { Button } from "@heroui/react";
import { useClerk, useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";

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
      className={`fixed lg:sticky top-14 sm:top-16 left-0 bottom-0 w-80 sm:w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-40 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="flex flex-col justify-between h-full">

        <nav className="p-3 sm:p-4 space-y-1 flex-1 overflow-y-auto">
          {navItems.map(({ name, icon: Icon, path }) => (
            <Button
              key={name}
              fullWidth
              variant={isActive(path) ? "flat" : "light"}
              className={`justify-start flex rounded-lg sm:rounded-xl mb-2 transition-all duration-200 ${
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

        <div className="p-3 sm:p-4 border-t border-gray-100">
          <Button
            fullWidth
            variant="light"
            className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-[#39FF14] to-[#2ecc71]"
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

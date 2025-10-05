"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  id: string;
  name: string;
}

interface BreadcrumbProps {
  path: BreadcrumbItem[];
}

export default function Breadcrumb({ path }: BreadcrumbProps) {
  return (
    <nav className="flex items-center text-sm text-gray-600 mb-4 flex-wrap">
      <Link href="/dashboard" className="hover:underline text-black font-medium">
        Home
      </Link>
      {path.map((item, index) => {
        const isLast = index === path.length - 1;
        return (
          <div key={item.id} className="flex items-center">
            <ChevronRight className="mx-1 h-4 w-4 text-gray-400" />
            {isLast ? (
              <span className="text-gray-500">{item.name}</span>
            ) : (
              <Link
                href={`/dashboard/folder/${item.id}`}
                className="hover:underline text-black"
              >
                {item.name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

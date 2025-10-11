"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, Folder, FileText, Image as ImageIcon, File, X, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  userId: string;
}

interface FileItem {
  id: string;
  name: string;
  type: string;
  isFolder: boolean;
  fileUrl?: string;
  thumbnailUrl?: string;
  parentId?: string | null;
  createdAt: string;
}

export default function SearchBar({ userId }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<FileItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSuggestions([]);
      setSelectedIndex(-1);
      setIsOpen(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/files/search?userId=${userId}&q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        
        setSuggestions(data);
        setIsOpen(true);
        setSelectedIndex(-1);
      } catch (err) {
        console.error('Error searching files:', err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300); 

    return () => clearTimeout(timeoutId);
  }, [searchQuery, userId]);
console.log(userId);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFileIcon = (type: string, isFolder: boolean) => {
    if (isFolder) return <Folder className="w-4 h-4 text-[#39FF14]" />;
    if (type === 'application/pdf') return <FileText className="w-4 h-4 text-red-500" />;
    if (type.startsWith('image/')) return <ImageIcon className="w-4 h-4 text-blue-500" />;
    return <File className="w-4 h-4 text-gray-500" />;
  };

  const handleItemClick = (item: FileItem) => {
    if (item.isFolder) {
      router.push(`/dashboard/folder/${item.id}`);
    } else {
      if (item.fileUrl) {
        window.open(item.fileUrl, '_blank');
      }
    }
    setSearchQuery('');
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleItemClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search files and folders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (searchQuery.trim() && suggestions.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#39FF14] focus:ring-2 focus:ring-[#39FF14]/20 transition"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {isOpen && searchQuery.trim() && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
          {loading ? (
            <div className="px-4 py-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#39FF14] mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Searching...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <>
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
                Search Results ({suggestions.length})
              </div>
              <ul className="py-1">
                {suggestions.map((item, index) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleItemClick(item)}
                      className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition ${
                        selectedIndex === index ? 'bg-gray-50' : ''
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {getFileIcon(item.type, item.isFolder)}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-black truncate">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500">
                            {item.isFolder ? 'Folder' : item.type.split('/')[1]?.toUpperCase() || 'File'}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                      </div>
                      {item.isFolder && (
                        <div className="flex-shrink-0 text-xs text-gray-400">
                          Open →
                        </div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No files or folders found</p>
              <p className="text-xs text-gray-400 mt-1">
                Try a different search term
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
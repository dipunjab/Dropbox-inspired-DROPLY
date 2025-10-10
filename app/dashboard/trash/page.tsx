"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Trash2, RotateCcw } from "lucide-react";

type FileItem = {
  id: string;
  name: string;
  isFolder?: boolean;
  thumbnailUrl?: string;
  fileUrl?: string;
  isTrash?: boolean;
};

export default function TrashPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // per-file action states: 'restoring' | 'deleting'
  const [actionLoading, setActionLoading] = useState<Record<string, "restoring" | "deleting" | undefined>>({});
  const [bulkLoading, setBulkLoading] = useState<{ deletingSelected: boolean; emptying: boolean }>({ deletingSelected: false, emptying: false });

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
      const filtered = data.filter((file: any) => file.isTrash);
      setFiles(filtered);
      setSelectedFiles(new Set());
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const setFileAction = (fileId: string, action: "restoring" | "deleting" | undefined) => {
    setActionLoading(prev => ({ ...prev, [fileId]: action }));
  };

  const handleRestore = async (fileId: string) => {
    if (actionLoading[fileId]) return; // already processing
    try {
      setFileAction(fileId, "restoring");
      await fetch(`/api/files/${fileId}/trash`, { method: "PATCH" });
      await fetchFiles();
    } catch (err) {
      console.error("Restore error:", err);
    } finally {
      setFileAction(fileId, undefined);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (actionLoading[fileId]) return;
    if (!confirm("Are you sure you want to permanently delete this item?")) return;

    try {
      setFileAction(fileId, "deleting");
      await fetch(`/api/files/${fileId}/delete`, { method: "DELETE" });
      await fetchFiles();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setFileAction(fileId, undefined);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedFiles.size === 0) return;
    if (!confirm(`Are you sure you want to permanently delete ${selectedFiles.size} item(s)?`)) return;

    try {
      setBulkLoading(prev => ({ ...prev, deletingSelected: true }));
      await Promise.all(
        Array.from(selectedFiles).map(async (fileId) => {
          setFileAction(fileId, "deleting");
          await fetch(`/api/files/${fileId}/delete`, { method: "DELETE" });
        })
      );
      await fetchFiles();
    } catch (err) {
      console.error("Delete selected error:", err);
    } finally {
      setBulkLoading(prev => ({ ...prev, deletingSelected: false }));
      // clear per-file actions
      setActionLoading({});
    }
  };

  const handleEmptyTrash = async () => {
    if (files.length === 0) return;
    if (!confirm("Are you sure you want to permanently delete all items in trash?")) return;

    try {
      setBulkLoading(prev => ({ ...prev, emptying: true }));
      await Promise.all(
        files.map((file) => fetch(`/api/files/${file.id}/delete`, { method: "DELETE" }))
      );
      await fetchFiles();
    } catch (err) {
      console.error("Empty trash error:", err);
    } finally {
      setBulkLoading(prev => ({ ...prev, emptying: false }));
      setActionLoading({});
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) newSet.delete(fileId);
      else newSet.add(fileId);
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedFiles.size === files.length) setSelectedFiles(new Set());
    else setSelectedFiles(new Set(files.map((f) => f.id)));
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="h-12 w-12 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  const isFileBusy = (fileId: string) => !!actionLoading[fileId];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Trash</h1>
          <p className="text-sm text-gray-500 mt-1">Items in trash will be permanently deleted after 30 days</p>
        </div>
        <div className="flex gap-2 items-center">
          {selectedFiles.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              disabled={bulkLoading.deletingSelected}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 justify-center ${bulkLoading.deletingSelected ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-[0_0_12px_rgba(57,255,20,0.18)]'}`}
              style={{ boxShadow: bulkLoading.deletingSelected ? '0 0 12px rgba(57,255,20,0.22)' : undefined }}
            >
              {bulkLoading.deletingSelected ? (
                <div className="h-4 w-4 border-2 border-[#39FF14] border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
              Delete Selected ({selectedFiles.size})
            </button>
          )}

          {files.length > 0 && (
            <button
              onClick={handleEmptyTrash}
              disabled={bulkLoading.emptying}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 justify-center ${bulkLoading.emptying ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-[0_0_14px_rgba(57,255,20,0.22)]'}`}
            >
              {bulkLoading.emptying ? (
                <div className="h-4 w-4 border-2 border-[#39FF14] border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
              Empty Trash
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="h-12 w-12 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <Trash2 size={64} className="mb-4" />
          <p className="text-lg">Trash is empty</p>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedFiles.size === files.length && files.length > 0}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-600">Select All</span>
          </div>

          <div className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" : "space-y-2"}>
            {files.map((file) => (
              <div
                key={file.id}
                className={`border rounded-lg p-4 transition ${selectedFiles.has(file.id) ? "border-[#39FF14] bg-green-50 shadow-[0_8px_24px_rgba(57,255,20,0.06)]" : "border-gray-200"}`}
              >
                <div className="flex items-start gap-2 mb-3">
                  <input
                    type="checkbox"
                    checked={selectedFiles.has(file.id)}
                    onChange={() => toggleFileSelection(file.id)}
                    className="mt-1 w-4 h-4 rounded border-gray-300"
                    disabled={isFileBusy(file.id)}
                  />
                  {file.isFolder ? (
                    <div className="w-full h-24 bg-gray-100 rounded flex items-center justify-center text-2xl">
                      📁
                    </div>
                  ) : (
                    <img
                      src={file.thumbnailUrl || file.fileUrl}
                      alt={file.name}
                      className="w-full h-24 object-cover rounded"
                    />
                  )}
                </div>
                <p className="text-sm font-medium truncate mb-3">{file.name}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRestore(file.id)}
                    disabled={isFileBusy(file.id)}
                    className={`flex-1 px-3 py-1.5 rounded text-sm flex items-center justify-center gap-1 transition ${actionLoading[file.id] === 'restoring' ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-[0_0_10px_rgba(57,255,20,0.18)]'}`}
                    style={{ background: 'linear-gradient(90deg, rgba(57,255,20,0.06), rgba(57,255,20,0.02))', border: '1px solid rgba(57,255,20,0.12)' }}
                  >
                    {actionLoading[file.id] === 'restoring' ? (
                      <div className="h-4 w-4 border-2 border-[#39FF14] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <RotateCcw size={14} />
                    )}
                    Restore
                  </button>

                  <button
                    onClick={() => handleDelete(file.id)}
                    disabled={isFileBusy(file.id)}
                    className={`flex-1 px-3 py-1.5 rounded text-sm flex items-center justify-center gap-1 transition ${actionLoading[file.id] === 'deleting' ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-[0_0_8px_rgba(0,0,0,0.06)]'}`}
                    style={{ background: 'transparent', border: '1px solid rgba(0,0,0,0.06)' }}
                  >
                    {actionLoading[file.id] === 'deleting' ? (
                      <div className="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

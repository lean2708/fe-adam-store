"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Upload, Search, MoreHorizontal, Trash2, Copy, Download, Eye } from "lucide-react";
import {
  getAllFilesAction,
  uploadImagesAction,
  deleteFileAction
} from "@/actions/fileActions";
import type { TFile } from "@/types";
import { toast } from "sonner";
import Image from "next/image";
import { useLocale } from "next-intl";
import { formatDate } from "@/lib/utils";
import { AdminPagination } from "@/components/ui/pagination";

export default function FilesPage() {
  const locale = useLocale();
  const [files, setFiles] = useState<TFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pageSize = 20;

  const fetchFiles = async (page: number = 0) => {
    setLoading(true);
    try {
      const result = await getAllFilesAction(page, pageSize);

      if (result.success && result.data) {
        let filteredFiles = result.data || [];

        // Apply client-side filtering if needed
        if (searchTerm) {
          filteredFiles = filteredFiles.filter(file =>
            file.fileName?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        setFiles(filteredFiles);
        setTotalItems(result.actionSizeResponse?.totalItems || 0);
        setTotalPages(result.actionSizeResponse?.totalPages || 0);
        setCurrentPage(page);
      } else {
        toast.error(result.message || "Failed to fetch files");
      }
    } catch (error) {
      toast.error("Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [fileTypeFilter]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    try {
      const filesArray = Array.from(selectedFiles);
      const result = await uploadImagesAction(filesArray);
      
      if (result.success) {
        toast.success(`Successfully uploaded ${filesArray.length} file(s)`);
        fetchFiles(currentPage);
      } else {
        toast.error(result.message || "Failed to upload files");
      }
    } catch (error) {
      toast.error("Failed to upload files");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteFile = async (id: number) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      const result = await deleteFileAction(id);
      
      if (result.success) {
        toast.success("File deleted successfully");
        fetchFiles(currentPage);
      } else {
        toast.error(result.message || "Failed to delete file");
      }
    } catch (error) {
      toast.error("Failed to delete file");
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileTypeColor = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const filteredFiles = files.filter(file =>
    file.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.createdBy?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page-container mt-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Files</h1>
          <p className="text-muted-foreground">
            Manage uploaded images and files
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? "Uploading..." : "Upload Images"}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>File Management</CardTitle>
          <CardDescription>View and manage all uploaded files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={fileTypeFilter}
              onValueChange={(value) => setFileTypeFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Files</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Files Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square bg-muted animate-pulse" />
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-3 bg-muted rounded animate-pulse w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                {searchTerm
                  ? "No files found matching your search"
                  : "No files uploaded yet"}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <Card
                  key={file.id}
                  className="overflow-hidden group hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square relative bg-muted">
                    {file.imageUrl ? (
                      <Image
                        src={file.imageUrl}
                        alt={file.fileName || "File"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Preview
                      </div>
                    )}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => window.open(file.imageUrl, "_blank")}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Full Size
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleCopyUrl(file.imageUrl || "")}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy URL
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleDownload(
                                file.imageUrl || "",
                                file.fileName || "file"
                              )
                            }
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteFile(file.id!)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium truncate flex-1">
                          {file.fileName}
                        </h4>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getFileTypeColor(
                            file.fileName || ""
                          )}`}
                        >
                          {file.fileName?.split(".").pop()?.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <div>By: {file.createdBy}</div>
                        <div>
                          {file.createdAt
                            ? formatDate(file.createdAt, locale, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "-"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-4 mt-4 flex justify-end">
              <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(newPage) => fetchFiles(newPage)}
                totalItems={totalItems}
                itemsPerPage={pageSize}
                itemName="files"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

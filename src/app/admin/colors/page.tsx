"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Palette, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw,
  Package
} from "lucide-react";
import { 
  fetchAllColorsAction,
  createColorAction,
  updateColorAction,
  deleteColorAction
} from "@/actions/colorActions";
import type { ColorResponse, ColorRequest } from "@/api-client/models";

export default function ColorsAdminPage() {
  const [colors, setColors] = useState<ColorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<ColorResponse | null>(null);
  const [formData, setFormData] = useState<ColorRequest>({
    name: ""
  });

  // Load colors on component mount
  useEffect(() => {
    loadColors(0);
  }, []);

  const loadColors = async (page: number) => {
    setLoading(true);
    try {
      const result = await fetchAllColorsAction(page, 20);
      if (result.success && result.data) {
        setColors(result.data.items || []);
        setTotalPages(result.data.totalPages || 0);
        setTotalElements(result.data.totalItems || 0);
        setCurrentPage(page);
      } else {
        toast.error(result.message || "Failed to load colors");
      }
    } catch (error) {
      toast.error("Failed to load colors");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadColors(currentPage);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      loadColors(newPage);
    }
  };

  const handleCreateColor = () => {
    setEditingColor(null);
    setFormData({ name: "" });
    setIsDialogOpen(true);
  };

  const handleEditColor = (color: ColorResponse) => {
    setEditingColor(color);
    setFormData({
      name: color.name || ""
    });
    setIsDialogOpen(true);
  };

  const handleDeleteColor = async (id: number) => {
    if (!confirm("Are you sure you want to delete this color?")) return;

    try {
      const result = await deleteColorAction(id);
      if (result.success) {
        toast.success("Color deleted successfully");
        loadColors(currentPage);
      } else {
        toast.error(result.message || "Failed to delete color");
      }
    } catch (error) {
      toast.error("Failed to delete color");
    }
  };

  // Helper function to get color value based on name
  const getColorValue = (color: ColorResponse) => {
    const colorName = color.name?.toLowerCase();

    // Common color name mappings
    const colorMap: Record<string, string> = {
      'red': '#FF0000',
      'blue': '#0000FF',
      'green': '#008000',
      'yellow': '#FFFF00',
      'orange': '#FFA500',
      'purple': '#800080',
      'pink': '#FFC0CB',
      'brown': '#A52A2A',
      'black': '#000000',
      'white': '#FFFFFF',
      'gray': '#808080',
      'grey': '#808080',
      'navy': '#000080',
      'lime': '#00FF00',
      'cyan': '#00FFFF',
      'magenta': '#FF00FF',
      'silver': '#C0C0C0',
      'gold': '#FFD700',
      'violet': '#EE82EE',
      'indigo': '#4B0082',
      'turquoise': '#40E0D0',
      'coral': '#FF7F50',
      'salmon': '#FA8072',
      'khaki': '#F0E68C',
      'plum': '#DDA0DD',
      'tan': '#D2B48C',
      'beige': '#F5F5DC',
      'ivory': '#FFFFF0',
      'crimson': '#DC143C',
      'maroon': '#800000',
      'olive': '#808000',
      'teal': '#008080',
      'aqua': '#00FFFF'
    };

    // Try to match by name
    if (colorName && colorMap[colorName]) {
      return colorMap[colorName];
    }

    // Generate a color based on the name hash if no match found
    if (colorName) {
      let hash = 0;
      for (let i = 0; i < colorName.length; i++) {
        hash = colorName.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hue = Math.abs(hash) % 360;
      return `hsl(${hue}, 70%, 50%)`;
    }

    // Default fallback
    return '#808080';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingColor) {
        const result = await updateColorAction(editingColor.id!, formData);
        if (result.success) {
          toast.success("Color updated successfully");
          setIsDialogOpen(false);
          loadColors(currentPage);
        } else {
          toast.error(result.message || "Failed to update color");
        }
      } else {
        const result = await createColorAction(formData);
        if (result.success) {
          toast.success("Color created successfully");
          setIsDialogOpen(false);
          loadColors(currentPage);
        } else {
          toast.error(result.message || "Failed to create color");
        }
      }
    } catch (error) {
      toast.error("Failed to save color");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Color Management</h1>
          <p className="text-muted-foreground">
            Manage product colors
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleCreateColor}>
            <Plus className="h-4 w-4 mr-2" />
            Add Color
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Colors</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalElements}</div>
            <p className="text-xs text-muted-foreground">
              Available product colors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Page</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentPage + 1}</div>
            <p className="text-xs text-muted-foreground">
              of {totalPages} pages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items per Page</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{colors.length}</div>
            <p className="text-xs text-muted-foreground">
              showing on current page
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Colors Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Product Colors
          </CardTitle>
          <CardDescription>
            List of all available product colors
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : colors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No colors found</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Color Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {colors.map((color) => (
                    <TableRow key={color.id}>
                      <TableCell className="font-medium">
                        {color.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full border border-gray-300"
                            style={{ backgroundColor: getColorValue(color) }}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {color.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {getColorValue(color)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        N/A
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditColor(color)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => color.id && handleDeleteColor(color.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {currentPage * 20 + 1} to {Math.min((currentPage + 1) * 20, totalElements)} of {totalElements} colors
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum + 1}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages - 1}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Color Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingColor ? "Edit Color" : "Create New Color"}
            </DialogTitle>
            <DialogDescription>
              {editingColor 
                ? "Update the color information below."
                : "Add a new color to the system."
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Red, Blue, Green"
                    required
                  />
                  <div
                    className="w-8 h-8 rounded border border-gray-300"
                    style={{ backgroundColor: getColorValue({ name: formData.name }) }}
                  />
                </div>
              </div>
              <div className="text-sm text-muted-foreground px-4">
                <p>Color preview is generated based on the name. Common color names like "red", "blue", "green" will show their standard colors.</p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingColor ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

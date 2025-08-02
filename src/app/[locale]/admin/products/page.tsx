"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, Edit, Trash2, RotateCcw, Eye } from "lucide-react";
import {
  fetchAllProductsForAdminAction,
  deleteProductAdminAction,
  restoreProductAction
} from "@/actions/productActions";
import type { ProductResponse } from "@/api-client/models";
import { toast } from "sonner";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const pageSize = 10;

  const fetchProducts = async (page: number = 0) => {
    setLoading(true);
    try {
      const result = await fetchAllProductsForAdminAction(page, pageSize);
      
      if (result.success && result.data) {
        setProducts(result.data.items || []);
        setTotalPages(result.data.totalPages || 0);
        setTotalElements(result.data.totalItems || 0);
        setCurrentPage(page);
      } else {
        toast.error(result.message || "Failed to fetch products");
      }
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const result = await deleteProductAdminAction(id);
      
      if (result.success) {
        toast.success("Product deleted successfully");
        fetchProducts(currentPage);
      } else {
        toast.error(result.message || "Failed to delete product");
      }
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleRestoreProduct = async (id: number) => {
    try {
      const result = await restoreProductAction(id);

      if (result.success) {
        toast.success("Product restored successfully");
        fetchProducts(currentPage);
      } else {
        toast.error(result.message || "Failed to restore product");
      }
    } catch (error) {
      toast.error("Failed to restore product");
    }
  };

  const handleViewDetails = (product: ProductResponse) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleEditProduct = (product: ProductResponse) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getProductPrice = (product: ProductResponse) => {
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants.map(v => v.price || 0);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      if (minPrice === maxPrice) {
        return formatCurrency(minPrice);
      } else {
        return `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;
      }
    }
    return "N/A";
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>
            View and manage all products in your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Products Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price Range</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-muted rounded animate-pulse" />
                          <div className="space-y-2">
                            <div className="h-4 bg-muted rounded animate-pulse w-32" />
                            <div className="h-3 bg-muted rounded animate-pulse w-24" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><div className="h-4 bg-muted rounded animate-pulse w-20" /></TableCell>
                      <TableCell><div className="h-4 bg-muted rounded animate-pulse w-16" /></TableCell>
                      <TableCell><div className="h-4 bg-muted rounded animate-pulse w-16" /></TableCell>
                      <TableCell><div className="h-4 bg-muted rounded animate-pulse w-12" /></TableCell>
                      <TableCell><div className="h-4 bg-muted rounded animate-pulse w-24" /></TableCell>
                      <TableCell><div className="h-4 bg-muted rounded animate-pulse w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 relative rounded overflow-hidden bg-muted">
                            {product.images && product.images.length > 0 ? (
                              <Image
                                src={product.images[0].imageUrl || "/placeholder.png"}
                                alt={product.name || "Product"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
                                No Image
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {getProductPrice(product)}
                      </TableCell>
                      <TableCell>
                        {product.variants?.reduce((total, variant) => total + (variant.quantity || 0), 0) || 0}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={`${getStatusColor(product.status || 'ACTIVE')}`}
                        >
                          {product.status || 'ACTIVE'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm">⭐</span>
                          <span className="text-sm">
                            {product.averageRating?.toFixed(1) || '0.0'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({product.totalReviews || 0})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewDetails(product)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {product.status === 'ACTIVE' ? (
                              <DropdownMenuItem 
                                onClick={() => handleDeleteProduct(product.id!)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleRestoreProduct(product.id!)}>
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Restore
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} products
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchProducts(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchProducts(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              View detailed information about this product
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              {/* Product Images */}
              {selectedProduct.images && selectedProduct.images.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Images</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedProduct.images.map((image, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image
                          src={image.imageUrl || '/placeholder.png'}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover rounded-lg border"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Product Name</Label>
                  <p className="text-sm">{selectedProduct.name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedProduct.status || 'INACTIVE')}>
                    {selectedProduct.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Average Rating</Label>
                  <p className="text-sm">
                    ⭐ {selectedProduct.averageRating?.toFixed(1) || '0.0'}
                    ({selectedProduct.totalReviews || 0} reviews)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Sold Quantity</Label>
                  <p className="text-sm">{selectedProduct.soldQuantity || 0}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Created Date</Label>
                  <p className="text-sm">
                    {selectedProduct.createdAt ? new Date(selectedProduct.createdAt).toLocaleDateString() : '-'}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Available</Label>
                  <Badge variant={selectedProduct.isAvailable ? 'default' : 'secondary'}>
                    {selectedProduct.isAvailable ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>

              {/* Description */}
              {selectedProduct.description && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                </div>
              )}

              {/* Variants */}
              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Variants</Label>
                  <div className="space-y-2">
                    {selectedProduct.variants.map((variant, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Color:</span> {variant.color?.name || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Size:</span> {variant.size?.name || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Price:</span> ${variant.price || 0}
                          </div>
                          <div>
                            <span className="font-medium">Quantity:</span> {variant.quantity || 0}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Product Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Edit product information (Note: This is a basic edit form. Full product editing should be implemented with proper form handling)
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Product Name</Label>
                <Input
                  id="edit-name"
                  defaultValue={selectedProduct.name}
                  placeholder="Enter product name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  defaultValue={selectedProduct.description}
                  placeholder="Enter product description"
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast.info("Edit functionality needs to be implemented with proper form handling and API calls");
                  setIsEditModalOpen(false);
                }}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

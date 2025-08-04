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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Tag, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw,
  Package,
  Percent,
  Calendar,
  RotateCcw
} from "lucide-react";
import { 
  fetchAllPromotionsForAdminAction,
  createPromotionAction,
  updatePromotionAction,
  deletePromotionAction,
  restorePromotionAction
} from "@/actions/promotionActions";
import type { PromotionResponse, PromotionRequest } from "@/api-client/models";
import { useTranslations, useLocale } from "next-intl";
import { formatDate } from "@/lib/utils";

export default function PromotionsAdminPage() {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const [promotions, setPromotions] = useState<PromotionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<PromotionResponse | null>(null);
  const [formData, setFormData] = useState<PromotionRequest>({
    name: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: 0,
    startDate: "",
    endDate: "",
    isActive: true
  });

  // Load promotions on component mount
  useEffect(() => {
    loadPromotions(0);
  }, []);

  const loadPromotions = async (page: number) => {
    setLoading(true);
    try {
      const result = await fetchAllPromotionsForAdminAction(page, 20);
      if (result.success && result.data) {
        setPromotions(result.data.items || []);
        setTotalPages(result.data.totalPages || 0);
        setTotalElements(result.data.totalItems || 0);
        setCurrentPage(page);
      } else {
        toast.error(result.message || "Failed to load promotions");
      }
    } catch (error) {
      toast.error("Failed to load promotions");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadPromotions(currentPage);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      loadPromotions(newPage);
    }
  };

  const handleCreatePromotion = () => {
    setEditingPromotion(null);
    setFormData({
      name: "",
      description: "",
      discountType: "PERCENTAGE",
      discountValue: 0,
      startDate: "",
      endDate: "",
      isActive: true
    });
    setIsDialogOpen(true);
  };

  const handleEditPromotion = (promotion: PromotionResponse) => {
    setEditingPromotion(promotion);
    setFormData({
      name: promotion.name || "",
      description: promotion.description || "",
      discountType: promotion.discountType || "PERCENTAGE",
      discountValue: promotion.discountValue || 0,
      startDate: promotion.startDate || "",
      endDate: promotion.endDate || "",
      isActive: promotion.isActive ?? true
    });
    setIsDialogOpen(true);
  };

  const handleDeletePromotion = async (id: number) => {
    if (!confirm("Are you sure you want to delete this promotion?")) return;

    try {
      const result = await deletePromotionAction(id);
      if (result.success) {
        toast.success("Promotion deleted successfully");
        loadPromotions(currentPage);
      } else {
        toast.error(result.message || "Failed to delete promotion");
      }
    } catch (error) {
      toast.error("Failed to delete promotion");
    }
  };

  const handleRestorePromotion = async (id: number) => {
    try {
      const result = await restorePromotionAction(id);
      if (result.success) {
        toast.success("Promotion restored successfully");
        loadPromotions(currentPage);
      } else {
        toast.error(result.message || "Failed to restore promotion");
      }
    } catch (error) {
      toast.error("Failed to restore promotion");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPromotion) {
        const result = await updatePromotionAction(editingPromotion.id!, formData);
        if (result.success) {
          toast.success("Promotion updated successfully");
          setIsDialogOpen(false);
          loadPromotions(currentPage);
        } else {
          toast.error(result.message || "Failed to update promotion");
        }
      } else {
        const result = await createPromotionAction(formData);
        if (result.success) {
          toast.success("Promotion created successfully");
          setIsDialogOpen(false);
          loadPromotions(currentPage);
        } else {
          toast.error(result.message || "Failed to create promotion");
        }
      }
    } catch (error) {
      toast.error("Failed to save promotion");
    }
  };



  const isPromotionActive = (promotion: PromotionResponse) => {
    if (!promotion.isActive) return false;
    const now = new Date();
    const startDate = promotion.startDate ? new Date(promotion.startDate) : null;
    const endDate = promotion.endDate ? new Date(promotion.endDate) : null;
    
    if (startDate && now < startDate) return false;
    if (endDate && now > endDate) return false;
    return true;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Promotion Management</h1>
          <p className="text-muted-foreground">
            Manage discounts and promotional offers
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleCreatePromotion}>
            <Plus className="h-4 w-4 mr-2" />
            Add Promotion
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Promotions</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalElements}</div>
            <p className="text-xs text-muted-foreground">
              All promotional offers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Promotions</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {promotions.filter(p => isPromotionActive(p)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {promotions.filter(p => !isPromotionActive(p) && p.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Past end date
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disabled</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {promotions.filter(p => !p.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Manually disabled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Promotions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Promotional Offers
          </CardTitle>
          <CardDescription>
            List of all promotional offers and discounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : promotions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No promotions found</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promotions.map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell className="font-medium">
                        {promotion.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{promotion.name}</div>
                          {promotion.description && (
                            <div className="text-sm text-muted-foreground">
                              {promotion.description.length > 50 
                                ? `${promotion.description.substring(0, 50)}...`
                                : promotion.description
                              }
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {promotion.discountType === 'PERCENTAGE' 
                            ? `${promotion.discountValue}%`
                            : `$${promotion.discountValue}`
                          }
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{formatDate(promotion.startDate, locale, { year: 'numeric', month: 'short', day: 'numeric' })} -</div>
                          <div>{formatDate(promotion.endDate, locale, { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={isPromotionActive(promotion) ? 'default' : 'secondary'}
                        >
                          {isPromotionActive(promotion) ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(promotion.createdAt, locale, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPromotion(promotion)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {promotion.isActive ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => promotion.id && handleDeletePromotion(promotion.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => promotion.id && handleRestorePromotion(promotion.id)}
                              className="text-green-600 hover:text-green-600"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          )}
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
                    Showing {currentPage * 20 + 1} to {Math.min((currentPage + 1) * 20, totalElements)} of {totalElements} promotions
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

      {/* Create/Edit Promotion Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPromotion ? "Edit Promotion" : "Create New Promotion"}
            </DialogTitle>
            <DialogDescription>
              {editingPromotion 
                ? "Update the promotion information below."
                : "Add a new promotion to the system."
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                  placeholder="Promotion name"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="col-span-3"
                  placeholder="Promotion description"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discountType" className="text-right">
                  Type
                </Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value) => setFormData({ ...formData, discountType: value as any })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discountValue" className="text-right">
                  Value
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                  className="col-span-3"
                  placeholder="Discount value"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingPromotion ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

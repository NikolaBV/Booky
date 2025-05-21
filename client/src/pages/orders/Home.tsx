import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import agent from "../../api/agent";
import type {
  PurchaseOrder,
  AppUser,
  PurchaseOrderDTO,
} from "../../api/models";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { MoreHorizontal, PlusCircle, Search } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { useCurrentUser } from "../../hooks/useAuth";
import { toast } from "sonner";

export default function Orders() {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<PurchaseOrder | null>(null);
  const [formData, setFormData] = useState({
    id: 0,
    appUserId: 0,
    userName: "",
    orderDate: new Date().toISOString().split("T")[0],
    userEmail: "",
    totalAmount: "0",
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);

  // Search state
  const [searchParams, setSearchParams] = useState({
    username: "",
    startDate: "",
    endDate: "",
  });
  const [isSearching, setIsSearching] = useState(false);

  const { decodedToken } = useCurrentUser();

  // Regular query for all orders
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["ordersQuery"],
    queryFn: () => agent.orders.list(),
  });

  // Search query
  const { data: searchResults = [], refetch: searchOrders } = useQuery({
    queryKey: ["ordersSearchQuery"],
    queryFn: () =>
      agent.orders.search(
        searchParams.username,
        searchParams.startDate ? new Date(searchParams.startDate) : null,
        searchParams.endDate ? new Date(searchParams.endDate) : null
      ),
    enabled: false, // Disable automatic running
  });

  const createMutation = useMutation({
    mutationFn: (order: PurchaseOrderDTO) => agent.orders.create(order),
    onSuccess: () => {
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["ordersQuery"] });
      if (isSearching) {
        searchOrders();
      }
      toast.success("Order created successfully");
    },
    onError: () => {
      toast.error("Failed to create order");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (orderId: number) => agent.orders.delete(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordersQuery"] });
      if (isSearching) {
        searchOrders();
      }
      toast.success("Order deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete order");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (order: PurchaseOrder) => agent.orders.update(order.id, order),
    onSuccess: () => {
      setIsUpdateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["ordersQuery"] });
      if (isSearching) {
        searchOrders();
      }
      toast.success("Order updated successfully");
    },
    onError: () => {
      toast.error("Failed to update order");
    },
  });

  const handleCreateClick = () => {
    setFormData({
      id: 0,
      appUserId: 0,
      userName: "",
      userEmail: "",
      orderDate: new Date().toISOString().split("T")[0],
      totalAmount: "0",
    });
    setIsCreateDialogOpen(true);
  };

  const handleUpdateClick = (order: PurchaseOrder) => {
    setCurrentOrder(order);
    setFormData({
      id: order.id,
      appUserId: order.appUser.id,
      userName: order.appUser.username,
      userEmail: order.appUser.email,
      orderDate: new Date(order.orderDate).toISOString().split("T")[0],
      totalAmount: order.totalAmount.toString(),
    });
    setIsUpdateDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!decodedToken?.userId) {
      toast.error("User not authenticated");
      return;
    }

    const newOrder: PurchaseOrderDTO = {
      appUser: {
        id: decodedToken.userId,
        username: "",
        email: "",
      },
      orderDate: new Date(formData.orderDate),
      totalAmount: parseFloat(formData.totalAmount) || 0,
    };
    createMutation.mutate(newOrder);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentOrder) return;

    const updatedOrder = {
      id: currentOrder.id,
      appUser: currentOrder.appUser,
      orderDate: new Date(formData.orderDate),
      totalAmount: parseFloat(formData.totalAmount),
    };
    updateMutation.mutate(updatedOrder);
  };

  const handleDeleteClick = (orderId: number) => {
    setOrderToDelete(orderId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (orderToDelete !== null) {
      deleteMutation.mutate(orderToDelete);
      setOrderToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSearch = () => {
    if (
      !searchParams.username &&
      !searchParams.startDate &&
      !searchParams.endDate
    ) {
      toast.warning("Please enter at least one search criteria");
      return;
    }
    setIsSearching(true);
    searchOrders();
  };

  const handleClearSearch = () => {
    setIsSearching(false);
    setSearchParams({
      username: "",
      startDate: "",
      endDate: "",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading orders...
      </div>
    );
  }

  const displayedOrders = isSearching ? searchResults : orders;

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Orders Management</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex gap-2"
              onClick={handleCreateClick}
            >
              <PlusCircle className="h-4 w-4" />
              Add New Order
            </Button>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-6 p-4 border rounded-lg bg-card">
          <h2 className="text-lg font-semibold mb-4">Search Orders</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search-username">Customer Name</Label>
              <Input
                id="search-username"
                placeholder="Search by name..."
                value={searchParams.username}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    username: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="search-start-date">From Date</Label>
              <Input
                id="search-start-date"
                type="date"
                value={searchParams.startDate}
                max={
                  searchParams.endDate || new Date().toISOString().split("T")[0]
                }
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    startDate: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="search-end-date">To Date</Label>
              <Input
                id="search-end-date"
                type="date"
                value={searchParams.endDate}
                min={searchParams.startDate}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    endDate: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleSearch} className="flex gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
              {isSearching && (
                <Button variant="outline" onClick={handleClearSearch}>
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-md border">
          <Table>
            <TableCaption>
              {isSearching
                ? `Showing ${searchResults.length} search results`
                : "A list of your recent orders"}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead className="w-16">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedOrders.length > 0 ? (
                displayedOrders.map((order: PurchaseOrder) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.appUser.username}</TableCell>
                    <TableCell>{order.appUser.email}</TableCell>
                    <TableCell>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      ${order.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleUpdateClick(order)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => handleDeleteClick(order.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    {isSearching
                      ? "No orders match your search criteria"
                      : "No orders found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Create Order Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
              <DialogDescription>
                Fill in the details for the new order.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="orderDate" className="text-right">
                    Order Date
                  </Label>
                  <Input
                    id="orderDate"
                    name="orderDate"
                    type="date"
                    value={formData.orderDate}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="totalAmount" className="text-right">
                    Total Amount
                  </Label>
                  <Input
                    id="totalAmount"
                    name="totalAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.totalAmount}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Order"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Update Order Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Order</DialogTitle>
              <DialogDescription>
                Make changes to the order details below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="orderDate" className="text-right">
                    Order Date
                  </Label>
                  <Input
                    id="orderDate"
                    name="orderDate"
                    type="date"
                    value={formData.orderDate}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="totalAmount" className="text-right">
                    Total Amount
                  </Label>
                  <Input
                    id="totalAmount"
                    name="totalAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.totalAmount}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsUpdateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete this order?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The order will be permanently
                removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

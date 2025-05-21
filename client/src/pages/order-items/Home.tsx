import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import agent from "../../api/agent";
import type { OrderItem, PurchaseOrder, Product } from "../../api/models";
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
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export default function OrderItems() {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    orderId: 0,
    productId: 0,
    quantity: 1,
    priceAtPurchase: 0,
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderItemToDelete, setOrderItemToDelete] = useState<number | null>(
    null
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [orderIdSearch, setOrderIdSearch] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);

  const { data: orderItems = [], isLoading: orderItemsLoading } = useQuery({
    queryKey: ["orderItemsQuery"],
    queryFn: () => agent.orderItems.list(),
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["ordersQuery"],
    queryFn: () => agent.orders.list(),
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["productsQuery"],
    queryFn: () => agent.products.list(),
  });

  const { data: searchResults = [], refetch: searchOrderItems } = useQuery({
    queryKey: ["orderItemsSearchQuery"],
    queryFn: () =>
      agent.orderItems.search(
        searchTerm,
        orderIdSearch ? Number(orderIdSearch) : null
      ),
    enabled: false,
  });

  const createMutation = useMutation({
    mutationFn: (orderItem: Partial<OrderItem>) =>
      agent.orderItems.create(orderItem),
    onSuccess: () => {
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["orderItemsQuery"] });
      if (isSearching) {
        searchOrderItems();
      }
      toast.success("Order item created successfully");
    },
    onError: () => {
      toast.error("Failed to create order item");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (orderItemId: number) => agent.orderItems.delete(orderItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orderItemsQuery"] });
      if (isSearching) {
        searchOrderItems();
      }
      toast.success("Order item deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete order item");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; orderItem: Partial<OrderItem> }) =>
      agent.orderItems.update(data.id, data.orderItem),
    onSuccess: () => {
      setIsUpdateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["orderItemsQuery"] });
      if (isSearching) {
        searchOrderItems();
      }
      toast.success("Order item updated successfully");
    },
    onError: () => {
      toast.error("Failed to update order item");
    },
  });

  const handleCreateClick = () => {
    const defaultProduct = products.length > 0 ? products[0] : null;
    setFormData({
      id: 0,
      orderId: orders.length > 0 ? orders[0].id : 0,
      productId: defaultProduct?.id || 0,
      quantity: 1,
      priceAtPurchase: defaultProduct?.price || 0,
    });
    setIsCreateDialogOpen(true);
  };

  const handleUpdateClick = (orderItem: OrderItem) => {
    setFormData({
      id: orderItem.id,
      orderId: orderItem.order.id,
      productId: orderItem.product.id,
      quantity: orderItem.quantity,
      priceAtPurchase: orderItem.priceAtPurchase,
    });
    setIsUpdateDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number(value),
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    const numValue = Number(value);
    const updatedData = {
      ...formData,
      [name]: numValue,
    };

    // Update price when product changes
    if (name === "productId") {
      const selectedProduct = products.find((p) => p.id === numValue);
      updatedData.priceAtPurchase = selectedProduct?.price || 0;
    }

    setFormData(updatedData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderItemData = {
      orderId: formData.orderId,
      productId: formData.productId,
      quantity: formData.quantity,
      priceAtPurchase: formData.priceAtPurchase,
    };

    if (formData.id === 0) {
      createMutation.mutate(orderItemData);
    } else {
      updateMutation.mutate({ id: formData.id, orderItem: orderItemData });
    }
  };

  const handleDeleteClick = (orderItemId: number) => {
    setOrderItemToDelete(orderItemId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (orderItemToDelete !== null) {
      deleteMutation.mutate(orderItemToDelete);
      setOrderItemToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim() && !orderIdSearch) {
      toast.warning("Please enter a search term or order ID");
      return;
    }
    setIsSearching(true);
    searchOrderItems();
  };

  const handleClearSearch = () => {
    setIsSearching(false);
    setSearchTerm("");
    setOrderIdSearch("");
  };

  if (orderItemsLoading || ordersLoading || productsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading order items...
      </div>
    );
  }

  const displayedOrderItems = isSearching ? searchResults : orderItems;

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order Items Management</h1>
          <Button
            variant="outline"
            className="flex gap-2"
            onClick={handleCreateClick}
          >
            <PlusCircle className="h-4 w-4" />
            Add New Order Item
          </Button>
        </div>

        <div className="mb-6 p-4 border rounded-lg bg-card">
          <h2 className="text-lg font-semibold mb-4">Search Order Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="product-search">Product Name</Label>
              <Input
                id="product-search"
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="order-id-search">Order ID</Label>
              <Input
                id="order-id-search"
                type="number"
                placeholder="Search by order ID..."
                value={orderIdSearch}
                onChange={(e) => setOrderIdSearch(e.target.value)}
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

        <div className="rounded-md border">
          <Table>
            <TableCaption>
              {isSearching
                ? `Showing ${searchResults.length} search results`
                : "A list of your order items"}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead className="w-16">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedOrderItems.length > 0 ? (
                displayedOrderItems.map((orderItem: OrderItem) => (
                  <TableRow key={orderItem.id}>
                    <TableCell className="font-medium">
                      {orderItem.id}
                    </TableCell>
                    <TableCell>#{orderItem.order.id}</TableCell>
                    <TableCell>{orderItem.product.name}</TableCell>
                    <TableCell>{orderItem.quantity}</TableCell>
                    <TableCell>
                      ${orderItem.priceAtPurchase.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      $
                      {(orderItem.quantity * orderItem.priceAtPurchase).toFixed(
                        2
                      )}
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
                            onClick={() => handleUpdateClick(orderItem)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => handleDeleteClick(orderItem.id)}
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
                  <TableCell colSpan={7} className="text-center py-4">
                    {isSearching
                      ? "No order items match your search criteria"
                      : "No order items found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Order Item</DialogTitle>
              <DialogDescription>Add a new item to an order.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="orderId" className="text-right">
                    Order
                  </Label>
                  <Select
                    name="orderId"
                    value={formData.orderId.toString()}
                    onValueChange={(value) =>
                      handleSelectChange("orderId", value)
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select an order" />
                    </SelectTrigger>
                    <SelectContent>
                      {orders.map((order: PurchaseOrder) => (
                        <SelectItem key={order.id} value={order.id.toString()}>
                          Order #{order.id} - {order.appUser.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="productId" className="text-right">
                    Product
                  </Label>
                  <Select
                    name="productId"
                    value={formData.productId.toString()}
                    onValueChange={(value) =>
                      handleSelectChange("productId", value)
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product: Product) => (
                        <SelectItem
                          key={product.id}
                          value={product.id.toString()}
                        >
                          {product.name} (${product.price.toFixed(2)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priceAtPurchase" className="text-right">
                    Unit Price
                  </Label>
                  <Input
                    id="priceAtPurchase"
                    name="priceAtPurchase"
                    type="number"
                    step="0.01"
                    value={formData.priceAtPurchase}
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
                  {createMutation.isPending ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Order Item</DialogTitle>
              <DialogDescription>
                Make changes to the order item below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="orderId" className="text-right">
                    Order
                  </Label>
                  <Select
                    name="orderId"
                    value={formData.orderId.toString()}
                    onValueChange={(value) =>
                      handleSelectChange("orderId", value)
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select an order" />
                    </SelectTrigger>
                    <SelectContent>
                      {orders.map((order: PurchaseOrder) => (
                        <SelectItem key={order.id} value={order.id.toString()}>
                          Order #{order.id} - {order.appUser.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="productId" className="text-right">
                    Product
                  </Label>
                  <Select
                    name="productId"
                    value={formData.productId.toString()}
                    onValueChange={(value) =>
                      handleSelectChange("productId", value)
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product: Product) => (
                        <SelectItem
                          key={product.id}
                          value={product.id.toString()}
                        >
                          {product.name} (${product.price.toFixed(2)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priceAtPurchase" className="text-right">
                    Unit Price
                  </Label>
                  <Input
                    id="priceAtPurchase"
                    name="priceAtPurchase"
                    type="number"
                    step="0.01"
                    value={formData.priceAtPurchase}
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

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete this order item?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The order item will be permanently
                removed from the order.
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

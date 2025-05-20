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
import { MoreHorizontal, PlusCircle } from "lucide-react";
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

  const { decodedToken } = useCurrentUser();
  console.log(decodedToken);
  console.log(decodedToken);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["ordersQuery"],
    queryFn: () => agent.orders.list(),
  });

  const createMutation = useMutation({
    mutationFn: (order: PurchaseOrderDTO) => agent.orders.create(order),
    onSuccess: () => {
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["ordersQuery"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (orderId: number) => agent.orders.delete(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordersQuery"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (order: PurchaseOrder) => agent.orders.update(order.id, order),
    onSuccess: () => {
      setIsUpdateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["ordersQuery"] });
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

    const newOrder: PurchaseOrderDTO = {
      appUser: {
        id: decodedToken?.userId,
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

    if (!decodedToken?.userId) {
      toast.error("User not authenticated");
      return;
    }

    const updatedOrder = {
      id: formData.id,
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Orders Management</h1>
          <Button
            variant="outline"
            className="flex gap-2"
            onClick={handleCreateClick}
          >
            <PlusCircle className="h-4 w-4" />
            Add New Order
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableCaption>A list of your recent orders.</TableCaption>
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
              {orders.map((order: PurchaseOrder) => (
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
              ))}
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
                <Button type="submit">Create Order</Button>
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
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="totalAmount" className="text-right">
                    Total Amount
                  </Label>
                  <Input
                    id="totalAmount"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleInputChange}
                    className="col-span-3"
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
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        {isDeleteDialogOpen && (
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
                <AlertDialogAction onClick={confirmDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}

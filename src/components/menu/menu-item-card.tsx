import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  useUpdateMenuItem,
  useDeleteMenuItem
} from "@/hooks/use-menu-items";
import { type MenuItem } from "../../../shared/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatCurrency } from "@/lib/utils";
import { EditMenuItemDialog } from "./add-menu-item-dialog";
import { Switch } from "../ui/switch";

interface MenuItemCardProps {
  menuItem: MenuItem;
  restaurantId: number;
}

export function MenuItemCard({ menuItem, restaurantId }: MenuItemCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { toast } = useToast();
  const updateMenuItem = useUpdateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();

  const isAvailable = menuItem.status === "available";

  const toggleAvailability = async () => {
    try {
      await updateMenuItem.mutateAsync({
        id: menuItem.id,
        restaurantId,
        data: {
          ...menuItem,
          status: isAvailable ? "unavailable" : "available"
        }
      });
      toast({ title: "Success",description: `Item marked as ${isAvailable ? "unavailable" : "available"}` });
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to update item status", variant: "destructive"});
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMenuItem.mutateAsync({
        id: menuItem.id,
        restaurantId
      });

      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      });

      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete menu item",
        variant: "destructive",
      });
    }
  };

  // Get image based on dish type
  const getMenuItemImage = () => {
    switch (menuItem.dish_type) {
      case "main":
        return "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=400&q=80";
      case "side":
        return "https://potatorolls.com/wp-content/uploads/2020/06/Summer-Food-Drink-Pairing.jpg";
      case "chicken":
        return "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.tasteatlas.com%2Fimages%2Fsocial%2F733cd5be69a84534b648fca6ef98b2a2.jpg&f=1&nofb=1&ipt=ebf960f3047ba0696755ddec757cd31d6e7d9295ab494ebd9f65e4d1647df628";
      case "dessert":
        return "https://images.unsplash.com/photo-1587314168485-3236d6710381?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=400&q=80";
      case "drink":
        return "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=400&q=80";
      default:
        return "https://images.unsplash.com/photo-1546241072-48010ad2862c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=400&q=80";
    }
  };

  return (
    <>
      <Card className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
        <div className="relative h-48">
          <img
            src={getMenuItemImage()}
            alt={menuItem.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
          <div className="absolute top-0 right-0 p-2">
            <span className={`${isAvailable ? "bg-green-600" : "bg-destructive"} text-white text-xs font-semibold px-2 py-1 rounded-full`}>
              {isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-lg font-semibold">{menuItem.name}</h4>
            <span className="text-primary font-medium">
              {formatCurrency(menuItem.price)}
            </span>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            {menuItem.description || "No description available"}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs">Max: {menuItem.max_portion} portions</span>
            <div className="flex space-x-2">
              <div className="flex space-x-2 items-center">
                <Switch
                  checked={isAvailable}
                  onCheckedChange={toggleAvailability}
                  disabled={updateMenuItem.isPending}
                  aria-label={`Toggle availability for ${menuItem.name}`}
                />
                <span className="text-[8px] text-muted-foreground">
                  {updateMenuItem.isPending ? "Updating..." : isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <span className="material-icons text-muted-foreground hover:text-foreground">edit</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border">
                  <DropdownMenuItem
                    className="flex items-center cursor-pointer"
                    onClick={() => setIsEditDialogOpen(true)}
                  >
                    <span className="material-icons mr-2 text-secondary text-sm">edit</span>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center cursor-pointer"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <span className="material-icons mr-2 text-destructive text-sm">delete</span>
                    Delete
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem
                    className="flex items-center cursor-pointer"
                    onClick={toggleAvailability}
                  >
                    <span className={`material-icons mr-2 text-sm ${isAvailable ? "text-green-600" : "text-muted-foreground"}`}>
                      {isAvailable ? "toggle_on" : "toggle_off"}
                    </span>
                    {isAvailable ? "Mark Unavailable" : "Mark Available"}
                  </DropdownMenuItem> */}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{menuItem.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMenuItem.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit dialog */}
      <EditMenuItemDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        menuItem={menuItem}
        restaurantId={restaurantId}
      />
    </>
  );
}

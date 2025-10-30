import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// import { createInsertSchema, } from "drizzle-zod";
// import { menuItems } from "../../../shared/schema";
import { useCreateMenuItem, useUpdateMenuItem } from "@/hooks/use-menu-items";
import { useToast } from "@/hooks/use-toast";
import { type MenuItem } from "../../../shared/schema";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";


// Form validation schema
export const formSchema = z.object({
  name: z.string().min(2, {
    message: "Menu item name must be at least 2 characters.",
  }),
  price: z.coerce.number().min(0, {
    message: "Price must be at least 1.",
  }),
  max_portion: z.coerce.number().min(1, {
    message: "Maximum portions must be at least 1.",
  }),
  dish_type: z.enum(["main", "side", "dessert", "drink", "chicken"], {
    required_error: "Please select a dish type.",
  }),
  status: z.enum(["available", "unavailable"]).default("available"),

  description: z.string().optional(),
});

export type FormData = z.infer<typeof formSchema>;


interface AddMenuItemDialogProps {
  restaurantId: number;
}

export function AddMenuItemDialog({ restaurantId }: AddMenuItemDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createMenuItem = useCreateMenuItem();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema as any),   
    defaultValues: {
      name: "",
      price: 0,
      max_portion: 10,
      dish_type: "main",
      description: "",
      status: "available",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createMenuItem.mutateAsync({
        restaurantId,
        data: {
          ...data,
          restaurant_id: restaurantId
        }
      });
      toast({
        title: "Success",
        description: "Menu item added successfully",
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
        >
          <span className="material-icons mr-2">add</span>
          <span>Menu Item</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background border-border text-foreground sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add Menu Item</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill in the details to add a new menu item
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Item Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter menu item name" 
                      className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Price (₦)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter price" 
                        className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="max_portion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Max Portions</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Max available" 
                        className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="dish_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Dish Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-muted border-border text-foreground">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="main">Main Dish</SelectItem>
                      <SelectItem value="side">Side Dish</SelectItem>
                      <SelectItem value="chicken">Chicken Dish</SelectItem>
                      <SelectItem value="dessert">Dessert</SelectItem>
                      <SelectItem value="drink">Drink</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter item description" 
                      className="bg-muted border-border text-foreground placeholder:text-muted-foreground resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-foreground">Availability</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Item will be {field.value === "available" ? "shown as available" : "marked as unavailable"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value === "available"}
                      onCheckedChange={(checked) => 
                        field.onChange(checked ? "available" : "unavailable")
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="border-border text-foreground"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createMenuItem.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {createMenuItem.isPending ? "Adding..." : "Add Item"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface EditMenuItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuItem: MenuItem;
  restaurantId: number;
}

export function EditMenuItemDialog({ open, onOpenChange, menuItem, restaurantId }: EditMenuItemDialogProps) {
  const { toast } = useToast();
  const updateMenuItem = useUpdateMenuItem();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      name: menuItem.name,
      price: menuItem.price,
      max_portion: menuItem.max_portion ?? 0,
      dish_type: menuItem.dish_type as "main" | "side" | "dessert" | "drink" | "chicken",
      description: menuItem.description || "",
      status: menuItem.status as "available" | "unavailable",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await updateMenuItem.mutateAsync({
        id: menuItem.id,
        restaurantId,
        data
      });
      toast({
        title: "Success",
        description: "Menu item updated successfully",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border text-foreground sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Menu Item</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update the details of this menu item
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Item Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter menu item name" 
                      className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Price (₦)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter price" 
                        className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="max_portion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Max Portions</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Max available" 
                        className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="dish_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Dish Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-muted border-border text-foreground">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="main">Main Dish</SelectItem>
                      <SelectItem value="side">Side Dish</SelectItem>
                      <SelectItem value="chicken">Chicken Dish</SelectItem>
                      <SelectItem value="dessert">Dessert</SelectItem>
                      <SelectItem value="drink">Drink</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter item description" 
                      className="bg-muted border-border text-foreground placeholder:text-muted-foreground resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-foreground">Availability</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Item will be {field.value === "available" ? "shown as available" : "marked as unavailable"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value === "available"}
                      onCheckedChange={(checked) => 
                        field.onChange(checked ? "available" : "unavailable")
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="border-border text-foreground"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updateMenuItem.isPending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {updateMenuItem.isPending ? "Updating..." : "Update Item"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

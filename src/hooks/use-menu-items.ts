import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { ApiResponse, MenuItemResponse, MenuItemsResponse } from "@/lib/types";
import { api } from "@/services/api";
import { InsertMenuItem, UpdateMenuItem } from "../../shared/schema";

// Hook to fetch menu items for a restaurant
export function useMenuItems(restaurantId: number) {
  return useQuery<MenuItemsResponse, Error>({
    queryKey: ['/restaurant', restaurantId, 'menu'],
    queryFn: () => api.getMenuItems(restaurantId),
    enabled: !!restaurantId,
  });
}

// Hook to fetch a single menu item
export function useMenuItem(id: number) {
  return useQuery<MenuItemResponse, Error>({
    queryKey: ['/menu', id],
    queryFn: () => api.getMenuItem(id),
    enabled: !!id,
  });
}

// Hook to create a new menu item
export function useCreateMenuItem() {
  return useMutation<MenuItemResponse, Error, { restaurantId: number, data: InsertMenuItem }>({
    mutationFn: ({ restaurantId, data }) => api.createMenuItem(restaurantId, data),
    onSuccess: (_, variables) => {
      // Invalidate restaurant menu cache to refetch
      queryClient.invalidateQueries({ queryKey: ['/restaurant', variables.restaurantId, 'menu'] });
    }
  });
}

// Hook to update a menu item
export function useUpdateMenuItem() {
  return useMutation<ApiResponse<void>, Error, { id: number, restaurantId: number, data: UpdateMenuItem }>({
    mutationFn: ({ id, data }) => api.updateMenuItem(id, data),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/menu', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['/restaurant', variables.restaurantId, 'menu'] });
    }
  });
}

// Hook to delete a menu item
export function useDeleteMenuItem() {
  return useMutation<ApiResponse<void>, Error, { id: number, restaurantId: number }>({
    mutationFn: ({ id }) => api.deleteMenuItem(id),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/restaurant', variables.restaurantId, 'menu'] });
    }
  });
}
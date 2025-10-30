import {
  pgTable,
  text,
  serial,
  integer,
  // boolean,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
// import { z } from "zod";

// Restaurant model
export const restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const insertRestaurantSchema = createInsertSchema(restaurants).pick({
  name: true,
  description: true,
});

// Menu item model
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  max_portion: integer("max_portion").default(10),
  dish_type: varchar("dish_type", { length: 20 }).notNull().default("main"),
  status: varchar("status", { length: 20 }).notNull().default("available"),
  description: text("description"),
  restaurant_id: integer("restaurant_id").notNull(),
});

export const insertMenuItemSchema = createInsertSchema(menuItems).pick({
  name: true,
  price: true,
  max_portion: true,
  dish_type: true,
  status: true,
  description: true,
  restaurant_id: true,
});

export const updateMenuItemSchema = createInsertSchema(menuItems).partial();

export interface Restaurant {
  id: number;
  name: string;
  plate_price: number;
  delivery_fee: number;
  description: string | null;
}

export interface InsertRestaurant {
  name: string;
  description?: string | null;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  max_portion: number | null;
  dish_type: string;
  status: string;
  description: string | null;
  restaurant_id: number;
}

export interface InsertMenuItem {
  name: string;
  price: number;
  max_portion?: number | null;
  dish_type?: string;
  status?: string;
  description?: string | null;
  restaurant_id: number;
}

export interface UpdateMenuItem {
  id?: number;
  name?: string;
  price?: number;
  max_portion?: number | null;
  dish_type?: string;
  status?: string;
  description?: string | null;
  restaurant_id?: number;
}

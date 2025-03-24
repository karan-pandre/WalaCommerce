import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  pincode: text("pincode"),
  role: text("role").default("customer"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true
});

// Retailer Model
export const retailers = pgTable("retailers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  businessName: text("business_name").notNull(),
  businessType: text("business_type").notNull(),
  gstNumber: text("gst_number"),
  panNumber: text("pan_number"),
  businessAddress: text("business_address").notNull(),
  businessCity: text("business_city").notNull(),
  businessPincode: text("business_pincode").notNull(),
  businessPhone: text("business_phone").notNull(),
  verificationStatus: text("verification_status").default("pending"),
  verificationDocuments: jsonb("verification_documents"),
  registrationDate: timestamp("registration_date").notNull().defaultNow(),
});

export const insertRetailerSchema = createInsertSchema(retailers).omit({
  id: true,
  registrationDate: true
});

// Category Model
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  description: text("description"),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true
});

// Product Model
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  mrp: real("mrp").notNull(),
  image: text("image").notNull(),
  unitValue: real("unit_value").notNull(),
  unitType: text("unit_type").notNull(),
  categoryId: integer("category_id").notNull(),
  stock: integer("stock").notNull().default(0),
  isPopular: boolean("is_popular").default(false),
  isNewArrival: boolean("is_new_arrival").default(false),
  discount: integer("discount"),
  isBestSeller: boolean("is_best_seller").default(false),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true
});

// Order Model
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  items: jsonb("items").notNull(),
  totalAmount: real("total_amount").notNull(),
  status: text("status").notNull().default("pending"),
  address: text("address").notNull(),
  paymentMethod: text("payment_method").notNull(),
  deliveryFee: real("delivery_fee").notNull(),
  platformFee: real("platform_fee").notNull(),
  orderDate: timestamp("order_date").notNull().defaultNow(),
  expectedDelivery: text("expected_delivery").notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderDate: true
});

// Cart Item Schema (for JSON storage)
export const cartItemSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(1),
  price: z.number(),
  name: z.string(),
  image: z.string(),
  unitValue: z.number(),
  unitType: z.string(),
});

// Order Item Schema (for JSON storage)
export const orderItemSchema = cartItemSchema;

// Retailer Order Model
export const retailerOrders = pgTable("retailer_orders", {
  id: serial("id").primaryKey(),
  retailerId: integer("retailer_id").notNull(),
  items: jsonb("items").notNull(),
  totalAmount: real("total_amount").notNull(),
  status: text("status").notNull().default("pending"),
  deliveryAddress: text("delivery_address").notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentStatus: text("payment_status").default("pending"),
  notes: text("notes"),
  orderDate: timestamp("order_date").notNull().defaultNow(),
  expectedDelivery: text("expected_delivery"),
  bulkOrderDiscount: real("bulk_order_discount").default(0),
});

export const insertRetailerOrderSchema = createInsertSchema(retailerOrders).omit({
  id: true,
  orderDate: true
});

// Retailer Verification Document Schema
export const verificationDocumentSchema = z.object({
  documentType: z.enum(["gst_certificate", "pan_card", "business_license", "owner_id", "other"]),
  documentName: z.string(),
  documentUrl: z.string(),
  uploadDate: z.date().optional(),
  verificationStatus: z.enum(["pending", "verified", "rejected"]).default("pending"),
  rejectionReason: z.string().optional(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertRetailer = z.infer<typeof insertRetailerSchema>;
export type Retailer = typeof retailers.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertRetailerOrder = z.infer<typeof insertRetailerOrderSchema>;
export type RetailerOrder = typeof retailerOrders.$inferSelect;

export type CartItem = z.infer<typeof cartItemSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type VerificationDocument = z.infer<typeof verificationDocumentSchema>;

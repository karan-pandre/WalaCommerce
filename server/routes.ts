import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertOrderSchema, 
  cartItemSchema,
  orderItemSchema,
  insertProductSchema,
  insertCategorySchema,
  insertRetailerSchema,
  insertRetailerOrderSchema,
  verificationDocumentSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // API route prefix
  const apiRouter = "/api";

  // Categories
  app.get(`${apiRouter}/categories`, async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get(`${apiRouter}/categories/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const category = await storage.getCategoryById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  app.post(`${apiRouter}/categories`, async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Products
  app.get(`${apiRouter}/products`, async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const query = req.query.search as string | undefined;
      
      let products;
      
      if (categoryId) {
        products = await storage.getProductsByCategory(categoryId);
      } else if (query) {
        products = await storage.searchProducts(query);
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get(`${apiRouter}/products/popular`, async (req, res) => {
    try {
      const products = await storage.getPopularProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch popular products" });
    }
  });

  app.get(`${apiRouter}/products/new`, async (req, res) => {
    try {
      const products = await storage.getNewArrivals();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch new arrivals" });
    }
  });

  app.get(`${apiRouter}/products/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post(`${apiRouter}/products`, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.patch(`${apiRouter}/products/:id/stock`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const stockSchema = z.object({
        stock: z.number().int().nonnegative()
      });
      
      const { stock } = stockSchema.parse(req.body);
      
      const updatedProduct = await storage.updateProductStock(id, stock);
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid stock data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product stock" });
    }
  });

  // Users
  app.post(`${apiRouter}/users/register`, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      const userWithoutPassword = { ...user, password: undefined };
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post(`${apiRouter}/users/login`, async (req, res) => {
    try {
      const loginSchema = z.object({
        username: z.string(),
        password: z.string()
      });
      
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      const userWithoutPassword = { ...user, password: undefined };
      
      // In a real app, this would set a session or return a token
      res.json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid login data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to login" });
    }
  });

  app.get(`${apiRouter}/users/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const userWithoutPassword = { ...user, password: undefined };
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch(`${apiRouter}/users/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const updateUserSchema = insertUserSchema.partial();
      const userData = updateUserSchema.parse(req.body);
      
      const updatedUser = await storage.updateUser(id, userData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const userWithoutPassword = { ...updatedUser, password: undefined };
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Orders
  app.post(`${apiRouter}/orders`, async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      
      // Validate cart items
      const itemsSchema = z.array(orderItemSchema);
      itemsSchema.parse(orderData.items);
      
      // Check for product stock
      for (const item of orderData.items) {
        const product = await storage.getProductById(item.productId);
        if (!product) {
          return res.status(400).json({ 
            message: `Product with id ${item.productId} not found` 
          });
        }
        
        if (product.stock < item.quantity) {
          return res.status(400).json({ 
            message: `Not enough stock for ${product.name}. Available: ${product.stock}` 
          });
        }
        
        // Update the stock
        await storage.updateProductStock(product.id, product.stock - item.quantity);
      }
      
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get(`${apiRouter}/orders/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const order = await storage.getOrderById(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.get(`${apiRouter}/users/:userId/orders`, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const orders = await storage.getOrdersByUserId(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.patch(`${apiRouter}/orders/:id/status`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const statusSchema = z.object({
        status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"])
      });
      
      const { status } = statusSchema.parse(req.body);
      
      const updatedOrder = await storage.updateOrderStatus(id, status);
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid status data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Retailer routes
  app.post(`${apiRouter}/retailers/register`, async (req, res) => {
    try {
      // Verify the user exists first
      const userId = parseInt(req.body.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if retailer account already exists for this user
      const existingRetailer = await storage.getRetailerByUserId(userId);
      if (existingRetailer) {
        return res.status(409).json({ message: "Retailer account already exists for this user" });
      }

      // Create the retailer account
      const retailerData = insertRetailerSchema.parse(req.body);
      const retailer = await storage.createRetailer(retailerData);

      // Update the user's role
      await storage.updateUser(userId, { role: "retailer" });

      res.status(201).json(retailer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid retailer data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to register retailer" });
    }
  });

  app.get(`${apiRouter}/retailers/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid retailer ID" });
      }
      
      const retailer = await storage.getRetailer(id);
      if (!retailer) {
        return res.status(404).json({ message: "Retailer not found" });
      }
      
      res.json(retailer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch retailer" });
    }
  });

  app.get(`${apiRouter}/users/:userId/retailer`, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const retailer = await storage.getRetailerByUserId(userId);
      if (!retailer) {
        return res.status(404).json({ message: "Retailer account not found for this user" });
      }
      
      res.json(retailer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch retailer" });
    }
  });

  app.patch(`${apiRouter}/retailers/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid retailer ID" });
      }
      
      const updateRetailerSchema = insertRetailerSchema.partial();
      const retailerData = updateRetailerSchema.parse(req.body);
      
      const updatedRetailer = await storage.updateRetailer(id, retailerData);
      if (!updatedRetailer) {
        return res.status(404).json({ message: "Retailer not found" });
      }
      
      res.json(updatedRetailer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid retailer data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update retailer" });
    }
  });

  app.post(`${apiRouter}/retailers/:id/documents`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid retailer ID" });
      }
      
      const documentData = verificationDocumentSchema.parse(req.body);
      
      const retailer = await storage.addVerificationDocument(id, documentData);
      if (!retailer) {
        return res.status(404).json({ message: "Retailer not found" });
      }
      
      res.status(201).json(retailer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid document data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add verification document" });
    }
  });

  app.patch(`${apiRouter}/retailers/:id/verification`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid retailer ID" });
      }
      
      const statusSchema = z.object({
        status: z.enum(["pending", "verified", "rejected"])
      });
      
      const { status } = statusSchema.parse(req.body);
      
      const updatedRetailer = await storage.updateRetailerVerificationStatus(id, status);
      if (!updatedRetailer) {
        return res.status(404).json({ message: "Retailer not found" });
      }
      
      res.json(updatedRetailer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid status data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update verification status" });
    }
  });

  app.get(`${apiRouter}/retailers/pending`, async (req, res) => {
    try {
      const retailers = await storage.getPendingVerificationRetailers();
      res.json(retailers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending retailers" });
    }
  });

  app.get(`${apiRouter}/retailers/verified`, async (req, res) => {
    try {
      const retailers = await storage.getVerifiedRetailers();
      res.json(retailers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch verified retailers" });
    }
  });

  // Retailer Orders
  app.post(`${apiRouter}/retailer-orders`, async (req, res) => {
    try {
      const orderData = insertRetailerOrderSchema.parse(req.body);
      
      // Validate items
      const itemsSchema = z.array(orderItemSchema);
      itemsSchema.parse(orderData.items);
      
      // Verify retailer exists and is verified
      const retailer = await storage.getRetailer(orderData.retailerId);
      if (!retailer) {
        return res.status(404).json({ message: "Retailer not found" });
      }
      
      if (retailer.verificationStatus !== "verified") {
        return res.status(403).json({ 
          message: "Retailer account is not verified. Current status: " + retailer.verificationStatus 
        });
      }
      
      // Check for product stock
      for (const item of orderData.items) {
        const product = await storage.getProductById(item.productId);
        if (!product) {
          return res.status(400).json({ 
            message: `Product with id ${item.productId} not found` 
          });
        }
        
        if (product.stock < item.quantity) {
          return res.status(400).json({ 
            message: `Not enough stock for ${product.name}. Available: ${product.stock}` 
          });
        }
        
        // Update the stock
        await storage.updateProductStock(product.id, product.stock - item.quantity);
      }
      
      const order = await storage.createRetailerOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create retailer order" });
    }
  });

  app.get(`${apiRouter}/retailer-orders/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const order = await storage.getRetailerOrderById(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch retailer order" });
    }
  });

  app.get(`${apiRouter}/retailers/:retailerId/orders`, async (req, res) => {
    try {
      const retailerId = parseInt(req.params.retailerId);
      if (isNaN(retailerId)) {
        return res.status(400).json({ message: "Invalid retailer ID" });
      }
      
      const orders = await storage.getRetailerOrdersByRetailerId(retailerId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch retailer orders" });
    }
  });

  app.patch(`${apiRouter}/retailer-orders/:id/status`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const statusSchema = z.object({
        status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"])
      });
      
      const { status } = statusSchema.parse(req.body);
      
      const updatedOrder = await storage.updateRetailerOrderStatus(id, status);
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid status data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  app.patch(`${apiRouter}/retailer-orders/:id/payment-status`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const statusSchema = z.object({
        status: z.enum(["pending", "paid", "failed", "refunded", "partial"])
      });
      
      const { status } = statusSchema.parse(req.body);
      
      const updatedOrder = await storage.updateRetailerOrderPaymentStatus(id, status);
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid status data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update payment status" });
    }
  });

  return httpServer;
}

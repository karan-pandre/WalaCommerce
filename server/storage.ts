import { 
  User, InsertUser, 
  Category, InsertCategory, 
  Product, InsertProduct,
  Order, InsertOrder,
  Retailer, InsertRetailer,
  RetailerOrder, InsertRetailerOrder,
  VerificationDocument,
  users, categories, products, orders, retailers, retailerOrders
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;

  // Retailer methods
  getRetailer(id: number): Promise<Retailer | undefined>;
  getRetailerByUserId(userId: number): Promise<Retailer | undefined>;
  createRetailer(retailer: InsertRetailer): Promise<Retailer>;
  updateRetailer(id: number, retailerData: Partial<InsertRetailer>): Promise<Retailer | undefined>;
  updateRetailerVerificationStatus(id: number, status: string): Promise<Retailer | undefined>;
  getPendingVerificationRetailers(): Promise<Retailer[]>;
  getVerifiedRetailers(): Promise<Retailer[]>;
  addVerificationDocument(retailerId: number, document: VerificationDocument): Promise<Retailer | undefined>;

  // Category methods
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Product methods
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getPopularProducts(): Promise<Product[]>;
  getNewArrivals(): Promise<Product[]>;
  updateProductStock(id: number, newStock: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  searchProducts(query: string): Promise<Product[]>;

  // Order methods
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(id: number): Promise<Order | undefined>;
  getOrdersByUserId(userId: number): Promise<Order[]>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Retailer Order methods
  createRetailerOrder(order: InsertRetailerOrder): Promise<RetailerOrder>;
  getRetailerOrderById(id: number): Promise<RetailerOrder | undefined>;
  getRetailerOrdersByRetailerId(retailerId: number): Promise<RetailerOrder[]>;
  updateRetailerOrderStatus(id: number, status: string): Promise<RetailerOrder | undefined>;
  updateRetailerOrderPaymentStatus(id: number, status: string): Promise<RetailerOrder | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private retailers: Map<number, Retailer>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private retailerOrders: Map<number, RetailerOrder>;

  private userId: number;
  private retailerId: number;
  private categoryId: number;
  private productId: number;
  private orderId: number;
  private retailerOrderId: number;

  constructor() {
    this.users = new Map();
    this.retailers = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.retailerOrders = new Map();

    this.userId = 1;
    this.retailerId = 1;
    this.categoryId = 1;
    this.productId = 1;
    this.orderId = 1;
    this.retailerOrderId = 1;

    // Seed initial data
    this.seedData();
  }
  
  // Retailer methods
  async getRetailer(id: number): Promise<Retailer | undefined> {
    return this.retailers.get(id);
  }

  async getRetailerByUserId(userId: number): Promise<Retailer | undefined> {
    return Array.from(this.retailers.values()).find(
      (retailer) => retailer.userId === userId
    );
  }

  async createRetailer(insertRetailer: InsertRetailer): Promise<Retailer> {
    const id = this.retailerId++;
    const retailer: Retailer = { 
      ...insertRetailer, 
      id, 
      verificationStatus: "pending", 
      registrationDate: new Date(),
      verificationDocuments: insertRetailer.verificationDocuments || []
    };
    this.retailers.set(id, retailer);
    return retailer;
  }

  async updateRetailer(id: number, retailerData: Partial<InsertRetailer>): Promise<Retailer | undefined> {
    const retailer = await this.getRetailer(id);
    if (!retailer) return undefined;

    const updatedRetailer = { ...retailer, ...retailerData };
    this.retailers.set(id, updatedRetailer);
    return updatedRetailer;
  }

  async updateRetailerVerificationStatus(id: number, status: string): Promise<Retailer | undefined> {
    const retailer = await this.getRetailer(id);
    if (!retailer) return undefined;

    const updatedRetailer = { ...retailer, verificationStatus: status };
    this.retailers.set(id, updatedRetailer);
    return updatedRetailer;
  }

  async getPendingVerificationRetailers(): Promise<Retailer[]> {
    return Array.from(this.retailers.values()).filter(
      (retailer) => retailer.verificationStatus === "pending"
    );
  }

  async getVerifiedRetailers(): Promise<Retailer[]> {
    return Array.from(this.retailers.values()).filter(
      (retailer) => retailer.verificationStatus === "verified"
    );
  }

  async addVerificationDocument(retailerId: number, document: VerificationDocument): Promise<Retailer | undefined> {
    const retailer = await this.getRetailer(retailerId);
    if (!retailer) return undefined;

    const documents = Array.isArray(retailer.verificationDocuments) 
      ? [...retailer.verificationDocuments, document] 
      : [document];

    const updatedRetailer = { 
      ...retailer, 
      verificationDocuments: documents
    };
    
    this.retailers.set(retailerId, updatedRetailer);
    return updatedRetailer;
  }
  
  // Retailer Order methods
  async createRetailerOrder(insertOrder: InsertRetailerOrder): Promise<RetailerOrder> {
    const id = this.retailerOrderId++;
    const orderDate = new Date();
    const order: RetailerOrder = { 
      ...insertOrder, 
      id, 
      orderDate, 
      status: insertOrder.status || "pending",
      paymentStatus: insertOrder.paymentStatus || "pending"
    };
    this.retailerOrders.set(id, order);
    return order;
  }

  async getRetailerOrderById(id: number): Promise<RetailerOrder | undefined> {
    return this.retailerOrders.get(id);
  }

  async getRetailerOrdersByRetailerId(retailerId: number): Promise<RetailerOrder[]> {
    return Array.from(this.retailerOrders.values()).filter(
      (order) => order.retailerId === retailerId
    );
  }

  async updateRetailerOrderStatus(id: number, status: string): Promise<RetailerOrder | undefined> {
    const order = await this.getRetailerOrderById(id);
    if (!order) return undefined;

    const updatedOrder = { ...order, status };
    this.retailerOrders.set(id, updatedOrder);
    return updatedOrder;
  }

  async updateRetailerOrderPaymentStatus(id: number, status: string): Promise<RetailerOrder | undefined> {
    const order = await this.getRetailerOrderById(id);
    if (!order) return undefined;

    const updatedOrder = { ...order, paymentStatus: status };
    this.retailerOrders.set(id, updatedOrder);
    return updatedOrder;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.categoryId === categoryId
    );
  }

  async getPopularProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.isPopular
    );
  }

  async getNewArrivals(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.isNewArrival
    );
  }

  async updateProductStock(id: number, newStock: number): Promise<Product | undefined> {
    const product = await this.getProductById(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, stock: newStock };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) => 
        product.name.toLowerCase().includes(lowercaseQuery) || 
        (product.description && product.description.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Order methods
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.orderId++;
    const orderDate = new Date();
    const order: Order = { ...insertOrder, id, orderDate };
    this.orders.set(id, order);
    return order;
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = await this.getOrderById(id);
    if (!order) return undefined;

    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Seed data for development
  private seedData() {
    // Seed categories
    const categories: InsertCategory[] = [
      {
        name: "Dairy",
        image: "https://cdn-icons-png.flaticon.com/512/2153/2153788.png",
        description: "Fresh dairy products"
      },
      {
        name: "Fruits",
        image: "https://cdn-icons-png.flaticon.com/512/3082/3082025.png",
        description: "Fresh fruits"
      },
      {
        name: "Vegetables",
        image: "https://cdn-icons-png.flaticon.com/512/2153/2153786.png",
        description: "Fresh vegetables"
      },
      {
        name: "Bakery",
        image: "https://cdn-icons-png.flaticon.com/512/2716/2716467.png",
        description: "Fresh bakery products"
      },
      {
        name: "Snacks",
        image: "https://cdn-icons-png.flaticon.com/512/2553/2553691.png",
        description: "Tasty snacks"
      },
      {
        name: "Beverages",
        image: "https://cdn-icons-png.flaticon.com/512/3050/3050153.png",
        description: "Refreshing beverages"
      },
      {
        name: "Household",
        image: "https://cdn-icons-png.flaticon.com/512/3082/3082054.png",
        description: "Household essentials"
      },
      {
        name: "Personal Care",
        image: "https://cdn-icons-png.flaticon.com/512/6134/6134187.png",
        description: "Personal care products"
      }
    ];

    categories.forEach(category => {
      this.createCategory(category);
    });

    // Seed products
    const products: InsertProduct[] = [
      {
        name: "Organic Milk",
        description: "Fresh organic milk from grass-fed cows",
        price: 45,
        mrp: 55,
        image: "https://images.unsplash.com/photo-1633575331244-ef7a8ebe6338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
        unitValue: 500,
        unitType: "ml",
        categoryId: 1,
        stock: 50,
        isPopular: true,
        isNewArrival: false,
        discount: 18,
        isBestSeller: true
      },
      {
        name: "Free Range Eggs",
        description: "Farm fresh free-range eggs",
        price: 60,
        mrp: 60,
        image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
        unitValue: 6,
        unitType: "pcs",
        categoryId: 1,
        stock: 40,
        isPopular: true,
        isNewArrival: false,
        discount: 0,
        isBestSeller: false
      },
      {
        name: "Whole Wheat Bread",
        description: "Freshly baked whole wheat bread",
        price: 35,
        mrp: 40,
        image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
        unitValue: 400,
        unitType: "g",
        categoryId: 4,
        stock: 30,
        isPopular: true,
        isNewArrival: false,
        discount: 12.5,
        isBestSeller: false
      },
      {
        name: "Fresh Bananas",
        description: "Sweet and ripe bananas",
        price: 70,
        mrp: 70,
        image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
        unitValue: 12,
        unitType: "pcs",
        categoryId: 2,
        stock: 2,
        isPopular: true,
        isNewArrival: false,
        discount: 0,
        isBestSeller: false
      },
      {
        name: "Ripe Avocado",
        description: "Perfectly ripe avocados",
        price: 80,
        mrp: 80,
        image: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
        unitValue: 1,
        unitType: "pc",
        categoryId: 2,
        stock: 20,
        isPopular: false,
        isNewArrival: true,
        discount: 0,
        isBestSeller: false
      },
      {
        name: "Fresh Blueberries",
        description: "Sweet and juicy blueberries",
        price: 120,
        mrp: 150,
        image: "https://images.unsplash.com/photo-1579636858710-2a22e5e4b957?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
        unitValue: 125,
        unitType: "g",
        categoryId: 2,
        stock: 15,
        isPopular: false,
        isNewArrival: true,
        discount: 20,
        isBestSeller: false
      },
      {
        name: "Cherry Tomatoes",
        description: "Sweet and tangy cherry tomatoes",
        price: 60,
        mrp: 60,
        image: "https://images.unsplash.com/photo-1578281644399-8ba21beeb8a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
        unitValue: 500,
        unitType: "g",
        categoryId: 3,
        stock: 25,
        isPopular: false,
        isNewArrival: true,
        discount: 0,
        isBestSeller: false
      },
      {
        name: "Greek Yogurt",
        description: "Creamy Greek yogurt",
        price: 90,
        mrp: 110,
        image: "https://images.unsplash.com/photo-1546630392-db5b1f8277fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
        unitValue: 400,
        unitType: "g",
        categoryId: 1,
        stock: 35,
        isPopular: false,
        isNewArrival: true,
        discount: 18,
        isBestSeller: false
      }
    ];

    products.forEach(product => {
      this.createProduct(product);
    });
  }
}

export const storage = new MemStorage();

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Store, Package, FileCheck, ShoppingBag, Clock, Truck, Check, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Product, CartItem, Category } from '@shared/schema';

// Component for business verification form
const BusinessVerificationForm = () => {
  const { user, registerAsRetailer } = useAuth();
  const [location, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    businessName: z.string().min(2, { message: "Business name must be at least 2 characters" }),
    businessType: z.string().min(2, { message: "Business type is required" }),
    gstNumber: z.string().min(15, { message: "Please enter a valid GST number" }).max(15),
    panNumber: z.string().min(10, { message: "Please enter a valid PAN number" }).max(10),
    businessAddress: z.string().min(5, { message: "Address must be at least 5 characters" }),
    businessCity: z.string().min(2, { message: "City is required" }),
    businessPincode: z.string().min(6, { message: "Please enter a valid pincode" }).max(6),
    businessPhone: z.string().min(10, { message: "Please enter a valid phone number" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      businessType: "",
      gstNumber: "",
      panNumber: "",
      businessAddress: "",
      businessCity: "",
      businessPincode: "",
      businessPhone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const success = await registerAsRetailer({
        ...values,
        userId: user?.id,
      });
      
      if (success) {
        setLocation('/retailer/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-2xl">Business Verification</CardTitle>
        <CardDescription>
          Please provide your business details for verification. Once verified, you'll be able to order products in bulk.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Business Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="retailer">Retailer</SelectItem>
                        <SelectItem value="wholesaler">Wholesaler</SelectItem>
                        <SelectItem value="distributor">Distributor</SelectItem>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="hotel">Hotel</SelectItem>
                        <SelectItem value="supermarket">Supermarket</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="gstNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST Number</FormLabel>
                    <FormControl>
                      <Input placeholder="22AAAAA0000A1Z5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="panNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PAN Number</FormLabel>
                    <FormControl>
                      <Input placeholder="ABCDE1234F" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="businessAddress"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Business Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your complete business address" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="businessCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Bangalore" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="businessPincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input placeholder="560001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="businessPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormDescription>
              You'll need to upload verification documents after this step. Documents will be reviewed by our team.
            </FormDescription>
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting
                </>
              ) : (
                "Submit for Verification"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

// Component for uploading verification documents
const DocumentUpload = () => {
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-2xl">Upload Documents</CardTitle>
        <CardDescription>
          Please upload the required documents for business verification
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-6 border-2 border-dashed rounded-md text-center">
            <FileCheck className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">GST Certificate</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Drag and drop your GST Certificate here, or click to browse
            </p>
            <Button variant="outline" className="mt-4">
              Upload Document
            </Button>
          </div>
          
          <div className="p-6 border-2 border-dashed rounded-md text-center">
            <FileCheck className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">Business License/Certificate</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Drag and drop your Business License here, or click to browse
            </p>
            <Button variant="outline" className="mt-4">
              Upload Document
            </Button>
          </div>
          
          <div className="p-6 border-2 border-dashed rounded-md text-center">
            <FileCheck className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">ID Proof of Business Owner</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Drag and drop your ID Proof here, or click to browse
            </p>
            <Button variant="outline" className="mt-4">
              Upload Document
            </Button>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button>Submit All Documents</Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Order component for retailer
const RetailerOrderItem = ({ product, onQuantityChange, quantity }: { 
  product: Product, 
  onQuantityChange: (id: number, qty: number) => void,
  quantity: number
}) => {
  return (
    <div className="flex items-center space-x-4 py-3 border-b">
      <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
        <img 
          src={product.image} 
          alt={product.name} 
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium truncate">{product.name}</h4>
        <p className="text-xs text-muted-foreground mt-1 truncate">
          {product.unitValue} {product.unitType} | Stock: {product.stock}
        </p>
        <div className="flex items-center mt-1">
          <span className="text-sm font-medium">₹{product.price}</span>
          {product.mrp > product.price && (
            <span className="ml-2 text-xs line-through text-muted-foreground">
              ₹{product.mrp}
            </span>
          )}
          {product.discount && (
            <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs">
              {product.discount}% off
            </Badge>
          )}
        </div>
      </div>
      
      <div className="flex space-x-1 items-center">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => onQuantityChange(product.id, Math.max(0, quantity - 1))}
          disabled={quantity <= 0}
        >
          <span>-</span>
        </Button>
        
        <Input
          type="number"
          min="0"
          value={quantity}
          onChange={(e) => onQuantityChange(product.id, parseInt(e.target.value) || 0)}
          className="h-8 w-12 text-center"
        />
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => onQuantityChange(product.id, quantity + 1)}
        >
          <span>+</span>
        </Button>
      </div>
    </div>
  );
};

// Component for placing bulk orders
const BulkOrder = () => {
  const [cartItems, setCartItems] = useState<{ [key: number]: number }>({});
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  // Fetch categories
  const { data: categories = [], isLoading: loadingCategories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  // Fetch products by category
  const { data: products = [], isLoading: loadingProducts } = useQuery<Product[]>({
    queryKey: ['/api/products', selectedCategory && `categoryId=${selectedCategory}`],
    enabled: selectedCategory !== null,
  });
  
  const handleQuantityChange = (productId: number, quantity: number) => {
    setCartItems(prev => ({
      ...prev,
      [productId]: quantity
    }));
  };
  
  const cartTotal = React.useMemo(() => {
    if (!products) return 0;
    
    return Object.entries(cartItems).reduce((total, [id, qty]) => {
      const product = products.find((p: Product) => p.id === parseInt(id));
      return total + (product ? product.price * qty : 0);
    }, 0);
  }, [cartItems, products]);
  
  const totalItems = Object.values(cartItems).reduce((a, b) => a + b, 0);
  
  return (
    <div className="w-full max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Place Bulk Order</CardTitle>
              <CardDescription>
                Select products from our catalog and place a bulk order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <FormLabel>Select Category</FormLabel>
                <Select
                  onValueChange={(value) => setSelectedCategory(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingCategories ? (
                      <div className="flex justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : (
                      categories.map((category: Category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="border rounded-md">
                {selectedCategory === null ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Store className="mx-auto h-12 w-12 mb-3" />
                    <p>Please select a category to view products</p>
                  </div>
                ) : loadingProducts ? (
                  <div className="p-8 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin mb-3" />
                    <p>Loading products...</p>
                  </div>
                ) : products?.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Package className="mx-auto h-12 w-12 mb-3" />
                    <p>No products found in this category</p>
                  </div>
                ) : (
                  <div className="p-4">
                    {products?.map((product: Product) => (
                      <RetailerOrderItem
                        key={product.id}
                        product={product}
                        quantity={cartItems[product.id] || 0}
                        onQuantityChange={handleQuantityChange}
                      />
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Items:</span>
                  <span>{totalItems}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Bulk Discount:</span>
                  <span className="text-green-600">-₹{(cartTotal * 0.05).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>₹100.00</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>₹{(cartTotal - (cartTotal * 0.05) + 100).toFixed(2)}</span>
                </div>
              </div>
              
              <Button className="w-full mt-6" disabled={totalItems === 0}>
                Place Order
              </Button>
              
              <p className="text-xs text-center mt-4 text-muted-foreground">
                By placing this order, you agree to our Terms of Service and Bulk Order Policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Component for order history
const RetailerOrderHistory = () => {
  // Mock orders, in real app would fetch from API
  const orders = [
    {
      id: 1,
      date: "2023-08-15",
      total: 12500,
      status: "delivered",
      items: 28,
    },
    {
      id: 2,
      date: "2023-08-05",
      total: 9800,
      status: "processing",
      items: 15,
    },
    {
      id: 3,
      date: "2023-07-28",
      total: 15650,
      status: "shipped",
      items: 32,
    },
    {
      id: 4,
      date: "2023-07-15",
      total: 8250,
      status: "delivered",
      items: 18,
    },
  ];
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "processing":
        return <Loader2 className="h-5 w-5 text-blue-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-indigo-500" />;
      case "delivered":
        return <Check className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "processing":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Processing</Badge>;
      case "shipped":
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Shipped</Badge>;
      case "delivered":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>
          View and track all your previous orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-3 text-left font-medium">Order ID</th>
                <th className="pb-3 text-left font-medium">Date</th>
                <th className="pb-3 text-left font-medium">Items</th>
                <th className="pb-3 text-left font-medium">Total</th>
                <th className="pb-3 text-left font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="py-4 text-sm">#{order.id.toString().padStart(5, '0')}</td>
                  <td className="py-4 text-sm">{order.date}</td>
                  <td className="py-4 text-sm">{order.items} items</td>
                  <td className="py-4 text-sm font-medium">₹{order.total.toLocaleString()}</td>
                  <td className="py-4 text-sm">
                    <div className="flex items-center">
                      {getStatusIcon(order.status)}
                      <span className="ml-2">{getStatusBadge(order.status)}</span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

// Main retailer portal dashboard component
const RetailerDashboard = () => {
  const { user, isRetailer } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Retailer Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.name || "Retailer"}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Amount Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹46,200</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button>
            <Package className="mr-2 h-4 w-4" />
            Place New Order
          </Button>
          <Button variant="outline">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Track Deliveries
          </Button>
          <Button variant="outline">
            <FileCheck className="mr-2 h-4 w-4" />
            View Invoices
          </Button>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
      <RetailerOrderHistory />
    </div>
  );
};

// Main retailer portal component
const RetailerPortal = () => {
  const { user, isAuthenticated, isRetailer } = useAuth();
  const [location] = useLocation();
  
  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Retailer Portal</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            You need to be logged in to access the retailer portal.
          </p>
        </div>
        <Button asChild>
          <Link href="/auth">Login or Register</Link>
        </Button>
      </div>
    );
  }
  
  // If user is already verified as retailer
  if (isRetailer) {
    // If we're on the main retailer portal page, we should see the dashboard
    if (location === '/retailer') {
      return (
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="dashboard">
            <TabsList className="mb-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="order">Place Order</TabsTrigger>
              <TabsTrigger value="history">Order History</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <RetailerDashboard />
            </TabsContent>
            <TabsContent value="order">
              <div className="flex justify-center">
                <BulkOrder />
              </div>
            </TabsContent>
            <TabsContent value="history">
              <div className="flex justify-center">
                <RetailerOrderHistory />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      );
    }
    
    // Otherwise, render the specific child route
    return null;
  }
  
  // If user is authenticated but not a retailer yet, show the registration form
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Retailer Portal</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Register your business with us to access bulk ordering and special pricing.
        </p>
      </div>
      <Tabs defaultValue="registration">
        <TabsList className="mb-8 mx-auto">
          <TabsTrigger value="registration">Business Registration</TabsTrigger>
          <TabsTrigger value="documents">Upload Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="registration" className="flex justify-center">
          <BusinessVerificationForm />
        </TabsContent>
        <TabsContent value="documents" className="flex justify-center">
          <DocumentUpload />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RetailerPortal;
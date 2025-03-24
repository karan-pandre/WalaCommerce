import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ProductDetails from "@/pages/ProductDetails";
import CategoryPage from "@/pages/CategoryPage";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import OrderTracking from "@/pages/OrderTracking";
import UserAccount from "@/pages/UserAccount";
import SearchPage from "@/pages/SearchPage";
import OrdersPage from "@/pages/OrdersPage";
import RetailerPortal from "@/pages/RetailerPortal";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/product/:id" component={ProductDetails} />
      <Route path="/category/:id" component={CategoryPage} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/success" component={OrderSuccess} />
      <Route path="/orders/:id" component={OrderTracking} />
      <Route path="/orders" component={OrdersPage} />
      <Route path="/account" component={UserAccount} />
      <Route path="/search" component={SearchPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router />
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

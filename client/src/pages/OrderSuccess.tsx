import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, Link } from 'wouter';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const OrderSuccess = () => {
  const [location] = useLocation();
  const [orderId, setOrderId] = useState<number | null>(null);
  
  useEffect(() => {
    // Extract order ID from URL query parameters
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('orderId') || '0');
    if (id > 0) {
      setOrderId(id);
    }
  }, [location]);
  
  // Fetch order details
  const { data: order, isLoading } = useQuery({
    queryKey: [`/api/orders/${orderId}`],
    enabled: orderId !== null,
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block p-3 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600">Your order will be delivered soon.</p>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-36 w-full" />
            </div>
          ) : order ? (
            <div className="bg-neutral rounded-lg p-6">
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">Order ID</span>
                  <span className="text-sm font-medium">#{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Expected Delivery</span>
                  <span className="text-sm font-medium">{order.expectedDelivery}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-4">
                <h3 className="text-base font-medium mb-3">Order Status</h3>
                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-green-500"></div>
                  
                  <div className="flex items-start mb-6 relative">
                    <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center z-10 mr-3">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Order Placed</h4>
                      <p className="text-xs text-gray-500">Your order has been placed</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-6 relative">
                    <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center z-10 mr-3">
                      <Package className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Order Preparing</h4>
                      <p className="text-xs text-gray-500">Your order is being prepared</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-6 relative">
                    <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center z-10 mr-3">
                      <Truck className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Out for Delivery</h4>
                      <p className="text-xs text-gray-500">Your order is on the way</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start relative">
                    <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center z-10 mr-3">
                      <Home className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Delivered</h4>
                      <p className="text-xs text-gray-500">Enjoy your order!</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-4">
                <h3 className="text-base font-medium mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Amount</span>
                    <span>₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method</span>
                    <span className="capitalize">{order.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <p className="text-red-600">Order details not found. Please check your order history.</p>
            </div>
          )}
          
          <div className="mt-8 flex justify-center">
            <Link href="/">
              <button className="bg-primary text-white px-6 py-3 rounded-lg font-medium">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

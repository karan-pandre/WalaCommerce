import { useQuery } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';
import { ArrowLeft, Package, Truck, Home, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

const OrderTracking = () => {
  const [, params] = useRoute('/orders/:id');
  const orderId = params?.id ? parseInt(params.id) : 0;
  
  // Fetch order details
  const { data: order, isLoading } = useQuery({
    queryKey: [`/api/orders/${orderId}`],
    enabled: orderId > 0,
  });

  // Helper function to determine the current status step
  const getStepStatus = (step: string) => {
    if (!order) return 'pending';
    
    const statusMap: Record<string, number> = {
      'pending': 1,
      'processing': 2,
      'shipped': 3,
      'delivered': 4,
      'cancelled': 0
    };
    
    const currentStep = statusMap[order.status];
    const stepMap: Record<string, number> = {
      'placed': 1,
      'preparing': 2,
      'delivery': 3,
      'delivered': 4
    };
    
    return currentStep >= stepMap[step] ? 'completed' : 'pending';
  };

  return (
    <div className="pb-16">
      <Header />
      
      <div className="sticky top-16 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center">
        <Link href="/orders">
          <button className="mr-3">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </Link>
        <h1 className="text-lg font-semibold">Track Order</h1>
      </div>
      
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-36 w-full" />
          </div>
        ) : order ? (
          <>
            <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4">
              <div className="flex justify-between mb-3">
                <div>
                  <h2 className="text-base font-medium">Order #{order.id}</h2>
                  <p className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="mb-3">
                <h3 className="text-sm font-medium mb-1">Delivery Address</h3>
                <p className="text-sm text-gray-700">{order.address}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Payment Method</h3>
                <p className="text-sm text-gray-700 capitalize">{order.paymentMethod}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4">
              <h2 className="text-base font-medium mb-4">Order Status</h2>
              
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div className="flex items-start mb-6 relative">
                  <div className={`h-6 w-6 rounded-full ${
                    getStepStatus('placed') === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                  } flex items-center justify-center z-10 mr-3`}>
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Order Placed</h4>
                    <p className="text-xs text-gray-500">Your order has been placed</p>
                  </div>
                </div>
                
                <div className="flex items-start mb-6 relative">
                  <div className={`h-6 w-6 rounded-full ${
                    getStepStatus('preparing') === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                  } flex items-center justify-center z-10 mr-3`}>
                    <Package className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Order Preparing</h4>
                    <p className="text-xs text-gray-500">Your order is being prepared</p>
                  </div>
                </div>
                
                <div className="flex items-start mb-6 relative">
                  <div className={`h-6 w-6 rounded-full ${
                    getStepStatus('delivery') === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                  } flex items-center justify-center z-10 mr-3`}>
                    <Truck className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Out for Delivery</h4>
                    <p className="text-xs text-gray-500">Your order is on the way</p>
                    {getStepStatus('delivery') === 'completed' && (
                      <p className="text-xs text-green-600 mt-1">Arriving in {order.expectedDelivery}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start relative">
                  <div className={`h-6 w-6 rounded-full ${
                    getStepStatus('delivered') === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                  } flex items-center justify-center z-10 mr-3`}>
                    <Home className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Delivered</h4>
                    <p className="text-xs text-gray-500">Enjoy your order!</p>
                    {getStepStatus('delivered') === 'completed' && (
                      <p className="text-xs text-green-600 mt-1">Delivered at {order.expectedDelivery}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4">
              <h2 className="text-base font-medium mb-3">Order Items</h2>
              
              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div key={item.productId} className="flex items-center border-b border-gray-100 pb-3">
                    <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.quantity} x ₹{item.price}</p>
                    </div>
                    <div className="text-sm font-bold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Item Total</span>
                    <span>₹{(order.totalAmount - order.deliveryFee - order.platformFee).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>₹{order.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee</span>
                    <span>₹{order.platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold mt-2 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center p-6 bg-red-50 rounded-lg">
            <p className="text-red-600">Order not found. Please check the order ID.</p>
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default OrderTracking;

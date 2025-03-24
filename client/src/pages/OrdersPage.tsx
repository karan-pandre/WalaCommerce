import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowLeft, Package, ShoppingBag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

const OrdersPage = () => {
  // In a real app, we would get the user ID from auth context
  const userId = 1; // Mock user ID
  
  // Fetch user's orders
  const { data: orders, isLoading } = useQuery({
    queryKey: [`/api/users/${userId}/orders`],
  });

  return (
    <div className="pb-16">
      <Header />
      
      <div className="sticky top-16 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center">
        <Link href="/account">
          <button className="mr-3">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </Link>
        <h1 className="text-lg font-semibold">My Orders</h1>
      </div>
      
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-100 p-4">
                <Skeleton className="h-5 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-24 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-white rounded-lg border border-gray-100 p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="text-base font-medium">Order #{order.id}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 mb-1">
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
                
                <p className="text-sm mb-2">
                  <span className="font-medium">Items:</span> {order.items.length} &nbsp;
                  <span className="font-medium">Total:</span> ₹{order.totalAmount.toFixed(2)}
                </p>
                
                {order.expectedDelivery && (
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Expected Delivery:</span> {order.expectedDelivery}
                  </p>
                )}
                
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    {order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}
                  </p>
                  
                  <Link href={`/orders/${order.id}`}>
                    <button className="px-3 py-1.5 bg-primary text-white text-sm rounded-md flex items-center">
                      <Package className="h-4 w-4 mr-1" />
                      Track Order
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="bg-neutral rounded-full p-5 mb-4">
              <ShoppingBag className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No orders yet</h3>
            <p className="text-sm text-gray-500 mb-4 text-center">
              You haven't placed any orders yet.
              <br />Start shopping to see your orders here.
            </p>
            <Link href="/">
              <button className="px-4 py-2 bg-primary text-white rounded-md">
                Start Shopping
              </button>
            </Link>
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default OrdersPage;

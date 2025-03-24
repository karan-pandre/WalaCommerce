import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  FileText, 
  ShoppingBag, 
  Phone, 
  Mail, 
  LogOut,
  Edit
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

const UserAccount = () => {
  // In a real app, we would fetch the user from the API
  // This is a placeholder since we're not implementing actual auth
  const [user] = useState({
    id: 1,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    address: '201, Maple Heights, MG Road',
    city: 'Bangalore',
    pincode: '560001'
  });

  // Fetch user's orders
  const { data: orders, isLoading: loadingOrders } = useQuery({
    queryKey: [`/api/users/${user.id}/orders`],
    enabled: !!user.id
  });

  return (
    <div className="pb-16">
      <Header />
      
      <div className="sticky top-16 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center">
        <Link href="/">
          <button className="mr-3">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </Link>
        <h1 className="text-lg font-semibold">My Account</h1>
      </div>
      
      <div className="p-4">
        {/* User Profile */}
        <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                <User className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-semibold">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.username}</p>
              </div>
            </div>
            <button className="p-2 text-primary">
              <Edit className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <Phone className="text-gray-400 h-4 w-4 mr-2" />
              <span className="text-sm">{user.phone}</span>
            </div>
            <div className="flex items-center">
              <Mail className="text-gray-400 h-4 w-4 mr-2" />
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="text-gray-400 h-4 w-4 mr-2" />
              <span className="text-sm">{user.address}, {user.city} - {user.pincode}</span>
            </div>
          </div>
        </div>
        
        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">Recent Orders</h2>
            <Link href="/orders">
              <a className="text-sm text-accent">View All</a>
            </Link>
          </div>
          
          {loadingOrders ? (
            <div className="space-y-3">
              {Array(3).fill(0).map((_, index) => (
                <div key={index} className="border border-gray-100 rounded-lg p-3">
                  <Skeleton className="h-5 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-3">
              {orders.slice(0, 3).map((order: any) => (
                <Link key={order.id} href={`/orders/${order.id}`}>
                  <div className="border border-gray-100 rounded-lg p-3 cursor-pointer hover:border-gray-300 transition-colors">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Order #{order.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString()} &middot; {order.items.length} items
                    </p>
                    <p className="text-sm font-medium mt-1">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <ShoppingBag className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No orders yet</p>
              <Link href="/">
                <button className="mt-2 text-sm text-primary font-medium">
                  Start Shopping
                </button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Account Actions */}
        <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4">
          <h2 className="text-base font-semibold mb-3">Account</h2>
          
          <div className="space-y-4">
            <Link href="/orders">
              <div className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-sm">My Orders</span>
                </div>
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
            
            <Separator />
            
            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                <span className="text-sm">Manage Addresses</span>
              </div>
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <Separator />
            
            <div className="flex items-center text-red-500 cursor-pointer">
              <LogOut className="h-5 w-5 mr-3" />
              <span className="text-sm">Logout</span>
            </div>
          </div>
        </div>
        
        {/* App Info */}
        <div className="text-center mt-6 mb-8">
          <h2 className="text-lg font-bold text-primary mb-1">Wala</h2>
          <p className="text-xs text-gray-500">Version 1.0.0</p>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default UserAccount;

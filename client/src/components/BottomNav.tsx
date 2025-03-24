import { Home, Search, ShoppingCart, FileText } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Cart from './Cart';

const BottomNav = () => {
  const [location] = useLocation();
  
  // Get cart items count from localStorage
  const getCartItemsCount = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    return cartItems.length;
  };

  const { data: cartCount = getCartItemsCount() } = useQuery({
    queryKey: ['cartCount'],
    queryFn: getCartItemsCount,
    // This is just for local state, in a real app you'd fetch from API
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 z-40">
      <div className="flex justify-between items-center px-8">
        <Link href="/">
          <button className="flex flex-col items-center justify-center">
            <Home className={`h-5 w-5 ${location === '/' ? 'text-primary' : 'text-gray-400'}`} />
            <span className={`text-xs mt-1 ${location === '/' ? 'text-primary font-medium' : 'text-gray-500'}`}>Home</span>
          </button>
        </Link>
        
        <Link href="/search">
          <button className="flex flex-col items-center justify-center">
            <Search className={`h-5 w-5 ${location === '/search' ? 'text-primary' : 'text-gray-400'}`} />
            <span className={`text-xs mt-1 ${location === '/search' ? 'text-primary font-medium' : 'text-gray-500'}`}>Search</span>
          </button>
        </Link>
        
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center justify-center relative">
              <ShoppingCart className="h-5 w-5 text-gray-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <span className="text-xs mt-1 text-gray-500">Cart</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="p-0 h-[85vh] overflow-auto" showCloseButton={false}>
            <Cart />
          </SheetContent>
        </Sheet>
        
        <Link href="/orders">
          <button className="flex flex-col items-center justify-center">
            <FileText className={`h-5 w-5 ${location === '/orders' ? 'text-primary' : 'text-gray-400'}`} />
            <span className={`text-xs mt-1 ${location === '/orders' ? 'text-primary font-medium' : 'text-gray-500'}`}>Orders</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;

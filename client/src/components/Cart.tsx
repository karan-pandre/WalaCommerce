import { useState, useEffect } from 'react';
import { X, Plus, Minus, MapPin } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { CartItem } from '@shared/schema';

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState('201, Maple Heights, MG Road, Bangalore - 560001');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Get cart items from localStorage
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  // Calculate totals
  const itemTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 30;
  const platformFee = 5;
  const total = itemTotal + deliveryFee + platformFee;

  // Update quantity
  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      // Remove item if quantity is less than 1
      const updatedCart = cartItems.filter(item => item.productId !== productId);
      setCartItems(updatedCart);
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    } else {
      // Update quantity
      const updatedCart = cartItems.map(item => {
        if (item.productId === productId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      setCartItems(updatedCart);
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    }
    
    // Invalidate cart count query to refresh the badge
    queryClient.invalidateQueries({ queryKey: ['cartCount'] });
  };

  // Handle checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checkout",
        variant: "destructive",
      });
      return;
    }
    
    navigate('/checkout');
  };

  return (
    <>
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold font-sans">Your Cart ({cartItems.length})</h2>
        <button className="text-gray-500">
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="p-4">
        {/* Cart Items */}
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="bg-neutral rounded-full p-5 mb-4">
              <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
            <p className="text-sm text-gray-500 mb-4 text-center">Start adding items to your cart and they will appear here!</p>
            <Link href="/">
              <button className="px-4 py-2 bg-primary text-white rounded-md">
                Browse Products
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.unitValue} {item.unitType}</p>
                    <div className="text-sm font-bold mt-1">₹{item.price}</div>
                  </div>
                </div>
                <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                  <button 
                    className="w-8 h-8 flex items-center justify-center text-gray-500 bg-neutral"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 h-8 flex items-center justify-center text-sm">{item.quantity}</span>
                  <button 
                    className="w-8 h-8 flex items-center justify-center text-white bg-secondary"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {cartItems.length > 0 && (
          <>
            {/* Delivery Details */}
            <div className="bg-neutral rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <MapPin className="text-primary mr-2 h-4 w-4" />
                  <span className="text-sm font-medium">Deliver to</span>
                </div>
                <button className="text-accent text-xs font-medium">Change</button>
              </div>
              <p className="text-sm">{address}</p>
            </div>
            
            {/* Order Summary */}
            <div className="border-t border-gray-100 pt-4 pb-20">
              <h3 className="text-base font-semibold mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Item Total</span>
                  <span>₹{itemTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span>₹{platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold mt-4 pt-2 border-t border-gray-100">
                  <span>To Pay</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Checkout Button - Fixed at Bottom */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <button 
            className="w-full bg-primary text-white font-medium py-3 rounded-lg flex items-center justify-center"
            onClick={handleCheckout}
          >
            Proceed to Checkout <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default Cart;

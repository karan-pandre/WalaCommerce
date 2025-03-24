import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CreditCard, MapPin, Truck } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { CartItem } from '@shared/schema';

interface DeliveryAddress {
  address: string;
  city: string;
  pincode: string;
}

const Checkout = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState<DeliveryAddress>({
    address: '201, Maple Heights',
    city: 'Bangalore',
    pincode: '560001'
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Get cart items from localStorage
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    } else {
      // Redirect to home if cart is empty
      navigate('/');
    }
  }, [navigate]);

  // Calculate totals
  const itemTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 30;
  const platformFee = 5;
  const total = itemTotal + deliveryFee + platformFee;

  // Handle order placement
  const placeOrder = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checkout",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would use the logged-in user's ID
      const userId = 1;  // Mock user ID
      
      // Calculate delivery timeframe (10-15 minutes from now)
      const now = new Date();
      const deliveryTime = `${now.getHours()}:${now.getMinutes() + 15}`;
      
      const orderData = {
        userId,
        items: cartItems,
        totalAmount: total,
        address: `${address.address}, ${address.city} - ${address.pincode}`,
        paymentMethod,
        deliveryFee,
        platformFee,
        expectedDelivery: deliveryTime,
        status: "pending"
      };
      
      const response = await apiRequest('POST', '/api/orders', orderData);
      const newOrder = await response.json();
      
      // Clear cart
      localStorage.removeItem('cartItems');
      
      // Invalidate cart count query
      queryClient.invalidateQueries({ queryKey: ['cartCount'] });
      
      // Navigate to success page with order ID
      navigate(`/success?orderId=${newOrder.id}`);
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center">
        <Link href="/">
          <button className="mr-3">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </Link>
        <h1 className="text-lg font-semibold">Checkout</h1>
      </div>
      
      <div className="p-4">
        {/* Delivery Address */}
        <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <MapPin className="text-primary mr-2 h-5 w-5" />
              <h2 className="text-base font-medium">Delivery Address</h2>
            </div>
            <button className="text-accent text-sm font-medium">Change</button>
          </div>
          <p className="text-sm">{address.address}, {address.city} - {address.pincode}</p>
        </div>
        
        {/* Delivery Time */}
        <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4">
          <div className="flex items-center mb-3">
            <Truck className="text-primary mr-2 h-5 w-5" />
            <h2 className="text-base font-medium">Delivery Time</h2>
          </div>
          <p className="text-sm">Express Delivery (10-15 minutes)</p>
        </div>
        
        {/* Payment Method */}
        <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4">
          <div className="flex items-center mb-3">
            <CreditCard className="text-primary mr-2 h-5 w-5" />
            <h2 className="text-base font-medium">Payment Method</h2>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <input 
                type="radio" 
                id="cash" 
                name="payment" 
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={() => setPaymentMethod('cash')}
                className="mr-2"
              />
              <label htmlFor="cash" className="text-sm">Cash on Delivery</label>
            </div>
            <div className="flex items-center">
              <input 
                type="radio" 
                id="card" 
                name="payment" 
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
                className="mr-2"
              />
              <label htmlFor="card" className="text-sm">Credit/Debit Card</label>
            </div>
            <div className="flex items-center">
              <input 
                type="radio" 
                id="upi" 
                name="payment" 
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={() => setPaymentMethod('upi')}
                className="mr-2"
              />
              <label htmlFor="upi" className="text-sm">UPI</label>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4">
          <h2 className="text-base font-medium mb-3">Order Summary</h2>
          
          {/* Cart Items */}
          <div className="space-y-3 mb-4">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          {/* Costs */}
          <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
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
      </div>
      
      {/* Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <button 
          className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-primary'} text-white font-medium py-3 rounded-lg flex items-center justify-center`}
          onClick={placeOrder}
          disabled={isLoading || cartItems.length === 0}
        >
          {isLoading ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};

export default Checkout;

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Share2, 
  ShoppingCart,
  Package
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Product } from '@shared/schema';

const ProductDetails = () => {
  const [, params] = useRoute('/product/:id');
  const productId = params?.id ? parseInt(params.id) : 0;
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch product details
  const { data: product, isLoading } = useQuery({
    queryKey: [`/api/products/${productId}`],
    enabled: productId > 0,
  });

  // Handle add to cart
  const addToCart = () => {
    if (!product) return;
    
    // Get existing cart items from localStorage
    const existingCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    // Check if product already exists in cart
    const existingItemIndex = existingCartItems.findIndex(
      (item: any) => item.productId === product.id
    );
    
    let updatedCartItems;
    
    if (existingItemIndex >= 0) {
      // Update quantity if product already in cart
      updatedCartItems = existingCartItems.map((item: any, index: number) => {
        if (index === existingItemIndex) {
          return {
            ...item,
            quantity: item.quantity + quantity
          };
        }
        return item;
      });
    } else {
      // Add new product to cart
      updatedCartItems = [
        ...existingCartItems,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity,
          unitValue: product.unitValue,
          unitType: product.unitType
        }
      ];
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    
    // Invalidate cart count query to refresh the badge
    queryClient.invalidateQueries({ queryKey: ['cartCount'] });
    
    toast({
      title: "Added to cart",
      description: `${product.name} (${quantity}) added to your cart`,
      duration: 2000,
    });
  };

  return (
    <div className="pb-20">
      <Header />
      
      <div className="relative bg-white">
        {/* Back button */}
        <div className="absolute top-4 left-4 z-10">
          <Link href="/">
            <button className="p-2 bg-white rounded-full shadow-md">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
        </div>
        
        {/* Share button */}
        <div className="absolute top-4 right-4 z-10">
          <button className="p-2 bg-white rounded-full shadow-md">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
        
        {isLoading ? (
          <Skeleton className="w-full aspect-square" />
        ) : (
          <div className="w-full aspect-square bg-neutral">
            <img 
              src={product?.image} 
              alt={product?.name} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
      
      <div className="p-4">
        {isLoading ? (
          <>
            <Skeleton className="h-7 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/4 mb-4" />
            <Skeleton className="h-5 w-1/2 mb-6" />
            <Skeleton className="h-20 w-full mb-4" />
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold mb-1">{product?.name}</h1>
            <div className="text-sm text-gray-500 mb-2">{product?.unitValue} {product?.unitType}</div>
            
            <div className="flex items-baseline mb-4">
              <span className="text-xl font-bold mr-2">₹{product?.price}</span>
              {product?.mrp > product?.price && (
                <span className="text-sm line-through text-gray-400">₹{product?.mrp}</span>
              )}
              {product?.discount && (
                <span className="ml-2 text-sm text-green-600">{product?.discount}% OFF</span>
              )}
            </div>
            
            {product?.description && (
              <div className="mb-6">
                <h3 className="text-base font-medium mb-1">Description</h3>
                <p className="text-sm text-gray-700">{product?.description}</p>
              </div>
            )}
            
            {/* Stock status */}
            <div className="flex items-center mb-6">
              <Package className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm">
                {product?.stock > 10 ? (
                  <span className="text-green-600">In Stock</span>
                ) : product?.stock > 0 ? (
                  <span className="text-orange-500">Only {product?.stock} left</span>
                ) : (
                  <span className="text-red-500">Out of Stock</span>
                )}
              </span>
            </div>
            
            {/* Quantity selector */}
            <div className="mb-6">
              <h3 className="text-base font-medium mb-2">Quantity</h3>
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden inline-block">
                <button 
                  className="w-10 h-10 flex items-center justify-center text-gray-500 bg-neutral"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(quantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 h-10 flex items-center justify-center text-base">{quantity}</span>
                <button 
                  className="w-10 h-10 flex items-center justify-center text-white bg-secondary"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Add to cart button */}
      {!isLoading && (
        <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <button 
            className="w-full bg-primary text-white font-medium py-3 rounded-lg flex items-center justify-center"
            onClick={addToCart}
            disabled={!product || product.stock <= 0}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </button>
        </div>
      )}
      
      <BottomNav />
    </div>
  );
};

export default ProductDetails;

import { useState } from 'react';
import { Link } from 'wouter';
import { Product } from '@shared/schema';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    
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
            quantity: item.quantity + 1
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
          quantity: 1,
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
      description: `${product.name} added to your cart`,
      duration: 2000,
    });
    
    setTimeout(() => {
      setIsAdding(false);
    }, 300);
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div className="product-card bg-white rounded-lg border border-gray-100 overflow-hidden relative cursor-pointer hover:border-gray-300 transition-all">
        {product.isBestSeller && (
          <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full z-10">Best Seller</span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-2 left-2 bg-error text-white text-xs px-2 py-0.5 rounded-full z-10">Only {product.stock} left</span>
        )}
        {product.isNewArrival && (
          <span className="absolute top-2 left-2 bg-accent text-white text-xs px-2 py-0.5 rounded-full z-10">New</span>
        )}
        <div className="relative pb-[100%]">
          <img 
            src={product.image} 
            alt={product.name} 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="p-2">
          <div className="text-xs text-gray-500 mb-1">{product.unitValue} {product.unitType}</div>
          <h3 className="text-sm font-medium mb-1 line-clamp-2">{product.name}</h3>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm font-bold">₹{product.price}</span>
              {product.mrp > product.price && (
                <span className="text-xs line-through text-gray-400 ml-1">₹{product.mrp}</span>
              )}
            </div>
            <button 
              className={`quick-add ${isAdding ? 'animate-pulse' : ''} bg-secondary text-white w-7 h-7 rounded-full flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity`}
              onClick={addToCart}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

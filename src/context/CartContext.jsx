import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const shippingCost = cartItems.length > 0 && cartItems.every(item => item.isTest) ? 0 : 100;

  // Load from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('rootlooms_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to load cart', e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('rootlooms_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      // Check if item already in cart
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        // Can't add more than 1 of the same unique saree usually, but we'll increment quantity just in case
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); // Open cart when adding
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  const total = subtotal > 0 ? subtotal + shippingCost : 0;

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart,
      isCartOpen, 
      setIsCartOpen,
      subtotal,
      shippingCost,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant } from '@/lib/db';

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from LocalStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('pe_cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch {
        setCart([]);
      }
    }
  }, []);

  // Save cart to LocalStorage when it changes
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('pe_cart', JSON.stringify(newCart));
  };

  const addToCart = (product: Product, variant: ProductVariant, quantity: number) => {
    const existingIndex = cart.findIndex(item => item.variant.id === variant.id);

    if (existingIndex > -1) {
      const newCart = [...cart];
      const newQty = newCart[existingIndex].quantity + quantity;
      
      // Check stock limit
      if (newQty <= variant.stock) {
        newCart[existingIndex].quantity = newQty;
        saveCart(newCart);
      } else {
        newCart[existingIndex].quantity = variant.stock;
        saveCart(newCart);
        alert(`Stock limitado. Se agregaron máximo ${variant.stock} unidades de este producto.`);
      }
    } else {
      saveCart([...cart, { product, variant, quantity: Math.min(quantity, variant.stock) }]);
    }
  };

  const removeFromCart = (variantId: string) => {
    saveCart(cart.filter(item => item.variant.id !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    const item = cart.find(item => item.variant.id === variantId);
    if (!item) return;

    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }

    const finalQty = Math.min(quantity, item.variant.stock);
    saveCart(
      cart.map(item =>
        item.variant.id === variantId ? { ...item, quantity: finalQty } : item
      )
    );
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

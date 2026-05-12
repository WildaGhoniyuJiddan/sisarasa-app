'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, Product, DonationLog, AIInsight, Transaction } from '@/types';
import {
  mockSellerUser,
  mockConsumerUser,
  mockProducts,
  mockDonationLogs,
  mockAIInsights,
  mockTransactions,
} from '@/data/mock';

interface AppContextType {
  currentUser: User;
  userRole: UserRole;
  setRole: (role: UserRole) => void;
  switchRole: () => void;
  products: Product[];
  donationLogs: DonationLog[];
  aiInsights: AIInsight[];
  transactions: Transaction[];
  updateProductStatus: (productId: string, status: Product['status']) => void;
  activateDonation: (productId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('seller');
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [donationLogs] = useState<DonationLog[]>(mockDonationLogs);
  const [aiInsights] = useState<AIInsight[]>(mockAIInsights);
  const [transactions] = useState<Transaction[]>(mockTransactions);

  const currentUser = userRole === 'seller' ? mockSellerUser : mockConsumerUser;

  const setRole = (role: UserRole) => setUserRole(role);

  const switchRole = () =>
    setUserRole((prev) => (prev === 'seller' ? 'consumer' : 'seller'));

  const updateProductStatus = (productId: string, status: Product['status']) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, status } : p))
    );
  };

  const activateDonation = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, status: 'donation', currentPrice: 0, isDonation: true }
          : p
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        userRole,
        setRole,
        switchRole,
        products,
        donationLogs,
        aiInsights,
        transactions,
        updateProductStatus,
        activateDonation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

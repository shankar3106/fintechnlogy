import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, InvestmentProfile, InvestmentRecommendation } from '../types';

import { AppContextType } from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [investmentProfile, setInvestmentProfile] = useState<InvestmentProfile | null>(null);
  const [recommendation, setRecommendation] = useState<InvestmentRecommendation | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(83);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        investmentProfile,
        setInvestmentProfile,
        recommendation,
        setRecommendation,
        currentStep,
        setCurrentStep,
        isLoading,
        setIsLoading,
        exchangeRate,
        setExchangeRate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
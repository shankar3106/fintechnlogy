export interface User {
  id: string;
  email: string;
  name: string;
}

export interface InvestmentProfile {
  capitalAmount: number;
  investmentPeriod: number;
  sectors: string[];
  riskTolerance: 'low' | 'moderate' | 'high';
  targetGrowth: number;
  preferences: string;
}

export interface AssetAllocation {
  name: string;
  percentage: number;
  color: string;
  amount: number;
}

export interface InvestmentRecommendation {
  assetAllocation: AssetAllocation[];
  specificRecommendations: Array<{
    symbol: string;
    name: string;
    sector: string;
    allocation: number;
    rationale: string;
    currentPrice?: number;
    priceChange?: number;
    priceChangePercent?: number;
    priceInINR?: number;
  }>;
  strategy: {
    type: 'lump_sum' | 'sip';
    rationale: string;
    monthlyAmount?: number;
  };
  processGuide: string[];
  riskAssessment: {
    score: number;
    description: string;
  };
}

export interface HistoricalData {
  labels: string[];
  data: number[];
}

export interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  investmentProfile: InvestmentProfile | null;
  setInvestmentProfile: (profile: InvestmentProfile) => void;
  recommendation: InvestmentRecommendation | null;
  setRecommendation: (recommendation: InvestmentRecommendation) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  exchangeRate: number;
  setExchangeRate: (rate: number) => void;
}
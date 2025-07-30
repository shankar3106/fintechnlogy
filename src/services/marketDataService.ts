import axios from 'axios';

// Exchange rate service
export const getUSDToINRRate = async (): Promise<number> => {
  try {
    // Using a free exchange rate API
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    return response.data.rates.INR || 83; // Fallback to approximate rate
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);
    return 83; // Fallback INR rate
  }
};

// Stock price service using Alpha Vantage (free tier)
export const getStockPrice = async (symbol: string): Promise<{ price: number; change: number; changePercent: number }> => {
  try {
    // Using Alpha Vantage free API (demo key - replace with actual key for production)
    const API_KEY = 'demo'; // Replace with actual API key
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );
    
    const quote = response.data['Global Quote'];
    if (quote) {
      const price = parseFloat(quote['05. price']);
      const change = parseFloat(quote['09. change']);
      const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
      
      return { price, change, changePercent };
    }
    
    // Fallback with simulated data if API fails
    return generateMockStockData(symbol);
  } catch (error) {
    console.error(`Failed to fetch price for ${symbol}:`, error);
    return generateMockStockData(symbol);
  }
};

// Generate realistic mock data for demonstration
const generateMockStockData = (symbol: string): { price: number; change: number; changePercent: number } => {
  const basePrices: { [key: string]: number } = {
    'AAPL': 175.50,
    'MSFT': 378.85,
    'GOOGL': 138.75,
    'TSLA': 248.50,
    'AMZN': 145.25,
    'NVDA': 875.30,
    'VOO': 425.80,
    'BND': 75.25,
    'GLD': 185.40,
    'VNQ': 85.60,
    'QQQ': 385.75,
    'VTI': 235.90,
    'VTIAX': 28.45,
    'IAU': 37.80,
    'VWO': 42.15,
    'ARKK': 48.25,
    'BTC-USD': 43250.00,
  };

  const basePrice = basePrices[symbol] || 100 + Math.random() * 200;
  const changePercent = (Math.random() - 0.5) * 6; // -3% to +3%
  const change = (basePrice * changePercent) / 100;
  const currentPrice = basePrice + change;

  return {
    price: Math.round(currentPrice * 100) / 100,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
  };
};

// Indian stock recommendations
export const getIndianStockRecommendations = () => [
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries Ltd', sector: 'Energy & Petrochemicals' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services', sector: 'Information Technology' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Ltd', sector: 'Banking & Financial Services' },
  { symbol: 'INFY.NS', name: 'Infosys Ltd', sector: 'Information Technology' },
  { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever Ltd', sector: 'FMCG' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank Ltd', sector: 'Banking & Financial Services' },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel Ltd', sector: 'Telecommunications' },
  { symbol: 'ITC.NS', name: 'ITC Ltd', sector: 'FMCG & Tobacco' },
  { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank', sector: 'Banking & Financial Services' },
  { symbol: 'LT.NS', name: 'Larsen & Toubro Ltd', sector: 'Engineering & Construction' },
];

// Mutual fund recommendations for India
export const getIndianMutualFunds = () => [
  { symbol: 'SBI-BLUECHIP', name: 'SBI Blue Chip Fund', sector: 'Large Cap Equity', expense: '0.69%' },
  { symbol: 'HDFC-TOP100', name: 'HDFC Top 100 Fund', sector: 'Large Cap Equity', expense: '0.52%' },
  { symbol: 'ICICI-FOCUSED', name: 'ICICI Prudential Focused Blue Chip Fund', sector: 'Large Cap Equity', expense: '0.98%' },
  { symbol: 'AXIS-MIDCAP', name: 'Axis Midcap Fund', sector: 'Mid Cap Equity', expense: '1.05%' },
  { symbol: 'MIRAE-LARGECAP', name: 'Mirae Asset Large Cap Fund', sector: 'Large Cap Equity', expense: '0.52%' },
  { symbol: 'PARAG-FLEXI', name: 'Parag Parikh Flexi Cap Fund', sector: 'Flexi Cap Equity', expense: '0.80%' },
];
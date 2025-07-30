import { InvestmentProfile, InvestmentRecommendation, AssetAllocation, HistoricalData } from '../types';
import { getUSDToINRRate, getStockPrice, getIndianStockRecommendations, getIndianMutualFunds } from './marketDataService';

// Simulate ML analysis with realistic financial logic
export const analyzeInvestment = async (profile: InvestmentProfile): Promise<{ recommendation: InvestmentRecommendation; exchangeRate: number }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Get current exchange rate
  const exchangeRate = await getUSDToINRRate();

  const { capitalAmount, investmentPeriod, sectors, riskTolerance, targetGrowth } = profile;

  // Risk-based asset allocation logic
  const getAllocation = (): AssetAllocation[] => {
    const baseAllocations = {
      low: [
        { name: 'Government Bonds (Indian)', percentage: 40, color: '#3B82F6' },
        { name: 'Blue Chip Indian Stocks', percentage: 30, color: '#10B981' },
        { name: 'Gold & Precious Metals', percentage: 20, color: '#F59E0B' },
        { name: 'Real Estate (REITs)', percentage: 10, color: '#8B5CF6' },
      ],
      moderate: [
        { name: 'Indian Index Funds', percentage: 35, color: '#3B82F6' },
        { name: 'Indian Growth Stocks', percentage: 25, color: '#10B981' },
        { name: 'International Funds', percentage: 20, color: '#F59E0B' },
        { name: 'Indian Bonds', percentage: 15, color: '#8B5CF6' },
        { name: 'Gold', percentage: 5, color: '#EF4444' },
      ],
      high: [
        { name: 'Indian Tech Stocks', percentage: 40, color: '#3B82F6' },
        { name: 'Emerging Markets', percentage: 25, color: '#10B981' },
        { name: 'Indian Growth Funds', percentage: 20, color: '#F59E0B' },
        { name: 'Cryptocurrency', percentage: 10, color: '#8B5CF6' },
        { name: 'REITs', percentage: 5, color: '#EF4444' },
      ],
    };

    return baseAllocations[riskTolerance].map(allocation => ({
      ...allocation,
      amount: (capitalAmount * allocation.percentage) / 100,
    }));
  };

  // Generate specific recommendations based on sectors and risk
  const getSpecificRecommendations = async () => {
    const indianStocks = getIndianStockRecommendations();
    const indianMutualFunds = getIndianMutualFunds();
    
    const recommendations = {
      low: [
        { symbol: 'SBI-BLUECHIP', name: 'SBI Blue Chip Fund', sector: 'Large Cap Equity', allocation: 30, rationale: 'Low-cost broad Indian market exposure with consistent returns from established companies' },
        { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Ltd', sector: 'Banking', allocation: 25, rationale: 'Stable banking stock with strong fundamentals and regular dividends' },
        { symbol: 'GLD', name: 'SPDR Gold Shares', sector: 'Gold', allocation: 20, rationale: 'Hedge against inflation and market volatility' },
        { symbol: 'RELIANCE.NS', name: 'Reliance Industries Ltd', sector: 'Energy', allocation: 15, rationale: 'Largest Indian conglomerate with diversified business model' },
        { symbol: 'ICICIBANK.NS', name: 'ICICI Bank Ltd', sector: 'Banking', allocation: 10, rationale: 'Strong private sector bank with consistent growth' },
      ],
      moderate: [
        { symbol: 'HDFC-TOP100', name: 'HDFC Top 100 Fund', sector: 'Large Cap Equity', allocation: 35, rationale: 'Broad Indian large-cap exposure for balanced growth with lower expense ratio' },
        { symbol: 'TCS.NS', name: 'Tata Consultancy Services', sector: 'Information Technology', allocation: 25, rationale: 'Leading IT services company with strong global presence and consistent growth' },
        { symbol: 'MIRAE-LARGECAP', name: 'Mirae Asset Large Cap Fund', sector: 'Large Cap Equity', allocation: 20, rationale: 'Well-managed fund with focus on quality large-cap stocks' },
        { symbol: 'INFY.NS', name: 'Infosys Ltd', sector: 'Information Technology', allocation: 15, rationale: 'Premier IT services company with strong fundamentals and dividend yield' },
        { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever Ltd', sector: 'FMCG', allocation: 5, rationale: 'Defensive FMCG stock with consistent performance and market leadership' },
      ],
      high: [
        { symbol: 'TCS.NS', name: 'Tata Consultancy Services', sector: 'Information Technology', allocation: 20, rationale: 'Leading Indian IT company with strong growth prospects and global reach' },
        { symbol: 'RELIANCE.NS', name: 'Reliance Industries Ltd', sector: 'Energy & Telecom', allocation: 15, rationale: 'Diversified conglomerate with strong presence in energy, retail, and telecom' },
        { symbol: 'INFY.NS', name: 'Infosys Ltd', sector: 'Information Technology', allocation: 15, rationale: 'Premier IT services with focus on digital transformation and cloud services' },
        { symbol: 'AXIS-MIDCAP', name: 'Axis Midcap Fund', sector: 'Mid Cap Equity', allocation: 25, rationale: 'High growth potential through exposure to emerging mid-cap companies' },
        { symbol: 'PARAG-FLEXI', name: 'Parag Parikh Flexi Cap Fund', sector: 'Flexi Cap Equity', allocation: 15, rationale: 'Flexible investment approach with both domestic and international exposure' },
        { symbol: 'BTC-USD', name: 'Bitcoin', sector: 'Cryptocurrency', allocation: 10, rationale: 'Digital asset diversification for high-risk tolerance' },
      ],
    };

    // Add live market data to recommendations
    const recs = recommendations[riskTolerance];
    const recsWithPrices = await Promise.all(
      recs.map(async (rec) => {
        try {
          const marketData = await getStockPrice(rec.symbol);
          return {
            ...rec,
            currentPrice: marketData.price,
            priceChange: marketData.change,
            priceChangePercent: marketData.changePercent,
            priceInINR: rec.symbol.includes('.NS') ? marketData.price : marketData.price * exchangeRate,
          };
        } catch (error) {
          return {
            ...rec,
            currentPrice: 0,
            priceChange: 0,
            priceChangePercent: 0,
            priceInINR: 0,
          };
        }
      })
    );
    
    return recsWithPrices;
  };

  // Determine investment strategy
  const getStrategy = () => {
    const targetReturn = ((targetGrowth - capitalAmount) / capitalAmount) * 100;
    const annualizedReturn = targetReturn / investmentPeriod;

    if (investmentPeriod > 2 && annualizedReturn > 12) {
      return {
        type: 'sip' as const,
        rationale: `A Systematic Investment Plan (SIP) is recommended to average out market volatility over your ${investmentPeriod}-year timeline. This approach reduces timing risk and takes advantage of rupee-cost averaging.`,
        monthlyAmount: Math.round((capitalAmount * exchangeRate) / (investmentPeriod * 12)),
      };
    } else {
      return {
        type: 'lump_sum' as const,
        rationale: `A lump sum investment is recommended given your timeline and return expectations. This allows for immediate market exposure and compound growth in the Indian market.`,
      };
    }
  };

  const processGuide = [
    '1. Open a Demat and trading account with a reputable Indian broker (Zerodha, Groww, HDFC Securities, or ICICI Direct)',
    '2. Complete KYC verification with PAN, Aadhaar, and bank details, then fund your account',
    '3. Research and verify the recommended securities using their ticker symbols',
    '4. Place buy orders according to the suggested allocation percentages in INR',
    '5. Set up automatic dividend reinvestment for long-term compounding',
    '6. Review and rebalance your portfolio quarterly to maintain target allocation',
    '7. Monitor performance through your broker app but avoid emotional trading decisions',
    '8. Consider tax-saving investments under Section 80C and LTCG tax implications',
    '9. Keep track of dividend income for tax filing purposes',
    '10. Consider SIP investments in mutual funds for rupee-cost averaging benefits',
  ];

  const riskScore = riskTolerance === 'low' ? 3 : riskTolerance === 'moderate' ? 6 : 8;
  const riskDescriptions = {
    low: 'Conservative approach focused on capital preservation with steady, low-risk returns suitable for Indian market conditions',
    moderate: 'Balanced strategy balancing growth potential with reasonable risk management, ideal for Indian equity markets',
    high: 'Aggressive growth strategy accepting higher volatility for maximum return potential in emerging Indian markets',
  };

  const specificRecommendations = await getSpecificRecommendations();

  const recommendation = {
    assetAllocation: getAllocation().map(asset => ({
      ...asset,
      amount: (capitalAmount * exchangeRate * asset.percentage) / 100,
    })),
    specificRecommendations,
    strategy: getStrategy(),
    processGuide,
    riskAssessment: {
      score: riskScore,
      description: riskDescriptions[riskTolerance],
    },
  };

  return { recommendation, exchangeRate };
};

// Generate historical performance data
export const generateHistoricalData = (assetAllocation: AssetAllocation[]): HistoricalData => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = months.map((_, index) => {
    // Simulate portfolio performance with some volatility
    const baseReturn = 1000 + (index * 150) + (Math.random() * 200 - 100);
    return Math.round(baseReturn);
  });

  return {
    labels: months,
    data,
  };
};
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, DollarSign, Calendar, Target, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { InvestmentProfile } from '../types';
import { analyzeInvestment } from '../services/mlService';
import LoadingSpinner from './LoadingSpinner';
import AnimatedCard from './AnimatedCard';

const InvestmentForm: React.FC = () => {
  const { setInvestmentProfile, setRecommendation, currentStep, setCurrentStep, isLoading, setIsLoading, setExchangeRate } = useAppContext();
  
  const [formData, setFormData] = useState<InvestmentProfile>({
    capitalAmount: 50000,
    investmentPeriod: 5,
    sectors: [],
    riskTolerance: 'moderate',
    targetGrowth: 75000,
    preferences: '',
  });

  const sectors = [
    'Technology',
    'Healthcare',
    'Financial Services',
    'Consumer Goods',
    'Energy',
    'Real Estate (REITs)',
    'Gold & Precious Metals',
    'International Markets',
    'Cryptocurrency',
    'Government Bonds',
  ];

  const riskOptions = [
    {
      level: 'low',
      title: 'Conservative',
      description: 'Focus on capital preservation with steady, low-risk returns',
      expectedReturn: '4-7% annually',
      color: 'green',
    },
    {
      level: 'moderate',
      title: 'Balanced',
      description: 'Balance between growth and preservation with moderate risk',
      expectedReturn: '7-12% annually',
      color: 'blue',
    },
    {
      level: 'high',
      title: 'Aggressive',
      description: 'Focus on maximum growth, comfortable with high volatility',
      expectedReturn: '12-20% annually',
      color: 'red',
    },
  ];

  const handleSectorToggle = (sector: string) => {
    setFormData(prev => ({
      ...prev,
      sectors: prev.sectors.includes(sector)
        ? prev.sectors.filter(s => s !== sector)
        : [...prev.sectors, sector]
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const recommendation = await analyzeInvestment(formData);
      setInvestmentProfile(formData);
      setRecommendation(recommendation);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stepVariants = {
    enter: { opacity: 0, x: 300 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -300 }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <AnimatedCard className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Investment Capital</h3>
              <p className="text-gray-600">How much would you like to invest initially?</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Investment Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
                  <input
                    type="number"
                    min="1000"
                    max="10000000"
                    step="1000"
                    value={formData.capitalAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, capitalAmount: Number(e.target.value) }))}
                    className="w-full pl-8 pr-4 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <input
                  type="range"
                  min="1000"
                  max="1000000"
                  step="1000"
                  value={formData.capitalAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, capitalAmount: Number(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>$1K</span>
                  <span>$1M</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Recommendation:</strong> We suggest a minimum investment of $10,000 for optimal diversification and lower fees.
                </p>
              </div>
            </div>
          </AnimatedCard>
        );

      case 1:
        return (
          <AnimatedCard className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Investment Timeline</h3>
              <p className="text-gray-600">How long do you plan to keep your money invested?</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Period (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.investmentPeriod}
                  onChange={(e) => setFormData(prev => ({ ...prev, investmentPeriod: Number(e.target.value) }))}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={formData.investmentPeriod}
                  onChange={(e) => setFormData(prev => ({ ...prev, investmentPeriod: Number(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>1 Year</span>
                  <span>30 Years</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { years: 1, label: 'Short Term', desc: 'Emergency funds' },
                  { years: 5, label: 'Medium Term', desc: 'Major purchases' },
                  { years: 15, label: 'Long Term', desc: 'Retirement planning' },
                ].map((option) => (
                  <button
                    key={option.years}
                    onClick={() => setFormData(prev => ({ ...prev, investmentPeriod: option.years }))}
                    className={`p-4 border rounded-lg text-left transition-all duration-200 ${
                      formData.investmentPeriod === option.years
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{option.years} {option.years === 1 ? 'Year' : 'Years'}</div>
                    <div className="text-sm text-gray-600">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </AnimatedCard>
        );

      case 2:
        return (
          <AnimatedCard className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Investment Sectors</h3>
              <p className="text-gray-600">Select the sectors you're interested in investing in</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {sectors.map((sector) => (
                <button
                  key={sector}
                  onClick={() => handleSectorToggle(sector)}
                  className={`p-4 border rounded-lg text-left transition-all duration-200 ${
                    formData.sectors.includes(sector)
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{sector}</div>
                  {formData.sectors.includes(sector) && (
                    <div className="text-xs text-blue-600 mt-1">✓ Selected</div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Tip:</strong> Diversifying across multiple sectors helps reduce risk. We recommend selecting 3-5 different sectors.
              </p>
            </div>
          </AnimatedCard>
        );

      case 3:
        return (
          <AnimatedCard className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Risk Tolerance</h3>
              <p className="text-gray-600">How comfortable are you with investment risk?</p>
            </div>

            <div className="space-y-4">
              {riskOptions.map((option) => (
                <button
                  key={option.level}
                  onClick={() => setFormData(prev => ({ ...prev, riskTolerance: option.level as any }))}
                  className={`w-full p-6 border rounded-lg text-left transition-all duration-200 ${
                    formData.riskTolerance === option.level
                      ? `border-${option.color}-500 bg-${option.color}-50`
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h4>
                      <p className="text-gray-600 mb-2">{option.description}</p>
                      <p className="text-sm font-medium text-green-600">Expected: {option.expectedReturn}</p>
                    </div>
                    {formData.riskTolerance === option.level && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </AnimatedCard>
        );

      case 4:
        return (
          <AnimatedCard className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Investment Goals</h3>
              <p className="text-gray-600">What's your target amount after the investment period?</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Growth Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
                  <input
                    type="number"
                    min={formData.capitalAmount}
                    step="1000"
                    value={formData.targetGrowth}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetGrowth: Number(e.target.value) }))}
                    className="w-full pl-8 pr-4 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Preferences (Optional)
                </label>
                <textarea
                  value={formData.preferences}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferences: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Any specific companies, ESG preferences, or other investment preferences..."
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Investment Summary</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <p>Initial Investment: ${formData.capitalAmount.toLocaleString()}</p>
                  <p>Investment Period: {formData.investmentPeriod} years</p>
                  <p>Target Amount: ${formData.targetGrowth.toLocaleString()}</p>
                  <p>Required Return: {(((formData.targetGrowth - formData.capitalAmount) / formData.capitalAmount * 100) / formData.investmentPeriod).toFixed(1)}% annually</p>
                  <p>Risk Level: {formData.riskTolerance}</p>
                  <p>Sectors: {formData.sectors.length} selected</p>
                </div>
              </div>
            </div>
          </AnimatedCard>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <LoadingSpinner size="lg" text="Analyzing market data and generating your personalized investment strategy..." />
          <div className="mt-8 space-y-2">
            <p className="text-gray-600">🤖 AI is processing your profile...</p>
            <p className="text-gray-600">📊 Analyzing historical market data...</p>
            <p className="text-gray-600">🎯 Optimizing asset allocation...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {currentStep < 4 ? (
          <button
            onClick={handleNext}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
          >
            Generate Investment Plan
          </button>
        )}
      </div>
    </div>
  );
};

export default InvestmentForm;
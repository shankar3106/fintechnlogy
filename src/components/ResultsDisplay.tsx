import React from 'react';
import { motion } from 'framer-motion';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import { useAppContext } from '../context/AppContext';
import { TrendingUp, Target, Shield, FileText, RefreshCw, Download, ArrowUp, ArrowDown } from 'lucide-react';
import AnimatedCard from './AnimatedCard';
import { generateHistoricalData } from '../services/mlService';
import { generatePDFReport } from '../services/pdfService';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const ResultsDisplay: React.FC = () => {
  const { recommendation, investmentProfile, setRecommendation, setCurrentStep, exchangeRate } = useAppContext();

  if (!recommendation || !investmentProfile) return null;

  const handleStartOver = () => {
    setRecommendation(null);
    setCurrentStep(0);
  };

  const handleDownloadPDF = async () => {
    if (recommendation && investmentProfile) {
      await generatePDFReport(investmentProfile, recommendation, exchangeRate);
    }
  };

  // Chart data for asset allocation
  const doughnutData = {
    labels: recommendation.assetAllocation.map(asset => asset.name),
    datasets: [
      {
        data: recommendation.assetAllocation.map(asset => asset.percentage),
        backgroundColor: recommendation.assetAllocation.map(asset => asset.color),
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const amount = recommendation.assetAllocation[context.dataIndex].amount;
            return `${label}: ${value}% (₹${amount.toLocaleString('en-IN')})`;
          }
        }
      }
    },
  };

  // Historical performance data
  const historicalData = generateHistoricalData(recommendation.assetAllocation);
  const lineData = {
    labels: historicalData.labels,
    datasets: [
      {
        label: 'Portfolio Value',
        data: historicalData.data,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            return `Value: ₹${(context.parsed.y * exchangeRate).toLocaleString('en-IN')}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value: any) {
            return '₹' + (value * exchangeRate).toLocaleString('en-IN');
          }
        }
      },
    },
  };

  const expectedReturn = ((investmentProfile.targetGrowth - investmentProfile.capitalAmount) / investmentProfile.capitalAmount * 100) / investmentProfile.investmentPeriod;

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="text-center">
        <motion.h2
          className="text-3xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Your Personalized Investment Strategy
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Based on our AI analysis of your profile and current market conditions, here's your optimized investment plan.
        </motion.p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            icon: TrendingUp,
            label: 'Expected Annual Return',
            value: `${expectedReturn.toFixed(1)}%`,
            color: 'green',
          },
          {
            icon: Target,
            label: 'Target Amount',
            value: `₹${(investmentProfile.targetGrowth * exchangeRate).toLocaleString('en-IN')}`,
            color: 'blue',
          },
          {
            icon: Shield,
            label: 'Risk Level',
            value: investmentProfile.riskTolerance.charAt(0).toUpperCase() + investmentProfile.riskTolerance.slice(1),
            color: 'purple',
          },
          {
            icon: FileText,
            label: 'Investment Period',
            value: `${investmentProfile.investmentPeriod} Years`,
            color: 'orange',
          },
        ].map((metric, index) => (
          <AnimatedCard key={metric.label} delay={index * 0.1} className="p-6 text-center">
            <div className={`w-12 h-12 bg-${metric.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
              <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
            <div className="text-sm text-gray-600">{metric.label}</div>
          </AnimatedCard>
        ))}
      </div>

      {/* Asset Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatedCard delay={0.3} className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Asset Allocation</h3>
          <div className="h-80">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.4} className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Portfolio Performance Projection</h3>
          <div className="h-80">
            <Line data={lineData} options={lineOptions} />
          </div>
        </AnimatedCard>
      </div>

      {/* Specific Recommendations */}
      <AnimatedCard delay={0.5} className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Specific Investment Recommendations (Live Market Data)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendation.specificRecommendations.map((rec, index) => (
            <div key={rec.symbol} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{rec.symbol}</h4>
                  <p className="text-sm text-gray-600">{rec.name}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                  {rec.allocation}%
                </span>
              </div>
              
              {/* Live Market Data */}
              {rec.currentPrice && rec.currentPrice > 0 && (
                <div className="mb-3 p-2 bg-white rounded border">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {rec.symbol.includes('.NS') ? '₹' : '$'}{rec.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <div className={`flex items-center text-xs ${rec.priceChangePercent && rec.priceChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {rec.priceChangePercent && rec.priceChangePercent >= 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                      {rec.priceChangePercent?.toFixed(2)}%
                    </div>
                  </div>
                  {!rec.symbol.includes('.NS') && (
                    <div className="text-xs text-gray-500">
                      ≈ ₹{rec.priceInINR?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-xs text-gray-500 mb-2">{rec.sector}</p>
              <p className="text-sm text-gray-700">{rec.rationale}</p>
            </div>
          ))}
        </div>
      </AnimatedCard>

      {/* Investment Strategy */}
      <AnimatedCard delay={0.6} className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recommended Investment Strategy</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {recommendation.strategy.type === 'lump_sum' ? 'LS' : 'SIP'}
              </span>
            </div>
            <h4 className="text-lg font-semibold text-blue-900">
              {recommendation.strategy.type === 'lump_sum' ? 'Lump Sum Investment' : 'Systematic Investment Plan (SIP)'}
            </h4>
          </div>
          <p className="text-blue-800 mb-4">{recommendation.strategy.rationale}</p>
          {recommendation.strategy.monthlyAmount && (
            <div className="bg-white rounded-md p-3 border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Monthly Investment:</strong> ₹{recommendation.strategy.monthlyAmount.toLocaleString('en-IN')}
              </p>
            </div>
          )}
        </div>
      </AnimatedCard>

      {/* Risk Assessment */}
      <AnimatedCard delay={0.7} className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Risk Assessment</h3>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-400 to-red-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${(recommendation.riskAssessment.score / 10) * 100}%` }}
            />
          </div>
          <span className="text-lg font-bold text-gray-900">
            {recommendation.riskAssessment.score}/10
          </span>
        </div>
        <p className="text-gray-700">{recommendation.riskAssessment.description}</p>
      </AnimatedCard>

      {/* Process Guide */}
      <AnimatedCard delay={0.8} className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Step-by-Step Investment Guide</h3>
        <div className="space-y-4">
          {recommendation.processGuide.map((step, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">{index + 1}</span>
              </div>
              <p className="text-gray-700 pt-1">{step}</p>
            </div>
          ))}
        </div>
      </AnimatedCard>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleStartOver}
          className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Start Over</span>
        </button>
        <button 
          onClick={handleDownloadPDF}
          className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
        >
          <Download className="w-4 h-4" />
          <span>Download Report (PDF)</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ResultsDisplay;
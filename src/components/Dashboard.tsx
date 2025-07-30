import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import InvestmentForm from './InvestmentForm';
import ResultsDisplay from './ResultsDisplay';
import ProgressBar from './ProgressBar';
import { LogOut, User } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, setUser, recommendation, currentStep } = useAppContext();

  const handleLogout = () => {
    setUser(null);
  };

  const totalSteps = 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50">
      {/* Header */}
      <motion.header
        className="bg-white shadow-sm border-b border-gray-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg"></div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                InvestAI Pro
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!recommendation ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Investment Profile Assessment</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Let's create a personalized investment strategy tailored to your financial goals and risk tolerance.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
              <InvestmentForm />
            </div>
          </motion.div>
        ) : (
          <ResultsDisplay />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  hover?: boolean;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  delay = 0, 
  className = '', 
  hover = true 
}) => {
  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={hover ? { y: -5, shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' } : {}}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
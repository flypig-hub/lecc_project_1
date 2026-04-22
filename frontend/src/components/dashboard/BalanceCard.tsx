import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Coins, Sparkles } from 'lucide-react';

export interface BalanceCardProps {
  balance: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  username?: string;
}

/**
 * Dark Fantasy RPG themed balance card component
 * Features golden glow animation and tier-based styling
 */
export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  tier,
  username = 'Player'
}) => {
  const getTierColors = () => {
    switch (tier) {
      case 'Bronze':
        return {
          primary: '#CD7F32',
          secondary: '#8B4513',
          glow: '#CD7F32',
          text: 'text-amber-700',
          bg: 'bg-amber-900/20',
          border: 'border-amber-600'
        };
      case 'Silver':
        return {
          primary: '#C0C0C0',
          secondary: '#808080',
          glow: '#C0C0C0',
          text: 'text-gray-400',
          bg: 'bg-gray-800/20',
          border: 'border-gray-500'
        };
      case 'Gold':
        return {
          primary: '#FFD700',
          secondary: '#FFA500',
          glow: '#FFD700',
          text: 'text-yellow-400',
          bg: 'bg-yellow-900/20',
          border: 'border-yellow-500'
        };
      case 'Platinum':
        return {
          primary: '#E5E4E2',
          secondary: '#BCC6CC',
          glow: '#E5E4E2',
          text: 'text-gray-300',
          bg: 'bg-gray-700/20',
          border: 'border-gray-400'
        };
      case 'Diamond':
        return {
          primary: '#B9F2FF',
          secondary: '#00CED1',
          glow: '#B9F2FF',
          text: 'text-cyan-300',
          bg: 'bg-cyan-900/20',
          border: 'border-cyan-500'
        };
      default:
        return {
          primary: '#FFD700',
          secondary: '#FFA500',
          glow: '#FFD700',
          text: 'text-yellow-400',
          bg: 'bg-yellow-900/20',
          border: 'border-yellow-500'
        };
    }
  };

  const tierColors = getTierColors();

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getTierIcon = () => {
    switch (tier) {
      case 'Diamond':
        return <Sparkles className="w-6 h-6" />;
      default:
        return <Crown className="w-6 h-6" />;
    }
  };

  return (
    <motion.div
      className="relative w-full max-w-md mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Golden Glow Effect */}
      <motion.div
        className={`absolute inset-0 rounded-2xl ${tierColors.border} border-2`}
        animate={{
          boxShadow: [
            `0 0 20px ${tierColors.glow}40`,
            `0 0 40px ${tierColors.glow}60`,
            `0 0 60px ${tierColors.glow}40`,
            `0 0 20px ${tierColors.glow}40`
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main Card Container */}
      <div className={`relative ${tierColors.bg} backdrop-blur-md rounded-2xl p-6 border-2 ${tierColors.border}`}>
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <motion.div
              className={`${tierColors.text} opacity-80`}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {getTierIcon()}
            </motion.div>
            <div>
              <p className="text-gray-400 text-sm font-medium">Player</p>
              <p className={`${tierColors.text} font-bold text-lg`}>{username}</p>
            </div>
          </div>
          
          {/* Tier Badge */}
          <motion.div
            className={`px-3 py-1 rounded-full ${tierColors.bg} border ${tierColors.border}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className={`${tierColors.text} font-bold text-sm`}>{tier}</span>
          </motion.div>
        </div>

        {/* Balance Section */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Coins className={`w-5 h-5 ${tierColors.text}`} />
              <span className="text-gray-400 text-sm font-medium">Gold Balance</span>
            </div>
            <motion.div
              className={`${tierColors.text} font-bold text-4xl tracking-wider`}
              whileHover={{ scale: 1.02 }}
            >
              {formatBalance(balance)}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Decorative Elements */}
        <div className="flex justify-between items-center">
          <motion.div
            className="flex space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 rounded-full ${tierColors.text} opacity-60`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
          
          <motion.div
            className={`text-xs ${tierColors.text} opacity-60`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            RPG Bank
          </motion.div>
        </div>

        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-black to-transparent" />
        </div>
      </div>

      {/* Floating Particles Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${tierColors.text}`}
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              opacity: 0
            }}
            animate={{
              x: [Math.random() * 100, Math.random() * 100],
              y: [Math.random() * 100, Math.random() * 100],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default BalanceCard;

import React, { useState, useEffect, useMemo } from "react";
import api from "../utils/api";

interface UserTierInfo {
  tierName: string;
  tierTitle: string;
  tierColor: string;
  tierIcon: string;
  currentBalance: number;
  nextTierBalance?: number;
  nextTierName?: string;
  progressPercentage: number;
  achievementCount: number;
}

const TierProfile: React.FC = () => {
  const [tierInfo, setTierInfo] = useState<UserTierInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTierInfo = async () => {
      try {
        const response = await api.get("/gamification/tier");
        setTierInfo(response.data);
      } catch (error) {
        console.error("Error fetching tier info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTierInfo();
    const interval = setInterval(fetchTierInfo, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (isLoading || !tierInfo) {
    return (
      <div className="bg-gray-900 border-4 border-yellow-400 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">
          ADVENTURER PROFILE
        </h2>
        <div className="text-center text-yellow-300">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-2"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const getTierColor = useMemo(() => {
    return (tierColor: string) => {
      switch (tierColor) {
        case "#CD7F32":
          return "text-yellow-600";
        case "#C0C0C0":
          return "text-gray-400";
        case "#FFD700":
          return "text-yellow-400";
        case "#E5E4E2":
          return "text-gray-300";
        case "#B9F2FF":
          return "text-blue-300";
        default:
          return "text-yellow-400";
      }
    };
  }, []);

  return (
    <div className="bg-gray-900 border-4 border-yellow-400 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">
        ADVENTURER PROFILE
      </h2>

      {/* Current Tier */}
      <div className="text-center mb-6">
        <div className={`text-6xl mb-2 ${getTierColor(tierInfo.tierColor)}`}>
          {tierInfo.tierIcon}
        </div>
        <h3 className={`text-xl font-bold ${getTierColor(tierInfo.tierColor)}`}>
          {tierInfo.tierTitle}
        </h3>
        <p className="text-yellow-300 text-sm">Tier: {tierInfo.tierName}</p>
      </div>

      {/* Experience Bar */}
      {tierInfo.nextTierBalance && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-yellow-300 mb-2">
            <span>Progress to {tierInfo.nextTierName}</span>
            <span>{tierInfo.progressPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-black border-2 border-yellow-600 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${getTierColor(tierInfo.tierColor)} bg-gradient-to-r`}
              style={{
                width: `${Math.min(tierInfo.progressPercentage, 100)}%`,
                backgroundColor: tierInfo.tierColor,
              }}
            >
              <div className="h-full bg-gradient-to-r from-transparent to-white opacity-30"></div>
            </div>
          </div>
          <div className="text-center text-yellow-500 text-xs mt-1">
            {tierInfo.currentBalance.toFixed(2)} /{" "}
            {tierInfo.nextTierBalance.toFixed(2)} GOLD
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-black border-2 border-yellow-600 rounded p-3 text-center">
          <p className="text-yellow-300 text-sm">Total Balance</p>
          <p className="text-xl font-bold text-yellow-400">
            {tierInfo.currentBalance.toFixed(2)}
          </p>
        </div>
        <div className="bg-black border-2 border-yellow-600 rounded p-3 text-center">
          <p className="text-yellow-300 text-sm">Achievements</p>
          <p className="text-xl font-bold text-yellow-400">
            {tierInfo.achievementCount}
          </p>
        </div>
      </div>

      {/* Interest Bonus */}
      <div className="text-center">
        <p className="text-yellow-300 text-sm">
          Interest Bonus: +{getInterestBonus(tierInfo.tierName)}%
        </p>
      </div>
    </div>
  );
};

const getInterestBonus = (tierName: string): number => {
  switch (tierName) {
    case "BRONZE":
      return 0.0;
    case "SILVER":
      return 0.1;
    case "GOLD":
      return 0.2;
    case "PLATINUM":
      return 0.3;
    case "DIAMOND":
      return 0.5;
    default:
      return 0.0;
  }
};

export default React.memo(TierProfile);

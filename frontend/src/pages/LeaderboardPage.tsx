import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

interface LeaderboardEntry {
  username: string;
  tierName: string;
  tierTitle: string;
  tierColor: string;
  tierIcon: string;
  totalBalance: number;
  rank: number;
}

const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get("/gamification/leaderboard");
        setLeaderboard(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const getTierColor = (tierColor: string) => {
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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "[CROWN]"; // Crown for 1st place
      case 2:
        return "[MEDAL]"; // Medal for 2nd place
      case 3:
        return "[MEDAL]"; // Medal for 3rd place
      default:
        return `[${rank}]`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-400"; // Gold
      case 2:
        return "text-gray-400"; // Silver
      case 3:
        return "text-orange-600"; // Bronze
      default:
        return "text-yellow-300";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-yellow-400 font-pixel flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-xl">Loading Hall of Fame...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-yellow-400 font-pixel">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex justify-between items-center mb-6">
            <Link
              to="/dashboard"
              className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition-all transform hover:scale-105"
            >
              Back to Dashboard
            </Link>
            <div className="text-center">
              <h1 className="text-6xl font-bold text-yellow-400 animate-glow mb-4">
                HALL OF FAME
              </h1>
              <p className="text-xl text-yellow-300">Legendary Adventurers</p>
            </div>
            <div></div>
          </div>
        </header>

        {/* Leaderboard Table */}
        <main className="max-w-4xl mx-auto">
          <div className="bg-gray-900 border-4 border-yellow-400 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-yellow-600 text-black">
                  <th className="py-3 px-4 text-left font-bold">Rank</th>
                  <th className="py-3 px-4 text-left font-bold">Adventurer</th>
                  <th className="py-3 px-4 text-left font-bold">Tier</th>
                  <th className="py-3 px-4 text-right font-bold">Total Gold</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr
                    key={entry.username}
                    className={`border-b border-yellow-800 hover:bg-gray-800 transition-colors ${
                      index % 2 === 0 ? "bg-black" : "bg-gray-950"
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-2xl font-bold ${getRankColor(entry.rank)}`}
                        >
                          {getRankIcon(entry.rank)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-bold text-yellow-300">
                          {entry.username}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-2xl ${getTierColor(entry.tierColor)}`}
                        >
                          {entry.tierIcon}
                        </span>
                        <div>
                          <p
                            className={`font-bold ${getTierColor(entry.tierColor)}`}
                          >
                            {entry.tierTitle}
                          </p>
                          <p className="text-xs text-yellow-500">
                            {entry.tierName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <p className="text-xl font-bold text-yellow-400">
                        {entry.totalBalance.toFixed(2)} GOLD
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-8 bg-gray-900 border-4 border-yellow-400 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-yellow-400">
              Tier Legend
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-3xl text-yellow-600 mb-2">[BRONZE]</div>
                <p className="text-sm text-yellow-300">Bronze</p>
                <p className="text-xs text-yellow-500">0+ GOLD</p>
              </div>
              <div className="text-center">
                <div className="text-3xl text-gray-400 mb-2">[SILVER]</div>
                <p className="text-sm text-yellow-300">Silver</p>
                <p className="text-xs text-yellow-500">10K+ GOLD</p>
              </div>
              <div className="text-center">
                <div className="text-3xl text-yellow-400 mb-2">[GOLD]</div>
                <p className="text-sm text-yellow-300">Gold</p>
                <p className="text-xs text-yellow-500">50K+ GOLD</p>
              </div>
              <div className="text-center">
                <div className="text-3xl text-gray-300 mb-2">[PLATINUM]</div>
                <p className="text-sm text-yellow-300">Platinum</p>
                <p className="text-xs text-yellow-500">100K+ GOLD</p>
              </div>
              <div className="text-center">
                <div className="text-3xl text-blue-300 mb-2">[DIAMOND]</div>
                <p className="text-sm text-yellow-300">Diamond</p>
                <p className="text-xs text-yellow-500">500K+ GOLD</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-yellow-500 text-sm animate-pulse">
              Leaderboard updates automatically every 15 seconds
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeaderboardPage;

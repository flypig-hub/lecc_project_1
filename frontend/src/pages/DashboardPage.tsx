import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";
import TransactionHistory from "../components/TransactionHistory";
import TransferModal from "../components/TransferModal";
import TierProfile from "../components/TierProfile";

interface Account {
  id: number;
  accountNumber: string;
  balance: number;
}

const DashboardPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTransferModalOpen, setIsTransferModalOpen] =
    useState<boolean>(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch accounts every 2 seconds
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api.get("/bank/accounts");
        setAccounts(response.data);
        if (response.data.length > 0 && !selectedAccount) {
          setSelectedAccount(response.data[0]);
        }
      } catch (error: any) {
        console.error("Error fetching accounts:", error);
        // If unauthorized, redirect to login
        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchAccounts();
    const interval = setInterval(fetchAccounts, 2000);

    return () => clearInterval(interval);
  }, [selectedAccount, navigate]);

  const handleDeposit = async () => {
    if (!selectedAccount || !depositAmount) return;

    setIsLoading(true);
    try {
      const response = await api.post(
        `/bank/accounts/${selectedAccount.id}/deposit`,
        {
          amount: parseFloat(depositAmount),
        },
      );
      setSelectedAccount(response.data);
      setDepositAmount("");
    } catch (error) {
      console.error("Error depositing:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!selectedAccount || !withdrawAmount) return;

    setIsLoading(true);
    try {
      const response = await api.post(
        `/bank/accounts/${selectedAccount.id}/withdraw`,
        {
          amount: parseFloat(withdrawAmount),
        },
      );
      setSelectedAccount(response.data);
      setWithdrawAmount("");
    } catch (error) {
      console.error("Error withdrawing:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createInitialAccount = async () => {
    try {
      const response = await api.post("/bank/accounts", {
        accountNumber: `RPG-${user?.id || "001"}-001`,
        initialBalance: 1000.0,
      });
      setSelectedAccount(response.data);
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black text-yellow-400 font-pixel">
      <div className="container mx-auto px-4 py-8">
        {/* Header with User Info */}
        <header className="text-center mb-12">
          <div className="flex justify-between items-center mb-6">
            <Link
              to="/leaderboard"
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded transition-all transform hover:scale-105"
            >
              Hall of Fame
            </Link>
            <div className="text-center">
              <h1 className="text-6xl font-bold text-yellow-400 animate-glow mb-4">
                RPG BANK
              </h1>
              <p className="text-xl text-yellow-300">
                Welcome, {user?.username} Adventurer!
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded transition-all transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto">
          {accounts.length === 0 ? (
            <div className="text-center">
              <div className="bg-gray-900 border-4 border-yellow-400 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4 text-yellow-400">
                  No Account Yet
                </h2>
                <p className="text-yellow-300 mb-6">
                  Start your adventure by creating your first account!
                </p>
                <button
                  onClick={createInitialAccount}
                  className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-lg text-xl transition-all transform hover:scale-105"
                >
                  CREATE FIRST ACCOUNT
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Account Info Panel */}
              <div className="bg-gray-900 border-4 border-yellow-400 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-yellow-400">
                  ACCOUNT STATUS
                </h2>
                {selectedAccount && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-yellow-300">Account Number</p>
                      <p className="text-xl font-bold">
                        {selectedAccount.accountNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-yellow-300">Current Balance</p>
                      <p className="text-3xl font-bold text-yellow-400 animate-glow">
                        {selectedAccount.balance.toFixed(2)} GOLD
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tier Profile */}
              <TierProfile />

              {/* Action Panel */}
              <div className="bg-gray-900 border-4 border-yellow-400 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-yellow-400">
                  BANK ACTIONS
                </h2>

                {/* Deposit Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-2 text-yellow-300">
                    DEPOSIT
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="Amount"
                      className="flex-1 bg-black border-2 border-yellow-400 text-yellow-400 px-3 py-2 rounded"
                    />
                    <button
                      onClick={handleDeposit}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-black font-bold px-4 py-2 rounded transition-all transform hover:scale-105"
                    >
                      DEPOSIT
                    </button>
                  </div>
                </div>

                {/* Withdraw Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-2 text-yellow-300">
                    WITHDRAW
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Amount"
                      className="flex-1 bg-black border-2 border-yellow-400 text-yellow-400 px-3 py-2 rounded"
                    />
                    <button
                      onClick={handleWithdraw}
                      disabled={isLoading}
                      className="bg-red-600 hover:bg-red-500 disabled:bg-gray-600 text-black font-bold px-4 py-2 rounded transition-all transform hover:scale-105"
                    >
                      WITHDRAW
                    </button>
                  </div>
                </div>

                {/* Transfer Section */}
                <div>
                  <h3 className="text-lg font-bold mb-2 text-yellow-300">
                    SEND GOLD
                  </h3>
                  <button
                    onClick={() => setIsTransferModalOpen(true)}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded transition-all transform hover:scale-105"
                  >
                    Send Gold Magic
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Interest Notice */}
          <div className="mt-8 text-center">
            <p className="text-yellow-300 animate-pulse">
              Interest Applied Every 10 Seconds: +1% GOLD
            </p>
          </div>

          {/* Transaction History */}
          <div className="mt-8">
            <TransactionHistory />
          </div>
        </main>
      </div>

      {/* Transfer Modal */}
      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onTransferSuccess={() => {
          // Refresh accounts after successful transfer
          const fetchAccounts = async () => {
            try {
              const response = await api.get("/bank/accounts");
              setAccounts(response.data);
              if (response.data.length > 0 && !selectedAccount) {
                setSelectedAccount(response.data[0]);
              }
            } catch (error) {
              console.error("Error fetching accounts:", error);
            }
          };
          fetchAccounts();
        }}
      />
    </div>
  );
};

export default DashboardPage;

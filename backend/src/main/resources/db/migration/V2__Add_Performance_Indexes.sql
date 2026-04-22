-- Performance optimization indexes for RPG Bank

-- Transaction indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_transaction_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transaction_date ON transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transaction_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transaction_account_date ON transactions(account_id, transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transaction_account_type ON transactions(account_id, type);

-- Account indexes for balance queries
CREATE INDEX IF NOT EXISTS idx_account_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_account_balance ON accounts(balance DESC);

-- User indexes for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_user_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_user_created_at ON users(created_at);

-- UserAchievement indexes for achievement tracking
CREATE INDEX IF NOT EXISTS idx_user_achievement_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievement_achievement_id ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_achievement_unlocked_at ON user_achievements(unlocked_at DESC);

-- Tier indexes for quick tier lookups
CREATE INDEX IF NOT EXISTS idx_tier_min_balance ON tiers(min_balance);

-- Achievement indexes for achievement browsing
CREATE INDEX IF NOT EXISTS idx_achievement_condition ON achievements(condition);
CREATE INDEX IF NOT EXISTS idx_achievement_points ON achievements(achievement_points DESC);

-- Composite index for leaderboard optimization
CREATE INDEX IF NOT EXISTS idx_account_user_balance ON accounts(user_id, balance DESC);

-- Performance logging
SELECT 'Performance indexes created successfully' as status;

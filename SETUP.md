# Setup Guide for Java RPG Bank

## Current Status
- **Frontend**: Running on http://localhost:5174
- **Backend**: Needs setup

## Prerequisites
- Java 17+ (Java 20 detected on your system)
- Node.js 16+ (installed)
- Gradle (needs to be installed)

## Quick Setup Steps

### 1. Install Gradle (if not installed)
```bash
# Option 1: Download from https://gradle.org/install/
# Option 2: Use package manager
# Option 3: Use Gradle wrapper (recommended)
```

### 2. Start Backend
```bash
cd backend
./gradlew bootRun
```

### 3. Start Frontend (already running)
```bash
cd frontend
npm run dev
```

## Alternative: Use IDE
1. Open the backend folder in IntelliJ IDEA or Eclipse
2. Import as Gradle project
3. Run the main class: `com.rpgbank.RpgBankApplication`

## Access Points
- Frontend: http://localhost:5174
- Backend API: http://localhost:8080 (when running)
- H2 Console: http://localhost:8080/h2-console

## Features to Test
1. Create initial account with 1000 GOLD
2. Deposit/withdraw operations
3. Real-time balance updates (every 2 seconds)
4. Automatic interest (1% every 10 seconds)

## Troubleshooting
- If backend won't start, ensure Java 17+ is installed
- Check that port 8080 is available
- Verify Gradle installation or use IDE

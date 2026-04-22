# Java RPG Bank - Full Stack Application

A full-stack RPG-themed banking application built with Java 17 + Spring Boot backend and React + Vite frontend.

## Features

### Backend (Java 17 + Spring Boot)
- **Account Entity**: Balance field with JPA persistence
- **BankService**: Thread-safe deposit/withdraw operations using ReentrantLock
- **InterestTask**: Automatic 1% interest applied every 10 seconds
- **REST API**: Full CRUD operations for account management
- **H2 Database**: In-memory database with web console

### Frontend (React + Vite + Tailwind CSS)
- **RPG Theme**: Black background, pixel font style, gold accents
- **Real-time Dashboard**: Updates every 2 seconds
- **Interactive UI**: Deposit/withdraw buttons with animations
- **Responsive Design**: Works on all screen sizes

## Project Structure

```
lecc_project_1/
|-- backend/
|   |-- src/main/java/com/rpgbank/
|   |   |-- entity/Account.java
|   |   |-- service/BankService.java
|   |   |-- service/InterestTask.java
|   |   |-- controller/BankController.java
|   |   |-- repository/AccountRepository.java
|   |   |-- RpgBankApplication.java
|   |-- src/main/resources/application.properties
|   |-- build.gradle
|   |-- settings.gradle
|-- frontend/
|   |-- src/
|   |   |-- App.tsx
|   |   |-- main.tsx
|   |   |-- index.css
|   |   |-- App.css
|   |-- package.json
|   |-- vite.config.ts
|   |-- tailwind.config.js
|   |-- postcss.config.js
|   |-- tsconfig.json
|   |-- index.html
|-- start-backend.bat
|-- start-frontend.bat
|-- start-all.bat
```

## Prerequisites

- **Java 17** or higher
- **Node.js** 16+ and npm
- **Gradle** (included with project)

## Setup & Installation

### 1. Backend Setup
```bash
cd backend
./gradlew build
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

## Running the Application

### Option 1: Start Both Servers (Recommended)
```bash
# Run from project root
start-all.bat
```

### Option 2: Start Servers Separately

**Backend:**
```bash
start-backend.bat
```

**Frontend:**
```bash
start-frontend.bat
```

### Option 3: Manual Commands

**Backend:**
```bash
cd backend
./gradlew bootRun
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **H2 Console**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:rpgbank`
  - Username: `sa`
  - Password: (empty)

## API Endpoints

- `GET /api/bank/accounts` - Get all accounts
- `POST /api/bank/accounts` - Create new account
- `GET /api/bank/accounts/{id}` - Get account by ID
- `POST /api/bank/accounts/{id}/deposit` - Deposit to account
- `POST /api/bank/accounts/{id}/withdraw` - Withdraw from account

## Features Demonstration

1. **Thread Safety**: Multiple concurrent transactions are handled safely using ReentrantLock
2. **Scheduled Interest**: 1% interest automatically applied every 10 seconds
3. **Real-time Updates**: Frontend polls backend every 2 seconds for live balance updates
4. **RPG Theme**: Immersive gaming-style UI with gold animations and pixel fonts

## Learning Points

### Java Concepts
- **Multithreading**: ReentrantLock for thread synchronization
- **Spring Boot**: REST API development with @RestController
- **JPA**: Entity mapping and repository patterns
- **Scheduling**: @Scheduled annotation for periodic tasks
- **Dependency Injection**: @Service and @Autowired annotations

### React Concepts
- **Hooks**: useState, useEffect for state management
- **Real-time Updates**: Polling with setInterval
- **Styling**: Tailwind CSS for rapid UI development
- **TypeScript**: Type safety for better development experience

## Troubleshooting

- **Backend won't start**: Ensure Java 17 is installed and JAVA_HOME is set
- **Frontend won't start**: Run `npm install` in frontend directory
- **CORS errors**: Backend is configured to allow frontend at localhost:5173
- **Database connection**: H2 console available at /h2-console for debugging

Enjoy your RPG Banking adventure!

# 📚 RPG Bank API Documentation

## 🎯 Overview

This document provides comprehensive API documentation for the RPG Bank application. All endpoints follow RESTful principles and use standard HTTP status codes.

## 🔐 Authentication

All API endpoints (except public endpoints) require JWT token authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## 📋 Base URL

- **Development**: `http://localhost:8080`
- **Production**: `https://your-domain.com`
- **API Base Path**: `/api`

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│              Frontend (React)              │
│  ┌─────────────────────────────────────┐    │
│  │           Nginx (Reverse Proxy)          │    │
│  │  ┌─────────────────────────────────────┐    │    │
│  │  │  Backend (Spring Boot)    │    │
│  │  │  ┌─────────────────────────────┐    │    │
│  │  │  │  PostgreSQL Database        │    │
│  │  │  └─────────────────────────────┘    │    │
│  │  │  Redis Cache               │    │
│  │  └─────────────────────────────┘    │    │
│  └─────────────────────────────────────────────┘
│                                          │
└─────────────────────────────────────────────────┘
```

---

## 🔑 Authentication API

### Register User
Create a new user account with role-based access control.

```http
POST /api/auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "string (3-20 characters, unique)",
  "email": "string (valid email format)",
  "password": "string (8-128 characters)",
  "role": "USER | ADMIN (optional, defaults to USER)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt-token-string",
    "user": {
      "id": 1,
      "username": "newuser",
      "email": "user@example.com",
      "role": "USER",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  },
  "timestamp": 1642242800000
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Username already exists",
  "timestamp": 1642242800000
}
```

### Login User
Authenticate with username and password to receive JWT token.

```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token-string",
    "user": {
      "id": 1,
      "username": "existinguser",
      "email": "user@example.com",
      "role": "USER",
      "lastLogin": "2024-01-15T10:30:00Z"
    }
  },
  "timestamp": 1642242800000
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "timestamp": 1642242800000
}
```

---

## 💳 Banking API

### Get Accounts
Retrieve all accounts for the authenticated user.

```http
GET /api/bank/accounts
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Accounts retrieved successfully",
  "data": [
    {
      "id": 1,
      "accountNumber": "ACC-001",
      "balance": 5000.00,
      "createdAt": "2024-01-15T09:00:00Z"
    },
    {
      "id": 2,
      "accountNumber": "ACC-002", 
      "balance": 2500.50,
      "createdAt": "2024-01-10T14:30:00Z"
    }
  ],
  "timestamp": 1642242800000
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "timestamp": 1642242800000
}
```

### Create Account
Create a new bank account with initial balance.

```http
POST /api/bank/accounts
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "initialBalance": "number (>= 1000)"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "id": 3,
    "accountNumber": "ACC-003",
    "balance": 1000.00,
    "createdAt": "2024-01-15T11:00:00Z"
  },
  "timestamp": 1642242800000
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Initial balance must be at least 1000",
  "timestamp": 1642242800000
}
```

### Deposit
Deposit funds into an existing account.

```http
POST /api/bank/accounts/{accountId}/deposit
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": "number (>= 1)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Deposit successful",
  "data": {
    "accountId": 1,
    "newBalance": 1500.00,
    "transactionId": "TXN-001"
  },
  "timestamp": 1642242800000
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Amount must be positive",
  "timestamp": 1642242800000
}
```

### Withdraw
Withdraw funds from an existing account.

```http
POST /api/bank/accounts/{accountId}/withdraw
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": "number (>= 1)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Withdrawal successful",
  "data": {
    "accountId": 1,
    "newBalance": 800.00,
    "transactionId": "TXN-002"
  },
  "timestamp": 1642242800000
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Insufficient funds",
  "timestamp": 1642242800000
}
```

### Transfer
Transfer funds between accounts.

```http
POST /api/bank/transfer
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "fromAccountId": "number",
  "toAccountNumber": "string (valid account number)",
  "amount": "number (>= 1)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Transfer successful",
  "data": {
    "transactionId": "TXN-003",
    "fromAccount": "ACC-001",
    "toAccount": "ACC-002",
    "amount": 500.00
  },
  "timestamp": 1642242800000
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Insufficient funds or invalid account",
  "timestamp": 1642242800000
}
```

### Get Transactions
Retrieve transaction history for the authenticated user.

```http
GET /api/bank/transactions
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 20)
- `type` (optional): Transaction type filter
- `startDate` (optional): Filter transactions from this date
- `endDate` (optional): Filter transactions to this date

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Transactions retrieved successfully",
  "data": {
    "transactions": [
      {
        "id": 1,
        "type": "DEPOSIT",
        "amount": 1000.00,
        "description": "Initial deposit",
        "transactionDate": "2024-01-15T09:00:00Z",
        "fromAccount": null,
        "toAccount": "ACC-001"
      }
    ],
    "pagination": {
      "page": 0,
      "size": 20,
      "totalElements": 1,
      "totalPages": 1
    }
  },
  "timestamp": 1642242800000
}
```

---

## 🎮 Gamification API

### Get Leaderboard
Retrieve the global leaderboard of users by total balance.

```http
GET /api/gamification/leaderboard
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 10)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Leaderboard retrieved successfully",
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "username": "goldplayer",
        "totalBalance": 50000.00,
        "tier": "PLATINUM"
      },
      {
        "rank": 2,
        "username": "silverplayer",
        "totalBalance": 15000.00,
        "tier": "SILVER"
      }
    ],
    "pagination": {
      "page": 0,
      "size": 10,
      "totalElements": 2,
      "totalPages": 1
    }
  },
  "timestamp": 1642242800000
}
```

### Get User Tier
Get the current tier and progress for a specific user.

```http
GET /api/gamification/tier/{userId}
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User tier retrieved successfully",
  "data": {
    "userId": 1,
    "username": "player1",
    "currentTier": "SILVER",
    "progress": {
      "currentBalance": 15000.00,
      "nextTierBalance": 20000.00,
      "tierRequirements": {
        "GOLD": 100000.00,
        "achievementsRequired": 5
      }
    }
  },
  "timestamp": 1642242800000
}
```

### Check Achievements
Trigger achievement checking for the authenticated user.

```http
POST /api/gamification/check-achievements
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Achievements checked successfully",
  "data": {
    "newAchievements": [
      {
        "id": 1,
        "name": "First Account",
        "description": "Create your first bank account",
        "tier": "BRONZE",
        "reward": "100 Gold"
      }
    ],
    "totalAchievements": 15
  },
  "timestamp": 1642242800000
}
```

---

## 👑 Admin API

*All admin endpoints require `ROLE_ADMIN` privileges.*

### Get System Stats
Retrieve comprehensive system statistics.

```http
GET /api/admin/stats
Authorization: Bearer <admin-jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "System statistics retrieved successfully",
  "data": {
    "totalUsers": 150,
    "totalAccounts": 325,
    "totalBalance": 2500000.00,
    "todayTransactions": 45,
    "activeUsers": 89,
    "date": "2024-01-15"
  },
  "timestamp": 1642242800000
}
```

### Get Transaction Chart
Retrieve 7-day transaction volume data for charts.

```http
GET /api/admin/transactions/chart
Authorization: Bearer <admin-jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Transaction chart data retrieved successfully",
  "data": [
    {
      "date": "2024-01-15",
      "transactionCount": 45,
      "totalAmount": 125000.00
    },
    {
      "date": "2024-01-14",
      "transactionCount": 38,
      "totalAmount": 98000.00
    },
    {
      "date": "2024-01-13",
      "transactionCount": 52,
      "totalAmount": 156000.00
    }
  ],
  "timestamp": 1642242800000
}
```

---

## 🔧 System Health API

### Health Check
Check the overall health status of the system.

```http
GET /actuator/health
```

**Response (200 OK):**
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "validationQuery": "isValid()"
      }
    },
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": "250GB",
        "free": "180GB"
      }
    }
  },
  "ping": {
      "status": "UP"
    }
}
```

### System Metrics
Get detailed system performance metrics.

```http
GET /actuator/metrics
```

**Response (200 OK):**
```json
{
  "names": [
    "jvm.memory.used",
    "jvm.gc.pause",
    "http.server.requests",
    "database.connections.active"
  ],
  "measurements": [
    {
      "statistic": "jvm.memory.used",
      "value": 134217728
    }
  ]
}
```

---

## 🚨 Error Responses

All endpoints return consistent error responses with proper HTTP status codes.

### Standard Error Format
```json
{
  "success": false,
  "message": "Human-readable error description",
  "timestamp": 1642242800000
}
```

### Common HTTP Status Codes
- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Invalid or missing authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource does not exist
- **409 Conflict**: Resource already exists
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Unexpected server error

---

## 🔄 Pagination

All list endpoints support pagination for efficient data retrieval.

### Pagination Parameters
- `page`: Zero-based page number (default: 0)
- `size`: Number of items per page (default: 20)
- `sort`: Sort field (optional)
- `order`: Sort direction (ASC/DESC, optional)

### Pagination Response Format
```json
{
  "data": [...],
  "pagination": {
    "page": 0,
    "size": 20,
    "totalElements": 100,
    "totalPages": 5,
    "first": true,
    "last": false
  }
}
```

---

## 🌐 CORS Configuration

The API supports Cross-Origin Resource Sharing (CORS) for frontend integration.

### Allowed Origins
- Development: `http://localhost:5173`
- Production: `https://your-domain.com`

### Allowed Headers
- `Authorization`: Bearer token authentication
- `Content-Type`: `application/json`
- `Accept`: `application/json`

---

## 📝 Rate Limiting

API endpoints are protected against abuse with rate limiting.

### Limits
- **General**: 10 requests per second per IP
- **Authentication**: 5 requests per second per IP
- **Admin endpoints**: 30 requests per second per IP

### Rate Limit Headers
When rate limits are exceeded:
```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1642242800
Retry-After: 60
```

---

## 🔍 Testing

### API Testing Tools
- **Swagger UI**: Available at `/swagger-ui.html`
- **Postman Collection**: Import the provided collection
- **cURL Examples**: See endpoint documentation

### Example cURL Commands
```bash
# Register user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'

# Get accounts (with token)
TOKEN=$(curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }' | jq -r '.data.token')

curl -X GET http://localhost:8080/api/bank/accounts \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📞 Support

For API support and questions:
- **Documentation**: This document
- **Issues**: [GitHub Issues](https://github.com/your-username/rpg-bank/issues)
- **Email**: support@rpgbank.com
- **Discord**: [Join our community](https://discord.gg/rpgbank)

---

**📚 Last Updated**: January 15, 2024

*This documentation covers all current API endpoints and will be updated as the system evolves.*

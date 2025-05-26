# Renaissance Backend - Decentralized Football API

The backend API service for Renaissance, providing robust data management, real-time updates, and Web3 integration for the decentralized football fan experience platform.

## 🏗️ Architecture Overview

Renaissance is built as a **microservices architecture** with three main repositories:

- **Frontend**: Next.js 14 with TypeScript - User interface and Web3 interactions
- **Backend** (This repo): NestJS with TypeScript - API services and business logic
- **Smart Contracts**: Cairo on Starknet - Decentralized betting and content access

## 🚀 Backend Features

### Core API Services
- 🔐 **Authentication & Authorization** - JWT-based auth with role management
- ⚽ **Football Data Management** - Teams, players, matches, and statistics
- 📊 **Real-time Updates** - WebSocket connections for live data
- 🎯 **Betting Logic** - Odds calculation and bet management
- 🎥 **Content Management** - Premium player content and access control

### Web3 Integration
- 🔗 **Starknet Integration** - Smart contract interaction layer
- 📝 **Transaction Monitoring** - Blockchain event listening and processing
- 🔐 **Wallet Verification** - Signature verification for Web3 authentication
- 💰 **Token Operations** - Balance tracking and transaction management

### Data & Infrastructure
- 🗄️ **PostgreSQL Database** - Relational data with TypeORM
- 📡 **Redis Caching** - High-performance caching layer
- 🔄 **Event Sourcing** - Audit trails and data consistency
- 📈 **Monitoring & Logging** - Comprehensive observability

## 🛠️ Tech Stack

### Core Framework
- **NestJS** - Scalable Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Express** - HTTP server (under NestJS)

### Database & Caching
- **PostgreSQL** - Primary database
- **TypeORM** - Database ORM with migrations
- **Redis** - Caching and session storage
- **Bull Queue** - Background job processing

### Web3 & Blockchain
- **Starknet.js** - Starknet JavaScript SDK
- **ethers.js** - Ethereum utilities
- **Cairo contracts** - Smart contract ABIs

### Authentication & Security
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens
- **bcrypt** - Password hashing
- **Helmet** - Security headers

### Real-time & Communication
- **Socket.io** - WebSocket implementation
- **Bull** - Job queues for async processing
- **NodeCron** - Scheduled tasks

### Testing & Quality
- **Jest** - Testing framework
- **Supertest** - HTTP testing
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🏁 Getting Started

### Prerequisites
- Node.js 18.x or later
- PostgreSQL 14+
- Redis 6+
- npm/yarn/pnpm package manager

### Quick Start

1. **Clone the backend repository:**
```bash
git clone https://github.com/renaissance-org/renaissance-backend.git
cd renaissance-backend
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Configure your environment:
```env
# Server Configuration
NODE_ENV=development
PORT=3001
API_VERSION=v1

# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=renaissance_user
DATABASE_PASSWORD=your_password
DATABASE_NAME=renaissance_db

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=30d

# Starknet Configuration
STARKNET_RPC_URL=https://starknet-goerli.g.alchemy.com/v2/your-api-key
STARKNET_PRIVATE_KEY=your_private_key
STARKNET_ACCOUNT_ADDRESS=0x...

# Smart Contract Addresses
BETTING_CONTRACT_ADDRESS=0x...
CONTENT_CONTRACT_ADDRESS=0x...
TOKEN_CONTRACT_ADDRESS=0x...

# External APIs
FOOTBALL_API_URL=https://api.football-data.org/v4
FOOTBALL_API_KEY=your_football_api_key

# File Storage (Optional)
AWS_S3_BUCKET=renaissance-content
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

4. **Set up the database:**
```bash
# Run database migrations
npm run migration:run

# Seed initial data
npm run seed
```

5. **Start Redis server:**
```bash
redis-server
```

6. **Run the development server:**
```bash
npm run start:dev
```

7. **API is now running on [http://localhost:3001](http://localhost:3001)**

## 📁 Project Structure

```

```

## 🔧 Available Scripts

```bash
# Development
npm run start:dev      # Start development server with hot reload
npm run start:debug    # Start with debugging enabled
npm run start:prod     # Start production server

# Building
npm run build          # Build the application
npm run prebuild       # Pre-build tasks

# Database
npm run migration:generate  # Generate new migration
npm run migration:run      # Run pending migrations
npm run migration:revert   # Revert last migration
npm run seed              # Seed database with initial data

# Testing
npm run test              # Run unit tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage
npm run test:e2e         # Run end-to-end tests

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier

# Documentation
npm run doc:generate     # Generate API documentation
npm run doc:serve        # Serve documentation locally
```

## 🎯 API Endpoints

```

## 🗄️ Database Schema

### Key Entities
```typescript
// User Management
User, Profile, Role, Permission

// Football Data
Team, Player, Match, Tournament, Season

// Betting
Bet, BettingEvent, Odds, Market

// Content
Content, ContentAccess, ContentCategory

// Web3
Wallet, Transaction, ContractEvent
```

### Relationships
- Users have Profiles and Roles
- Teams have Players and Matches
- Bets reference BettingEvents and Users
- Content has access control via ContentAccess

## 🔐 Security Implementation

### Authentication Flow
1. User registers/logs in with credentials
2. JWT token issued with user claims
3. Optional Web3 wallet verification
4. Role-based access control applied

### API Security
- Rate limiting on all endpoints
- Input validation with class-validator
- SQL injection prevention via TypeORM
- XSS protection with sanitization
- CORS configuration for frontend domains

## 🧪 Testing Strategy

### Unit Tests
```bash
# Test individual services and controllers
npm run test src/auth/auth.service.spec.ts
npm run test src/betting/betting.controller.spec.ts
```

### Integration Tests
```bash
# Test database interactions and API endpoints
npm run test:e2e
```

### Web3 Testing
```bash
# Test smart contract interactions
npm run test src/web3/starknet.service.spec.ts
```

## 🚀 Deployment

### Docker Deployment
```dockerfile
# Dockerfile included for containerization
docker build -t renaissance-backend .
docker run -p 3001:3001 renaissance-backend
```

### Environment Setup
- Production database with connection pooling
- Redis cluster for high availability
- PM2 for process management
- Nginx for reverse proxy

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/api-enhancement`
3. Follow NestJS conventions and patterns
4. Write tests for new functionality
5. Update API documentation
6. Submit pull request with detailed description

### Coding Standards
- Use TypeScript for all code
- Follow NestJS module structure
- Implement proper error handling
- Write comprehensive tests
- Document API endpoints with Swagger

## 📚 Related Repositories

- **Frontend**: [renaissance-frontend](https://github.com/renaissance-org/renaissance-frontend) - Next.js application
- **Smart Contracts**: [renaissance-contracts](https://github.com/renaissance-org/renaissance-contracts) - Cairo smart contracts

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ⚡ by the Renaissance team. Powered by NestJS and Starknet.

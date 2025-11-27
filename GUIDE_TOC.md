# Building a Monetized Real-Time Streaming App: Complete Guide
## Table of Contents for 2-Part Series

---

## Part 1: Integrating X402 Payment Gateway (2500+ words)

### Introduction
- Overview of X402 Protocol
- Why X402 for Web Monetization
- What We're Building: A Payment-Protected Web Application
- Prerequisites and Requirements

### Chapter 1: Understanding X402 Architecture
- HTTP 402 Payment Required Status Code
- X402 Protocol Components
  - Client/Server Model
  - Facilitator Role
  - Wallet Integration
- Network Support: Base Sepolia vs Base Mainnet
- ERC-20 Token Payments (USDC) vs Native ETH

### Chapter 2: Project Setup and Initial Configuration
- Creating the Project Structure
- Installing Core Dependencies
  - Express.js Setup
  - x402-express Middleware
  - x402-axios Client
  - viem for Wallet Management
  - dotenv for Environment Variables
- Understanding Package Dependencies
- Project Directory Structure

### Chapter 3: Environment Configuration
- Creating `.env` File
- Understanding Environment Variables
  - X402_PRIVATE_KEY: Your Paying Wallet
  - X402_BASE_URL: Target Server URL
  - Network Configuration
- Common `.env` Mistakes and Solutions
- Security Best Practices for Private Keys

### Chapter 4: Setting Up the Express Server
- Basic Express Application Structure
- Static File Serving
- Middleware Configuration
- Route Organization
- Error Handling Setup

### Chapter 5: Implementing X402 Payment Middleware
- Installing and Configuring x402-express
- Understanding paymentMiddleware Function
- Configuring Protected Routes
  - Route Pattern Matching
  - Price Configuration
  - Network Selection
  - Facilitator URL Setup
- Receiver Wallet Address Configuration
- Middleware Order and Placement

### Chapter 6: Creating the X402 Client
- Understanding x402-axios Package
- Setting Up viem Wallet Client
  - Creating Wallet from Private Key
  - Configuring Chain (Base Sepolia)
  - RPC Endpoint Configuration
- Wrapping Axios with Payment Interceptor
- Understanding withPaymentInterceptor
- Client Export and Module Structure

### Chapter 7: Building the Payment Flow
- Creating the Payment Page (Frontend)
  - HTML Structure
  - Payment Button Implementation
  - Status Messages and User Feedback
- Backend Payment Endpoint (`/api/x402-pay`)
  - Route Handler Implementation
  - Calling Protected Route via paidClient
  - Error Handling
  - Success Response Formatting
- Payment Verification Flow
- Redirect Logic After Payment

### Chapter 8: Common Issues and Debugging
- Issue 1: Environment Variables Not Loading
  - Problem: `.env` file not being read
  - Solution: Installing and configuring dotenv
  - Verification methods
- Issue 2: Network Mismatch Errors
  - Problem: Base mainnet not supported
  - Solution: Switching to Base Sepolia
  - How to verify network compatibility
- Issue 3: Port Conflicts
  - Problem: EADDRINUSE errors
  - Solution: Port management strategies
- Issue 4: Dependency Corruption
  - Problem: Missing modules
  - Solution: Clean reinstall process
- Issue 5: Transaction Visibility
  - Problem: Payments not in Transactions tab
  - Solution: Understanding ERC-20 vs Native ETH
  - Where to find token transfers

### Chapter 9: Testing and Verification
- Testing the Payment Flow
- Verifying On-Chain Transactions
  - Using Basescan Explorer
  - Checking Token Transfers
  - Verifying Receiver Address
- Debugging with Console Logs
- Network Tab Inspection
- Terminal Output Analysis

### Chapter 10: Advanced Configuration
- Custom Facilitator URLs
- Multiple Protected Routes
- Price Configuration Options
- Session Management (Future Enhancement)
- Rate Limiting Considerations

### Conclusion
- Key Takeaways
- Best Practices Summary
- Next Steps: Integrating Streaming API

---

## Part 2: Integrating GoldRush Streaming API (2500+ words)

### Introduction
- Overview of GoldRush Streaming API
- Real-Time Data Streaming Use Cases
- What We're Building: Live Blockchain Data Dashboard
- Prerequisites from Part 1

### Chapter 1: Understanding GoldRush Streaming API
- GraphQL Subscriptions Over WebSocket
- Supported Chains and Networks
  - BASE_MAINNET
  - ETH_MAINNET
  - BSC_MAINNET
  - SOLANA_MAINNET
  - SONIC_MAINNET
- Available Stream Types
  - OHLCV Tokens Stream
  - OHLCV Pairs Stream
  - New DEX Pairs Stream
  - Update Pairs Stream
  - Wallet Activity Stream
  - Token Balances Stream
- WebSocket Protocol: graphql-transport-ws

### Chapter 2: Authentication and API Keys
- Obtaining GoldRush API Key
- API Key Formats and Security
- Authentication Methods
  - Connection Init Payload
  - GOLDRUSH_API_KEY Header
- Error Handling for Authentication
  - MISSING_TOKEN
  - INVALID_TOKEN
  - AUTH_SYSTEM_ERROR

### Chapter 3: Project Setup for Streaming
- Installing Required Packages
  - graphql-ws Client
  - Alternative: GoldRush Client SDK
- WebSocket Connection Configuration
- Environment Variables for Streaming
  - GOLDRUSH_API_KEY
  - GOLDRUSH_WS_URL
  - Token Address Configuration

### Chapter 4: Understanding OHLCV Data
- What is OHLCV?
  - Open, High, Low, Close, Volume
- Interval Options
  - ONE_MINUTE
  - FIVE_MINUTES
  - ONE_HOUR
  - ONE_DAY
- Timeframe Options
  - ONE_MINUTE
  - ONE_HOUR
  - ONE_DAY
  - ONE_MONTH
- Use Cases for OHLCV Data

### Chapter 5: Building the Streaming Dashboard Page
- HTML Structure
  - Connection Status Display
  - Data Table Layout
  - Configuration Panel
- CSS Styling
  - Modern UI Design
  - Responsive Layout
  - Status Indicators

### Chapter 6: Implementing WebSocket Connection
- Creating WebSocket Client
- Connection Lifecycle
  - Connecting State
  - Opened State
  - Closed State
  - Error Handling
- Connection Parameters
  - URL Configuration
  - Protocol Headers
  - Connection Init Payload

### Chapter 7: GraphQL Subscription Setup
- Understanding GraphQL Subscriptions
- Subscription Query Structure
- OHLCV Tokens Subscription
  - Query Parameters
  - Field Selection
  - Response Format
- Token Address Configuration
- Chain Selection (BASE_MAINNET)

### Chapter 8: Real-Time Data Handling
- Receiving Subscription Data
- Parsing Response Format
- Updating UI in Real-Time
- Data Table Management
  - Adding New Rows
  - Updating Existing Data
  - Sorting and Filtering
- Timestamp Formatting
- Number Formatting (Prices, Volumes)

### Chapter 9: Advanced Features
- Multiple Token Subscriptions
- Interval Switching
  - Dynamic Query Updates
  - Reconnection Logic
- Error Recovery
  - Automatic Reconnection
  - Manual Reconnect Button
- Connection Status Monitoring
- Last Event Display

### Chapter 10: Integration with X402 Payment
- Connecting Payment Flow to Streaming
- Access Control After Payment
- Session Management Considerations
- User Experience Flow
  - Payment → Access Granted → Streaming Dashboard

### Chapter 11: Troubleshooting Streaming Issues
- WebSocket Connection Failures
- Authentication Errors
- Subscription Errors
- Data Parsing Issues
- Performance Considerations
- Browser Compatibility

### Chapter 12: Extending the Application
- Adding More Stream Types
  - New DEX Pairs
  - Wallet Activity
  - Token Balances
- Multi-Chain Support
- Advanced Filtering
- Data Visualization Options
- Export Functionality

### Chapter 13: Production Considerations
- Error Handling Best Practices
- Connection Resilience
- Rate Limiting
- API Key Security
- Performance Optimization
- Monitoring and Logging

### Conclusion
- Complete Application Overview
- Key Learnings
- Future Enhancements
- Resources and Documentation

---

## Appendices (Both Parts)

### Appendix A: Complete Code Listings
- Full server.js
- Full x402Client.js
- Complete HTML Files
- Environment Configuration Examples

### Appendix B: Common Error Messages and Solutions
- Comprehensive Error Reference
- Quick Troubleshooting Guide

### Appendix C: API Reference Quick Guide
- X402 API Endpoints
- GoldRush Subscription Queries
- Response Formats

### Appendix D: Resources and Links
- Official Documentation
- GitHub Repositories
- Community Resources
- Support Channels


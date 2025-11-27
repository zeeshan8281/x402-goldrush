# System Architecture Diagram

## Overview

This document provides visual representations of the X402 + GoldRush application architecture, showing the complete flow from user interaction to real-time data streaming.

---

## High-Level Architecture

```mermaid
graph TB
    User[👤 User Browser] -->|1. Access Payment Page| PaymentPage[Payment Page<br/>payment.html]
    PaymentPage -->|2. Click Pay Button| Backend[Express Server<br/>server.js]
    Backend -->|3. POST /api/x402-pay| X402Client[X402 Client<br/>x402-axios]
    X402Client -->|4. GET /x402-check| X402Middleware[X402 Middleware<br/>x402-express]
    X402Middleware -->|5. Returns 402| X402Client
    X402Client -->|6. Pay via Facilitator| Facilitator[X402 Facilitator<br/>x402.org/facilitator]
    Facilitator -->|7. USDC Transfer| Blockchain[Base Sepolia<br/>Blockchain]
    Blockchain -->|8. Transaction Hash| Facilitator
    Facilitator -->|9. Payment Proof| X402Client
    X402Client -->|10. Retry with Proof| X402Middleware
    X402Middleware -->|11. Verify & Return 200| Backend
    Backend -->|12. Success Response| PaymentPage
    PaymentPage -->|13. Redirect| StreamingPage[Streaming Dashboard<br/>app.html]
    StreamingPage -->|14. WebSocket Connection| GoldRushAPI[GoldRush Streaming API<br/>BASE_MAINNET]
    GoldRushAPI -->|15. Real-time OHLCV Data| StreamingPage
```

---

## Component Architecture

```mermaid
graph LR
    subgraph "Frontend Layer"
        A[Payment Page<br/>payment.html]
        B[Streaming Dashboard<br/>app.html]
    end
    
    subgraph "Backend Layer"
        C[Express Server<br/>server.js]
        D[X402 Client<br/>x402Client.js]
    end
    
    subgraph "X402 Payment System"
        E[X402 Middleware<br/>x402-express]
        F[X402 Facilitator<br/>x402.org]
        G[Base Sepolia<br/>Blockchain]
    end
    
    subgraph "GoldRush Streaming"
        H[GoldRush WebSocket<br/>GraphQL API]
        I[BASE_MAINNET<br/>Blockchain Data]
    end
    
    A -->|HTTP POST| C
    C -->|Uses| D
    D -->|Calls| E
    E -->|Validates via| F
    F -->|Sends TX to| G
    C -->|Serves| B
    B -->|WebSocket| H
    H -->|Streams from| I
```

---

## Payment Flow Sequence

```mermaid
sequenceDiagram
    participant U as User Browser
    participant PP as Payment Page
    participant BE as Backend Server
    participant XC as X402 Client
    participant XM as X402 Middleware
    participant F as Facilitator
    participant BC as Base Sepolia
    
    U->>PP: 1. Access / (Payment Page)
    U->>PP: 2. Click "Pay with X402"
    PP->>BE: 3. POST /api/x402-pay
    BE->>XC: 4. paidClient.get("/x402-check")
    XC->>XM: 5. GET /x402-check (no payment)
    XM->>XC: 6. HTTP 402 + X402 Headers
    XC->>F: 7. Create Payment Request
    F->>BC: 8. Send USDC Transfer TX
    BC->>F: 9. Transaction Hash
    F->>XC: 10. Payment Proof
    XC->>XM: 11. GET /x402-check (with X-PAYMENT header)
    XM->>F: 12. Verify Payment
    F->>XM: 13. Verification Success
    XM->>XC: 14. HTTP 200 OK
    XC->>BE: 15. Response Data
    BE->>PP: 16. {ok: true}
    PP->>U: 17. Redirect to /app
```

---

## Streaming Flow Sequence

```mermaid
sequenceDiagram
    participant U as User Browser
    participant SD as Streaming Dashboard
    participant WS as WebSocket Client
    participant GA as GoldRush API
    
    U->>SD: 1. Access /app (After Payment)
    SD->>WS: 2. Create WebSocket Connection
    WS->>GA: 3. Connection Init (with API Key)
    GA->>WS: 4. Connection Acknowledged
    WS->>GA: 5. GraphQL Subscription Query
    Note over WS,GA: ohlcvCandlesForToken<br/>BASE_MAINNET<br/>ONE_MINUTE interval
    GA->>WS: 6. Real-time OHLCV Data
    WS->>SD: 7. Parse & Display Data
    loop Continuous Updates
        GA->>WS: 8. New Candle Data
        WS->>SD: 9. Update UI Table
    end
    SD->>U: 10. Live Price Updates
```

---

## Data Flow Architecture

```mermaid
graph TD
    subgraph "User Actions"
        A1[User Clicks Pay]
        A2[User Views Dashboard]
    end
    
    subgraph "Payment Processing"
        B1[Backend Receives Request]
        B2[X402 Client Intercepts]
        B3[Facilitator Processes]
        B4[Blockchain Executes]
        B5[Payment Verified]
    end
    
    subgraph "Data Streaming"
        C1[WebSocket Connection]
        C2[GraphQL Subscription]
        C3[OHLCV Data Stream]
        C4[UI Updates]
    end
    
    subgraph "Data Sources"
        D1[Base Sepolia<br/>USDC Transfers]
        D2[BASE_MAINNET<br/>Token Prices]
    end
    
    A1 --> B1
    B1 --> B2
    B2 --> B3
    B3 --> B4
    B4 --> D1
    B4 --> B5
    B5 --> A2
    
    A2 --> C1
    C1 --> C2
    C2 --> C3
    C3 --> D2
    C3 --> C4
    C4 --> A2
```

---

## Technology Stack

```mermaid
graph TB
    subgraph "Frontend Technologies"
        F1[HTML5]
        F2[Vanilla JavaScript]
        F3[WebSocket API]
        F4[GraphQL Client]
    end
    
    subgraph "Backend Technologies"
        B1[Node.js]
        B2[Express.js]
        B3[x402-express]
        B4[x402-axios]
        B5[viem]
    end
    
    subgraph "Payment Infrastructure"
        P1[X402 Protocol]
        P2[Base Sepolia]
        P3[USDC Token]
        P4[X402 Facilitator]
    end
    
    subgraph "Streaming Infrastructure"
        S1[GoldRush API]
        S2[GraphQL Subscriptions]
        S3[WebSocket Protocol]
        S4[BASE_MAINNET]
    end
    
    F1 --> B1
    F2 --> B2
    F3 --> S3
    F4 --> S2
    
    B2 --> B3
    B2 --> B4
    B4 --> B5
    B3 --> P1
    B5 --> P2
    P1 --> P4
    P4 --> P3
    
    S1 --> S2
    S2 --> S3
    S1 --> S4
```

---

## Network Architecture

```mermaid
graph LR
    subgraph "Client Network"
        Browser[User Browser<br/>localhost:40001]
    end
    
    subgraph "Application Server"
        Express[Express Server<br/>Port 40001]
        X402Client[X402 Client Module]
    end
    
    subgraph "X402 Network"
        Middleware[X402 Middleware<br/>Protected Routes]
        Facilitator[X402 Facilitator<br/>x402.org]
        BaseSepolia[Base Sepolia<br/>Testnet]
    end
    
    subgraph "GoldRush Network"
        GoldRushWS[GoldRush WebSocket<br/>gr-staging-v2.streaming.covalenthq.com]
        BaseMainnet[BASE_MAINNET<br/>Mainnet]
    end
    
    Browser <-->|HTTP/HTTPS| Express
    Express --> X402Client
    X402Client <-->|HTTP| Middleware
    Middleware <-->|HTTP| Facilitator
    Facilitator <-->|RPC| BaseSepolia
    Browser <-->|WebSocket| GoldRushWS
    GoldRushWS <-->|Data Source| BaseMainnet
```

---

## ASCII Architecture Diagram (Alternative)

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP GET
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PAYMENT PAGE (/)                             │
│                    payment.html                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ POST /api/x402-pay
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   EXPRESS SERVER                                │
│                   server.js (Port 40001)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  POST /api/x402-pay                                       │  │
│  │    └─> Uses x402Client.js                                │  │
│  │         └─> paidClient.get("/x402-check")                │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ GET /x402-check
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              X402 MIDDLEWARE (x402-express)                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Protected Route: GET /x402-check                       │  │
│  │  - Returns 402 if no payment                             │  │
│  │  - Verifies X-PAYMENT header                             │  │
│  │  - Returns 200 if verified                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Payment Request
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              X402 FACILITATOR                                   │
│              x402.org/facilitator                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  - Receives payment authorization                         │  │
│  │  - Creates USDC transfer transaction                     │  │
│  │  - Sends to Base Sepolia                                  │  │
│  │  - Returns payment proof                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ USDC Transfer TX
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              BASE SEPOLIA BLOCKCHAIN                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Transaction: 0x87e7927e...                             │  │
│  │  From: 0x27a03e8d... (Payer)                             │  │
│  │  To: 0x100278f4... (Receiver)                           │  │
│  │  Amount: 0.0001 USDC                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

                              │
                              │ After Payment Success
                              │ Redirect to /app
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              STREAMING DASHBOARD (/app)                        │
│              app.html                                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  - WebSocket Connection                                  │  │
│  │  - GraphQL Subscription                                  │  │
│  │  - Real-time OHLCV Display                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ WebSocket (graphql-transport-ws)
                              │ + API Key Authentication
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              GOLDRUSH STREAMING API                             │
│              gr-staging-v2.streaming.covalenthq.com             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Subscription: ohlcvCandlesForToken                      │  │
│  │  - Chain: BASE_MAINNET                                    │  │
│  │  - Interval: ONE_MINUTE                                   │  │
│  │  - Timeframe: ONE_HOUR                                    │  │
│  │  - Real-time OHLCV data stream                           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Data Source
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              BASE_MAINNET BLOCKCHAIN                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  - DEX Pair Data                                         │  │
│  │  - Token Price Data                                      │  │
│  │  - Trading Volume                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Components

### 1. **Payment Flow Components**
- **Payment Page**: User-facing interface for initiating payment
- **Express Server**: Handles HTTP requests and routes
- **X402 Client**: Manages payment interceptor logic
- **X402 Middleware**: Enforces payment requirements
- **Facilitator**: Processes and executes blockchain transactions
- **Base Sepolia**: Testnet blockchain for USDC payments

### 2. **Streaming Flow Components**
- **Streaming Dashboard**: Real-time data visualization interface
- **WebSocket Client**: Manages persistent connection
- **GoldRush API**: Provides GraphQL subscription endpoint
- **BASE_MAINNET**: Mainnet blockchain data source

### 3. **Data Flow**
- **Payment Data**: User → Backend → X402 → Blockchain
- **Streaming Data**: Blockchain → GoldRush API → WebSocket → Dashboard

---

## Security Considerations

1. **API Keys**: Stored in `.env` (not committed to git)
2. **Private Keys**: Securely managed via environment variables
3. **Payment Verification**: On-chain transaction verification
4. **WebSocket Authentication**: API key in connection init payload
5. **HTTPS/WSS**: Secure protocols for production deployment

---

## Scalability Notes

- **Stateless Backend**: Express server can be horizontally scaled
- **WebSocket Connections**: Each user maintains independent connection
- **Payment Processing**: Handled by external facilitator (no server load)
- **Caching**: Consider caching static data for performance

---

## Deployment Architecture

```
┌─────────────┐
│   CDN/      │
│   Static    │
│   Assets    │
└─────────────┘
      │
      ▼
┌─────────────┐      ┌─────────────┐
│   Load      │      │   Express   │
│   Balancer  │ ────▶│   Servers   │
└─────────────┘      └─────────────┘
      │                    │
      │                    ▼
      │              ┌─────────────┐
      │              │   X402      │
      │              │   Facilitator│
      │              └─────────────┘
      │
      ▼
┌─────────────┐
│   GoldRush  │
│   Streaming │
│   API       │
└─────────────┘
```

---

## File Structure Reference

```
x402-goldrush/
├── server.js              # Express server + X402 middleware
├── x402Client.js          # X402 payment client
├── package.json           # Dependencies
├── .env                   # Environment variables (not in git)
├── .gitignore             # Git ignore rules
├── README.md              # Setup instructions
├── GUIDE_TOC.md           # Guide table of contents
├── ARCHITECTURE.md        # This file
└── public/
    ├── payment.html       # Payment page
    └── app.html           # Streaming dashboard
```

---

## Legend

- **Solid Lines**: HTTP/HTTPS connections
- **Dashed Lines**: WebSocket connections
- **Arrows**: Data flow direction
- **Boxes**: Components/services
- **Subgraphs**: Logical groupings

---

*Last Updated: November 2025*


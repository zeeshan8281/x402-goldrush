## X402 + GoldRush 2‑Page App (Real X402 Gateway)

Two-page demo:

- **Page 1**: `X402` checkout UX at `/`  
  - Navigates to `/app` through your **real X402 Gateway**.
  - The actual HTTP `402 Payment Required` logic and payment proofs are handled entirely by the X402 Gateway and client / wallet.
- **Page 2**: GoldRush Streaming dashboard at `/app`  
  - Connects to the GoldRush Streaming API over WebSocket and streams OHLCV candles for a BASE_MAINNET token.

### 1. Install & Run

From the project root:

```bash
cd "/Users/zeeshan/Desktop/X402 + GOLDRUSH"
npm install
npm start
```

Then open `http://localhost:4000/` in your browser.

### 2. Configure Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# X402 Payment Configuration
X402_PRIVATE_KEY=0xYourPrivateKeyHere
X402_BASE_URL=http://localhost:4000

# GoldRush Streaming API Configuration
GOLDRUSH_API_KEY=cqt_YourGoldRushAPIKeyHere

# Optional: Override WebSocket URL (default: wss://gr-staging-v2.streaming.covalenthq.com/graphql)
# GOLDRUSH_WS_URL=wss://gr-staging-v2.streaming.covalenthq.com/graphql

# Optional: Override default token address for BASE_MAINNET (default: VIRTUAL token)
# GOLDRUSH_TOKEN_ADDRESS=0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b
```

**Important Notes:**
- **`GOLDRUSH_API_KEY`**: Required for the streaming dashboard to work. Get your API key from [GoldRush API Dashboard](https://goldrush.dev/platform/auth/register/).
- **`X402_PRIVATE_KEY`**: Your wallet private key (with `0x` prefix) for making X402 payments on Base Sepolia.
- The `.env` file is already in `.gitignore` and won't be committed to git.

The server automatically injects `GOLDRUSH_API_KEY` into the streaming dashboard page, so you don't need to edit `app.html` directly.

### 3. How the Flow Works (with a Real X402 Gateway)

- **Origin (this repo / Express app):**
  - `GET /` → serves `payment.html` (the X402 “paywall” UX).
  - `GET /app` → always serves `app.html` when reached.

- **X402 Gateway (your deployment, not in this repo):**
  - Runs in front of this origin and is configured so `GET /app` is **monetized**.
  - When the browser requests `/app` through the gateway:
    - The gateway responds with HTTP `402 Payment Required` and X402 headers until payment is made.
    - An X402-capable client/wallet performs the payment and retries.
    - After payment, the gateway forwards `/app` to this Express server, which returns `app.html`.

- **GoldRush Streaming Once `/app` Loads**:
  - `app.html` opens a WebSocket to GoldRush and subscribes to:

```graphql
subscription {
  ohlcvCandlesForToken(
    chain_name: BASE_MAINNET
    token_addresses: ["<token_address>"]
    interval: ONE_MINUTE
    timeframe: ONE_HOUR
  ) {
    timestamp
    open
    high
    low
    close
    volume
  }
}
```

### 4. Example X402 Gateway Concept (High Level)

Consult the official X402 docs for exact config (pricing, facilitator, etc.), but conceptually you:

- Point the gateway’s origin to this app (e.g. `http://localhost:4000`).
- Monetize the `/app` path in the gateway config (so any `GET /app` triggers a 402 challenge).
- Access the app through the gateway URL (e.g. `https://your-gateway.example.com/app`).
- Use an X402-capable wallet / client in the browser so that:
  - It detects the 402 response,
  - Pays via the configured facilitator,
  - Retries, and then receives the actual `app.html` page.



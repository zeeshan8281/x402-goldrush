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

### 2. Configure GoldRush Streaming

Edit `public/app.html` and set:

- **`GOLDRUSH_API_KEY`** – replace `<GOLDRUSH_API_KEY>` with your real key.
- (Optional) **`GOLDRUSH_WS_URL`** and **`GOLDRUSH_TOKEN_ADDRESS`** via `window` globals before the `<script type="module">` block if you want to override:
  - `wss://gr-staging-v2.streaming.covalenthq.com/graphql`
  - `0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b` (BASE_MAINNET VIRTUAL token)

Example inline override (add before the `<script type="module">` in `app.html`):

```html
<script>
  window.GOLDRUSH_API_KEY = "cqt_...";
  window.GOLDRUSH_TOKEN_ADDRESS = "0xYourBaseMainnetToken";
</script>
```

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



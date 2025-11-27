require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const { paymentMiddleware } = require("x402-express");
const { paidClient } = require("./x402Client");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

/**
 * REAL X402 SETUP – BACKEND PAYS, FRONTEND JUST UNLOCKS
 *
 * - `/paywall` (we use `/` for this) is the “pay” page.
 * - Hidden route `/x402-check` is protected by `x402-express`.
 * - Backend route `/api/x402-pay` uses `x402-axios` (`paidClient`) to call
 *   `/x402-check`, triggering a real X402 payment from your server wallet.
 * - On success, the frontend is told “access granted” and redirects to `/app`,
 *   which is NOT X402-protected and simply shows the GoldRush UI.
 */

// Attach X402 payment middleware BEFORE defining /x402-check.
app.use(
  paymentMiddleware("0x100278f4de251afd6006920e917a683b3b4976d2", {
    "GET /x402-check": {
      // Price in USD terms (charged in supported token, e.g. USDC on Base Sepolia)
      price: "0.0001",
      network: "base-sepolia",
      facilitatorUrl: "https://x402.org/facilitator"
    }
  })
);

// This route is only reached AFTER successful X402 payment.
app.get("/x402-check", (req, res) => {
  console.log("[x402-check] Route hit - checking payment headers...");
  console.log("[x402-check] X-PAYMENT header:", req.headers["x-payment"]);
  console.log("[x402-check] All headers:", JSON.stringify(req.headers, null, 2));
  res.json({ ok: true, message: "X402 payment verified for this request." });
});

// Backend helper that pays X402 invoice and unlocks access.
app.post("/api/x402-pay", async (req, res) => {
  try {
    console.log("[x402-pay] Attempting to call /x402-check via paidClient...");
    const upstream = await paidClient.get("/x402-check", {
      responseType: "json"
    });

    console.log("[x402-pay] Response status:", upstream.status);
    console.log("[x402-pay] Response data:", JSON.stringify(upstream.data, null, 2));
    console.log("[x402-pay] Response headers:", JSON.stringify(upstream.headers, null, 2));

    if (upstream.status !== 200 || !upstream.data?.ok) {
      return res.status(502).json({
        ok: false,
        error: "Upstream X402 check did not return ok=true"
      });
    }

    // For this simple demo we don't maintain sessions; we just indicate success.
    res.json({
      ok: true,
      message: "Payment complete. You can now access /app."
    });
  } catch (err) {
    console.error("[/api/x402-pay] error", err);
    console.error("[/api/x402-pay] error details:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      headers: err.response?.headers
    });
    res.status(500).json({
      ok: false,
      error: err.message || "Unknown error during X402 payment"
    });
  }
});

// Unprotected app page – shown after backend confirms payment.
app.get("/app", (req, res) => {
  const appHtmlPath = path.join(__dirname, "public", "app.html");
  let html = fs.readFileSync(appHtmlPath, "utf8");
  
  // Build configuration object from environment variables
  const config = {};
  
  // Inject GoldRush API key from environment
  const goldrushApiKey = process.env.GOLDRUSH_API_KEY || "";
  if (goldrushApiKey) {
    config.GOLDRUSH_API_KEY = goldrushApiKey;
  } else {
    console.warn("[server] WARNING: GOLDRUSH_API_KEY not set in .env. Streaming may not work.");
  }
  
  // Inject WebSocket URL from environment (optional, has default)
  const goldrushWsUrl = process.env.GOLDRUSH_WS_URL;
  if (goldrushWsUrl) {
    config.GOLDRUSH_WS_URL = goldrushWsUrl;
  }
  
  // Inject token address from environment (optional, has default)
  const goldrushTokenAddress = process.env.GOLDRUSH_TOKEN_ADDRESS;
  if (goldrushTokenAddress) {
    config.GOLDRUSH_TOKEN_ADDRESS = goldrushTokenAddress;
  }
  
  // Inject all config as a single script tag before closing </head>
  if (Object.keys(config).length > 0) {
    const configScript = Object.entries(config)
      .map(([key, value]) => `window.${key} = ${JSON.stringify(value)};`)
      .join("\n    ");
    html = html.replace(
      "</head>",
      `<script>\n    ${configScript}\n  </script></head>`
    );
  }
  
  res.send(html);
});

// Payment page (landing).
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "payment.html"));
});

app.listen(PORT, () => {
  console.log(`X402 + GoldRush demo running on http://localhost:${PORT}`);
});



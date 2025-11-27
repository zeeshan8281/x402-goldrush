const axios = require("axios");
const { withPaymentInterceptor } = require("x402-axios");
const { createWalletClient, http } = require("viem");
const { privateKeyToAccount } = require("viem/accounts");
const { baseSepolia } = require("viem/chains");

/**
 * X402 + viem client configured for Base mainnet.
 *
 * This is a REAL X402 integration: when you use `paidClient` to call an
 * X402-protected endpoint (that returns HTTP 402 with x402 headers),
 * the interceptor will:
 *   - Decode the 402 challenge
 *   - Pay via the configured wallet
 *   - Retry with proof of payment
 */

const X402_PRIVATE_KEY = process.env.X402_PRIVATE_KEY;
const X402_BASE_URL =
  process.env.X402_BASE_URL || "https://your-x402-gateway.example.com";
const X402_CHAIN = process.env.X402_CHAIN || "base-sepolia";

if (!X402_PRIVATE_KEY) {
  console.warn(
    "[x402] WARNING: X402_PRIVATE_KEY is not set in env. " +
      "Create a .env file with X402_PRIVATE_KEY=0xyourkey to enable payments."
  );
}

const account = X402_PRIVATE_KEY
  ? privateKeyToAccount(X402_PRIVATE_KEY)
  : null;

const chain = baseSepolia; // using Base Sepolia testnet as supported by the facilitator

const walletClient =
  account != null
    ? createWalletClient({
        account,
        transport: http(), // you can point this to a specific Base RPC
        chain
      })
    : null;

// Raw axios instance that targets your X402 gateway / monetized API.
const rawAxios = axios.create({
  baseURL: X402_BASE_URL
});

// Wrap axios with X402 payment interceptor (only if wallet configured).
const paidClient =
  walletClient != null
    ? withPaymentInterceptor(rawAxios, walletClient)
    : rawAxios;

module.exports = {
  paidClient
};



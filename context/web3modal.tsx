"use client";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";

// 1. Get projectId from https://cloud.walletconnect.com
export const projectId = "2c2cdd3ce95fef7a0d9e509143d505be";

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: "Ethereum",
  currency: "ETH",
  explorerUrl: "https://etherscan.io",
  rpcUrl: "https://cloudflare-eth.com",
};

// 2. Set chains
const amoy = {
  chainId: 80002,
  name: "Polygon Amoy",
  currency: "MATIC",
  explorerUrl: "https://amoy.polygonscan.com/",
  rpcUrl: "https://polygon-amoy.drpc.org",
};

// 3. Create a metadata object
const metadata = {
  name: "Secret Vaults",
  description: "Secret Vault",
  url: "", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: "...", // used for the Coinbase SDK
  defaultChainId: 80002, // used for the Coinbase SDK
});

// 5. Create a AppKit instance
createWeb3Modal({
  ethersConfig,
  chains: [amoy],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

export function AppKit({ children }: any) {
  return children;
}

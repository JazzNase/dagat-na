"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "./DemoComponents";

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <Button
          onClick={() => disconnect()}
          variant="outline"
          size="sm"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => {
        const coinbaseConnector = connectors.find(c => c.name === "Coinbase Wallet");
        if (coinbaseConnector) {
          connect({ connector: coinbaseConnector });
        }
      }}
      variant="primary"
      size="sm"
    >
      Connect Wallet
    </Button>
  );
}
"use client";

import { Button } from "../../Main/DemoComponents";
import { CONFIG, type GeneratedFish } from "./AdoptFishConfig";

interface SuccessStatusProps {
  txHash: string;
  fish: GeneratedFish | null;
  onAdoptAnother: () => void;
}

export function SuccessStatus({ txHash, fish, onAdoptAnother }: SuccessStatusProps) {
  return (
    <div className="text-center p-8">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-xl font-bold mb-2 text-green-600">Fish Adopted Successfully!</h2>
      <p className="text-gray-600 mb-4">
        Your {fish?.species} has been added to your tank!
      </p>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="text-sm text-green-700 mb-2">
          <strong>✅ Transaction Confirmed!</strong>
        </div>
        <div className="text-xs text-green-600 mb-2">
          Hash: {txHash.slice(0, 10)}...{txHash.slice(-8)}
        </div>
        <a 
          href={`${CONFIG.network.explorerUrl}/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline text-sm"
        >
          🔗 View on {CONFIG.network.name} Explorer
        </a>
      </div>
      
      <Button
        onClick={onAdoptAnother}
        variant="primary"
        size="md"
      >
        🎣 Adopt Another Fish
      </Button>
    </div>
  );
}

interface ErrorStatusProps {
  error: string;
  onTryAgain: () => void;
}

export function ErrorStatus({ error, onTryAgain }: ErrorStatusProps) {
  return (
    <div className="text-center p-8">
      <div className="text-6xl mb-4">❌</div>
      <h2 className="text-xl font-bold mb-2 text-red-600">Transaction Failed</h2>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="text-sm text-red-700">{error}</div>
      </div>
      <Button
        onClick={onTryAgain}
        variant="primary"
        size="md"
      >
        🔄 Try Again
      </Button>
    </div>
  );
}

export function NotConnectedStatus() {
  return (
    <div className="text-center p-8">
      <div className="text-6xl mb-4">🔗</div>
      <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
      <p className="text-gray-600">
        Connect your wallet to start adopting fish!
      </p>
    </div>
  );
}
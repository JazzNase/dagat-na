"use client";

import { useBalance } from "wagmi";
import { ADOPTION_FEES, CONFIG } from "./AdoptFishConfig";
import { FishRarityUtils } from "./FishRarityUtils";
import { CONTRACT_ADDRESS } from "../../../../contracts/abi";

interface AdoptFishInfoProps {
  isConnected: boolean;
  address: `0x${string}` | undefined; // Fix the type here
  txHash: string | undefined;
  isConfirming: boolean;
}

export function AdoptFishInfo({ isConnected, address, txHash, isConfirming }: AdoptFishInfoProps) {
  const { data: balance } = useBalance({ 
    address: address, // Now this matches the expected type
  });

  const calculateAffordableFish = () => {
    if (!balance) return 0;
    const balanceInEth = parseFloat(balance.formatted);
    const diamondFee = parseFloat(ADOPTION_FEES.Diamond);
    return Math.floor(balanceInEth / diamondFee);
  };

  return (
    <div className="space-y-4">
      {/* Network Debug Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
        <div className="text-xs text-yellow-700">
          🌐 Network: {CONFIG.network.name} (Chain ID: {CONFIG.network.chainId})
        </div>
        <div className="text-xs text-yellow-600">
          📋 Contract: {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}
        </div>
        <div className="text-xs text-yellow-600">
          👤 Connected: {isConnected ? "✅" : "❌"} | {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
      </div>

      {/* Transaction Status */}
      {txHash && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <div className="text-sm text-blue-700 mb-2">
            {isConfirming ? "⏳ Confirming Transaction..." : "📤 Transaction Sent"}
          </div>
          <div className="text-xs text-blue-600 mb-2">
            Hash: {txHash.slice(0, 10)}...{txHash.slice(-8)}
          </div>
          <a 
            href={`${CONFIG.network.explorerUrl}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline text-xs"
          >
            🔗 View on Explorer
          </a>
        </div>
      )}

      {/* Testnet Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
        <div className="text-sm font-medium text-green-800 mb-1">
          🧪 Testnet Mode - Still Super Low Fees!
        </div>
        <div className="text-xs text-green-700">
          Maximum cost: {ADOPTION_FEES.Diamond} ETH - Perfect for testing!
        </div>
      </div>

      {/* Price Comparison */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">💰 Testnet Pricing</h3>
        <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
          {Object.entries(ADOPTION_FEES).map(([rarity, fee]) => (
            <div key={rarity}>
              {FishRarityUtils.getRarityEmoji(rarity)} {rarity}: {fee} ETH
            </div>
          ))}
        </div>
        {balance && (
          <div className="text-xs text-blue-600 mt-2 text-center">
            Your Balance: {parseFloat(balance.formatted).toFixed(6)} ETH - You can adopt ~{calculateAffordableFish()} Diamond fish! 🐟
          </div>
        )}
      </div>

      {/* Blockchain Integration Notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-medium text-purple-800 mb-2">⚡ On-Chain Features</h3>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• Each fish is minted as an NFT on {CONFIG.network.name}</li>
          <li>• Fish data is stored permanently on blockchain</li>
          <li>• Feed and care for your fish to level them up</li>
          <li>• Dynamic pricing based on rarity</li>
        </ul>
      </div>
    </div>
  );
}
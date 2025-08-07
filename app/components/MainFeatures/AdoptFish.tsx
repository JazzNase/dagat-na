"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useBalance } from "wagmi";
import { parseEther } from "viem";
import { Button } from "../Main/DemoComponents";
import { DAGAT_NA_ABI, CONTRACT_ADDRESS } from "../../../contracts/abi";

const FISH_SPECIES = [
  { name: "Tilapia", filipino: "Tilapya" },
  { name: "Bangus", filipino: "Milkfish" },
  { name: "Lapu-lapu", filipino: "Grouper" },
  { name: "Maya-maya", filipino: "Snapper" },
  { name: "Tambakol", filipino: "Yellowfin Tuna" },
  { name: "Dilis", filipino: "Anchovy" },
];

const RARITIES = ["Bronze", "Silver", "Gold", "Diamond"];

// Move fees to a configurable object
const ADOPTION_FEES = {
  Bronze: "0.00001",
  Silver: "0.00002", 
  Gold: "0.00005",
  Diamond: "0.0001"
} as const;

// Configuration for network and UI
const CONFIG = {
  network: {
    name: "Base Sepolia",
    chainId: 84532,
    explorerUrl: "https://sepolia.basescan.org"
  },
  ui: {
    generateDelay: 2000, // milliseconds
    maxDiamondFishCalculation: 470 // Remove this hardcoded calculation
  }
} as const;

type GeneratedFish = {
  species: string;
  filipinoName: string;
  rarity: string;
};

export function AdoptFish() {
  const { isConnected, address } = useAccount();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFish, setGeneratedFish] = useState<GeneratedFish | null>(null);
  
  // Get actual balance instead of hardcoding
  const { data: balance } = useBalance({
    address: address,
  });
  
  // Contract interaction with better error handling
  const { 
    writeContract: adoptFish, 
    isPending: isAdopting,
    data: txHash,
    error: adoptError
  } = useWriteContract({
    mutation: {
      onSuccess: (hash) => {
        console.log("✅ Transaction sent:", hash);
      },
      onError: (error) => {
        console.error("❌ Transaction failed:", error);
      }
    }
  });

  // Wait for transaction confirmation
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    error: confirmError 
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const generateRandomFish = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const species = FISH_SPECIES[Math.floor(Math.random() * FISH_SPECIES.length)];
      const rarity = RARITIES[Math.floor(Math.random() * RARITIES.length)];

      setGeneratedFish({
        species: species.name,
        filipinoName: species.filipino,
        rarity,
      });
      setIsGenerating(false);
    }, CONFIG.ui.generateDelay);
  };

  const handleAdoptFish = async () => {
    if (!generatedFish || !isConnected) return;

    try {
      const fee = ADOPTION_FEES[generatedFish.rarity as keyof typeof ADOPTION_FEES];

      console.log("🚀 Starting adoption:", {
        species: generatedFish.species,
        filipinoName: generatedFish.filipinoName,
        rarity: generatedFish.rarity,
        fee,
        contract: CONTRACT_ADDRESS,
        address
      });

      await adoptFish({
        abi: DAGAT_NA_ABI,
        address: CONTRACT_ADDRESS,
        functionName: 'adoptFish',
        args: [
          generatedFish.species,
          generatedFish.filipinoName,
          generatedFish.rarity
        ],
        value: parseEther(fee),
      });

    } catch (error) {
      console.error('❌ Error adopting fish:', error);
    }
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      Bronze: "border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100",
      Silver: "border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100",
      Gold: "border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100",
      Diamond: "border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100"
    };
    return colors[rarity as keyof typeof colors] || "border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100";
  };

  const getRarityEmoji = (rarity: string) => {
    const emojis = {
      Bronze: "🥉",
      Silver: "🥈", 
      Gold: "🥇",
      Diamond: "💎"
    };
    return emojis[rarity as keyof typeof emojis] || "🐟";
  };

  const getAdoptionFee = (rarity: string) => {
    const fee = ADOPTION_FEES[rarity as keyof typeof ADOPTION_FEES];
    return fee ? `${fee} ETH` : "Unknown";
  };

  // Calculate how many diamond fish user can afford
  const calculateAffordableFish = () => {
    if (!balance) return 0;
    const balanceInEth = parseFloat(balance.formatted);
    const diamondFee = parseFloat(ADOPTION_FEES.Diamond);
    return Math.floor(balanceInEth / diamondFee);
  };

  // Check if user has enough balance for adoption
  const hasEnoughBalance = (rarity: string) => {
    if (!balance) return false;
    const balanceInEth = parseFloat(balance.formatted);
    const requiredFee = parseFloat(ADOPTION_FEES[rarity as keyof typeof ADOPTION_FEES]);
    return balanceInEth >= requiredFee;
  };

  // Show success message after confirmation
  if (isConfirmed && txHash) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-xl font-bold mb-2 text-green-600">Fish Adopted Successfully!</h2>
        <p className="text-gray-600 mb-4">
          Your {generatedFish?.species} has been added to your tank!
        </p>
        
        {/* Transaction Link */}
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
          onClick={() => {
            setGeneratedFish(null);
          }}
          variant="primary"
          size="md"
        >
          🎣 Adopt Another Fish
        </Button>
      </div>
    );
  }

  // Show error state
  if (adoptError || confirmError) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-xl font-bold mb-2 text-red-600">Transaction Failed</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="text-sm text-red-700">
            {adoptError?.message || confirmError?.message || "Unknown error occurred"}
          </div>
        </div>
        <Button
          onClick={() => {
            setGeneratedFish(null);
          }}
          variant="primary"
          size="md"
        >
          🔄 Try Again
        </Button>
      </div>
    );
  }

  if (!isConnected) {
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

  return (
    <div className="space-y-6 p-4 max-w-md mx-auto">
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

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">🎣 Adopt a Filipino Fish</h2>
        <p className="text-[var(--app-foreground-muted)]">Discover fish species native to Philippine waters!</p>
      </div>

      {!generatedFish ? (
        <div className="text-center space-y-4">
          <div className="bg-[var(--app-card-bg)] rounded-xl p-8 border border-[var(--app-card-border)]">
            <div className="text-6xl mb-4">🌊</div>
            <Button
              onClick={generateRandomFish}
              disabled={isGenerating}
              variant="primary"
              size="lg"
            >
              {isGenerating ? "🔄 Casting Net..." : "🎲 Cast Your Net"}
            </Button>
            {isGenerating && (
              <div className="mt-4 text-sm text-[var(--app-foreground-muted)]">
                Searching the waters around the Philippines...
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Fish Card */}
          <div className={`${getRarityColor(generatedFish.rarity)} border-2 rounded-xl p-6 text-center shadow-lg`}>
            <div className="text-4xl mb-2">
              {getRarityEmoji(generatedFish.rarity)} 🐟
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {generatedFish.rarity} {generatedFish.species}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {generatedFish.filipinoName}
            </p>
            
            {/* Adoption Fee */}
            <div className="bg-white bg-opacity-75 rounded-lg p-3 mb-4">
              <div className="text-sm font-medium text-gray-800">
                Adoption Fee: {getAdoptionFee(generatedFish.rarity)}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                💰 Testnet pricing!
              </div>
              <div className={`text-xs mt-1 ${hasEnoughBalance(generatedFish.rarity) ? 'text-green-600' : 'text-red-600'}`}>
                {hasEnoughBalance(generatedFish.rarity) ? 
                  "✅ You have enough ETH for this adoption!" : 
                  "❌ Insufficient ETH balance"}
              </div>
            </div>

            <Button
              onClick={handleAdoptFish}
              disabled={isAdopting || isConfirming || !hasEnoughBalance(generatedFish.rarity)}
              variant="primary"
              size="md"
              className="w-full"
            >
              {isAdopting ? "🔄 Sending Transaction..." : 
               isConfirming ? "⏳ Confirming..." : 
               !hasEnoughBalance(generatedFish.rarity) ? "💰 Insufficient Balance" :
               "🏠 Adopt This Fish"}
            </Button>
          </div>

          {/* Generate Another Button */}
          <div className="text-center">
            <Button
              onClick={() => setGeneratedFish(null)}
              variant="outline"
              size="sm"
            >
              🎣 Cast Net Again
            </Button>
          </div>
        </div>
      )}

      {/* Price Comparison - Now using dynamic fees */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">💰 Testnet Pricing</h3>
        <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
          {Object.entries(ADOPTION_FEES).map(([rarity, fee]) => (
            <div key={rarity}>
              {getRarityEmoji(rarity)} {rarity}: {fee} ETH
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
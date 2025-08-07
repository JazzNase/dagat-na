"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { Button } from "./DemoComponents";
import { DAGAT_NA_ABI, CONTRACT_ADDRESS } from "../../contracts/abi";

const FISH_SPECIES = [
  { name: "Tilapia", filipino: "Tilapya" },
  { name: "Bangus", filipino: "Milkfish" },
  { name: "Lapu-lapu", filipino: "Grouper" },
  { name: "Maya-maya", filipino: "Snapper" },
  { name: "Tambakol", filipino: "Yellowfin Tuna" },
  { name: "Dilis", filipino: "Anchovy" },
];

const RARITIES = ["Bronze", "Silver", "Gold", "Diamond"];

type GeneratedFish = {
  species: string;
  filipinoName: string;
  rarity: string;
};

export function AdoptFish() {
  const { isConnected } = useAccount();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFish, setGeneratedFish] = useState<GeneratedFish | null>(null);
  
  // Contract interaction
  const { writeContract: adoptFish, isPending: isAdopting } = useWriteContract();

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
    }, 2000);
  };

  const handleAdoptFish = async () => {
    if (!generatedFish || !isConnected) return;

    try {
      // Calculate adoption fee based on rarity
      const fees = {
        Bronze: "0.001",
        Silver: "0.002", 
        Gold: "0.005",
        Diamond: "0.01"
      };
      
      const fee = fees[generatedFish.rarity as keyof typeof fees];

      adoptFish({
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

      // Reset after successful adoption
      setGeneratedFish(null);
    } catch (error) {
      console.error('Error adopting fish:', error);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Bronze": return "border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100";
      case "Silver": return "border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100";
      case "Gold": return "border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100";
      case "Diamond": return "border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100";
      default: return "border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100";
    }
  };

  const getRarityEmoji = (rarity: string) => {
    switch (rarity) {
      case "Bronze": return "🥉";
      case "Silver": return "🥈";
      case "Gold": return "🥇";
      case "Diamond": return "💎";
      default: return "🐟";
    }
  };

  const getAdoptionFee = (rarity: string) => {
    const fees = {
      Bronze: "0.001 ETH",
      Silver: "0.002 ETH", 
      Gold: "0.005 ETH",
      Diamond: "0.01 ETH"
    };
    return fees[rarity as keyof typeof fees];
  };

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
                This will mint an NFT to your wallet
              </div>
            </div>

            <Button
              onClick={handleAdoptFish}
              disabled={isAdopting}
              variant="primary"
              size="md"
              className="w-full"
            >
              {isAdopting ? "🔄 Adopting..." : "🏠 Adopt This Fish"}
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

      {/* Blockchain Integration Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">⚡ On-Chain Features</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Each fish is minted as an NFT on Base</li>
          <li>• Fish data is stored permanently on blockchain</li>
          <li>• Feed and care for your fish to level them up</li>
          <li>• Higher rarity fish cost more but grow faster</li>
        </ul>
      </div>

      {/* Contract Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
        <div className="text-xs text-gray-600">
          Smart Contract: {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Base Sepolia Network
        </div>
      </div>
    </div>
  );
}
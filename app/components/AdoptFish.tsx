"use client";

import { useState } from "react";
import { Button } from "./DemoComponents";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFish, setGeneratedFish] = useState<GeneratedFish | null>(null);

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
            
            {/* Fish Stats */}
            <div className="bg-white bg-opacity-50 rounded-lg p-3 mb-4">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="font-medium">Level</div>
                  <div>1</div>
                </div>
                <div>
                  <div className="font-medium">Rarity</div>
                  <div>{generatedFish.rarity}</div>
                </div>
                <div>
                  <div className="font-medium">Age</div>
                  <div>Baby</div>
                </div>
              </div>
            </div>

            <Button
              onClick={() => {
                alert(`🎉 ${generatedFish.species} adopted successfully! Welcome to your new fish family!`);
                setGeneratedFish(null);
              }}
              variant="primary"
              size="md"
              className="w-full"
            >
              🏠 Adopt This Fish
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

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">💡 How Fish Adoption Works</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Each fish will be a unique NFT on Base blockchain</li>
          <li>• Random traits make every fish special</li>
          <li>• Higher rarity = faster growth and special abilities</li>
          <li>• Care for your fish to level them up to 100!</li>
        </ul>
      </div>

      {/* Phase Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="text-green-600 text-sm font-medium">
          🚀 Phase 2: On-Chain Minting Coming Soon!
        </div>
        <div className="text-xs text-green-600 mt-1">
          Currently in demo mode • Full blockchain integration next
        </div>
      </div>
    </div>
  );
}
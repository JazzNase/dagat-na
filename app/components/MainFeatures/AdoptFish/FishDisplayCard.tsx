"use client";

import Image from "next/image";
import { Button } from "../../Main/DemoComponents";
import { ADOPTION_FEES, type GeneratedFish } from "./AdoptFishConfig";
import { FishRarityUtils } from "./FishRarityUtils";

const FISH_IMAGES: Record<string, string> = {
  "Bangus": "Bangus.png",
  "Dilis": "Dilis.png",
  "Lapu-lapu": "Lapu-lapu.png",
  "Maya-maya": "Maya-maya.png",
  "Tambakol": "Tambakol.png",
  "Tilapia": "Tilapia.png",
  // Add more mappings as needed
};

interface FishDisplayCardProps {
  fish: GeneratedFish;
  onAdopt: () => void;
  onGenerateAnother: () => void;
  hasEnoughBalance: boolean;
  isAdopting: boolean;
  isConfirming: boolean;
  cooldownLeft?: number;
}

export function FishDisplayCard({ 
  fish, 
  onAdopt, 
  onGenerateAnother, 
  hasEnoughBalance, 
  isAdopting, 
  isConfirming,
  cooldownLeft = 0
}: FishDisplayCardProps) {
  const getAdoptionFee = (rarity: string) => {
    const fee = ADOPTION_FEES[rarity as keyof typeof ADOPTION_FEES];
    return fee ? `${fee} ETH` : "Unknown";
  };

  const fishImage = FISH_IMAGES[fish.species] || "Bangus.png"; // fallback image

  return (
    <div className="space-y-4">
      {/* Fish Card */}
      <div className={`${FishRarityUtils.getRarityColor(fish.rarity)} border-2 rounded-xl p-6 text-center shadow-lg`}>
        <div className="mb-2 flex justify-center">
          <Image
            src={`/fish/${fishImage}`}
            alt={fish.species}
            width={64}
            height={64}
            className="mx-auto object-contain"
          />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-1">
          {fish.rarity} {fish.species}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {fish.filipinoName}
        </p>
        
        {/* Adoption Fee */}
        <div className="bg-white bg-opacity-75 rounded-lg p-3 mb-4">
          <div className="text-sm font-medium text-gray-800">
            Adoption Fee: {getAdoptionFee(fish.rarity)}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            💰 Testnet pricing!
          </div>
          <div className={`text-xs mt-1 ${hasEnoughBalance ? 'text-green-600' : 'text-red-600'}`}>
            {hasEnoughBalance ? 
              "✅ You have enough ETH for this adoption!" : 
              "❌ Insufficient ETH balance"}
          </div>
        </div>

        <Button
          onClick={onAdopt}
          disabled={isAdopting || isConfirming || !hasEnoughBalance}
          variant="primary"
          size="md"
          className="w-full"
        >
          {isAdopting ? "🔄 Sending Transaction..." : 
           isConfirming ? "⏳ Confirming..." : 
           !hasEnoughBalance ? "💰 Insufficient Balance" :
           "🏠 Adopt This Fish"}
        </Button>
      </div>

      {/* Generate Another Button */}
      <div className="text-center">
        <Button
          onClick={onGenerateAnother}
          variant="outline"
          size="sm"
          disabled={cooldownLeft > 0}
        >
          {cooldownLeft > 0
            ? `⏳ Wait ${cooldownLeft}s to cast again`
            : "🎣 Cast Net Again"}
        </Button>
        {cooldownLeft > 0 && (
          <div className="mt-2 text-xs text-red-500">
            You must wait {cooldownLeft} seconds before casting your net again.
          </div>
        )}
      </div>
    </div>
  );
}
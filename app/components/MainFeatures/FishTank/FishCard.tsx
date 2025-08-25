"use client";

import Image from "next/image";
import { type Fish } from "../../../../hooks/useFishTank";

const FISH_IMAGES: Record<string, string> = {
  "Bangus": "Bangus.png",
  "Dilis": "Dilis.png",
  "Lapu-lapu": "Lapu-lapu.png",
  "Maya-maya": "Maya-maya.png",
  "Tambakol": "Tambakol.png",
  "Tilapia": "Tilapia.png",
  // Add more mappings as needed
};

interface FishCardProps {
  fish: Fish;
  onSelect: () => void;
  isSelected: boolean;
}

export function FishCard({ fish, onSelect, isSelected }: FishCardProps) {
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

  const getHealthStatus = () => {
    const now = Date.now() / 1000;
    const lastFedSeconds = Number(fish.lastFed);
    const hoursSinceLastFed = (now - lastFedSeconds) / 3600;

    if (!fish.isAlive) return { status: "💀 Dead", color: "text-red-600" };
    if (hoursSinceLastFed > 24) return { status: "😵 Starving", color: "text-red-500" };
    if (hoursSinceLastFed > 12) return { status: "😰 Hungry", color: "text-orange-500" };
    if (hoursSinceLastFed > 6) return { status: "😐 OK", color: "text-yellow-600" };
    return { status: "😊 Happy", color: "text-green-600" };
  };

  const health = getHealthStatus();
  const fishImage = FISH_IMAGES[fish.species] || "Bangus.png";

  return (
    <div 
      className={`${getRarityColor(fish.rarity)} border-2 rounded-xl p-4 cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-blue-500 scale-105" : "hover:scale-102"
      }`}
      onClick={onSelect}
    >
      <div className="text-center">
        <div className="mb-1 flex justify-center">
          <Image
            src={`/fish/${fishImage}`}
            alt={fish.species}
            width={40}
            height={40}
            className="mx-auto object-contain"
          />
        </div>
        <div className="text-xs mb-1">{getRarityEmoji(fish.rarity)}</div>
        <h3 className="font-bold text-base text-blue-900 mb-1">
          {fish.name ? fish.name : fish.species}
        </h3>
        <div className="text-xs text-gray-700 mb-1">
          {fish.species} &middot; {fish.rarity}
        </div>
        <p className="text-xs text-gray-600 mb-2">
          {fish.filipinoName}
        </p>
        <div className="bg-white bg-opacity-50 rounded-lg p-2 mb-2">
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div>
              <div className="font-medium">Level</div>
              <div>{Number(fish.level)}</div>
            </div>
            <div>
              <div className="font-medium">XP</div>
              <div>{Number(fish.experience)}</div>
            </div>
          </div>
        </div>
        <div className={`text-xs font-medium ${health.color}`}>
          {health.status}
        </div>
      </div>
    </div>
  );
}
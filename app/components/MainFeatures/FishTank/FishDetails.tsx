"use client";

import { Button } from "../../Main/DemoComponents";
import { type Fish } from "../../../../hooks/useFishTank";

interface FishDetailsProps {
  fish: Fish;
  onFeed: () => void;
  isFeedingPending: boolean;
}

export function FishDetails({ fish, onFeed, isFeedingPending }: FishDetailsProps) {
  const getExperienceToNext = () => {
    const currentXP = Number(fish.experience);
    const progress = (currentXP % 100) / 100 * 100;
    return { current: currentXP % 100, needed: 100, progress };
  };

  const getTimeSinceLastFed = () => {
    const now = Date.now() / 1000;
    const lastFedSeconds = Number(fish.lastFed);
    const diffHours = (now - lastFedSeconds) / 3600;
    
    if (diffHours < 1) return `${Math.floor(diffHours * 60)} minutes ago`;
    if (diffHours < 24) return `${Math.floor(diffHours)} hours ago`;
    return `${Math.floor(diffHours / 24)} days ago`;
  };

  const xpInfo = getExperienceToNext();

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          {fish.species}
        </h2>
        <p className="text-gray-600">{fish.filipinoName}</p>
        <div className="text-3xl my-3">🐟</div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Level:</span>
          <span className="text-sm">{Number(fish.level)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Experience:</span>
          <span className="text-sm">{xpInfo.current}/{xpInfo.needed} XP</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${xpInfo.progress}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Rarity:</span>
          <span className="text-sm">{fish.rarity}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Last Fed:</span>
          <span className="text-sm">{getTimeSinceLastFed()}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Status:</span>
          <span className="text-sm">{fish.isAlive ? "🟢 Alive" : "🔴 Dead"}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          onClick={onFeed}
          disabled={isFeedingPending || !fish.isAlive}
          variant="primary"
          size="md"
          className="w-full"
        >
          {isFeedingPending ? "🔄 Feeding..." : "🍤 Feed Fish (+10 XP)"}
        </Button>
        
        <div className="text-xs text-gray-500 text-center">
          Feeding gives experience and keeps your fish healthy!
        </div>
      </div>
    </div>
  );
}
"use client";

import { useAccount } from "wagmi";
import { Button } from "./DemoComponents";
import { useFishTank, type Fish } from "../../hooks/useFishTank";

// Fish Tank UI Component
function FishCard({ fish, onSelect, isSelected }: { 
  fish: Fish; 
  onSelect: () => void;
  isSelected: boolean;
}) {
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

  return (
    <div 
      className={`${getRarityColor(fish.rarity)} border-2 rounded-xl p-4 cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-blue-500 scale-105" : "hover:scale-102"
      }`}
      onClick={onSelect}
    >
      <div className="text-center">
        <div className="text-2xl mb-1">
          {getRarityEmoji(fish.rarity)} 🐟
        </div>
        <h3 className="font-bold text-sm text-gray-800">
          {fish.species}
        </h3>
        <p className="text-xs text-gray-600 mb-2">
          {fish.filipinoName}
        </p>
        
        {/* Stats */}
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

        {/* Health Status */}
        <div className={`text-xs font-medium ${health.color}`}>
          {health.status}
        </div>
      </div>
    </div>
  );
}

function FishDetails({ fish, onFeed, isFeedingPending }: { 
  fish: Fish; 
  onFeed: () => void;
  isFeedingPending: boolean;
}) {
  const getExperienceToNext = () => {
    const currentXP = Number(fish.experience);
    const progress = (currentXP % 100) / 100 * 100;
    return { current: currentXP % 100, needed: 100, progress };
  };

  const xpInfo = getExperienceToNext();

  const getTimeSinceLastFed = () => {
    const now = Date.now() / 1000;
    const lastFedSeconds = Number(fish.lastFed);
    const diffHours = (now - lastFedSeconds) / 3600;
    
    if (diffHours < 1) return `${Math.floor(diffHours * 60)} minutes ago`;
    if (diffHours < 24) return `${Math.floor(diffHours)} hours ago`;
    return `${Math.floor(diffHours / 24)} days ago`;
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          {fish.species}
        </h2>
        <p className="text-gray-600">{fish.filipinoName}</p>
        <div className="text-3xl my-3">🐟</div>
      </div>

      {/* Detailed Stats */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Level:</span>
          <span className="text-sm">{Number(fish.level)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Experience:</span>
          <span className="text-sm">{xpInfo.current}/{xpInfo.needed} XP</span>
        </div>
        
        {/* XP Progress Bar */}
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

      {/* Actions */}
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

export function FishTank() {
  const { isConnected } = useAccount();
  const { 
    fish, 
    selectedFish, 
    setSelectedFish, 
    isLoading, 
    handleFeedFish, 
    isFeedingPending 
  } = useFishTank();

  if (!isConnected) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🐟</div>
        <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
        <p className="text-gray-600">
          Connect your wallet to view your fish collection!
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🌊</div>
        <h2 className="text-xl font-bold mb-2">Loading Your Tank...</h2>
        <p className="text-gray-600">
          Fetching your fish from the blockchain...
        </p>
      </div>
    );
  }

  if (fish.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🏞️</div>
        <h2 className="text-xl font-bold mb-2">Empty Tank</h2>
        <p className="text-gray-600 mb-4">
          You don&apos;t have any fish yet. Start by adopting some!
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            💡 Go to the &quot;Adopt Fish&quot; section to get your first fish!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">🐠 Your Fish Tank</h2>
        <p className="text-gray-600">You have {fish.length} fish in your collection</p>
      </div>

      {/* Fish Grid */}
      <div className="grid grid-cols-2 gap-3">
        {fish.map((fishItem: Fish) => (
          <FishCard
            key={Number(fishItem.id)}
            fish={fishItem}
            onSelect={() => setSelectedFish(fishItem)}
            isSelected={selectedFish?.id === fishItem.id}
          />
        ))}
      </div>

      {/* Fish Details */}
      {selectedFish && (
        <FishDetails
          fish={selectedFish}
          onFeed={() => handleFeedFish(selectedFish.id)}
          isFeedingPending={isFeedingPending}
        />
      )}

      {/* Tank Care Tips */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-medium text-green-800 mb-2">🏆 Tank Care Tips</h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Feed your fish regularly to keep them healthy</li>
          <li>• Fish gain 10 XP each time you feed them</li>
          <li>• Every 100 XP = 1 level up!</li>
          <li>• Unfed fish for 24+ hours will start starving</li>
          <li>• Higher level fish are more valuable</li>
        </ul>
      </div>
    </div>
  );
}
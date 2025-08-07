"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useFishTank, type Fish } from "../../../hooks/useFishTank";
import { CONTRACT_ADDRESS } from "../../../contracts/abi";
import { OceanCleanup } from "../OceanCleanup";
import { FishCard } from "./FishCard";
import { FishDetails } from "./FishDetails";
import { TankStatus } from "./TankStatus";
import { FeedingModal } from "./FeedingModal";

export function FishTank() {
  const { isConnected, address } = useAccount();
  const { 
    fish, 
    selectedFish, 
    setSelectedFish, 
    isLoading, 
    isFeedingPending,
    refreshFish,
    error,
    totalFishCount,
    totalCountError
  } = useFishTank();

  const [showMiniGame, setShowMiniGame] = useState(false);
  const [showFeedingModal, setShowFeedingModal] = useState(false);

  // Handle feeding with modal
  const handleFeedWithModal = (fish: Fish) => {
    setSelectedFish(fish);
    setShowFeedingModal(true);
  };

  const handleFeedSuccess = () => {
    refreshFish();
    setShowFeedingModal(false);
  };

  // Show status component for non-success states
  if (!isConnected || isLoading || error || totalCountError || fish.length === 0) {
    return (
      <TankStatus
        isConnected={isConnected}
        isLoading={isLoading}
        error={error}
        totalCountError={totalCountError}
        fishCount={fish.length}
        totalFishCount={totalFishCount}
        address={address}
        contractAddress={CONTRACT_ADDRESS}
        onRefresh={refreshFish}
        onPlayMiniGame={() => setShowMiniGame(true)}
      />
    );
  }

  // Success state - show fish tank
  return (
    <div className="space-y-6 p-4">
      <TankStatus
        isConnected={isConnected}
        isLoading={isLoading}
        error={error}
        totalCountError={totalCountError}
        fishCount={fish.length}
        totalFishCount={totalFishCount}
        address={address}
        contractAddress={CONTRACT_ADDRESS}
        onRefresh={refreshFish}
        onPlayMiniGame={() => setShowMiniGame(true)}
      />

      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
        <div className="text-sm text-green-700">
          🎉 Great! Your fish are loaded from the blockchain!
        </div>
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

      {/* Fish Details with New Feed Button */}
      {selectedFish && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <FishDetails
            fish={selectedFish}
            onFeed={() => handleFeedWithModal(selectedFish)}
            isFeedingPending={isFeedingPending}
          />
        </div>
      )}

      {/* Tank Care Tips */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-medium text-green-800 mb-2">🏆 Tank Care Tips</h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Feed your fish regularly to keep them healthy</li>
          <li>• Regular food gives 10 XP, Fish food gives 20 XP!</li>
          <li>• Every 100 XP = 1 level up!</li>
          <li>• <strong>NEW:</strong> Play Ocean Cleanup to earn fish food!</li>
        </ul>
      </div>

      {/* Modals */}
      {showMiniGame && (
        <OceanCleanup onClose={() => setShowMiniGame(false)} />
      )}

      {showFeedingModal && selectedFish && (
        <FeedingModal
          fish={selectedFish}
          onClose={() => setShowFeedingModal(false)}
          onFeedSuccess={handleFeedSuccess}
        />
      )}
    </div>
  );
}
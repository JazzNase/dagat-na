"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { useFishTank, type Fish } from "../../../../hooks/useFishTank";
import { DAGAT_NA_ABI, CONTRACT_ADDRESS } from "../../../../contracts/abi";
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

  // Fish food balance state
  const { data: fishFoodBalance, refetch: refetchFishFood } = useReadContract({
    abi: DAGAT_NA_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "getFishFoodBalance",
    args: address ? [address] : undefined,
  });

  // Auto-update selected fish when fish data changes
  useEffect(() => {
    if (selectedFish && fish.length > 0) {
      const updatedFish = fish.find(f => f.id === selectedFish.id);
      if (updatedFish) setSelectedFish(updatedFish);
    }
  }, [fish, selectedFish, setSelectedFish]);

  // Feeding modal handler
  const handleFeedWithModal = (fish: Fish) => {
    setSelectedFish(fish);
    setShowFeedingModal(true);
  };

  // Feed success handler
  const handleFeedSuccess = () => {
    refreshFish();
    setTimeout(() => refreshFish(), 1000);
    setTimeout(() => refreshFish(), 3000);
    setTimeout(() => setShowFeedingModal(false), 2000);
    refetchFishFood(); // <-- Refresh fish food after feeding
  };

  // Get current selected fish data
  const currentSelectedFish = selectedFish ? 
    fish.find(f => f.id === selectedFish.id) || selectedFish : 
    null;

  // Status component for non-success states
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

      {/* Fish Details */}
      {currentSelectedFish && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <FishDetails
            fish={currentSelectedFish}
            onFeed={() => handleFeedWithModal(currentSelectedFish)}
            isFeedingPending={isFeedingPending}
          />
          {/* DEBUG INFO */}
          <div className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
            <div><strong>Fish ID:</strong> {Number(currentSelectedFish.id)}</div>
            <div><strong>XP:</strong> {(Number(currentSelectedFish.experience) / 100).toFixed(2)}</div>
            <div><strong>Last Updated:</strong> {new Date().toLocaleTimeString()}</div>
            <div><strong>Fish Food:</strong> {fishFoodBalance ? Number(fishFoodBalance) : 0} 🍤</div>
          </div>
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
        <OceanCleanup 
          onClose={() => {
            setShowMiniGame(false);
            refetchFishFood(); // <-- This triggers a refresh for FeedingModal too!
          }} 
          refetchFishFood={refetchFishFood}
        />
      )}

      {showFeedingModal && currentSelectedFish && (
        <FeedingModal
          fish={currentSelectedFish}
          onClose={() => setShowFeedingModal(false)}
          onFeedSuccess={handleFeedSuccess}
          fishFoodBalance={fishFoodBalance ? Number(fishFoodBalance) : 0} // <-- Pass balance
          refetchFishFood={refetchFishFood} // <-- Pass refetch to FeedingModal
        />
      )}
    </div>
  );
}
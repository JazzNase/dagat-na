"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { Button } from "../DemoComponents";
import { DAGAT_NA_ABI, CONTRACT_ADDRESS } from "../../../contracts/abi";
import { type Fish } from "../../../hooks/useFishTank";

type FeedingModalProps = {
  fish: Fish;
  onClose: () => void;
  onFeedSuccess: () => void;
};

export function FeedingModal({ fish, onClose, onFeedSuccess }: FeedingModalProps) {
  const { address, isConnected } = useAccount();
  const [feedingMethod, setFeedingMethod] = useState<"regular" | "fishfood" | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [xpGained, setXpGained] = useState(0);

  // Read fish food balance
  const { data: fishFoodBalance, refetch: refetchBalance } = useReadContract({
    abi: DAGAT_NA_ABI,
    address: CONTRACT_ADDRESS,
    functionName: 'getFishFoodBalance',
    args: address ? [address] : undefined,
  });

  // Regular feeding (no fish food required)
  const { 
    writeContract: feedRegular, 
    isPending: isRegularPending,
    data: regularTxHash 
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        console.log("✅ Regular feeding successful!");
        setXpGained(10);
      },
      onError: (error) => {
        console.error("❌ Regular feeding failed:", error);
      }
    }
  });

  // Fish food feeding (uses earned fish food)
  const { 
    writeContract: feedWithFishFood, 
    isPending: isFishFoodPending,
    data: fishFoodTxHash 
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        console.log("✅ Fish food feeding successful!");
        setXpGained(20);
        refetchBalance(); // Refresh balance after feeding
      },
      onError: (error) => {
        console.error("❌ Fish food feeding failed:", error);
      }
    }
  });

  // Wait for transaction confirmations
  const { isSuccess: isRegularConfirmed } = useWaitForTransactionReceipt({
    hash: regularTxHash,
  });

  const { isSuccess: isFishFoodConfirmed } = useWaitForTransactionReceipt({
    hash: fishFoodTxHash,
  });

  // Handle successful feeding
  useEffect(() => {
    if (isRegularConfirmed || isFishFoodConfirmed) {
      setShowSuccess(true);
      
      // **FORCE REFRESH IMMEDIATELY** when transaction confirms
      console.log("🔄 Transaction confirmed, refreshing fish data...");
      onFeedSuccess();
      
      // Auto-close after showing success
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Close after 3 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isRegularConfirmed, isFishFoodConfirmed, onFeedSuccess, onClose]);

  // Handle feeding actions
  const handleRegularFeed = async () => {
    if (!isConnected) return;

    try {
      await feedRegular({
        abi: DAGAT_NA_ABI,
        address: CONTRACT_ADDRESS,
        functionName: 'feedFish',
        args: [fish.id],
      });
    } catch (error) {
      console.error('❌ Error with regular feeding:', error);
    }
  };

  const handleFishFoodFeed = async () => {
    if (!isConnected) return;

    try {
      await feedWithFishFood({
        abi: DAGAT_NA_ABI,
        address: CONTRACT_ADDRESS,
        functionName: 'feedFishWithFishFood',
        args: [fish.id],
      });
    } catch (error) {
      console.error('❌ Error with fish food feeding:', error);
    }
  };

  // Convert BigInt to number safely
  const fishFoodCount = fishFoodBalance ? Number(fishFoodBalance) : 0;
  const fishLevel = Number(fish.level);
  const fishExp = Number(fish.experience);
  const expForNextLevel = (fishLevel * 100) - fishExp;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm mx-4 w-full">
        <div className="text-center">
          {/* Fish Info Header */}
          <div className="mb-4">
            <div className="text-3xl mb-2">🐟</div>
            <h2 className="text-xl font-bold mb-1">Feed {fish.species}</h2>
            <p className="text-sm text-gray-600">{fish.filipinoName} • Level {fishLevel}</p>
            <div className="text-xs text-gray-500 mt-1">
              {expForNextLevel > 0 ? `${expForNextLevel} XP to next level` : "Max level!"}
            </div>
          </div>

          {/* Show Transaction Success with XP details */}
          {showSuccess && (isRegularConfirmed || isFishFoodConfirmed) && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="text-green-800 font-medium mb-2">🎉 Feeding Successful!</div>
              <div className="text-sm text-green-700 space-y-1">
                <div><strong>XP Gained:</strong> +{xpGained}</div>
                <div><strong>Previous XP:</strong> {fishExp}</div>
                <div><strong>New XP:</strong> {fishExp + xpGained}</div>
                {isFishFoodConfirmed && (
                  <div className="text-orange-600 font-medium">🍤 Fish Food Bonus Applied!</div>
                )}
              </div>
              <div className="text-xs text-green-600 mt-2">
                ✅ Fish data updating automatically...
              </div>
            </div>
          )}

          {/* Feeding Method Selection */}
          {!feedingMethod && !isRegularPending && !isFishFoodPending && !showSuccess && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800 mb-3">Choose Feeding Method:</h3>
              
              {/* Regular Feeding Option */}
              <div 
                className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all"
                onClick={() => setFeedingMethod("regular")}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="font-medium text-gray-800">🍞 Regular Food</div>
                    <div className="text-sm text-gray-600">Free feeding</div>
                    <div className="text-xs text-green-600 mt-1">+10 XP</div>
                  </div>
                  <div className="text-2xl">🆓</div>
                </div>
              </div>

              {/* Fish Food Option */}
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  fishFoodCount > 0 
                    ? "border-orange-200 hover:border-orange-300 hover:bg-orange-50" 
                    : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
                }`}
                onClick={() => fishFoodCount > 0 && setFeedingMethod("fishfood")}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="font-medium text-gray-800">🍤 Mini-Game Fish Food</div>
                    <div className="text-sm text-gray-600">
                      Earned from Ocean Cleanup
                    </div>
                    <div className="text-xs text-orange-600 mt-1">+20 XP (Double Bonus!)</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl">🍤</div>
                    <div className="text-xs text-gray-600">
                      {fishFoodCount} available
                    </div>
                  </div>
                </div>
              </div>

              {/* Show fish food balance prominently */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-sm text-blue-800">
                  <strong>Your Fish Food:</strong> {fishFoodCount} 🍤
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  Earn more by playing Ocean Cleanup mini-game!
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Screen */}
          {feedingMethod && !isRegularPending && !isFishFoodPending && !showSuccess && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="text-lg font-medium mb-2">
                  {feedingMethod === "regular" ? "🍞 Regular Feeding" : "🍤 Fish Food Feeding"}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {feedingMethod === "regular" 
                    ? "Feed your fish with regular food (+10 XP)" 
                    : `Use 1 fish food for bonus XP (+20 XP)`
                  }
                </div>
                {feedingMethod === "fishfood" && (
                  <div className="text-xs text-orange-600">
                    Remaining after feeding: {fishFoodCount - 1} fish food
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => setFeedingMethod(null)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  ← Back
                </Button>
                <Button
                  onClick={feedingMethod === "regular" ? handleRegularFeed : handleFishFoodFeed}
                  variant="primary"
                  size="sm"
                  className="flex-1"
                >
                  {feedingMethod === "regular" ? "🍞 Feed Fish" : "🍤 Use Fish Food"}
                </Button>
              </div>
            </div>
          )}

          {/* Loading States */}
          {(isRegularPending || isFishFoodPending) && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl mb-2">🔄</div>
                <div className="font-medium">Feeding your fish...</div>
                <div className="text-sm text-gray-600">Please wait for blockchain confirmation</div>
                <div className="text-xs text-blue-600 mt-2">
                  Transaction sent! Waiting for confirmation...
                </div>
              </div>
            </div>
          )}

          {/* Close button (only show if not in loading/success state) */}
          {!isRegularPending && !isFishFoodPending && !feedingMethod && !showSuccess && (
            <div className="mt-4">
              <Button
                onClick={onClose}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
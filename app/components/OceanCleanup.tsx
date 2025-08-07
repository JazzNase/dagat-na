"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Button } from "./DemoComponents";
import { DAGAT_NA_ABI, CONTRACT_ADDRESS } from "../../contracts/abi";

type TrashItem = {
  id: number;
  x: number;
  y: number;
  type: string;
  points: number;
  createdAt: number; // For auto-disappearing
  lifetime: number; // How long it stays (in seconds)
};

const TRASH_TYPES = [
  { emoji: "🗑️", points: 1, lifetime: 8 },  // Disappears after 8 seconds
  { emoji: "🥤", points: 1, lifetime: 6 },   // Disappears after 6 seconds
  { emoji: "🛍️", points: 1, lifetime: 10 }, // Stays longer
  { emoji: "🍾", points: 1, lifetime: 5 },   // Disappears quickly
  { emoji: "🥫", points: 1, lifetime: 7 },   // Medium lifetime
];

export function OceanCleanup({ onClose }: { onClose: () => void }) {
  const { isConnected } = useAccount();
  const [gameState, setGameState] = useState<"waiting" | "playing" | "finished">("waiting");
  const [trashCleaned, setTrashCleaned] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [trash, setTrash] = useState<TrashItem[]>([]);
  const [fishFoodEarned, setFishFoodEarned] = useState(0);
  
  // Use refs to prevent timer manipulation
  const gameStartTime = useRef<number>(0);
  const trashCleanedRef = useRef<number>(0);

  // Contract interaction for claiming rewards
  const { 
    writeContract: claimReward, 
    isPending: isClaimingPending,
    data: claimTxHash 
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        console.log("✅ Reward claimed successfully!");
      },
      onError: (error) => {
        console.error("❌ Claim reward failed:", error);
      }
    }
  });

  const { isSuccess: isClaimConfirmed } = useWaitForTransactionReceipt({
    hash: claimTxHash,
  });

  // Calculate fish food based on exponential trash collection
  const calculateFishFood = (trashCount: number) => {
    if (trashCount >= 40) return Math.min(3, 10);
    if (trashCount >= 20) return Math.min(2, 10);
    if (trashCount >= 10) return Math.min(1, 10);
    return 0;
  };

  // Generate random trash with lifetime
  const generateTrash = useCallback(() => {
    const newTrash: TrashItem[] = [];
    const currentTime = Date.now();
    
    for (let i = 0; i < 12; i++) {
      const trashType = TRASH_TYPES[Math.floor(Math.random() * TRASH_TYPES.length)];
      newTrash.push({
        id: currentTime + i + Math.random(), // Truly unique IDs
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 10,
        type: trashType.emoji,
        points: trashType.points,
        createdAt: currentTime,
        lifetime: trashType.lifetime
      });
    }
    setTrash(newTrash);
  }, []);

  // Start game
  const startGame = () => {
    setGameState("playing");
    setTrashCleaned(0);
    setTimeLeft(30);
    setFishFoodEarned(0);
    trashCleanedRef.current = 0;
    gameStartTime.current = Date.now();
    generateTrash();
  };

  // **FIXED TIMER** - Runs independently using real time
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameState === "playing") {
      timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - gameStartTime.current) / 1000);
        const remaining = Math.max(0, 30 - elapsed);
        
        setTimeLeft(remaining);
        
        if (remaining === 0) {
          setGameState("finished");
          const earned = calculateFishFood(trashCleanedRef.current);
          setFishFoodEarned(earned);
        }
      }, 100); // Update every 100ms for smooth countdown
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState]); // Only depends on gameState

  // **AUTO-DISAPPEARING TRASH** - Remove expired trash
  useEffect(() => {
    if (gameState !== "playing") return;

    const cleanupTimer = setInterval(() => {
      const currentTime = Date.now();
      setTrash(currentTrash => 
        currentTrash.filter(item => {
          const age = (currentTime - item.createdAt) / 1000;
          return age < item.lifetime; // Keep if not expired
        })
      );
    }, 500); // Check every 500ms

    return () => clearInterval(cleanupTimer);
  }, [gameState]);

  // **SPAWN NEW TRASH** - Add new trash periodically
  useEffect(() => {
    if (gameState !== "playing") return;

    const spawnTimer = setInterval(() => {
      setTrash(currentTrash => {
        // Only spawn if we have less than 15 trash items
        if (currentTrash.length < 15) {
          const trashType = TRASH_TYPES[Math.floor(Math.random() * TRASH_TYPES.length)];
          const newTrash: TrashItem = {
            id: Date.now() + Math.random(),
            x: Math.random() * 80 + 10,
            y: Math.random() * 70 + 10,
            type: trashType.emoji,
            points: trashType.points,
            createdAt: Date.now(),
            lifetime: trashType.lifetime
          };
          return [...currentTrash, newTrash];
        }
        return currentTrash;
      });
    }, 2000); // Spawn new trash every 2 seconds

    return () => clearInterval(spawnTimer);
  }, [gameState]);

  // Remove trash when clicked
  const removeTrash = (id: number) => {
    if (gameState !== "playing") return;

    const trashItem = trash.find(t => t.id === id);
    if (trashItem) {
      // Update counts
      const newCount = trashCleanedRef.current + 1;
      trashCleanedRef.current = newCount;
      setTrashCleaned(newCount);
      
      // Remove clicked trash
      setTrash(currentTrash => currentTrash.filter(t => t.id !== id));
    }
  };

  // Claim on-chain reward with safety check
  const handleClaimReward = async () => {
    if (!isConnected || fishFoodEarned === 0) return;

    const safeAmount = Math.min(fishFoodEarned, 10);

    try {
      console.log("🎁 Claiming reward:", safeAmount, "fish food");
      
      await claimReward({
        abi: DAGAT_NA_ABI,
        address: CONTRACT_ADDRESS,
        functionName: 'claimMiniGameReward',
        args: [BigInt(safeAmount)],
      });
    } catch (error) {
      console.error('❌ Error claiming reward:', error);
    }
  };

  // Waiting to start
  if (gameState === "waiting") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-sm mx-4">
          <div className="text-center">
            <div className="text-4xl mb-4">🌊</div>
            <h2 className="text-xl font-bold mb-2">Ocean Cleanup Challenge</h2>
            <p className="text-gray-600 mb-4">
              Help clean the Philippine waters! Remove trash to earn fish food for your tank.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <h3 className="font-medium text-blue-800 mb-2">🏆 Game Rules:</h3>
              <ul className="text-sm text-blue-700 space-y-1 text-left">
                <li>• Clean 10 trash = 1 fish food 🍤</li>
                <li>• Clean 20 trash = 2 fish food 🍤🍤</li>
                <li>• Clean 40 trash = 3 fish food 🍤🍤🍤</li>
                <li>• ⏰ Exactly 30 seconds (no pausing!)</li>
                <li>• 🗑️ Trash auto-disappears after time</li>
                <li>• 🔄 New trash spawns continuously</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Button
                onClick={startGame}
                variant="primary"
                size="md"
                className="w-full"
              >
                🎮 Start Cleanup!
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Playing the game
  if (gameState === "playing") {
    const currentFishFood = calculateFishFood(trashCleaned);
    const nextTarget = trashCleaned < 10 ? 10 : trashCleaned < 20 ? 20 : 40;
    const progress = trashCleaned < 10 ? (trashCleaned / 10) * 100 : 
                    trashCleaned < 20 ? ((trashCleaned - 10) / 10) * 100 :
                    trashCleaned < 40 ? ((trashCleaned - 20) / 20) * 100 : 100;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-4 max-w-sm mx-4 w-full">
          {/* Game Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-medium">Trash: {trashCleaned}</div>
            <div className="text-sm font-medium text-red-600">Time: {timeLeft}s</div>
          </div>

          {/* Ocean Game Area */}
          <div className="relative h-64 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-400 rounded-lg overflow-hidden border-2 border-blue-300">
            {/* Water waves effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
            
            {/* Trash Items with lifetime visual indicator */}
            {trash.map(item => {
              const currentTime = Date.now();
              const age = (currentTime - item.createdAt) / 1000;
              const lifePercent = Math.max(0, (item.lifetime - age) / item.lifetime);
              const opacity = Math.max(0.3, lifePercent); // Fade as it gets older
              
              return (
                <div
                  key={item.id}
                  className="absolute cursor-pointer text-xl hover:scale-110 transition-all active:scale-95 z-10"
                  style={{ 
                    left: `${item.x}%`, 
                    top: `${item.y}%`,
                    transform: 'translate(-50%, -50%)',
                    opacity: opacity,
                    filter: lifePercent < 0.3 ? 'brightness(0.7)' : 'none' // Dim when about to disappear
                  }}
                  onClick={() => removeTrash(item.id)}
                >
                  {item.type}
                </div>
              );
            })}

            {/* Fish swimming around */}
            <div className="absolute bottom-4 left-4 text-lg animate-bounce">🐟</div>
            <div className="absolute top-8 right-8 text-lg animate-pulse">🐠</div>
            <div className="absolute bottom-8 right-12 text-lg animate-bounce delay-1000">🐡</div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Fish Food: {currentFishFood} 🍤</span>
              <span>Next: {nextTarget} trash</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 text-center mt-1">
              Trash auto-disappears • New trash spawns every 2s
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game finished
  if (gameState === "finished") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-sm mx-4">
          <div className="text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-xl font-bold mb-2">Ocean Cleanup Complete!</h2>
            
            {/* Results */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="text-lg font-bold text-green-800 mb-2">
                Trash Cleaned: {trashCleaned} pieces
              </div>
              <div className="text-sm text-green-700">
                Fish Food Earned: {fishFoodEarned} 🍤
              </div>
              {fishFoodEarned > 0 && (
                <div className="text-xs text-green-600 mt-2">
                  Claim your rewards on the blockchain!
                </div>
              )}
            </div>

            {/* Claim Reward or Play Again */}
            <div className="space-y-2">
              {fishFoodEarned > 0 && isConnected && !isClaimConfirmed ? (
                <Button
                  onClick={handleClaimReward}
                  disabled={isClaimingPending}
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  {isClaimingPending ? "🔄 Claiming..." : `🎁 Claim ${fishFoodEarned} Fish Food`}
                </Button>
              ) : null}

              {isClaimConfirmed && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                  <div className="text-sm text-blue-700">
                    ✅ Reward claimed successfully!
                  </div>
                </div>
              )}

              <Button
                onClick={startGame}
                variant="primary"
                size="md"
                className="w-full"
              >
                🔄 Play Again
              </Button>
              
              <Button
                onClick={onClose}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { DAGAT_NA_ABI, CONTRACT_ADDRESS } from "../../../../contracts/abi";
import { TrashItem } from "./types";
import { TRASH_TYPES } from "./trashTypes";
import { GameRulesModal } from "./GameRulesModal";
import { OceanGameArea } from "./OceanGameArea";
import { GameFinishedModal } from "./GameFinishedModal";

// Leaderboard Modal for Ocean Cleanup (shows global stats + your lifetime fish food earned)
function LeaderboardModal({ onClose }: { onClose: () => void }) {
  const { address } = useAccount();
  const { data: totalFishFoodEarned, isLoading: isTotalFoodLoading } = useReadContract({
    abi: DAGAT_NA_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "getTotalFishFoodEarned",
    args: address ? [address] : undefined,
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md mx-4 w-full">
        <h2 className="text-xl font-bold mb-4 text-center">🍤 Fish Food Collected</h2>
        <div className="text-center text-lg font-semibold mb-6">
          {isTotalFoodLoading
            ? "Loading..."
            : `${totalFishFoodEarned?.toString() ?? "0"} Fish Food Collected`}
        </div>
        <button
          className="mt-2 w-full bg-blue-600 text-white py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

const GAME_COOLDOWN_SECONDS = 300; // 5 minutes
const GAME_LAST_PLAY_KEY = "dagatna_last_ocean_cleanup_time";

export function OceanCleanup({ onClose }: { onClose: () => void }) {
  const { isConnected } = useAccount();
  const [gameState, setGameState] = useState<"waiting" | "playing" | "finished">("waiting");
  const [trashCleaned, setTrashCleaned] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [trash, setTrash] = useState<TrashItem[]>([]);
  const [fishFoodEarned, setFishFoodEarned] = useState(0);

  const [gameCooldownLeft, setGameCooldownLeft] = useState<number>(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const gameStartTime = useRef<number>(0);
  const trashCleanedRef = useRef<number>(0);

  // Track last play time for cooldown
  useEffect(() => {
    const stored = localStorage.getItem(GAME_LAST_PLAY_KEY);
    if (stored) {
      const lastPlay = Number(stored);
      const elapsed = Math.floor((Date.now() - lastPlay) / 1000);
      const left = Math.max(0, GAME_COOLDOWN_SECONDS - elapsed);
      setGameCooldownLeft(left);
      if (left > 0) {
        // Update cooldown every second
        const interval = setInterval(() => {
          const elapsedNow = Math.floor((Date.now() - lastPlay) / 1000);
          const leftNow = Math.max(0, GAME_COOLDOWN_SECONDS - elapsedNow);
          setGameCooldownLeft(leftNow);
          if (leftNow <= 0) clearInterval(interval);
        }, 1000);
        return () => clearInterval(interval);
      }
    }
  }, [gameState]);

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

  const calculateFishFood = (trashCount: number) => {
    if (trashCount >= 40) return Math.min(3, 10);
    if (trashCount >= 20) return Math.min(2, 10);
    if (trashCount >= 10) return Math.min(1, 10);
    return 0;
  };

  // Randomize points and add 3 seconds to lifetime for each trash item
  const generateTrash = useCallback(() => {
    const newTrash: TrashItem[] = [];
    const currentTime = Date.now();
    for (let i = 0; i < 12; i++) {
      const trashType = TRASH_TYPES[Math.floor(Math.random() * TRASH_TYPES.length)];
      newTrash.push({
        id: currentTime + i + Math.random(),
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 10,
        type: trashType.emoji,
        points: Math.floor(Math.random() * 3) + 1, // random 1-3 integer
        createdAt: currentTime,
        lifetime: trashType.lifetime + 3 // add at least 3 seconds
      });
    }
    setTrash(newTrash);
  }, []);

  const startGame = () => {
    if (gameCooldownLeft > 0) return; // Prevent starting if cooldown active
    setGameState("playing");
    setTrashCleaned(0);
    setTimeLeft(60);
    setFishFoodEarned(0);
    trashCleanedRef.current = 0;
    gameStartTime.current = Date.now();
    generateTrash();
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing") {
      timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - gameStartTime.current) / 1000);
        const remaining = Math.max(0, 60 - elapsed);
        setTimeLeft(remaining);
        if (remaining === 0) {
          setGameState("finished");
          const earned = calculateFishFood(trashCleanedRef.current);
          setFishFoodEarned(earned);
          // Save last play time for cooldown
          localStorage.setItem(GAME_LAST_PLAY_KEY, String(Date.now()));
          setGameCooldownLeft(GAME_COOLDOWN_SECONDS);
        }
      }, 100);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "playing") return;
    const cleanupTimer = setInterval(() => {
      const currentTime = Date.now();
      setTrash(currentTrash =>
        currentTrash.filter(item => {
          const age = (currentTime - item.createdAt) / 1000;
          return age < item.lifetime;
        })
      );
    }, 500);
    return () => clearInterval(cleanupTimer);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "playing") return;
    const spawnTimer = setInterval(() => {
      setTrash(currentTrash => {
        if (currentTrash.length < 15) {
          const trashType = TRASH_TYPES[Math.floor(Math.random() * TRASH_TYPES.length)];
          const newTrash: TrashItem = {
            id: Date.now() + Math.random(),
            x: Math.random() * 80 + 10,
            y: Math.random() * 70 + 10,
            type: trashType.emoji,
            points: Math.floor(Math.random() * 3) + 1, // random 1-3 integer
            createdAt: Date.now(),
            lifetime: trashType.lifetime + 3 // add at least 3 seconds
          };
          return [...currentTrash, newTrash];
        }
        return currentTrash;
      });
    }, 2000);
    return () => clearInterval(spawnTimer);
  }, [gameState]);

  const removeTrash = (id: number) => {
    if (gameState !== "playing") return;
    const trashItem = trash.find(t => t.id === id);
    if (trashItem) {
      const newCount = trashCleanedRef.current + 1;
      trashCleanedRef.current = newCount;
      setTrashCleaned(newCount);
      setTrash(currentTrash => currentTrash.filter(t => t.id !== id));
    }
  };

  const handleClaimReward = async () => {
    if (!isConnected || fishFoodEarned === 0) return;
    const safeAmount = Math.min(fishFoodEarned, 10);
    try {
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

  if (gameState === "waiting") {
    return (
      <>
        <GameRulesModal
          onStart={startGame}
          onClose={onClose}
          gameCooldownLeft={gameCooldownLeft}
          onShowLeaderboard={() => setShowLeaderboard(true)}
        />
        {showLeaderboard && (
          <LeaderboardModal onClose={() => setShowLeaderboard(false)} />
        )}
      </>
    );
  }

  if (gameState === "playing") {
    return (
      <OceanGameArea
        trash={trash}
        trashCleaned={trashCleaned}
        timeLeft={timeLeft}
        removeTrash={removeTrash}
        calculateFishFood={calculateFishFood}
      />
    );
  }

  if (gameState === "finished") {
    return (
      <GameFinishedModal
        trashCleaned={trashCleaned}
        fishFoodEarned={fishFoodEarned}
        isConnected={isConnected}
        isClaimConfirmed={isClaimConfirmed}
        isClaimingPending={isClaimingPending}
        onClaim={handleClaimReward}
        onPlayAgain={startGame}
        onClose={onClose}
        gameCooldownLeft={gameCooldownLeft}
      />
    );
  }

  return null;
}
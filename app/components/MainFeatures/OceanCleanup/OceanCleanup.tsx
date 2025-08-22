"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { DAGAT_NA_ABI, CONTRACT_ADDRESS } from "../../../../contracts/abi";
import { TrashItem } from "./types";
import { TRASH_TYPES } from "./trashTypes";
import { GameRulesModal } from "./GameRulesModal";
import { OceanGameArea } from "./OceanGameArea";
import { GameFinishedModal } from "./GameFinishedModal";

export function OceanCleanup({ onClose }: { onClose: () => void }) {
  const { isConnected } = useAccount();
  const [gameState, setGameState] = useState<"waiting" | "playing" | "finished">("waiting");
  const [trashCleaned, setTrashCleaned] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [trash, setTrash] = useState<TrashItem[]>([]);
  const [fishFoodEarned, setFishFoodEarned] = useState(0);

  const gameStartTime = useRef<number>(0);
  const trashCleanedRef = useRef<number>(0);

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
      <GameRulesModal onStart={startGame} onClose={onClose} />
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
      />
    );
  }

  return null;
}
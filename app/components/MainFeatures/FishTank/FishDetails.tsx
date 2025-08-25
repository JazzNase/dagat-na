"use client";

import { useState } from "react";
import { Button } from "../../Main/DemoComponents";
import { useWriteContract } from "wagmi";
import { DAGAT_NA_ABI, CONTRACT_ADDRESS } from "../../../../contracts/abi";
import { type Fish } from "../../../../hooks/useFishTank";

const FEED_COOLDOWN_SECONDS = 300; // 5 minutes

interface FishDetailsProps {
  fish: Fish;
  onFeed: () => void;
  isFeedingPending: boolean;
}

export function FishDetails({ fish, onFeed, isFeedingPending }: FishDetailsProps) {
  const [newName, setNewName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  const { writeContract: renameFish, isPending: isRenamePending } = useWriteContract({
    mutation: {
      onSuccess: () => {
        setNewName("");
        setIsRenaming(false);
      }
    }
  });

  const handleRename = async () => {
    if (!newName) return;
    await renameFish({
      abi: DAGAT_NA_ABI,
      address: CONTRACT_ADDRESS,
      functionName: "renameFish",
      args: [fish.id, newName]
    });
  };

  const getExperienceToNext = () => {
    const currentXP = Number(fish.experience);
    const progress = (currentXP % 100) / 100 * 100;
    return { current: currentXP % 100, needed: 100, progress };
  };

  const getTimeSinceLastFed = () => {
    const now = Date.now() / 1000;
    const lastFedSeconds = Number(fish.lastFed);
    const diffSeconds = now - lastFedSeconds;
    const diffMinutes = Math.floor(diffSeconds / 60);

    if (diffMinutes < 1) return `${Math.floor(diffSeconds)} seconds ago`;
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return `${Math.floor(diffMinutes / 1440)} days ago`;
  };

  // --- FEED COOLDOWN LOGIC ---
  const nowSeconds = Date.now() / 1000;
  const lastFedSeconds = Number(fish.lastFed);
  const secondsSinceFed = nowSeconds - lastFedSeconds;
  const feedCooldownLeft = Math.max(0, FEED_COOLDOWN_SECONDS - secondsSinceFed);

  const xpInfo = getExperienceToNext();

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          {fish.name || fish.species}
        </h2>
        <p className="text-gray-600">{fish.filipinoName}</p>
        <div className="text-3xl my-3">🐟</div>
        {/* 🆕 Rename UI */}
        <div className="mt-2">
          {isRenaming ? (
            <div className="flex items-center gap-2 justify-center">
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Enter new name"
                className="border rounded px-2 py-1"
                maxLength={32}
              />
              <Button
                onClick={handleRename}
                disabled={isRenamePending}
                variant="primary"
                size="sm"
              >
                Save
              </Button>
              <Button
                onClick={() => setIsRenaming(false)}
                variant="ghost"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsRenaming(true)}
              variant="ghost"
              size="sm"
              className="text-blue-600 underline"
            >
              Rename Fish
            </Button>
          )}
        </div>
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
          disabled={isFeedingPending || !fish.isAlive || feedCooldownLeft > 0}
          variant="primary"
          size="md"
          className="w-full"
        >
          {feedCooldownLeft > 0
            ? `⏳ Wait ${Math.ceil(feedCooldownLeft)}s to feed again`
            : isFeedingPending
              ? "🔄 Feeding..."
              : "🍤 Feed Fish (+10 XP)"}
        </Button>
        
        <div className="text-xs text-gray-500 text-center">
          Feeding gives experience and keeps your fish healthy!
        </div>
        {feedCooldownLeft > 0 && (
          <div className="text-xs text-red-500 text-center mt-2">
            You must wait {Math.ceil(feedCooldownLeft)} seconds before feeding this fish again.
          </div>
        )}
      </div>
    </div>
  );
}
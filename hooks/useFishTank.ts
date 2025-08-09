"use client";

import { useState, useEffect, useMemo } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { DAGAT_NA_ABI, CONTRACT_ADDRESS } from "../contracts/abi";

export type Fish = {
  id: bigint;
  species: string;
  filipinoName: string;
  rarity: string;
  name: string;
  level: bigint;
  experience: bigint;
  lastFed: bigint;
  isAlive: boolean;
};

// Type for the raw contract response (tuple format)
type ContractFishData = readonly [
  bigint,    // id
  string,    // species
  string,    // filipinoName
  string,    // rarity
  string,    // name         // 🆕 Add this line
  bigint,    // level
  bigint,    // experience
  bigint,    // lastFed
  boolean    // isAlive
];

// Type for contract response (object format)
type ContractFishObject = {
  id: bigint;
  species: string;
  filipinoName: string;
  rarity: string;
  name: string;
  level: bigint;
  experience: bigint;
  lastFed: bigint;
  isAlive: boolean;
};

// Union type for contract response
type ContractFishItem = ContractFishData | ContractFishObject;

export function useFishTank() {
  const { address, isConnected } = useAccount();
  const [selectedFish, setSelectedFish] = useState<Fish | null>(null);

  // Get total fish count using nextFishId
  const { 
    data: nextFishId, 
    error: totalCountError 
  } = useReadContract({
    abi: DAGAT_NA_ABI,
    address: CONTRACT_ADDRESS,
    functionName: 'nextFishId',
    query: {
      enabled: !!isConnected,
    }
  });

  // Read fish data from contract
  const { 
    data: fishData, 
    isLoading, 
    refetch,
    error 
  } = useReadContract({
    abi: DAGAT_NA_ABI,
    address: CONTRACT_ADDRESS,
    functionName: 'getFishByOwner',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
      refetchInterval: 5000, // Refetch every 5 seconds
    }
  });

  // Feed fish functionality
  const { 
    writeContract: feedFish, 
    isPending: isFeedingPending,
    data: feedTxHash 
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        console.log("✅ Feed transaction sent");
        // Refetch fish data after successful transaction
        setTimeout(() => {
          refetch();
        }, 2000);
      },
      onError: (error) => {
        console.error("❌ Feed transaction failed:", error);
      }
    }
  });

  // Wait for feed transaction confirmation
  const { isSuccess: isFeedConfirmed } = useWaitForTransactionReceipt({
    hash: feedTxHash,
  });

  // Refetch data when feed transaction is confirmed
  useEffect(() => {
    if (isFeedConfirmed) {
      console.log("🔄 Feed confirmed, refreshing fish data...");
      refetch();
    }
  }, [isFeedConfirmed, refetch]);

  const handleFeedFish = async (fishId: bigint) => {
    if (!isConnected) return;

    try {
      console.log("🍤 Feeding fish:", fishId.toString());
      
      await feedFish({
        abi: DAGAT_NA_ABI,
        address: CONTRACT_ADDRESS,
        functionName: 'feedFish',
        args: [fishId],
      });
    } catch (error) {
      console.error('❌ Error feeding fish:', error);
    }
  };

  // Manual refresh function
  const refreshFish = () => {
    console.log("🔄 Manually refreshing fish data...");
    refetch();
  };

  // Helper function to check if item is tuple format
  const isTupleFormat = (item: ContractFishItem): item is ContractFishData => {
    return Array.isArray(item);
  };

  // Convert contract data to Fish array with useMemo to prevent unnecessary re-renders
  const fish: Fish[] = useMemo(() => {
    if (!fishData || !Array.isArray(fishData)) {
      return [];
    }
    
    // Convert the contract data to our Fish type with proper typing
    return (fishData as ContractFishItem[]).map((fishItem) => {
      if (isTupleFormat(fishItem)) {
        // Tuple format: [id, species, filipinoName, rarity, name, level, experience, lastFed, isAlive]
        const [id, species, filipinoName, rarity, name, level, experience, lastFed, isAlive] = fishItem;
        return {
          id: BigInt(id || 0),
          species: species || "Unknown",
          filipinoName: filipinoName || "Unknown",
          rarity: rarity || "Bronze",
          name: name || "Isda", // 🆕 Add this line
          level: BigInt(level || 1),
          experience: BigInt(experience || 0),
          lastFed: BigInt(lastFed || Math.floor(Date.now() / 1000)),
          isAlive: isAlive !== undefined ? isAlive : true,
        };
      } else {
        // Object format: {id, species, filipinoName, rarity, name, ...}
        return {
          id: BigInt(fishItem.id || 0),
          species: fishItem.species || "Unknown",
          filipinoName: fishItem.filipinoName || "Unknown",
          rarity: fishItem.rarity || "Bronze",
          name: fishItem.name || "Isda", // 🆕 Add this line
          level: BigInt(fishItem.level || 1),
          experience: BigInt(fishItem.experience || 0),
          lastFed: BigInt(fishItem.lastFed || Math.floor(Date.now() / 1000)),
          isAlive: fishItem.isAlive !== undefined ? fishItem.isAlive : true,
        };
      }
    });
  }, [fishData]);

  // Calculate total fish count from nextFishId
  const totalFishCount = nextFishId ? Number(nextFishId) - 1 : 0;

  // Enhanced debug logging
  useEffect(() => {
    console.log("🐟 Fish Tank Debug:", {
      isConnected,
      address,
      contractAddress: CONTRACT_ADDRESS,
      fishCount: fish.length,
      isLoading,
      error: error?.message,
      totalFishCount,
      totalCountError: totalCountError?.message,
      nextFishId: nextFishId ? Number(nextFishId) : 'N/A',
      rawFishData: fishData,
      processedFish: fish,
    });
  }, [fish, isLoading, error?.message, isConnected, address, totalFishCount, totalCountError?.message, fishData, nextFishId]);

  return {
    fish,
    selectedFish,
    setSelectedFish,
    isLoading,
    handleFeedFish,
    isFeedingPending,
    refreshFish,
    error,
    totalFishCount,
    totalCountError,
  };
}
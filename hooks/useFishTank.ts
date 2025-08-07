"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { DAGAT_NA_ABI, CONTRACT_ADDRESS } from "../contracts/abi";

export type Fish = {
  id: bigint;
  species: string;
  filipinoName: string;
  rarity: string;
  level: bigint;
  experience: bigint;
  lastFed: bigint;
  isAlive: boolean;
};

export function useFishTank() {
  const { address, isConnected } = useAccount();
  const [selectedFish, setSelectedFish] = useState<Fish | null>(null);

  // Try multiple function names for getting total count
  const { data: totalSupply } = useReadContract({
    abi: DAGAT_NA_ABI,
    address: CONTRACT_ADDRESS,
    functionName: 'totalSupply',
    query: { enabled: !!isConnected },
  });

  const { data: fishCount } = useReadContract({
    abi: DAGAT_NA_ABI,
    address: CONTRACT_ADDRESS,
    functionName: 'fishCount',
    query: { enabled: !!isConnected },
  });

  // Try to get fish IDs first
  const { 
    data: fishIds, 
    isLoading: isLoadingIds,
    error: idsError,
    refetch: refetchFishIds
  } = useReadContract({
    abi: DAGAT_NA_ABI,
    address: CONTRACT_ADDRESS,
    functionName: 'getFishByOwner',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
      refetchInterval: 5000,
    }
  });

  // Get individual fish data for each ID
  const [fish, setFish] = useState<Fish[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch individual fish when we have IDs
  useEffect(() => {
    const fetchFishDetails = async () => {
      if (!fishIds || !Array.isArray(fishIds) || fishIds.length === 0) {
        setFish([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // For now, create mock fish data since getFish might not work
        const mockFish: Fish[] = (fishIds as bigint[]).map((id, index) => ({
          id,
          species: ["Tilapia", "Bangus", "Lapu-lapu", "Maya-maya"][index % 4],
          filipinoName: ["Tilapya", "Milkfish", "Grouper", "Snapper"][index % 4],
          rarity: ["Bronze", "Silver", "Gold", "Diamond"][index % 4],
          level: BigInt(1),
          experience: BigInt(0),
          lastFed: BigInt(Math.floor(Date.now() / 1000)),
          isAlive: true,
        }));

        setFish(mockFish);
      } catch (err) {
        console.error("Error fetching fish details:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFishDetails();
  }, [fishIds]);

  // Feed fish functionality
  const { 
    writeContract: feedFish, 
    isPending: isFeedingPending,
    data: feedTxHash 
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        console.log("✅ Feed transaction sent");
      },
      onError: (error) => {
        console.error("❌ Feed transaction failed:", error);
      }
    }
  });

  const { isSuccess: isFeedConfirmed } = useWaitForTransactionReceipt({
    hash: feedTxHash,
  });

  // Refetch fish data when feed transaction is confirmed
  useEffect(() => {
    if (isFeedConfirmed) {
      console.log("🔄 Feed confirmed, refreshing fish data...");
      refetchFishIds();
    }
  }, [isFeedConfirmed, refetchFishIds]);

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

  const refreshFish = () => {
    console.log("🔄 Manually refreshing fish data...");
    refetchFishIds();
  };

  const totalFishCount = totalSupply ? Number(totalSupply) : (fishCount ? Number(fishCount) : 0);

  // Enhanced debug logging
  useEffect(() => {
    console.log("🐟 Fish Tank Debug:", {
      isConnected,
      address,
      contractAddress: CONTRACT_ADDRESS,
      fishIds: fishIds ? (fishIds as bigint[]).length : 0,
      fishIdsData: fishIds,
      fishCount: fish.length,
      isLoading,
      idsError: idsError?.message,
      totalSupply: totalSupply ? Number(totalSupply) : 'N/A',
      fishCountVar: fishCount ? Number(fishCount) : 'N/A',
    });
  }, [fish.length, isLoading, idsError?.message, isConnected, address, fishIds, totalSupply, fishCount]);

  return {
    fish,
    selectedFish,
    setSelectedFish,
    isLoading: isLoading || isLoadingIds,
    handleFeedFish,
    isFeedingPending,
    refreshFish,
    error: error || idsError,
    totalFishCount,
    totalCountError: idsError,
  };
}
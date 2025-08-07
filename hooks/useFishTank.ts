"use client";

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { DAGAT_NA_ABI, CONTRACT_ADDRESS } from '../contracts/abi';

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
  const { address } = useAccount();
  const [selectedFish, setSelectedFish] = useState<Fish | null>(null);

  // Read user's fish from contract
  const { data: fishData, isLoading, refetch } = useReadContract({
    abi: DAGAT_NA_ABI,
    address: CONTRACT_ADDRESS,
    functionName: 'getFishByOwner',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Write contract for feeding fish
  const { writeContract: feedFish, isPending: isFeedingPending } = useWriteContract();

  const fish = fishData as Fish[] || [];

  const handleFeedFish = async (fishId: bigint) => {
    try {
      feedFish({
        abi: DAGAT_NA_ABI,
        address: CONTRACT_ADDRESS,
        functionName: 'feedFish',
        args: [fishId],
      });
    } catch (error) {
      console.error('Error feeding fish:', error);
    }
  };

  // Auto-refresh fish data every 30 seconds
  useEffect(() => {
    if (address) {
      const interval = setInterval(() => {
        refetch();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [address, refetch]);

  return {
    fish,
    selectedFish,
    setSelectedFish,
    isLoading,
    handleFeedFish,
    isFeedingPending,
    refetch,
  };
}
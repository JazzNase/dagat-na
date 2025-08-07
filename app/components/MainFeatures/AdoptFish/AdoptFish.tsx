"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useBalance } from "wagmi";
import { parseEther } from "viem";
import { DAGAT_NA_ABI, CONTRACT_ADDRESS } from "../../../../contracts/abi";
import { ADOPTION_FEES, CONFIG, type GeneratedFish } from "./AdoptFishConfig";
import { FishGenerator } from "./FishGenerator";
import { FishDisplayCard } from "./FishDisplayCard";
import { SuccessStatus, ErrorStatus, NotConnectedStatus } from "./AdoptFishStatus";
import { FishRarityUtils } from "./FishRarityUtils";

export function AdoptFish() {
  const { isConnected, address } = useAccount();
  const [generatedFish, setGeneratedFish] = useState<GeneratedFish | null>(null);
  const [txHash, setTxHash] = useState<string>("");
  
  const { data: balance } = useBalance({ address });
  
  const { 
    writeContract: adoptFish, 
    isPending: isAdopting,
    data: contractTxHash,
    error: adoptError,
    reset: resetContract
  } = useWriteContract({
    mutation: {
      onSuccess: (hash) => {
        console.log("✅ Transaction sent:", hash);
        setTxHash(hash);
      },
      onError: (error) => console.error("❌ Transaction failed:", error)
    }
  });

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    error: confirmError 
  } = useWaitForTransactionReceipt({ hash: contractTxHash });

  const handleAdoptFish = async () => {
    if (!generatedFish || !isConnected) return;

    try {
      const fee = ADOPTION_FEES[generatedFish.rarity as keyof typeof ADOPTION_FEES];

      await adoptFish({
        abi: DAGAT_NA_ABI,
        address: CONTRACT_ADDRESS,
        functionName: 'adoptFish',
        args: [generatedFish.species, generatedFish.filipinoName, generatedFish.rarity],
        value: parseEther(fee),
      });
    } catch (error) {
      console.error('❌ Error adopting fish:', error);
    }
  };

  const hasEnoughBalance = (rarity: string) => {
    if (!balance) return false;
    const balanceInEth = parseFloat(balance.formatted);
    const requiredFee = parseFloat(ADOPTION_FEES[rarity as keyof typeof ADOPTION_FEES]);
    return balanceInEth >= requiredFee;
  };

  const calculateAffordableFish = () => {
    if (!balance) return 0;
    const balanceInEth = parseFloat(balance.formatted);
    const diamondFee = parseFloat(ADOPTION_FEES.Diamond);
    return Math.floor(balanceInEth / diamondFee);
  };

  // 🎯 FIXED: Complete reset function
  const resetState = () => {
    setGeneratedFish(null);
    setTxHash("");
    resetContract(); // Reset the wagmi contract state
  };

  // Status screens
  if (isConfirmed && txHash) {
    return <SuccessStatus txHash={txHash} fish={generatedFish} onAdoptAnother={resetState} />;
  }

  if (adoptError || confirmError) {
    const errorMessage = adoptError?.message || confirmError?.message || "Unknown error occurred";
    return <ErrorStatus error={errorMessage} onTryAgain={resetState} />;
  }

  if (!isConnected) {
    return <NotConnectedStatus />;
  }

  // Main interface
  return (
    <div className="space-y-6 p-4 max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">🎣 Adopt a Filipino Fish</h2>
        <p className="text-[var(--app-foreground-muted)]">Discover fish species native to Philippine waters!</p>
      </div>

      {!generatedFish ? (
        <FishGenerator onFishGenerated={setGeneratedFish} />
      ) : (
        <FishDisplayCard
          fish={generatedFish}
          onAdopt={handleAdoptFish}
          onGenerateAnother={resetState}
          hasEnoughBalance={hasEnoughBalance(generatedFish.rarity)}
          isAdopting={isAdopting}
          isConfirming={isConfirming}
        />
      )}

      {/* Price Comparison */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">💰 Testnet Pricing</h3>
        <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
          {Object.entries(ADOPTION_FEES).map(([rarity, fee]) => (
            <div key={rarity}>
              {FishRarityUtils.getRarityEmoji(rarity)} {rarity}: {fee} ETH
            </div>
          ))}
        </div>
        {balance && (
          <div className="text-xs text-blue-600 mt-2 text-center">
            Your Balance: {parseFloat(balance.formatted).toFixed(6)} ETH - You can adopt ~{calculateAffordableFish()} Diamond fish! 🐟
          </div>
        )}
      </div>

      {/* Blockchain Integration Notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-medium text-purple-800 mb-2">⚡ On-Chain Features</h3>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• Each fish is minted as an NFT on {CONFIG.network.name}</li>
          <li>• Fish data is stored permanently on blockchain</li>
          <li>• Feed and care for your fish to level them up</li>
          <li>• Dynamic pricing based on rarity</li>
        </ul>
      </div>
    </div>
  );
}
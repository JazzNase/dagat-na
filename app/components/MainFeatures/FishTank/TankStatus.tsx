"use client";

import { Button } from "../../Main/DemoComponents";

interface TankStatusProps {
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
  totalCountError: Error | null;
  fishCount: number;
  totalFishCount: number;
  address?: string;
  contractAddress: string;
  onRefresh: () => void;
  onPlayMiniGame: () => void;
}

export function TankStatus({ 
  isConnected, 
  isLoading, 
  error, 
  totalCountError, 
  fishCount, 
  totalFishCount, 
  address, 
  contractAddress,
  onRefresh,
  onPlayMiniGame 
}: TankStatusProps) {
  
  if (!isConnected) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🐟</div>
        <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
        <p className="text-gray-600">
          Connect your wallet to view your fish collection!
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🌊</div>
        <h2 className="text-xl font-bold mb-2">Loading Your Tank...</h2>
        <p className="text-gray-600">
          Fetching your fish from the blockchain...
        </p>
      </div>
    );
  }

  if (error || totalCountError) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2 text-red-600">Contract Connection Issue</h2>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h3 className="font-medium text-red-800 mb-2">🔍 Diagnosis:</h3>
          <div className="text-sm text-red-700 space-y-2 text-left">
            <div><strong>Contract Address:</strong> {contractAddress}</div>
            <div><strong>Your Address:</strong> {address}</div>
            <div><strong>Network:</strong> Base Sepolia (84532)</div>
            <div><strong>Total Fish Contract Call:</strong> {totalCountError ? "❌ Failed" : `✅ Success (${totalFishCount})`}</div>
            <div><strong>Get Fish Call:</strong> {error ? "❌ Failed" : "✅ Success"}</div>
          </div>
          
          {/* Show error details if available */}
          {(error || totalCountError) && (
            <div className="mt-3 p-2 bg-red-100 rounded text-xs">
              <strong>Error Details:</strong><br />
              {error?.message || totalCountError?.message || "Unknown error occurred"}
            </div>
          )}
        </div>

        <Button onClick={onRefresh} variant="primary" size="md">
          🔄 Try Again
        </Button>
      </div>
    );
  }

  if (fishCount === 0) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🏞️</div>
        <h2 className="text-xl font-bold mb-2">Empty Tank</h2>
        <p className="text-gray-600 mb-4">
          You don&apos;t have any fish yet. Start by adopting some!
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-green-800 mb-2">✅ Contract Connected!</h4>
          <div className="text-sm text-green-700 space-y-1">
            <div>Total fish in ecosystem: {totalFishCount}</div>
            <div>Your fish: 0</div>
            <div>Contract is working properly!</div>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={onRefresh} variant="outline" size="md">
            🔄 Refresh Tank
          </Button>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              💡 Go to the &quot;Adopt Fish&quot; section to get your first fish!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success state - show header
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-center flex-1">
          <h2 className="text-2xl font-bold mb-2">🐠 Your Fish Tank</h2>
          <p className="text-gray-600">You have {fishCount} fish in your collection</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={onPlayMiniGame} variant="primary" size="sm">
            🎮 Play
          </Button>
          <Button onClick={onRefresh} variant="outline" size="sm">
            🔄
          </Button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
        <div className="text-sm text-blue-700 mb-1">
          🌊 <strong>New!</strong> Play Ocean Cleanup to earn fish food!
        </div>
        <div className="text-xs text-blue-600">
          Help clean Philippine waters and get rewards on the blockchain 🏆
        </div>
      </div>
    </div>
  );
}
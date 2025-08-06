"use client";

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Button } from './DemoComponents'

type DagatNaHomeProps = {
  setActiveTab: (tab: string) => void;
}

export function DagatNaHome({ setActiveTab }: DagatNaHomeProps) {
  const { address } = useAccount()

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center space-y-3">
        <div className="text-4xl mb-2">🐟</div>
        <h1 className="text-2xl font-bold text-blue-600">
          Welcome to Dagat na!
        </h1>
        <p className="text-sm text-gray-600 px-4">
          Adopt, raise, and care for Filipino fish species in this Tamagotchi-style mini app
        </p>
      </div>

      {/* Connection Status */}
      {!address ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-yellow-600 mb-2">👋</div>
          <p className="text-sm text-yellow-700 font-medium mb-3">
            Connect your wallet to start your fish adoption journey!
          </p>
          <p className="text-xs text-yellow-600">
            Once connected, you can adopt your first Filipino fish
          </p>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-green-600 mb-2">✅</div>
          <p className="text-sm text-green-700 font-medium mb-1">
            Wallet Connected!
          </p>
          <p className="text-xs text-green-600">
            Ready to adopt your first fish
          </p>
        </div>
      )}

      {/* Game Features Preview */}
      <div className="space-y-3">
        <h2 className="font-bold text-lg text-center">🎮 How to Play</h2>
        
        <div className="grid grid-cols-1 gap-3">
          <FeatureCard
            emoji="🐠"
            title="Adopt Fish"
            description="Get random Filipino fish species with unique traits & rarity"
          />
          <FeatureCard
            emoji="🍽️"
            title="Feed & Care"
            description="Keep your fish happy with food, play, and tank cleaning"
          />
          <FeatureCard
            emoji="📈"
            title="Grow & Level"
            description="Watch fish grow from baby (0) to elder (100) through care"
          />
          <FeatureCard
            emoji="🏆"
            title="Collect Rarities"
            description="Find Bronze, Silver, Gold, and rare Diamond fish"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        {address ? (
          <>
            <Button
              onClick={() => setActiveTab("adopt")}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 text-lg"
            >
              🎣 Start Adopting Fish
            </Button>
            <Button
              onClick={() => setActiveTab("tank")}
              variant="outline"
              className="w-full py-2"
            >
              🐠 View My Fish Tank
            </Button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              Connect wallet above to begin
            </p>
            <Button
              variant="ghost"
              className="text-blue-500"
              onClick={() => setActiveTab("learn")}
            >
              📚 Learn About Filipino Fish
            </Button>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-bold text-sm text-blue-800 mb-2">🇵🇭 Did You Know?</h3>
        <p className="text-xs text-blue-700">
          The Philippines has over <strong>18+ fish species</strong> featured in Dagat na, 
          from the national Bangus (Milkfish) to the colorful Lapu-lapu (Grouper)!
        </p>
      </div>

      {/* Fish Species Preview */}
      <div className="space-y-2">
        <h3 className="font-bold text-sm text-center">🐟 Featured Fish Species</h3>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <FishPreview name="Bangus" emoji="🐟" rarity="National" />
          <FishPreview name="Tilapia" emoji="🐠" rarity="Common" />
          <FishPreview name="Lapu-lapu" emoji="🟡" rarity="Rare" />
          <FishPreview name="Maya-maya" emoji="🔴" rarity="Popular" />
          <FishPreview name="Tambakol" emoji="🐋" rarity="Ocean" />
          <FishPreview name="Dilis" emoji="🦈" rarity="Tiny" />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ emoji, title, description }: {
  emoji: string
  title: string  
  description: string
}) {
  return (
    <div className="bg-white border rounded-lg p-3 shadow-sm">
      <div className="flex items-start space-x-3">
        <div className="text-lg">{emoji}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm">{title}</h3>
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </div>
  )
}

function FishPreview({ name, emoji, rarity }: {
  name: string
  emoji: string
  rarity: string
}) {
  return (
    <div className="bg-white border rounded p-2 text-center">
      <div className="text-lg mb-1">{emoji}</div>
      <div className="font-medium text-xs">{name}</div>
      <div className="text-xs text-gray-500">{rarity}</div>
    </div>
  )
}
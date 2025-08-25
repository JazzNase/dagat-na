"use client";

import { useState, useEffect } from "react";
import { Button } from "../../Main/DemoComponents";
import { FISH_SPECIES, RARITIES, CONFIG, type GeneratedFish } from "./AdoptFishConfig";
import { FishDisplayCard } from "./FishDisplayCard";

const COOLDOWN_SECONDS = 180; // 3 minutes
const LOCALSTORAGE_KEY = "dagatna_last_cast_time";

interface FishGeneratorProps {
  onFishGenerated?: (fish: GeneratedFish) => void;
}

export function FishGenerator({ onFishGenerated }: FishGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastCastTime, setLastCastTime] = useState<number | null>(null);
  const [cooldownLeft, setCooldownLeft] = useState<number>(0);
  const [generatedFish, setGeneratedFish] = useState<GeneratedFish | null>(null);

  // Load lastCastTime from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCALSTORAGE_KEY);
    if (stored) {
      setLastCastTime(Number(stored));
    }
  }, []);

  // Update cooldown every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastCastTime) {
        const elapsed = Math.floor((Date.now() - lastCastTime) / 1000);
        const left = Math.max(0, COOLDOWN_SECONDS - elapsed);
        setCooldownLeft(left);
      } else {
        setCooldownLeft(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastCastTime]);

  const generateRandomFish = () => {
    if (cooldownLeft > 0) return;

    setIsGenerating(true);

    setTimeout(() => {
      const species = FISH_SPECIES[Math.floor(Math.random() * FISH_SPECIES.length)];
      const rarity = RARITIES[Math.floor(Math.random() * RARITIES.length)];

      const fish: GeneratedFish = {
        species: species.name,
        filipinoName: species.filipino,
        rarity,
      };

      setGeneratedFish(fish);
      setIsGenerating(false);
      const now = Date.now();
      setLastCastTime(now);
      localStorage.setItem(LOCALSTORAGE_KEY, String(now)); // Save to localStorage
      if (onFishGenerated) onFishGenerated(fish);
    }, CONFIG.ui.generateDelay);
  };

  const handleGenerateAnother = () => {
    if (cooldownLeft > 0) return;
    setGeneratedFish(null);
    generateRandomFish();
  };

  return (
    <div className="text-center space-y-4">
      <div className="bg-[var(--app-card-bg)] rounded-xl p-8 border border-[var(--app-card-border)]">
        <div className="text-6xl mb-4">🌊</div>
        {!generatedFish ? (
          <>
            <Button
              onClick={generateRandomFish}
              disabled={isGenerating || cooldownLeft > 0}
              variant="primary"
              size="lg"
            >
              {isGenerating
                ? "🔄 Casting Net..."
                : cooldownLeft > 0
                  ? `⏳ Wait ${cooldownLeft}s to cast again`
                  : "🎲 Cast Your Net"}
            </Button>
            {isGenerating && (
              <div className="mt-4 text-sm text-[var(--app-foreground-muted)]">
                Searching the waters around the Philippines...
              </div>
            )}
            {cooldownLeft > 0 && (
              <div className="mt-2 text-xs text-red-500">
                You must wait {cooldownLeft} seconds before casting your net again.
              </div>
            )}
          </>
        ) : (
          <FishDisplayCard
            fish={generatedFish}
            onAdopt={() => {}}
            onGenerateAnother={handleGenerateAnother}
            hasEnoughBalance={true}
            isAdopting={false}
            isConfirming={false}
            cooldownLeft={cooldownLeft}
          />
        )}
      </div>
    </div>
  );
}
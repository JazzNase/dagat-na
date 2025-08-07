"use client";

import { useState } from "react";
import { Button } from "../../Main/DemoComponents";
import { FISH_SPECIES, RARITIES, CONFIG, type GeneratedFish } from "./AdoptFishConfig";

interface FishGeneratorProps {
  onFishGenerated: (fish: GeneratedFish) => void;
}

export function FishGenerator({ onFishGenerated }: FishGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRandomFish = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const species = FISH_SPECIES[Math.floor(Math.random() * FISH_SPECIES.length)];
      const rarity = RARITIES[Math.floor(Math.random() * RARITIES.length)];

      const fish: GeneratedFish = {
        species: species.name,
        filipinoName: species.filipino,
        rarity,
      };

      onFishGenerated(fish);
      setIsGenerating(false);
    }, CONFIG.ui.generateDelay);
  };

  return (
    <div className="text-center space-y-4">
      <div className="bg-[var(--app-card-bg)] rounded-xl p-8 border border-[var(--app-card-border)]">
        <div className="text-6xl mb-4">🌊</div>
        <Button
          onClick={generateRandomFish}
          disabled={isGenerating}
          variant="primary"
          size="lg"
        >
          {isGenerating ? "🔄 Casting Net..." : "🎲 Cast Your Net"}
        </Button>
        {isGenerating && (
          <div className="mt-4 text-sm text-[var(--app-foreground-muted)]">
            Searching the waters around the Philippines...
          </div>
        )}
      </div>
    </div>
  );
}
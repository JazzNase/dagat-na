export const FISH_SPECIES = [
  { name: "Tilapia", filipino: "Tilapya" },
  { name: "Bangus", filipino: "Milkfish" },
  { name: "Lapu-lapu", filipino: "Grouper" },
  { name: "Maya-maya", filipino: "Snapper" },
  { name: "Tambakol", filipino: "Yellowfin Tuna" },
  { name: "Dilis", filipino: "Anchovy" },
];

export const RARITIES = ["Bronze", "Silver", "Gold", "Diamond"];

export const ADOPTION_FEES = {
  Bronze: "0.00001",
  Silver: "0.00002", 
  Gold: "0.00005",
  Diamond: "0.0001"
} as const;

export const CONFIG = {
  network: {
    name: "Base Sepolia",
    chainId: 84532,
    explorerUrl: "https://sepolia.basescan.org"
  },
  ui: {
    generateDelay: 2000,
  }
} as const;

export type GeneratedFish = {
  species: string;
  filipinoName: string;
  rarity: string;
};
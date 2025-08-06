export const DAGAT_NA_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "species",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "filipinoName", 
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "rarity",
        "type": "string"
      }
    ],
    "name": "adoptFish",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;

// For now, use a placeholder - you'll replace this after deploying
export const CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890" as const;
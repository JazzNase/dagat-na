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
  },
  // Try different function names that might exist in your contract
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "getFishByOwner",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "fishId",
        "type": "uint256"
      }
    ],
    "name": "getFish",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
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
          },
          {
            "internalType": "uint256",
            "name": "level",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "experience",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "lastFed",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isAlive",
            "type": "bool"
          }
        ],
        "internalType": "struct DagatNa.Fish",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "fishId",
        "type": "uint256"
      }
    ],
    "name": "feedFish",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Alternative function names - try these instead
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fishCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export const CONTRACT_ADDRESS = "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8" as const;
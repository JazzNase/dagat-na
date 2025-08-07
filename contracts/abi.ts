export const DAGAT_NA_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "fishId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "species",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "rarity",
        "type": "string"
      }
    ],
    "name": "FishAdopted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "fishId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newExperience",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newLevel",
        "type": "uint256"
      }
    ],
    "name": "FishFed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "FishFoodEarned",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "FishFoodUsed",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "adoptionFee",
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
    "inputs": [
      {
        "internalType": "string",
        "name": "_species",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_filipinoName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_rarity",
        "type": "string"
      }
    ],
    "name": "adoptFish",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "claimMiniGameReward",
    "outputs": [],
    "stateMutability": "nonpayable",
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
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "fishId",
        "type": "uint256"
      }
    ],
    "name": "feedFishWithFishFood",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "fishFoodBalance",
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
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "fishToOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "fishes",
    "outputs": [
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
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "getFishByOwner",
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
        "internalType": "struct DagatNa.Fish[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      }
    ],
    "name": "getFishFoodBalance",
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
    "name": "getTotalFishCount",
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
    "name": "nextFishId",
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
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "ownerToFishes",
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
  },
  {
    "inputs": [],
    "name": "getTotalParticipants",
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
    "name": "getGlobalStats",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "totalParticipants",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalFish",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "averageFishPerParticipant",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "participant",
        "type": "address"
      }
    ],
    "name": "getParticipantFishCount",
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
    "name": "getSpeciesStats",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "speciesNames",
        "type": "string[]"
      },
      {
        "internalType": "uint256[]",
        "name": "counts",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// 🎯 UPDATE THIS WITH YOUR NEW CONTRACT ADDRESS
export const CONTRACT_ADDRESS = "0x1e3a6360fed8fb5b53ef127bd56bfb47cfac267f" as const;
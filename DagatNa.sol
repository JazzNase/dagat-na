// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DagatNa {
    struct Fish {
        uint256 id;
        string species;
        string filipinoName;
        string rarity;
        uint256 level;
        uint256 experience;
        uint256 lastFed;
        bool isAlive;
    }

    uint256 public nextFishId;
    mapping(uint256 => Fish) public fishes;
    mapping(address => uint256[]) public ownerToFishes;
    mapping(uint256 => address) public fishToOwner;
    
    // NEW: Fish Food System for Mini-Game Rewards
    mapping(address => uint256) public fishFoodBalance;
    
    uint256 public adoptionFee = 0.00001 ether; // Very small fee for Base Sepolia
    
    string[] public species = ["Bangus", "Tilapia", "Lapu-lapu", "Maya-maya", "Dilis", "Tambakol"];
    string[] public filipinoNames = ["Milkfish", "Tilapya", "Grouper", "Snapper", "Anchovy", "Yellowfin Tuna"];
    string[] public rarities = ["Bronze", "Silver", "Gold", "Diamond"];
    
    event FishAdopted(address indexed owner, uint256 indexed fishId, string species, string rarity);
    event FishFed(uint256 indexed fishId, uint256 newExperience, uint256 newLevel);
    // NEW: Mini-game events
    event FishFoodEarned(address indexed player, uint256 amount);
    event FishFoodUsed(address indexed player, uint256 amount);
    
    constructor() {
        nextFishId = 1;
    }
    
    function adoptFish(string memory _species, string memory _filipinoName, string memory _rarity) 
        external 
        payable 
    {
        require(msg.value >= adoptionFee, "Insufficient adoption fee");
        
        uint256 fishId = nextFishId++;
        
        Fish memory newFish = Fish({
            id: fishId,
            species: _species,
            filipinoName: _filipinoName,
            rarity: _rarity,
            level: 1,
            experience: 0,
            lastFed: block.timestamp,
            isAlive: true
        });
        
        fishes[fishId] = newFish;
        ownerToFishes[msg.sender].push(fishId);
        fishToOwner[fishId] = msg.sender;
        
        emit FishAdopted(msg.sender, fishId, _species, _rarity);
    }
    
    function feedFish(uint256 fishId) external {
        require(fishToOwner[fishId] == msg.sender, "Not your fish");
        require(fishes[fishId].isAlive, "Fish is dead");
        
        Fish storage fish = fishes[fishId];
        fish.lastFed = block.timestamp;
        fish.experience += 10;
        
        // Level up every 100 XP
        uint256 newLevel = (fish.experience / 100) + 1;
        if (newLevel > fish.level) {
            fish.level = newLevel;
        }
        
        emit FishFed(fishId, fish.experience, fish.level);
    }
    
    // NEW: Mini-Game Reward System
    function claimMiniGameReward(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= 10, "Maximum 10 fish food per game"); // Anti-cheat protection
        
        fishFoodBalance[msg.sender] += amount;
        
        emit FishFoodEarned(msg.sender, amount);
    }
    
    // NEW: Get fish food balance
    function getFishFoodBalance(address player) external view returns (uint256) {
        return fishFoodBalance[player];
    }
    
    // NEW: Use fish food when feeding (optional enhancement)
    function feedFishWithFishFood(uint256 fishId) external {
        require(fishToOwner[fishId] == msg.sender, "Not your fish");
        require(fishes[fishId].isAlive, "Fish is dead");
        require(fishFoodBalance[msg.sender] >= 1, "Not enough fish food");
        
        // Use 1 fish food
        fishFoodBalance[msg.sender] -= 1;
        emit FishFoodUsed(msg.sender, 1);
        
        Fish storage fish = fishes[fishId];
        fish.lastFed = block.timestamp;
        fish.experience += 20; // Double XP with fish food!
        
        // Level up every 100 XP
        uint256 newLevel = (fish.experience / 100) + 1;
        if (newLevel > fish.level) {
            fish.level = newLevel;
        }
        
        emit FishFed(fishId, fish.experience, fish.level);
    }
    
    function getFishByOwner(address owner) external view returns (Fish[] memory) {
        uint256[] memory fishIds = ownerToFishes[owner];
        Fish[] memory result = new Fish[](fishIds.length);
        
        for (uint256 i = 0; i < fishIds.length; i++) {
            result[i] = fishes[fishIds[i]];
        }
        
        return result;
    }
    
    function getFish(uint256 fishId) external view returns (Fish memory) {
        return fishes[fishId];
    }
    
    function getTotalFishCount() external view returns (uint256) {
        return nextFishId - 1;
    }

    // 📊 NEW ANALYTICS FUNCTIONS
    
    // Get total unique participants/players
    function getTotalParticipants() external view returns (uint256) {
        uint256 participantCount = 0;
        
        for (uint256 i = 1; i < nextFishId; i++) {
            address owner = fishToOwner[i];
            if (owner != address(0)) {
                // Check if this is the first fish we've seen from this owner
                bool isFirstFish = true;
                for (uint256 j = 1; j < i; j++) {
                    if (fishToOwner[j] == owner) {
                        isFirstFish = false;
                        break;
                    }
                }
                if (isFirstFish) {
                    participantCount++;
                }
            }
        }
        
        return participantCount;
    }

    // Get comprehensive stats in one call
    function getGlobalStats() external view returns (
        uint256 totalParticipants,
        uint256 totalFish,
        uint256 averageFishPerParticipant
    ) {
        totalParticipants = this.getTotalParticipants();
        totalFish = nextFishId - 1;
        
        if (totalParticipants > 0) {
            averageFishPerParticipant = totalFish / totalParticipants;
        } else {
            averageFishPerParticipant = 0;
        }
        
        return (totalParticipants, totalFish, averageFishPerParticipant);
    }

    // Get fish count for specific participant
    function getParticipantFishCount(address participant) external view returns (uint256) {
        return ownerToFishes[participant].length;
    }

    // Get species distribution stats
    function getSpeciesStats() external view returns (
        string[] memory speciesNames,
        uint256[] memory counts
    ) {
        speciesNames = new string[](species.length);
        counts = new uint256[](species.length);
        
        // Initialize arrays
        for (uint256 i = 0; i < species.length; i++) {
            speciesNames[i] = species[i];
            counts[i] = 0;
        }
        
        // Count each species
        for (uint256 fishId = 1; fishId < nextFishId; fishId++) {
            if (fishToOwner[fishId] != address(0)) {
                string memory fishSpecies = fishes[fishId].species;
                
                // Find matching species and increment count
                for (uint256 j = 0; j < species.length; j++) {
                    if (keccak256(bytes(fishSpecies)) == keccak256(bytes(species[j]))) {
                        counts[j]++;
                        break;
                    }
                }
            }
        }
        
        return (speciesNames, counts);
    }
    
    function withdraw() external {
        require(msg.sender == 0x6DEB9d6341cA1421a9d254A4F3A1883Ea3B8CCBe, "Only owner");
        payable(msg.sender).transfer(address(this).balance);
    }
}
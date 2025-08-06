# 🐟 Dagat na — A Mini App for Adopting and Caring for Filipino Fish

**Dagat na** is a cute, collectible mini app where users mint, collect, and care for **fish species found in the Philippines** — each with **random traits**, **rarity ranks**, and **onchain uniqueness**. Built for the **Base Campus Mini App Challenge 2025**, Dagat na combines Web3 technology, cultural learning, and adorable sea life vibes into one accessible experience.

---

## 🌏 About the Project

The Philippines is one of the world’s top marine biodiversity hotspots. **Dagat na** puts this ecosystem front and center by letting users:
- Adopt digital fish collectibles
- Learn about Filipino fish species
- Experience simple blockchain minting via Base
- Enjoy “Grow-a-Garden” gameplay — but with 🐠

---

## 🧠 Gameplay Summary

> Users mint fish NFTs with **random ranks**, **personality traits**, and **unique species** — all inspired by real Philippine marine life.

Each fish is:
- A known **Philippine species**
- Assigned a **rarity**: Bronze → Diamond
- Given a set of **random traits**
- Uniquely numbered (e.g. “Bangus – Diamond #1”)

---

## 🐟 Fish Species Featured

| Fish Species               | Filipino Name (If Any)  | Description                          |
|---------------------------|--------------------------|--------------------------------------|
| Tilapia                   | Tilapya                  | Popular freshwater food fish         |
| Starry Triggerfish        | —                        | Bright reef fish with sharp fins     |
| Bangus                    | Milkfish                 | National fish of the Philippines     |
| Snappers                  | Maya-maya                | Common in coastal fishing            |
| Ablennes hians            | Flat needlefish          | Long-bodied and fast                 |
| Abudefduf bengalensis     | —                        | Colorful damselfish                  |
| Abudefduf septemfasciatus | —                        | Banded reef fish                     |
| Acanthurus auranticavus   | —                        | Orange-lined surgeonfish             |
| Acanthurus bariene        | —                        | Large tang with sharp tail spine     |
| Dilis                     | Anchovy                  | Tiny schooling fish                  |
| Eel                       | Igat                     | Slippery and snake-like              |
| Mackerel scad             | Alumahan                 | Found in open sea                    |
| Grouper                   | Lapu-lapu                | Spotted reef predator                |
| Mene maculata             | Moonfish / Bilong-bilong | Flat, round silver fish              |
| Milkfish                  | Bangus                   | Repeated for importance              |
| Sardine                   | Sardinas                 | Common in cans and fisheries         |
| Yellowfin Tuna            | Tambakol                 | Fast and valuable ocean fish         |
| Sardinella lemuru         | Tamban                   | Major fish for sardine industry      |

---

## 🏆 Rarity System

Fish are minted with a rarity rank:

| Rarity      | Chance | Visual Style               |
|-------------|--------|----------------------------|
| 🥉 Bronze   | 84%    | Standard border             |
| 🥈 Silver   | 10%    | Subtle shimmer              |
| 🥇 Gold     | 5%     | Glow outline                |
| 💎 Diamond  | 1%     | Animated sparkle effect     |

This makes **Diamond Sardine** rarer than even **Bronze Tuna** — it’s all about the luck!

---

## 🧬 Trait System

Each minted fish has randomized **traits**, making every collectible unique:

| Trait Category | Possible Values                          |
|----------------|------------------------------------------|
| 🎨 Color       | Pink, Blue, Golden, Silver, Green         |
| 😄 Personality | Shy, Brave, Curious, Grumpy, Energetic    |
| 🧼 Pattern     | Striped, Spotted, Solid, Glittery         |
| 📏 Size        | Tiny, Small, Medium, Large                |

---

## 🎮 Core Features

| Feature              | Description                                                             |
|----------------------|-------------------------------------------------------------------------|
| 🐠 Mint a Fish        | Users click to mint a randomized fish NFT with traits + rarity         |
| 🎁 Trait Generator    | Random trait values generated per mint                                 |
| 🏅 Rarity Assignment  | Rarity is rolled during mint (Bronze to Diamond)                       |
| 📦 Unique IDs         | Fish are globally numbered + ranked numbered (e.g. “Tilapia #011”)    |
| 🧸 Fish Tank View      | View your fish collection in a simple UI                               |

---

## 🧰 Tech Stack

| Tech                | Use Case                          |
|---------------------|-----------------------------------|
| **Next.js**         | Web app framework                 |
| **MiniKit**         | Base + Farcaster Mini App builder |
| **Base Sepolia**    | L2 blockchain testnet             |
| **WAGMI + viem**    | Wallet + contract handling        |
| **Tailwind CSS**    | UI styling                        |

---

## 🚀 Quick Setup

```bash
npx create-onchain --mini Dagat na
cd Dagat na
npm install
npm run dev

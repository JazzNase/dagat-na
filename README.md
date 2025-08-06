# 🐟 Dagat na — A Mini App for Adopting and Caring for Filipino Fish

**Dagat na** is a cute, collectible mini app where users adopt, raise, and care for **fish species found in the Philippines** — each with **random traits**, **rarity ranks**, and **Tamagotchi-style gameplay**. Built for the **Base Campus Mini App Challenge 2025**, Dagat na combines Web3 technology, cultural learning, and adorable fish care into one accessible experience.

---

## 🌏 About the Project

The Philippines is one of the world's top marine biodiversity hotspots. **Dagat na** puts this ecosystem front and center by letting users:
- Adopt digital fish collectibles
- Raise fish from baby to adult (100 levels)
- Care for fish through feeding, playing, and cleaning
- Learn about Filipino fish species
- Experience simple blockchain integration via Base

---

## 🧠 Gameplay Summary

> Users adopt fish NFTs and raise them through **100 levels** with **Tamagotchi-style care mechanics** — all inspired by real Philippine marine life.

Each fish is:
- A known **Philippine species**
- Assigned a **rarity**: Bronze → Diamond
- Given **random traits** (color, personality, pattern, size)
- **Grows through life stages** based on care
- Uniquely numbered (e.g. "Adult Bangus – Diamond #1")

---

## 🐠 Fish Life Stages & Levels

| Life Stage    | Level Range | Description                    | Care Requirements    |
|---------------|-------------|--------------------------------|---------------------|
| 👶 Baby Fish  | 0-10        | Just hatched, needs constant care | Feed every 2 hours  |
| 🧒 Kid Fish   | 11-30       | Playful and curious            | Play mini-games     |
| 👦 Teen Fish  | 31-50       | Growing fast, eats a lot       | Regular feeding     |
| 👨 Young Adult| 51-70       | Independent but social         | Balanced care       |
| 👩 Adult Fish | 71-90       | Mature and wise                | Weekly maintenance  |
| 👴 Elder Fish | 91-100      | Maximum level, legendary status| Minimal care needed |

---

## 🎮 Care Mechanics (Like Pou/Tamagotchi)

| Care Action   | Effect                          | Frequency Needed    |
|---------------|---------------------------------|---------------------|
| 🍽️ Feed       | Increases hunger meter (0-100)  | Every few hours     |
| 🎲 Play       | Increases happiness (0-100)     | Daily mini-games    |
| 🧽 Clean Tank | Increases cleanliness (0-100)   | Every 2-3 days     |
| 💕 Pet        | Boosts all stats slightly       | Anytime            |

**Neglect your fish** and they:
- Stop growing (no XP gain)
- Become sad and dirty
- Require extra care to recover

**Good care results in:**
- Faster leveling and growth
- Happier fish with better traits
- Unlocked cosmetic features

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

Fish are adopted with a rarity rank that affects growth speed and visual effects:

| Rarity      | Chance | Growth Speed | Visual Style               |
|-------------|--------|--------------|----------------------------|
| 🥉 Bronze   | 84%    | Normal       | Standard border             |
| 🥈 Silver   | 10%    | +10% XP      | Subtle shimmer              |
| 🥇 Gold     | 5%     | +25% XP      | Glow outline                |
| 💎 Diamond  | 1%     | +50% XP      | Animated sparkle effect     |

This makes **Diamond Sardine** grow faster than even **Bronze Tuna** — rarity matters!

---

## 🧬 Trait System

Each adopted fish has randomized **traits**, making every collectible unique:

| Trait Category | Possible Values                          | Effect on Gameplay         |
|----------------|------------------------------------------|----------------------------|
| 🎨 Color       | Pink, Blue, Golden, Silver, Green         | Visual appearance only     |
| 😄 Personality | Shy, Brave, Curious, Grumpy, Energetic    | Affects care preferences   |
| 🧼 Pattern     | Striped, Spotted, Solid, Glittery         | Visual appearance only     |
| 📏 Size        | Tiny, Small, Medium, Large                | Affects food consumption   |

---

## 🎮 Core Features

| Feature              | Description                                                             |
|----------------------|-------------------------------------------------------------------------|
| 🐠 Adopt a Fish       | Users adopt a randomized fish with traits + rarity                     |
| �️ Feeding System     | Feed your fish to maintain hunger levels                               |
| � Mini-Games         | Play simple games to increase fish happiness                           |
| 🧽 Tank Cleaning      | Keep your fish's environment clean                                     |
| 📈 Level Progression  | Fish grow from baby (0) to elder (100) based on care                  |
| 🏅 Rarity Bonuses     | Higher rarity fish grow faster and have special effects               |
| 🧸 Fish Tank View     | View your fish collection with real-time care stats                   |
| 📊 Care Dashboard     | Monitor hunger, happiness, and cleanliness meters                     |

---

## 🗄️ Database Structure (Supabase)

```sql
-- Main fish table
fish (
  id, user_address, species, filipino_name, 
  rarity, color, personality, pattern, size,
  level (0-100), experience_points,
  hunger (0-100), happiness (0-100), cleanliness (0-100),
  last_fed, last_played, last_cleaned,
  created_at, updated_at
)

-- Care activity logs
fish_activities (
  id, fish_id, activity_type, timestamp, points_gained
)
```

---

## 🧰 Tech Stack

| Tech                | Use Case                          |
|---------------------|-----------------------------------|
| **Next.js**         | Web app framework                 |
| **MiniKit**         | Base + Farcaster Mini App builder |
| **Supabase**        | Database for fish care data       |
| **Base Sepolia**    | L2 blockchain (future NFT minting)|
| **WAGMI + viem**    | Wallet + contract handling        |
| **Tailwind CSS**    | UI styling                        |

---

## 🚀 Quick Setup

```bash
npx create-onchain --mini Dagat na
cd Dagat na
npm install
npm run dev
```

## 🎯 Game Loop

1. **Adopt** your first Filipino fish (random species + traits)
2. **Care** for your fish daily (feed, play, clean)
3. **Watch** your fish grow through life stages (baby → elder)
4. **Collect** multiple fish species with different rarities
5. **Maintain** your fish tank ecosystem
6. **Unlock** new features as fish reach higher levels

**Dagat na** teaches players about Philippine marine biodiversity while providing engaging Tamagotchi-style gameplay! 🐟✨
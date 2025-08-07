"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const FISH_SPECIES = [
  {
    species: 'Bangus',
    filipino: 'Milkfish',
    emoji: '🐟',
    habitat: 'Coastal waters',
    description: 'National fish of the Philippines, silver-bodied with a forked tail',
    rarity: 'Common',
    size: 'Medium to Large',
    facts: 'Most important commercial fish in the Philippines'
  },
  {
    species: 'Tilapia',
    filipino: 'Tilapya',
    emoji: '🐠',
    habitat: 'Freshwater lakes',
    description: 'Popular food fish with mild flavor, adaptable to various environments',
    rarity: 'Very Common',
    size: 'Medium',
    facts: 'Originally from Africa but now widely farmed in the Philippines'
  },
  {
    species: 'Grouper',
    filipino: 'Lapu-lapu',
    emoji: '🐡',
    habitat: 'Coral reefs',
    description: 'Large predatory fish with spotted patterns, highly prized',
    rarity: 'Uncommon',
    size: 'Large',
    facts: 'Named after the famous Filipino chief who defeated Magellan'
  },
  {
    species: 'Snappers',
    filipino: 'Maya-maya',
    emoji: '🐟',
    habitat: 'Rocky reefs',
    description: 'Red-colored fish common in Filipino markets and cuisine',
    rarity: 'Common',
    size: 'Medium',
    facts: 'One of the most popular fish in Filipino cooking'
  },
  {
    species: 'Yellowfin Tuna',
    filipino: 'Tambakol',
    emoji: '🐋',
    habitat: 'Open ocean',
    description: 'Fast-swimming pelagic fish, important for commercial fishing',
    rarity: 'Rare',
    size: 'Very Large',
    facts: 'Can swim up to 75 km/h and weigh over 180 kg'
  },
  {
    species: 'Dilis',
    filipino: 'Anchovy',
    emoji: '🦈',
    habitat: 'Coastal waters',
    description: 'Small schooling fish, often dried and used as flavoring',
    rarity: 'Very Common',
    size: 'Tiny',
    facts: 'Essential ingredient in Filipino cooking and bagoong'
  }
]

const CARE_GUIDE = [
  {
    action: 'Feeding',
    emoji: '🍽️',
    frequency: 'Every 4-6 hours',
    effect: 'Increases hunger meter',
    tips: 'Different fish species have different appetites. Larger fish need more food!'
  },
  {
    action: 'Playing',
    emoji: '🎲',
    frequency: 'Daily',
    effect: 'Increases happiness',
    tips: 'Mini-games unlock based on fish personality. Energetic fish love more active games!'
  },
  {
    action: 'Cleaning',
    emoji: '🧽',
    frequency: 'Every 2-3 days',
    effect: 'Increases cleanliness',
    tips: 'Clean tank = healthy fish. Neglected fish grow slower and become sad.'
  },
  {
    action: 'Petting',
    emoji: '💕',
    frequency: 'Anytime',
    effect: 'Boosts all stats',
    tips: 'Free love! Pet your fish anytime for small stat boosts.'
  }
]

const RARITY_INFO = [
  {
    rarity: 'Bronze',
    emoji: '🥉',
    chance: '84%',
    bonus: 'Normal growth',
    description: 'Most common fish, still adorable and fun to raise!'
  },
  {
    rarity: 'Silver',
    emoji: '🥈',
    chance: '10%',
    bonus: '+10% XP',
    description: 'Shimmery fish that grow slightly faster'
  },
  {
    rarity: 'Gold',
    emoji: '🥇',
    chance: '5%',
    bonus: '+25% XP',
    description: 'Golden fish with glowing outlines'
  },
  {
    rarity: 'Diamond',
    emoji: '💎',
    chance: '1%',
    bonus: '+50% XP',
    description: 'Ultra-rare sparkling fish that grow super fast!'
  }
]

export function FishGuide() {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-blue-600">📚 Filipino Fish Guide</h1>
        <p className="text-sm text-gray-600">
          Learn about Philippine marine biodiversity and fish care
        </p>
      </div>

      <Tabs defaultValue="species" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="species">🐟 Species</TabsTrigger>
          <TabsTrigger value="care">🎮 Care</TabsTrigger>
          <TabsTrigger value="rarity">🏆 Rarity</TabsTrigger>
        </TabsList>

        <TabsContent value="species" className="space-y-4">
          <ScrollArea className="h-[400px] w-full">
            <div className="space-y-3">
              {FISH_SPECIES.map((fish, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{fish.emoji}</span>
                        <div>
                          <CardTitle className="text-lg">{fish.species}</CardTitle>
                          <CardDescription>{fish.filipino}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline">{fish.rarity}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-gray-700">{fish.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><strong>Habitat:</strong> {fish.habitat}</div>
                      <div><strong>Size:</strong> {fish.size}</div>
                    </div>
                    <div className="bg-blue-50 p-2 rounded text-xs">
                      <strong>Fun Fact:</strong> {fish.facts}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="care" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🎮 How to Care for Your Fish</CardTitle>
              <CardDescription>
                Like Tamagotchi pets, your fish need regular care to grow and stay happy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {CARE_GUIDE.map((care, index) => (
                <div key={index}>
                  <div className="flex items-start space-x-3">
                    <span className="text-xl">{care.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{care.action}</h3>
                        <Badge variant="secondary">{care.frequency}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{care.effect}</p>
                      <div className="bg-yellow-50 p-2 rounded text-xs">
                        💡 <strong>Tip:</strong> {care.tips}
                      </div>
                    </div>
                  </div>
                  {index < CARE_GUIDE.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Life Stages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📈 Fish Life Stages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <div className="font-medium">👶 Baby (0-10)</div>
                  <div className="text-xs text-gray-600">Needs constant care</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium">🧒 Kid (11-30)</div>
                  <div className="text-xs text-gray-600">Playful and curious</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium">👦 Teen (31-50)</div>
                  <div className="text-xs text-gray-600">Eats a lot, grows fast</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium">👨 Young Adult (51-70)</div>
                  <div className="text-xs text-gray-600">Independent but social</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium">👩 Adult (71-90)</div>
                  <div className="text-xs text-gray-600">Mature and wise</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium">👴 Elder (91-100)</div>
                  <div className="text-xs text-gray-600">Legendary status!</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rarity" className="space-y-4">
          <div className="space-y-3">
            {RARITY_INFO.map((rarity, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{rarity.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold">{rarity.rarity} Fish</h3>
                        <Badge>{rarity.chance}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rarity.description}</p>
                      <div className="bg-green-50 px-2 py-1 rounded text-xs">
                        <strong>Bonus:</strong> {rarity.bonus}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="text-center space-y-2">
                <div className="text-2xl">🎲</div>
                <h3 className="font-bold">Random Adoption</h3>
                <p className="text-sm text-gray-600">
                  Every fish adoption is completely random! You might get a common Bronze Tilapia 
                  or a super rare Diamond Bangus - it&apos;s all about luck! 🍀
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
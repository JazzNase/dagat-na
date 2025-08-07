export class FishRarityUtils {
  static getRarityColor(rarity: string): string {
    const colors = {
      Bronze: "border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100",
      Silver: "border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100",
      Gold: "border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100",
      Diamond: "border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100"
    };
    return colors[rarity as keyof typeof colors] || "border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100";
  }

  static getRarityEmoji(rarity: string): string {
    const emojis = {
      Bronze: "🥉",
      Silver: "🥈", 
      Gold: "🥇",
      Diamond: "💎"
    };
    return emojis[rarity as keyof typeof emojis] || "🐟";
  }
}
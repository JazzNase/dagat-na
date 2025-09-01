import { Button } from "../../Main/DemoComponents";

export function GameRulesModal({
  onStart,
  onClose,
  gameCooldownLeft = 0,
  onShowLeaderboard, // <-- Add this prop
}: {
  onStart: () => void;
  onClose: () => void;
  gameCooldownLeft?: number;
  onShowLeaderboard?: () => void; // <-- Add this prop type
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm mx-4">
        <div className="text-center">
          <div className="text-4xl mb-4">🌊</div>
          <h2 className="text-xl font-bold mb-2">Ocean Cleanup Challenge</h2>
          <p className="text-gray-600 mb-4">
            Help clean the Philippine waters! Remove trash to earn fish food for your tank.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <h3 className="font-medium text-blue-800 mb-2">🏆 Game Rules:</h3>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
              <li>• Clean 10 trash = 1 fish food 🍤</li>
              <li>• Clean 20 trash = 2 fish food 🍤🍤</li>
              <li>• Clean 40 trash = 3 fish food 🍤🍤🍤</li>
              <li>• ⏰ Exactly 60 seconds (no pausing!)</li>
              <li>• 🗑️ Trash auto-disappears after time</li>
              <li>• 🔄 New trash spawns continuously</li>
            </ul>
          </div>
          <div className="space-y-2">
            <Button
              onClick={onStart}
              variant="primary"
              size="md"
              className="w-full"
              disabled={gameCooldownLeft > 0}
            >
              {gameCooldownLeft > 0
                ? `⏳ Wait ${gameCooldownLeft}s to play again`
                : "🎮 Start Cleanup!"}
            </Button>
            {gameCooldownLeft > 0 && (
              <div className="text-xs text-red-500 mt-2">
                You must wait {gameCooldownLeft} seconds before playing again.
              </div>
            )}
            <Button onClick={onClose} variant="outline" size="sm" className="w-full">
              Cancel
            </Button>
            {onShowLeaderboard && (
              <Button
                onClick={onShowLeaderboard}
                variant="secondary"
                size="sm"
                className="w-full"
              >
                🏆 Leaderboard
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
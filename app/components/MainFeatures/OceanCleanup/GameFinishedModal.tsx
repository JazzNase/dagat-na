import { Button } from "../../Main/DemoComponents";

type Props = {
  trashCleaned: number;
  fishFoodEarned: number;
  isConnected: boolean;
  isClaimConfirmed: boolean;
  isClaimingPending: boolean;
  onClaim: () => void;
  onPlayAgain: () => void;
  onClose: () => void;
};

export function GameFinishedModal({
  trashCleaned,
  fishFoodEarned,
  isConnected,
  isClaimConfirmed,
  isClaimingPending,
  onClaim,
  onPlayAgain,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm mx-4">
        <div className="text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-xl font-bold mb-2">Ocean Cleanup Complete!</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="text-lg font-bold text-green-800 mb-2">
              Trash Cleaned: {trashCleaned} pieces
            </div>
            <div className="text-sm text-green-700">
              Fish Food Earned: {fishFoodEarned} 🍤
            </div>
            {fishFoodEarned > 0 && (
              <div className="text-xs text-green-600 mt-2">
                Claim your rewards on the blockchain!
              </div>
            )}
          </div>
          <div className="space-y-2">
            {fishFoodEarned > 0 && isConnected && !isClaimConfirmed ? (
              <Button
                onClick={onClaim}
                disabled={isClaimingPending}
                variant="primary"
                size="md"
                className="w-full"
              >
                {isClaimingPending ? "🔄 Claiming..." : `🎁 Claim ${fishFoodEarned} Fish Food`}
              </Button>
            ) : null}
            {isClaimConfirmed && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                <div className="text-sm text-blue-700">
                  ✅ Reward claimed successfully!
                </div>
              </div>
            )}
            <Button
              onClick={onPlayAgain}
              variant="primary"
              size="md"
              className="w-full"
            >
              🔄 Play Again
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
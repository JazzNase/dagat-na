import { TrashItem } from "./types";

type Props = {
  trash: TrashItem[];
  trashCleaned: number;
  timeLeft: number;
  removeTrash: (id: number) => void;
  calculateFishFood: (count: number) => number;
};

export function OceanGameArea({
  trash,
  trashCleaned,
  timeLeft,
  removeTrash,
  calculateFishFood,
}: Props) {
  const currentFishFood = calculateFishFood(trashCleaned);
  const nextTarget = trashCleaned < 10 ? 10 : trashCleaned < 20 ? 20 : 40;
  const progress = trashCleaned < 10 ? (trashCleaned / 10) * 100 : 
                  trashCleaned < 20 ? ((trashCleaned - 10) / 10) * 100 :
                  trashCleaned < 40 ? ((trashCleaned - 20) / 20) * 100 : 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-4 max-w-sm mx-4 w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-medium">Trash: {trashCleaned}</div>
          <div className="text-sm font-medium text-red-600">Time: {timeLeft}s</div>
        </div>
        <div className="relative h-64 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-400 rounded-lg overflow-hidden border-2 border-blue-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
          {trash.map(item => {
            const currentTime = Date.now();
            const age = (currentTime - item.createdAt) / 1000;
            const lifePercent = Math.max(0, (item.lifetime - age) / item.lifetime);
            const opacity = Math.max(0.3, lifePercent);
            return (
              <div
                key={item.id}
                className="absolute cursor-pointer text-xl hover:scale-110 transition-all active:scale-95 z-10"
                style={{ 
                  left: `${item.x}%`, 
                  top: `${item.y}%`,
                  transform: 'translate(-50%, -50%)',
                  opacity: opacity,
                  filter: lifePercent < 0.3 ? 'brightness(0.7)' : 'none'
                }}
                onClick={() => removeTrash(item.id)}
              >
                {item.type}
              </div>
            );
          })}
          <div className="absolute bottom-4 left-4 text-lg animate-bounce">🐟</div>
          <div className="absolute top-8 right-8 text-lg animate-pulse">🐠</div>
          <div className="absolute bottom-8 right-12 text-lg animate-bounce delay-1000">🐡</div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Fish Food: {currentFishFood} 🍤</span>
            <span>Next: {nextTarget} trash</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 text-center mt-1">
            Trash auto-disappears • New trash spawns every 2s
          </div>
        </div>
      </div>
    </div>
  );
}
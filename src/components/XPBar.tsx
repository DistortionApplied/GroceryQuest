import { getXpForNextLevel, getXpProgressInCurrentLevel } from "@/lib/clientData";

interface XPBarProps {
  currentXP: number;
  level: number;
  xpForNextLevel: number;
}

export function XPBar({ currentXP, level, xpForNextLevel }: XPBarProps) {
  // Calculate XP progress within the current level using the new system
  const xpInLevel = getXpProgressInCurrentLevel(currentXP, level);
  const progressPercentage = Math.min((xpInLevel / xpForNextLevel) * 100, 100);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Level {level}</span>
        <span className="text-sm text-gray-500 dark:text-gray-500">{xpInLevel}/{xpForNextLevel} XP</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="text-center mt-2">
        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{currentXP} Total XP</span>
      </div>
    </div>
  );
}
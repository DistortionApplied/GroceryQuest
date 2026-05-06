'use client';

import { Achievement } from '@/lib/clientData';
import { useState } from 'react';

interface AchievementGridProps {
  achievements: Achievement[];
  unlockedIds: string[];
}

export function AchievementGrid({ achievements, unlockedIds }: AchievementGridProps) {
  const [isOpen, setIsOpen] = useState(false);

  const unlockedCount = unlockedIds.length;
  const totalCount = achievements.length;

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800  hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          <div className="text-left">
            <div className="font-semibold text-gray-900 dark:text-gray-100">Achievements</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {unlockedCount} of {totalCount} unlocked
            </div>
          </div>
        </div>
        <span className="text-gray-500 text-lg">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map(achievement => {
            const isUnlocked = unlockedIds.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`p-4  border-2 transition-all ${
                  isUnlocked
                    ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 shadow-md'
                    : 'border-gray-300 bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <div className="text-center">
                  <div className={`text-3xl mb-2 ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <div className={`font-semibold text-sm mb-1 ${isUnlocked ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'}`}>
                    {achievement.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {achievement.description}
                  </div>
                  {!isUnlocked && (
                    <div className="text-xs text-gray-400">
                      {achievement.requirements.map(req =>
                        `${req.type.replace('_', ' ')}: ${req.value}`
                      ).join(', ')}
                    </div>
                  )}
                  {isUnlocked && (
                    <div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                      Unlocked!
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
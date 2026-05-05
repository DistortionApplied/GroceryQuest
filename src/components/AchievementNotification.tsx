'use client';

import { Achievement } from '@/lib/clientData';
import { Button } from '@/components/ui/Button';

interface AchievementNotificationProps {
  achievements: Achievement[];
  onDismiss: () => void;
  levelUp?: boolean;
}

export function AchievementNotification({ achievements, onDismiss, levelUp }: AchievementNotificationProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-md mx-auto shadow-xl">
        <h3 className="text-xl font-bold mb-4 text-center">🎉 Achievement Unlocked!</h3>
        {levelUp && (
          <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg text-center">
            <div className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">⭐ Level Up!</div>
          </div>
        )}
        <div className="space-y-3 mb-6">
          {achievements.map(achievement => (
            <div key={achievement.id} className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span className="text-3xl">{achievement.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-gray-100">{achievement.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">+{achievement.xpReward} XP</div>
              </div>
            </div>
          ))}
        </div>
        <Button onClick={onDismiss} className="w-full">
          Continue
        </Button>
      </div>
    </div>
  );
}
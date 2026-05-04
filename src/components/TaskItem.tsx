"use client";

import { useState } from "react";

interface TaskItemProps {
  id: number;
  title: string;
  description?: string;
  xpValue: number;
  isCompleted: boolean;
  onToggle: (id: number) => void;
  onMoveUp?: (id: number) => void;
  onMoveDown?: (id: number) => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  isHealthTask?: boolean;
}

export function TaskItem({
  id,
  title,
  description,
  xpValue,
  isCompleted,
  onToggle,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
  isHealthTask = false,
}: TaskItemProps) {
  const [isChecked, setIsChecked] = useState(isCompleted);

  const handleToggle = () => {
    if (isHealthTask) return; // Health tasks are read-only
    console.log('TaskItem handleToggle called for task:', id, 'current isCompleted:', isCompleted);
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    console.log('TaskItem state updated to:', newChecked, 'calling onToggle');
    onToggle(id);
  };

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${isHealthTask ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700' : 'bg-gray-50 dark:bg-gray-800'}`}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleToggle}
        disabled={isHealthTask}
        className={`mt-1 w-4 h-4 rounded focus:ring-blue-500 dark:focus:ring-blue-400 ${isHealthTask ? 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900 border-amber-300 dark:border-amber-600 cursor-not-allowed' : 'text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'}`}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className={`font-medium ${isChecked ? "line-through text-gray-500 dark:text-gray-400" : isHealthTask ? "text-amber-900 dark:text-amber-100" : "text-gray-900 dark:text-gray-100"}`}>
            {title}
          </h4>
          <span className={`px-2 py-0.5 text-xs rounded ${isHealthTask ? 'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200' : xpValue >= 0 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`}>
            {xpValue >= 0 ? '+' : ''}{xpValue} XP
          </span>
          {isHealthTask && (
            <span className="px-2 py-0.5 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-xs rounded font-medium">
              Auto
            </span>
          )}
        </div>
        {description && (
          <p className={`text-sm ${isChecked ? "text-gray-400 dark:text-gray-500" : isHealthTask ? "text-amber-800 dark:text-amber-200" : "text-gray-600 dark:text-gray-400"}`}>
            {description}
          </p>
        )}
      </div>
      {(onMoveUp || onMoveDown) && (
        <div className="flex flex-col gap-1">
          {onMoveUp && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp(id);
              }}
              disabled={!canMoveUp}
              className="w-6 h-6 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded flex items-center justify-center text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ▲
            </button>
          )}
          {onMoveDown && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown(id);
              }}
              disabled={!canMoveDown}
              className="w-6 h-6 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded flex items-center justify-center text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ▼
            </button>
          )}
        </div>
      )}
    </div>
  );
}
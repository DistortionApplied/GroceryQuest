"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { NotificationModal } from "@/components/NotificationModal";
import { createRequest, createTask, getCurrentUser, calculateUserStats, checkAchievementUnlock, unlockAchievement, awardAchievementXP, updateUser } from "@/lib/clientData";

export default function AddRequest() {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [notification, setNotification] = useState<{ title: string; message: string } | null>(null);





  const handleSubmit = () => {
    // Clear any previous error
    setErrorMessage("");

    if (!itemName.trim()) {
      setErrorMessage("Please enter a list name");
      return;
    }

    try {
      // Create request directly in localStorage - this represents a grocery list
      const newRequest = createRequest({
        userId: 1,
        itemName: itemName.trim(),
        itemType: "grocery_list",
        description: description.trim() || undefined,
        requiredTasksCount: 0, // Start with no items
        completedTasksCount: 0,
        isCompleted: 0,
      });

      // Check for first list achievement
      const currentUser = getCurrentUser();
      if (currentUser) {
        const stats = calculateUserStats(currentUser);
        const unlockedAchievements = checkAchievementUnlock(currentUser, stats);
        if (unlockedAchievements.length > 0) {
          unlockedAchievements.forEach(a => unlockAchievement(a.id));
          const userWithAchievementXP = awardAchievementXP(currentUser, unlockedAchievements);
          updateUser(userWithAchievementXP);
        }
      }

      // Reset form
      setItemName("");
      setDescription("");
      setNotification({ title: 'List Created', message: 'Grocery list created! Now add items to your list.' });
      // Navigate after a short delay
      setTimeout(() => window.location.href = '/requests', 2000);
    } catch (error) {
      console.error("Error creating list:", error);
      setNotification({ title: 'Error', message: 'Failed to create list' });
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Create Grocery List</h1>
        <p className="text-gray-600 dark:text-gray-400">Create a new grocery list to organize your shopping</p>
      </div>

      <div className="space-y-6">
        {/* Item Details */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">List Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                List Name
              </label>
              <Input
                placeholder="e.g., Weekly Groceries, Party Supplies..."
                value={itemName}
                onChange={setItemName}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes (Optional)
              </label>
              <Textarea
                placeholder="Any notes about this shopping list..."
                value={description}
                onChange={setDescription}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3 mb-4">
            <p className="text-red-600 dark:text-red-400 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="pb-4">
          <Button onClick={handleSubmit} className="w-full" size="lg">
            Create List
          </Button>
        </div>
      </div>

      {notification && (
        <NotificationModal
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
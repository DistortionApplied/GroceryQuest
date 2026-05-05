"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getUsers, createUser, switchToUser, User } from "@/lib/clientData";

interface ProfileSelectorProps {
  onProfileSelected: () => void;
}

export function ProfileSelector({ onProfileSelected }: ProfileSelectorProps) {
  const [users, setUsers] = useState<User[]>(getUsers());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  const handleSelectProfile = (userId: number) => {
    switchToUser(userId);
    onProfileSelected();
  };

  const handleCreateProfile = () => {
    if (newUsername.trim()) {
      const newUser = createUser(newUsername.trim());
      setUsers(getUsers());
      setNewUsername("");
      setShowCreateForm(false);
      onProfileSelected();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newUsername.trim()) {
      handleCreateProfile();
    }
  };

  if (users.length === 0) {
    // First time user - show enhanced welcome screen with profile creation
    return (
      <div className="max-w-md w-full space-y-8">
        {/* App Logo/Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-6 shadow-lg">
            🛒
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Grocery Quest
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Gamified Grocery Shopping
          </p>
        </div>

        {/* Welcome Message */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Adventurer!
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Turn your daily tasks into an epic adventure! Earn XP, level up, and unlock rewards by completing requests.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center justify-center gap-2">
              <span className="text-yellow-500">⭐</span>
              <span>Earn XP</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-purple-500">⬆️</span>
              <span>Level Up</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-green-500">🎁</span>
              <span>Unlock Rewards</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-blue-500">📋</span>
              <span>Track Progress</span>
            </div>
          </div>
        </div>

        {/* Profile Creation */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Create Your Profile
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Choose a username to begin your quest
            </p>
          </div>

          <Input
            placeholder="Enter your username"
            value={newUsername}
            onChange={(value) => setNewUsername(value)}
            className="w-full"
          />
          <div className="space-y-2">
            <Button
              onClick={handleCreateProfile}
              className={`w-full ${!newUsername.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Start Your Quest
            </Button>
            {newUsername.trim() && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Press Enter or click Start Your Quest
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="max-w-md w-full space-y-8">
        {/* App Logo/Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-6 shadow-lg">
            🛒
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Grocery Quest
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Gamified Grocery Shopping
          </p>
        </div>

        {/* Create Profile Section */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Create New Profile
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start a fresh adventure with a new profile
            </p>
          </div>

          <Input
            placeholder="Enter username"
            value={newUsername}
            onChange={(value) => setNewUsername(value)}
            className="w-full"
          />
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCreateForm(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProfile}
              className={`flex-1 ${!newUsername.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Create Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full space-y-8">
      {/* App Logo/Icon */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-6 shadow-lg">
          🛒
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          TaskQuest
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Gamified Task Management
        </p>
      </div>

      {/* Welcome Back Message */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome Back!
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Continue your adventure or start fresh with a new profile.
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-center gap-2">
            <span className="text-yellow-500">⭐</span>
            <span>Earn XP</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-purple-500">⬆️</span>
            <span>Level Up</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-green-500">🎁</span>
            <span>Unlock Rewards</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-blue-500">📋</span>
            <span>Track Progress</span>
          </div>
        </div>
      </div>

      {/* Profile Selection */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Choose Your Profile
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Select a profile to continue your quest
          </p>
        </div>

        <div className="space-y-3">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleSelectProfile(user.id)}
              className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Level {user.level} • {user.xp} XP
                  </div>
                </div>
              </div>
            </button>
          ))}

          <Button
            onClick={() => setShowCreateForm(true)}
            variant="outline"
            className="w-full mt-4"
          >
            + Create New Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
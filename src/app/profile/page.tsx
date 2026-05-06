"use client";

import { useState, useEffect } from "react";
import { XPBar } from "@/components/XPBar";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { AchievementGrid } from "@/components/AchievementGrid";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { NotificationModal } from "@/components/NotificationModal";
import { compressImage, isValidImageFile } from "@/lib/imageUtils";
import { getCurrentUser, getRequestsForCurrentUser, getUsers, switchToUser, deleteUser, deleteCurrentProfile, updateUser, getXpForNextLevel, getLevelTitle, setCurrentUserId, getAchievements, getUnlockedAchievements } from "@/lib/clientData";

interface User {
  id: number;
  name: string;
  xp: number;
  level: number;
  createdAt: string;
  profilePicture?: string;
}

interface Request {
  id: number;
  isCompleted: number;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [clearDataConfirm, setClearDataConfirm] = useState(false);
  const [notification, setNotification] = useState<{ title: string; message: string } | null>(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [deleteProfileConfirm, setDeleteProfileConfirm] = useState<{ userId: number; userName: string } | null>(null);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [deleteAccountConfirm, setDeleteAccountConfirm] = useState(false);

  const loadProfileData = () => {
    try {
      // Load data for current user
      const userData = getCurrentUser();
      const requestsData = getRequestsForCurrentUser();
      const usersData = getUsers();

      // Set state in a microtask to avoid direct setState in effect
      queueMicrotask(() => {
        if (userData) {
          setUser(userData);
        }
        setRequests(requestsData);
        setAllUsers(usersData);
        setLoading(false);
      });
    } catch (error) {
      console.error('Error loading profile data:', error);
      queueMicrotask(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  // Refresh data when component becomes visible (user navigates back to profile)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Profile page became visible, refreshing data');
        loadProfileData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Also refresh on focus
    const handleFocus = () => {
      console.log('Profile page focused, refreshing data');
      loadProfileData();
    };

    window.addEventListener('focus', handleFocus);

    // Listen for custom data update events
    const handleDataUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.type === 'user') {
        console.log('User data updated, refreshing profile');
        loadProfileData();
      }
    };

    window.addEventListener('dataUpdated', handleDataUpdate);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('dataUpdated', handleDataUpdate);
    };
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center py-12">
          <div className="animate-spin  h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4">
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          Failed to load profile
        </div>
      </div>
    );
  }

  const handleSwitchProfile = (userId: number) => {
    try {
      const switchedUser = switchToUser(userId);
      if (switchedUser) {
        loadProfileData(); // Reload data for new user
        setShowProfileSwitcher(false);
        setNotification({ title: 'Profile Switched', message: `Switched to profile: ${switchedUser.name}` });
      }
    } catch (error) {
      console.error("Error switching profile:", error);
      setNotification({ title: 'Error', message: 'Failed to switch profile.' });
    }
  };

  const handleDeleteProfile = (userId: number, userName: string) => {
    if (allUsers.length <= 1) {
      setNotification({ title: 'Cannot Delete', message: 'Cannot delete the last profile.' });
      return;
    }

    setDeleteProfileConfirm({ userId, userName });
  };

  const confirmDeleteProfile = () => {
    if (!deleteProfileConfirm) return;
    
    try {
      deleteUser(deleteProfileConfirm.userId);
      setAllUsers(getUsers()); // Refresh user list
      loadProfileData(); // Reload current profile data
      setNotification({ title: 'Profile Deleted', message: 'Profile deleted successfully.' });
    } catch (error) {
      console.error("Error deleting profile:", error);
      setNotification({ title: 'Error', message: 'Failed to delete profile.' });
    }
    setDeleteProfileConfirm(null);
  };

  const handleLogout = () => {
    setLogoutConfirm(true);
  };

  const confirmLogout = () => {
    try {
      // Clear current user selection
      setCurrentUserId(null);
      // Redirect to home page (which will show profile selector)
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
      setNotification({ title: 'Error', message: 'Failed to logout.' });
    }
  };

  const handleDeleteCurrentProfile = () => {
    if (allUsers.length <= 1) {
      setNotification({ title: 'Cannot Delete', message: 'Cannot delete the last profile. Create another profile first if you want to delete this one.' });
      return;
    }

    setDeleteAccountConfirm(true);
  };

  const confirmDeleteCurrentProfile = () => {
    try {
      const success = deleteCurrentProfile();
      if (success) {
        setNotification({ title: 'Profile Deleted', message: 'Profile deleted successfully. Redirecting to profile selection.' });
        setTimeout(() => window.location.href = "/", 2000);
      } else {
        setNotification({ title: 'Error', message: 'Failed to delete profile.' });
      }
    } catch (error) {
      console.error("Error deleting current profile:", error);
      setNotification({ title: 'Error', message: 'Failed to delete profile.' });
    }
    setDeleteAccountConfirm(false);
  };

  const handleClearData = () => {
    setClearDataConfirm(true);
  };

  const confirmClearData = () => {
    setClearDataConfirm(false);
    try {
      localStorage.clear();
      setNotification({ title: 'Data Cleared', message: 'All data has been cleared. The app will now reload.' });
      setTimeout(() => window.location.href = '/', 2000);
    } catch (error) {
      console.error('Error clearing data:', error);
      setNotification({ title: 'Error', message: 'Failed to clear data.' });
    }
  };

  const handlePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (!isValidImageFile(file)) {
      setNotification({ title: 'Invalid File', message: 'Please select a valid image file (JPEG, PNG, WebP, GIF) under 5MB.' });
      return;
    }

    setUploadingPicture(true);
    try {
      const compressedImage = await compressImage(file);
      const updatedUser = { ...user, profilePicture: compressedImage };
      updateUser(updatedUser);
      setUser(updatedUser);
      setNotification({ title: 'Picture Updated', message: 'Your profile picture has been updated successfully.' });
    } catch (error) {
      console.error('Error uploading picture:', error);
      setNotification({ title: 'Upload Failed', message: 'Failed to upload profile picture. Please try again.' });
    } finally {
      setUploadingPicture(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleRemovePicture = () => {
    if (!user) return;

    try {
      const updatedUser = { ...user };
      delete updatedUser.profilePicture;
      updateUser(updatedUser);
      setUser(updatedUser);
      setNotification({ title: 'Picture Removed', message: 'Your profile picture has been removed.' });
    } catch (error) {
      console.error('Error removing picture:', error);
      setNotification({ title: 'Error', message: 'Failed to remove profile picture.' });
    }
  };

  const totalRequests = requests.length;
  const completedRequests = requests.filter(r => r.isCompleted).length;
  const xpForNextLevel = getXpForNextLevel(user.level);

  return (
    <div className="p-4">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your progress and achievements</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 text-gray-700 dark:text-gray-300  text-sm font-medium transition-colors"
            title="Logout and switch profiles"
          >
            Logout
          </button>
          <DarkModeToggle />
        </div>
      </div>

      {/* User Info */}
      <div className="bg-white dark:bg-gray-800 p-6  shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
        <div className="text-center">
          {user.profilePicture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.profilePicture}
              alt={`${user.name}'s profile`}
              className="w-16 h-16  object-cover mx-auto mb-3 border-4 border-white dark:border-gray-700 shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600  flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{user.name}</h2>
          <p className="text-gray-600 dark:text-gray-400">Level {user.level} {getLevelTitle(user.level)}</p>

          {/* Profile Picture Controls */}
          <div className="mt-4 flex justify-center gap-2">
            <label className="px-3 py-2 bg-blue-600 active:bg-blue-700 text-white text-sm  cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <input
                type="file"
                accept="image/*"
                onChange={handlePictureUpload}
                className="hidden"
                disabled={uploadingPicture}
              />
              {uploadingPicture ? 'Uploading...' : 'Upload Picture'}
            </label>
            {user.profilePicture && (
              <button
                onClick={handleRemovePicture}
                className="px-3 py-2 bg-gray-600 active:bg-gray-700 text-white text-sm  transition-colors"
                disabled={uploadingPicture}
              >
                Remove Picture
              </button>
            )}
          </div>
        </div>
      </div>

      {/* XP Progress */}
      <XPBar
        currentXP={user.xp}
        level={user.level}
        xpForNextLevel={xpForNextLevel}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4  shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalRequests}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Lists</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4  shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedRequests}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed Lists</div>
        </div>
      </div>

      {/* Achievements */}
      <AchievementGrid
        achievements={getAchievements()}
        unlockedIds={getUnlockedAchievements().map(a => a.id)}
      />

      {/* Profile Management */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Profile Management</h3>
          <button
            onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
            className="text-blue-600 dark:text-blue-400 active:underline text-sm"
          >
            {showProfileSwitcher ? 'Hide' : 'Manage Profiles'}
          </button>
        </div>

        {showProfileSwitcher && (
          <div className="bg-white dark:bg-gray-800 p-4  shadow-sm border border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Switch Profile</h4>
            <div className="space-y-2">
              {allUsers.map((profileUser) => (
                <div key={profileUser.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 ">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600  flex items-center justify-center text-white font-bold text-sm">
                      {profileUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {profileUser.name}
                        {profileUser.id === user?.id && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs ">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Level {profileUser.level} • {profileUser.xp} XP
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {profileUser.id !== user?.id && (
                      <button
                        onClick={() => handleSwitchProfile(profileUser.id)}
                        className="px-3 py-1 bg-blue-600 active:bg-blue-700 text-white text-sm transition-colors"
                      >
                        Switch
                      </button>
                    )}
                    {allUsers.length > 1 && (
                      <button
                        onClick={() => handleDeleteProfile(profileUser.id, profileUser.name)}
                        className="px-3 py-1 bg-red-600 active:bg-red-700 text-white text-sm transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              Each profile maintains separate XP, levels, requests, and tasks.
            </p>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="mt-6 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Danger Zone</h3>

        {/* Delete Current Profile */}
        <div className="bg-white dark:bg-gray-800 p-4  shadow-sm border border-red-200 dark:border-red-800 mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Delete your current profile and all its data. Other profiles will be preserved.
          </p>
          <button
            onClick={handleDeleteCurrentProfile}
            className="w-full py-2 px-4 bg-red-600 active:bg-red-700 dark:bg-red-700 dark:active:bg-red-600 text-white  text-sm font-medium transition-colors"
            disabled={allUsers.length <= 1}
          >
            Delete Current Profile
          </button>
          {allUsers.length <= 1 && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-2">
              Cannot delete the last profile. Create another profile first.
            </p>
          )}
        </div>

        {/* Clear All Data */}
        <div className="bg-white dark:bg-gray-800 p-4  shadow-sm border border-red-200 dark:border-red-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Clear all app data including requests, tasks, and XP progress. This cannot be undone.
          </p>
          <button
            onClick={handleClearData}
            className="w-full py-2 px-4 bg-red-600 active:bg-red-700 dark:bg-red-700 dark:active:bg-red-600 text-white  text-sm font-medium transition-colors"
          >
            Clear All Data
          </button>
        </div>
      </div>

      {deleteProfileConfirm && (
        <ConfirmationModal
          title="Delete Profile"
          message={`Are you sure you want to delete the profile "${deleteProfileConfirm.userName}"? This will permanently delete all their data and cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDeleteProfile}
          onCancel={() => setDeleteProfileConfirm(null)}
        />
      )}

      {logoutConfirm && (
        <ConfirmationModal
          title="Logout"
          message="Are you sure you want to logout? This will take you back to the profile selection screen."
          confirmText="Logout"
          cancelText="Cancel"
          onConfirm={confirmLogout}
          onCancel={() => setLogoutConfirm(false)}
        />
      )}

      {deleteAccountConfirm && (
        <ConfirmationModal
          title="Delete Current Profile"
          message={`Are you sure you want to delete the profile "${user?.name}"? This will permanently delete all your requests, tasks, and progress. Other profiles will be preserved. This cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDeleteCurrentProfile}
          onCancel={() => setDeleteAccountConfirm(false)}
        />
      )}

      {clearDataConfirm && (
        <ConfirmationModal
          title="Clear All Data"
          message="Are you sure you want to clear ALL data? This will reset your XP, level, requests, and tasks. This cannot be undone."
          confirmText="Clear Data"
          cancelText="Cancel"
          onConfirm={confirmClearData}
          onCancel={() => setClearDataConfirm(false)}
        />
      )}

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
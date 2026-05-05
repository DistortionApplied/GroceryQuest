// Client-side data utilities using localStorage

export interface User {
  id: number;
  name: string;
  xp: number;
  level: number;
  createdAt: string;
  profilePicture?: string; // base64 encoded image
}

export interface Request {
  id: number;
  userId: number;
  itemType: string;
  itemName: string;
  description?: string;
  requiredTasksCount: number;
  completedTasksCount: number;
  isCompleted: number;
  createdAt: string;
  completedAt?: string;
}

export interface Task {
  id: number;
  requestId: number;
  title: string;
  description?: string;
  xpValue: number;
  isCompleted: number;
  createdAt: string;
  completedAt?: string;
}

export interface Reward {
  id: number;
  userId: number;
  type: string;
  description: string;
  unlockedAt: string;
}

export interface AchievementRequirement {
  type: 'xp_total' | 'level_reached' | 'lists_completed' | 'lists_created' | 'tasks_completed' | 'streak_days';
  value: number;
  comparison: 'gte' | 'eq' | 'lte';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'progression' | 'completion' | 'special';
  xpReward: number;
  requirements: AchievementRequirement[];
  unlockedAt?: string;
}

export interface UserStats {
  xp_total: number;
  level_reached: number;
  lists_completed: number;
  lists_created: number;
  tasks_completed: number;
  streak_days: number;
}

// Storage keys
const STORAGE_KEYS = {
  users: 'gamified_app_users',
  currentUserId: 'gamified_app_current_user_id',
  requests: 'gamified_app_requests',
  tasks: 'gamified_app_tasks',
  rewards: 'gamified_app_rewards',
  rewardCategories: 'gamified_app_reward_categories',
  unlockedAchievements: 'gamified_app_unlocked_achievements',
};

// Reward category types
export interface RewardItem {
  id: string;
  name: string;
  icon: string;
  defaultTasks?: { title: string; description?: string; xpValue: number }[];
}

export interface RewardCategory {
  id: string;
  name: string;
  icon: string;
  subcategories?: RewardCategory[];
  items?: RewardItem[];
}

// Generic storage functions
function getFromStorage<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(key);
    if (!data) return [];

    const parsed = JSON.parse(data);
    // Ensure we return an array
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    // Clear corrupted data
    try {
      localStorage.removeItem(key);
    } catch (clearError) {
      console.error('Error clearing corrupted data:', clearError);
    }
    return [];
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage:`, error);
  }
}

// Default grocery categories
const DEFAULT_REWARD_CATEGORIES: RewardCategory[] = [
  {
    id: 'groceries',
    name: 'Groceries',
    icon: '🛒',
    items: [
      { id: 'grocery_item', name: 'Grocery Item', icon: '🛒' },
      { id: 'grocery_list', name: 'Grocery List', icon: '🛒' }
    ]
  }
];

// Predefined achievements
const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Create your first grocery list',
    icon: '🎯',
    category: 'progression',
    xpReward: 40,
    requirements: [{ type: 'lists_created', value: 1, comparison: 'gte' }]
  },
  {
    id: 'tasker',
    name: 'Tasker',
    description: 'Complete your first task',
    icon: '✅',
    category: 'progression',
    xpReward: 20,
    requirements: [{ type: 'tasks_completed', value: 1, comparison: 'gte' }]
  },
  {
    id: 'shopping_beginner',
    name: 'Shopping Beginner',
    description: 'Complete 10 tasks',
    icon: '🛒',
    category: 'progression',
    xpReward: 30,
    requirements: [{ type: 'tasks_completed', value: 10, comparison: 'gte' }]
  },
  {
    id: 'completer',
    name: 'Completer',
    description: 'Complete your first full list',
    icon: '📋',
    category: 'completion',
    xpReward: 40,
    requirements: [{ type: 'lists_completed', value: 1, comparison: 'gte' }]
  },
  {
    id: 'dedicated_shopper',
    name: 'Dedicated Shopper',
    description: 'Complete 50 tasks',
    icon: '💪',
    category: 'progression',
    xpReward: 75,
    requirements: [{ type: 'tasks_completed', value: 50, comparison: 'gte' }]
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Maintain a 7-day completion streak',
    icon: '🔥',
    category: 'completion',
    xpReward: 150,
    requirements: [{ type: 'streak_days', value: 7, comparison: 'gte' }]
  },
  {
    id: 'grocery_guru',
    name: 'Grocery Guru',
    description: 'Complete 100 tasks',
    icon: '👑',
    category: 'progression',
    xpReward: 200,
    requirements: [{ type: 'tasks_completed', value: 100, comparison: 'gte' }]
  },
  {
    id: 'apprentice',
    name: 'Apprentice',
    description: 'Reach level 5',
    icon: '⭐',
    category: 'progression',
    xpReward: 100,
    requirements: [{ type: 'level_reached', value: 5, comparison: 'gte' }]
  },
  {
    id: 'legend',
    name: 'Legend',
    description: 'Accumulate 1000 total XP',
    icon: '🌟',
    category: 'special',
    xpReward: 300,
    requirements: [{ type: 'xp_total', value: 1000, comparison: 'gte' }]
  }
];

// Users
export function getUsers(): User[] {
  return getFromStorage<User>(STORAGE_KEYS.users);
}

export function getUserById(id: number): User | undefined {
  const users = getUsers();
  return users.find(user => user.id === id);
}

export function updateUser(user: User): void {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index !== -1) {
    users[index] = user;
    saveToStorage(STORAGE_KEYS.users, users);
  }
}

// Profile Management
export function getCurrentUserId(): number | null {
  const stored = localStorage.getItem(STORAGE_KEYS.currentUserId);
  return stored ? parseInt(stored) : null;
}

export function setCurrentUserId(userId: number | null): void {
  if (userId === null) {
    localStorage.removeItem(STORAGE_KEYS.currentUserId);
  } else {
    localStorage.setItem(STORAGE_KEYS.currentUserId, userId.toString());
  }
}

export function getCurrentUser(): User | null {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) return null;
  const user = getUserById(currentUserId);
  return user || null;
}

export function createUser(name: string): User {
  const users = getUsers();
  const newId = Math.max(0, ...users.map(u => u.id)) + 1;

  const newUser: User = {
    id: newId,
    name: name.trim(),
    xp: 0,
    level: 1,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveToStorage(STORAGE_KEYS.users, users);

  // Set as current user
  setCurrentUserId(newId);

  return newUser;
}

export function switchToUser(userId: number): User | null {
  const user = getUserById(userId);
  if (user) {
    setCurrentUserId(userId);
    return user;
  }
  return null;
}

export function deleteUser(userId: number): void {
  // Don't allow deleting the last user
  const users = getUsers();
  if (users.length <= 1) return;

  // Remove user
  const filteredUsers = users.filter(u => u.id !== userId);
  saveToStorage(STORAGE_KEYS.users, filteredUsers);

  // Remove all user's data
  const requests = getRequests().filter(r => r.userId !== userId);
  const tasks = getTasks().filter(t => {
    const request = requests.find(r => r.id === t.requestId);
    return request !== undefined; // Keep tasks that belong to remaining requests
  });
  const rewards = getRewards().filter(r => r.userId !== userId);

  saveToStorage(STORAGE_KEYS.requests, requests);
  saveToStorage(STORAGE_KEYS.tasks, tasks);
  saveToStorage(STORAGE_KEYS.rewards, rewards);

  // Switch to another user if current user was deleted
  const currentUserId = getCurrentUserId();
  if (currentUserId === userId && filteredUsers.length > 0) {
    setCurrentUserId(filteredUsers[0].id);
  }
}

export function deleteCurrentProfile(): boolean {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) return false;

  // Don't allow deleting the last user
  const users = getUsers();
  if (users.length <= 1) return false;

  // Remove current user
  const filteredUsers = users.filter(u => u.id !== currentUserId);
  saveToStorage(STORAGE_KEYS.users, filteredUsers);

  // Remove all current user's data
  const requests = getRequests().filter(r => r.userId !== currentUserId);
  const tasks = getTasks().filter(t => {
    const request = requests.find(r => r.id === t.requestId);
    return request !== undefined; // Keep tasks that belong to remaining requests
  });
  const rewards = getRewards().filter(r => r.userId !== currentUserId);

  saveToStorage(STORAGE_KEYS.requests, requests);
  saveToStorage(STORAGE_KEYS.tasks, tasks);
  saveToStorage(STORAGE_KEYS.rewards, rewards);

  // Clear current user selection (will redirect to profile selector)
  setCurrentUserId(null);

  return true;
}

export function initializeDefaultUser(): User {
  const existingUsers = getUsers();
  if (existingUsers.length > 0) {
    // If users exist but no current user is set, set the first one as current
    if (!getCurrentUserId()) {
      setCurrentUserId(existingUsers[0].id);
    }
    return existingUsers[0];
  }

  const defaultUser: User = {
    id: 1,
    name: "Player",
    xp: 0,
    level: 1,
    createdAt: new Date().toISOString(),
  };

  saveToStorage(STORAGE_KEYS.users, [defaultUser]);
  setCurrentUserId(defaultUser.id);
  return defaultUser;
}

// Requests
export function getRequests(): Request[] {
  return getFromStorage<Request>(STORAGE_KEYS.requests);
}

export function getRequestsForCurrentUser(): Request[] {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) return [];
  return getRequests().filter(r => r.userId === currentUserId);
}

export function getRequestById(id: number): Request | undefined {
  const requests = getRequests();
  return requests.find(request => request.id === id);
}

export function createRequest(request: Omit<Request, 'id' | 'createdAt'>): Request {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) {
    throw new Error('No current user selected');
  }

  const requests = getRequests();
  const newId = Math.max(0, ...requests.map(r => r.id)) + 1;
  const newRequest: Request = {
    ...request,
    userId: currentUserId,
    id: newId,
    createdAt: new Date().toISOString(),
  };
  requests.push(newRequest);
  saveToStorage(STORAGE_KEYS.requests, requests);
  return newRequest;
}

export function updateRequest(request: Request): void {
  const requests = getRequests();
  const index = requests.findIndex(r => r.id === request.id);
  if (index !== -1) {
    requests[index] = request;
    saveToStorage(STORAGE_KEYS.requests, requests);
  }
}

export function deleteRequest(id: number): void {
  // Delete the request
  const requests = getRequests().filter(r => r.id !== id);
  saveToStorage(STORAGE_KEYS.requests, requests);

  // Delete all associated tasks
  const tasks = getTasks().filter(t => t.requestId !== id);
  saveToStorage(STORAGE_KEYS.tasks, tasks);
}

// Tasks
export function getTasks(): Task[] {
  return getFromStorage<Task>(STORAGE_KEYS.tasks);
}

export function getTasksByRequestId(requestId: number): Task[] {
  const tasks = getTasks();
  return tasks.filter(task => task.requestId === requestId);
}

export function getTasksForCurrentUser(): Task[] {
  const currentUserRequests = getRequestsForCurrentUser();
  const requestIds = currentUserRequests.map(r => r.id);
  return getTasks().filter(task => requestIds.includes(task.requestId));
}

export function createTask(task: Omit<Task, 'id' | 'createdAt'>): Task {
  const tasks = getTasks();
  const newId = Math.max(0, ...tasks.map(t => t.id)) + 1;
  const newTask: Task = {
    ...task,
    id: newId,
    createdAt: new Date().toISOString(),
  };
  tasks.unshift(newTask); // Add to beginning
  saveToStorage(STORAGE_KEYS.tasks, tasks);
  return newTask;
}

export function updateTask(task: Task): void {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === task.id);
  if (index !== -1) {
    tasks[index] = task;
    saveToStorage(STORAGE_KEYS.tasks, tasks);
  }
}

export function reorderTasksForRequest(requestId: number, taskIds: number[]): void {
  const allTasks = getTasks();
  const requestTasks = allTasks.filter(t => t.requestId === requestId).sort((a, b) => {
    const aIndex = taskIds.indexOf(a.id);
    const bIndex = taskIds.indexOf(b.id);
    return aIndex - bIndex;
  });
  const otherTasks = allTasks.filter(t => t.requestId !== requestId);
  saveToStorage(STORAGE_KEYS.tasks, [...otherTasks, ...requestTasks]);
}

// Rewards
export function getRewards(): Reward[] {
  return getFromStorage<Reward>(STORAGE_KEYS.rewards);
}

export function createReward(reward: Omit<Reward, 'id' | 'unlockedAt'>): Reward {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) {
    throw new Error('No current user selected');
  }

  const rewards = getRewards();
  const newId = Math.max(0, ...rewards.map(r => r.id)) + 1;
  const newReward: Reward = {
    ...reward,
    userId: currentUserId,
    id: newId,
    unlockedAt: new Date().toISOString(),
  };
  rewards.push(newReward);
  saveToStorage(STORAGE_KEYS.rewards, rewards);
  return newReward;
}

export function getRewardsForCurrentUser(): Reward[] {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) return [];
  return getRewards().filter(r => r.userId === currentUserId);
}

// Reward Categories
export function getRewardCategories(): RewardCategory[] {
  const categories = getFromStorage<RewardCategory>(STORAGE_KEYS.rewardCategories);
  // Return default categories if none exist
  return categories.length > 0 ? categories : DEFAULT_REWARD_CATEGORIES;
}

export function saveRewardCategories(categories: RewardCategory[]): void {
  saveToStorage(STORAGE_KEYS.rewardCategories, categories);
}

export function initializeDefaultRewardCategories(): void {
  const existing = getFromStorage<RewardCategory>(STORAGE_KEYS.rewardCategories);
  if (existing.length === 0) {
    saveToStorage(STORAGE_KEYS.rewardCategories, DEFAULT_REWARD_CATEGORIES);
  } else {
    // Merge new categories with existing ones
    const mergedCategories = mergeRewardCategories(existing, DEFAULT_REWARD_CATEGORIES);
    saveToStorage(STORAGE_KEYS.rewardCategories, mergedCategories);
  }
}

// Helper function to merge new categories with existing ones (deep merge)
function mergeRewardCategories(existing: RewardCategory[], defaults: RewardCategory[]): RewardCategory[] {
  const result = [...existing];
  const existingIds = new Set(existing.map(cat => cat.id));

  // Add any new top-level categories that don't exist
  for (const defaultCat of defaults) {
    if (!existingIds.has(defaultCat.id)) {
      result.push(defaultCat);
    } else {
      // Deep merge: update existing category's subcategories and items
      const existingIndex = result.findIndex(cat => cat.id === defaultCat.id);
      if (existingIndex !== -1) {
        result[existingIndex] = mergeCategory(result[existingIndex], defaultCat);
      }
    }
  }

  return result;
}

// Recursively merge a single category with its default version
function mergeCategory(existing: RewardCategory, defaultCat: RewardCategory): RewardCategory {
  const merged: RewardCategory = { ...existing };

  // Merge subcategories if both have them
  if (defaultCat.subcategories) {
    const existingSubs = existing.subcategories || [];
    const existingSubIds = new Set(existingSubs.map(s => s.id));
    const mergedSubs = [...existingSubs];

    for (const defaultSub of defaultCat.subcategories) {
      if (!existingSubIds.has(defaultSub.id)) {
        // New subcategory — add it
        mergedSubs.push(defaultSub);
      } else {
        // Existing subcategory — recurse to merge its children
        const subIndex = mergedSubs.findIndex(s => s.id === defaultSub.id);
        if (subIndex !== -1) {
          mergedSubs[subIndex] = mergeCategory(mergedSubs[subIndex], defaultSub);
        }
      }
    }

    merged.subcategories = mergedSubs;
  }

  // Merge items if both have them
  if (defaultCat.items) {
    const existingItems = existing.items || [];
    const existingItemIds = new Set(existingItems.map(i => i.id));
    const mergedItems = [...existingItems];

    for (const defaultItem of defaultCat.items) {
      if (!existingItemIds.has(defaultItem.id)) {
        mergedItems.push(defaultItem);
      }
    }

    merged.items = mergedItems;
  }

  return merged;
}

// Helper function to get all reward item IDs (flattened)
export function getAllRewardItemIds(): string[] {
  const categories = getRewardCategories();
  const ids: string[] = [];

  function collectIds(cats: RewardCategory[]) {
    for (const cat of cats) {
      if (cat.items) {
        ids.push(...cat.items.map(item => item.id));
      }
      if (cat.subcategories) {
        collectIds(cat.subcategories);
      }
    }
  }

  collectIds(categories);
  return ids;
}

// Helper function to find a reward item by ID
export function findRewardItem(id: string): RewardItem | null {
  const categories = getRewardCategories();

  function searchCategories(cats: RewardCategory[]): RewardItem | null {
    for (const cat of cats) {
      if (cat.items) {
        const found = cat.items.find(item => item.id === id);
        if (found) return found;
      }
      if (cat.subcategories) {
        const found = searchCategories(cat.subcategories);
        if (found) return found;
      }
    }
    return null;
  }

  return searchCategories(categories);
}

// Helper function for achievement requirement comparisons
function compareValues(current: number, required: number, comparison: 'gte' | 'eq' | 'lte'): boolean {
  switch (comparison) {
    case 'gte': return current >= required;
    case 'eq': return current === required;
    case 'lte': return current <= required;
    default: return false;
  }
}

// Achievements
export function getAchievements(): Achievement[] {
  return ACHIEVEMENTS;
}

export function getUnlockedAchievements(): Achievement[] {
  return getFromStorage<Achievement>(STORAGE_KEYS.unlockedAchievements);
}

export function unlockAchievement(achievementId: string): boolean {
  const achievements = getAchievements();
  const achievement = achievements.find(a => a.id === achievementId);
  if (!achievement) return false;

  const unlocked = getUnlockedAchievements();
  if (unlocked.some(a => a.id === achievementId)) return false;

  const unlockedAchievement = { ...achievement, unlockedAt: new Date().toISOString() };
  unlocked.push(unlockedAchievement);
  saveToStorage(STORAGE_KEYS.unlockedAchievements, unlocked);
  return true;
}

export function calculateUserStats(user: User): UserStats {
  const tasks = getTasksForCurrentUser();
  const requests = getRequestsForCurrentUser();
  const tasksCompleted = tasks.filter(t => t.isCompleted === 1).length;
  const listsCompleted = requests.filter(r => r.isCompleted === 1).length;
  const listsCreated = requests.length;

  // Calculate streak: longest consecutive days with at least one completed task
  const completedTasks = tasks
    .filter(t => t.isCompleted === 1 && t.completedAt)
    .sort((a, b) => new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime());

  let maxStreak = 0;
  let currentStreak = 0;
  let lastDate: string | null = null;

  for (const task of completedTasks) {
    const taskDate = new Date(task.completedAt!).toDateString();
    if (!lastDate || lastDate !== taskDate) {
      if (lastDate) {
        const prevDay = new Date(lastDate);
        const currDay = new Date(taskDate);
        const diffTime = currDay.getTime() - prevDay.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        if (diffDays === 1) {
          currentStreak++;
        } else {
          maxStreak = Math.max(maxStreak, currentStreak);
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      lastDate = taskDate;
    }
  }
  maxStreak = Math.max(maxStreak, currentStreak);

  return {
    xp_total: user.xp,
    level_reached: user.level,
    lists_completed: listsCompleted,
    lists_created: listsCreated,
    tasks_completed: tasksCompleted,
    streak_days: maxStreak
  };
}

export function checkAchievementUnlock(user: User, stats: UserStats): Achievement[] {
  const unlocked: Achievement[] = [];
  const achievements = getAchievements();
  const alreadyUnlocked = getUnlockedAchievements();

  for (const achievement of achievements) {
    if (alreadyUnlocked.some(a => a.id === achievement.id)) continue;

    const meetsRequirements = achievement.requirements.every(req =>
      compareValues(stats[req.type], req.value, req.comparison)
    );

    if (meetsRequirements) {
      unlocked.push(achievement);
    }
  }

  return unlocked;
}

export function awardAchievementXP(user: User, achievements: Achievement[]): User {
  const totalXp = achievements.reduce((sum, a) => sum + a.xpReward, 0);
  const newXp = user.xp + totalXp;
  return {
    ...user,
    xp: newXp,
    level: calculateLevelFromXp(newXp)
  };
}

// Helper function to format timestamp to Eastern Time dd/mm/yyyy h:mm a
export function formatTimestampToEST(isoString: string): string {
  const date = new Date(isoString);
  // Display in UTC time
  const estDate = new Date(date.getTime());
  const day = estDate.getDate().toString().padStart(2, '0');
  const month = (estDate.getMonth() + 1).toString().padStart(2, '0');
  const year = estDate.getFullYear();
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  const timeString = estDate.toLocaleString('en-US', timeOptions);
  return `${month}/${day}/${year} ${timeString}`;
}

// XP calculation functions
export function getXpForNextLevel(currentLevel: number): number {
  // Level 1 to 2: 100 XP
  // Level 2 to 3: 120 XP
  // Level 3 to 4: 140 XP
  // Formula: 100 + 20 * (currentLevel - 1)
  return 100 + (20 * (currentLevel - 1));
}

export function getXpProgressInCurrentLevel(totalXp: number, currentLevel: number): number {
  // Calculate how much XP the user has earned in the current level
  let xpInCurrentLevel = totalXp;

  // Subtract XP required for all previous levels
  for (let level = 1; level < currentLevel; level++) {
    xpInCurrentLevel -= getXpForNextLevel(level);
  }

  return Math.max(0, xpInCurrentLevel);
}

export function calculateLevelFromXp(totalXp: number): number {
  // Calculate what level the user should be at based on total XP
  let level = 1;
  let xpNeeded = 0;

  while (true) {
    const xpForThisLevel = getXpForNextLevel(level);
    xpNeeded += xpForThisLevel;

    if (totalXp < xpNeeded) {
      break;
    }

    level++;
  }

  return level;
}

export function getTotalXpRequiredForLevel(targetLevel: number): number {
  // Calculate total XP required to reach a specific level
  let totalXp = 0;

  for (let level = 1; level < targetLevel; level++) {
    totalXp += getXpForNextLevel(level);
  }

  return totalXp;
}

export function getLevelTitle(level: number): string {
  if (level >= 1 && level <= 4) return "Beginner";
  if (level >= 5 && level <= 9) return "New Adventurer";
  if (level >= 10 && level <= 14) return "Recruit";
  if (level >= 15 && level <= 19) return "Soldier";
  if (level >= 20 && level <= 24) return "Sergeant";
  if (level >= 25 && level <= 29) return "Captain";
  if (level >= 30 && level <= 34) return "Lieutenant";
  if (level >= 35 && level <= 39) return "Lieutenant Commander";
  if (level >= 40 && level <= 44) return "Commander";
  if (level >= 45 && level <= 49) return "Lieutenant Colonel";
  if (level >= 50 && level <= 55) return "Colonel";
  if (level >= 56 && level <= 60) return "Vice Admiral";
  if (level >= 61 && level <= 64) return "Admiral";
  if (level >= 65 && level <= 69) return "General";
  if (level >= 70 && level <= 74) return "1 Star General";
  if (level >= 75 && level <= 79) return "2 Star General";
  if (level >= 80 && level <= 84) return "3 Star General";
  if (level >= 85 && level <= 89) return "4 Star General";
  if (level >= 90 && level <= 94) return "Chief of Staff";
  if (level >= 95 && level <= 99) return "SecDef";
  if (level >= 100 && level <= 104) return "Commander-in-chief";
  if (level >= 105 && level <= 109) return "Ninja";
  if (level >= 110 && level <= 114) return "Ninja Assassin";
  if (level >= 115 && level <= 119) return "Space Ninja";
  if (level >= 120) return "God Tier";

  // Fallback for any unexpected cases
  return "Legendary Adventurer";
}
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { TaskItem } from "@/components/TaskItem";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getRequestById, getTasksByRequestId, updateTask, updateRequest, createTask, getUserById, updateUser, findRewardItem, calculateLevelFromXp, formatTimestampToEST, reorderTasksForRequest } from "@/lib/clientData";

interface Task {
  id: number;
  title: string;
  description?: string;
  xpValue: number;
  isCompleted: number;
  completedAt?: string;
}

interface Request {
  id: number;
  itemName: string;
  itemType: string;
  description?: string;
  requiredTasksCount: number;
  completedTasksCount: number;
  isCompleted: boolean;
  completedAt?: string;
}

export default function RequestDetail() {
  const params = useParams();
  const requestId = params.id as string;

  const [request, setRequest] = useState<Request | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  useEffect(() => {
    if (!requestId) return;

    // Load data directly from localStorage
    const reqId = parseInt(requestId);
    const requestData = getRequestById(reqId);
    const tasksData = getTasksByRequestId(reqId);

    if (requestData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRequest({
        ...requestData,
        isCompleted: Boolean(requestData.isCompleted),
      });
    }

    setTasks(tasksData);
    setLoading(false);
  }, [requestId]);

  const isHealthTask = (taskTitle: string) => {
    return taskTitle.includes('Health');
  };



  const handleTaskToggle = (taskId: number) => {
    console.log('handleTaskToggle called with taskId:', taskId);
    const task = tasks.find(t => t.id === taskId);
    console.log('Found task:', task);
    if (!task || !request) {
      console.log('Task or request not found');
      return;
    }

    // Don't allow toggling health tasks manually
    if (isHealthTask(task.title)) {
      console.log('Health tasks cannot be toggled manually');
      return;
    }

    const newIsCompleted = task.isCompleted === 0 ? 1 : 0;
    console.log('Toggling task completion:', task.isCompleted, '->', newIsCompleted);

    updateTaskAndCheckCompletion(taskId, newIsCompleted);
  };

   const updateTaskAndCheckCompletion = (taskId: number, newIsCompleted: number) => {
     const task = tasks.find(t => t.id === taskId);
     if (!task) return;

     // Update task
     const updatedTask = {
       ...task,
       isCompleted: newIsCompleted,
       completedAt: newIsCompleted === 1 ? new Date().toISOString() : task.completedAt,
     };
     updateTask(updatedTask as any);

     // Award XP to user if task is being completed
     if (newIsCompleted === 1 && task.isCompleted === 0) {
       const currentUser = getUserById(parseInt(localStorage.getItem('gamified_app_current_user_id') || '0'));
       if (currentUser) {
         const xpToAdd = task.xpValue || 10;
         const newXp = currentUser.xp + xpToAdd;
         const newLevel = calculateLevelFromXp(newXp);
         const updatedUser = {
           ...currentUser,
           xp: newXp,
           level: newLevel,
         };
         updateUser(updatedUser);
       }
     }

     // Update request completion count
     const updatedAllTasks = getTasksByRequestId(parseInt(requestId!));
     const completedCount = updatedAllTasks.filter(t => t.isCompleted === 1).length;
     const isNowCompleted = completedCount === updatedAllTasks.length;

     if (request) {
       const updatedRequest = {
         ...request,
         completedTasksCount: completedCount,
         isCompleted: isNowCompleted ? 1 : 0,
         completedAt: isNowCompleted ? (request.isCompleted === false ? new Date().toISOString() : request.completedAt) : undefined,
       };
       updateRequest(updatedRequest as any);
     }

     // Refresh local state
     setTasks(prevTasks => prevTasks.map(t =>
       t.id === taskId ? { ...t, isCompleted: newIsCompleted } : t
     ));
     setRequest(prevRequest => prevRequest ? {
       ...prevRequest,
       completedTasksCount: completedCount,
       isCompleted: isNowCompleted,
     } : null);
   };

  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropTaskId: number) => {
    e.preventDefault();
    if (!draggedTaskId || draggedTaskId === dropTaskId) return;

    const draggedIndex = tasks.findIndex(t => t.id === draggedTaskId);
    const dropIndex = tasks.findIndex(t => t.id === dropTaskId);

    const newTasks = [...tasks];
    const [draggedTask] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(dropIndex, 0, draggedTask);

    setTasks(newTasks);

    // Update storage
    reorderTasksForRequest(parseInt(requestId!), newTasks.map(t => t.id));

    setDraggedTaskId(null);
  };

  const moveTaskUp = (taskId: number) => {
    const index = tasks.findIndex(t => t.id === taskId);
    if (index > 0) {
      const newTasks = [...tasks];
      [newTasks[index], newTasks[index - 1]] = [newTasks[index - 1], newTasks[index]];
      setTasks(newTasks);
      reorderTasksForRequest(parseInt(requestId!), newTasks.map(t => t.id));
    }
  };

  const moveTaskDown = (taskId: number) => {
    const index = tasks.findIndex(t => t.id === taskId);
    if (index < tasks.length - 1) {
      const newTasks = [...tasks];
      [newTasks[index], newTasks[index + 1]] = [newTasks[index + 1], newTasks[index]];
      setTasks(newTasks);
      reorderTasksForRequest(parseInt(requestId!), newTasks.map(t => t.id));
    }
  };

   const addNewItem = () => {
     if (!newItemName.trim() || !request) return;

     try {
       const newTask = createTask({
         requestId: parseInt(requestId!),
         title: newItemName.trim(),
         description: undefined,
         xpValue: 10,
         isCompleted: 0,
       });

      // Update local state
      setTasks(prevTasks => [...prevTasks, newTask]);

      // Update request task count
      const updatedRequest = {
        ...request,
        requiredTasksCount: request.requiredTasksCount + 1,
      };
      updateRequest(updatedRequest as any);
      setRequest(updatedRequest);

      // Reset form
      setNewItemName("");
      setShowAddItem(false);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const getItemIcon = (type: string) => {
    const rewardItem = findRewardItem(type);
    return rewardItem ? rewardItem.icon : "🎁";
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-4">
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          Request not found
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const totalTasks = tasks.length;

  return (
    <div className="p-4">
      <div className="mb-6">
        <Button
          onClick={() => window.history.back()}
          variant="outline"
          size="sm"
          className="mb-4"
        >
          ← Back
        </Button>

        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{getItemIcon(request.itemType)}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{request.itemName}</h1>
            {request.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">{request.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>Items: {completedTasks}/{totalTasks}</span>
          {request.isCompleted && (
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">
              Shopping Complete
            </span>
          )}
        </div>
        {request.isCompleted && request.completedAt && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Completed on: {formatTimestampToEST(request.completedAt)}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Shopping Items</h2>
          {!request?.isCompleted && (
            <Button onClick={() => setShowAddItem(!showAddItem)} size="sm" variant="outline">
              + Add Item
            </Button>
          )}
        </div>

        {showAddItem && !request?.isCompleted && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              <Input
                placeholder="Enter item name..."
                value={newItemName}
                onChange={setNewItemName}
              />
              <div className="flex gap-2">
                <Button onClick={addNewItem} size="sm" className={!newItemName.trim() ? "opacity-50 cursor-not-allowed" : ""}>
                  Add Item
                </Button>
                <Button onClick={() => { setShowAddItem(false); setNewItemName(""); }} size="sm" variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">🛒</div>
            <p>No items in this list yet. Click &quot;Add Item&quot; to get started!</p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, task.id)}
              className="cursor-move"
            >
              <TaskItem
                id={task.id}
                title={task.title}
                description={task.description}
                xpValue={task.xpValue}
                isCompleted={Boolean(task.isCompleted)}
                onToggle={handleTaskToggle}
                onMoveUp={moveTaskUp}
                onMoveDown={moveTaskDown}
                canMoveUp={index > 0}
                canMoveDown={index < tasks.length - 1}
                isHealthTask={isHealthTask(task.title)}
              />
            </div>
          ))
        )}
      </div>

      {request.isCompleted && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-1">
              Congratulations!
            </h3>
            <p className="text-green-700 dark:text-green-300">
              Shopping list completed! All items purchased.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
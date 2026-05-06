import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { findRewardItem, formatTimestampToEST } from "@/lib/clientData";

interface RequestCardProps {
  id: number;
  itemName: string;
  itemType: string;
  description?: string;
  completedTasks: number;
  totalTasks: number;
  isCompleted: boolean;
  completedAt?: string;
  onDelete?: (id: number) => void;
  onEdit?: (id: number, newName: string, newDescription?: string) => void;
}

export function RequestCard({
  id,
  itemName,
  itemType,
  description,
  completedTasks,
  totalTasks,
  isCompleted,
  completedAt,
  onDelete,
  onEdit,
}: RequestCardProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(itemName);
  const [editDescription, setEditDescription] = useState(description || "");
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const getItemIcon = (type: string) => {
    const rewardItem = findRewardItem(type);
    return rewardItem ? rewardItem.icon : "🎁";
  };

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on the delete button, edit button, or if editing
    if ((e.target as HTMLElement).closest('.delete-button') ||
        (e.target as HTMLElement).closest('.edit-button') ||
        isEditing) {
      return;
    }
    router.push(`/request/${id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditName(itemName);
    setEditDescription(description || "");
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editName.trim() && onEdit) {
      onEdit(id, editName.trim(), editDescription.trim() || undefined);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(itemName);
    setEditDescription(description || "");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <Card onClick={handleClick} className="mb-4 relative group">
      <div className="absolute top-2 right-2 flex flex-col gap-1">
        {onDelete && (
          <button
            onClick={handleDelete}
            className="delete-button w-8 h-8 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900 active:bg-red-200 dark:active:bg-red-800 text-red-600 dark:text-red-400 transition-colors"
            aria-label="Delete request"
          >
            🗑️
          </button>
        )}
        {onEdit && (
          <button
            onClick={handleEdit}
            className="edit-button w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900 active:bg-blue-200 dark:active:bg-blue-800 text-blue-600 dark:text-blue-400 transition-colors"
            aria-label="Edit list name"
          >
            ✏️
          </button>
        )}
      </div>
      <div className="flex items-start gap-3 pr-12">
        <div className="text-2xl">{getItemIcon(itemType)}</div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {isEditing ? (
                <div className="space-y-2 w-full">
                  <div className="flex items-center gap-2">
                    <Input
                      value={editName}
                      onChange={setEditName}
                      className="flex-1 text-lg font-semibold"
                      placeholder="List name"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      value={editDescription}
                      onChange={setEditDescription}
                      className="flex-1 text-sm"
                      placeholder="Description (optional)"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="px-2 py-1 bg-green-600 text-white text-xs active:bg-green-700 transition-colors"
                    >
                      ✓
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-2 py-1 bg-gray-600 text-white text-xs active:bg-gray-700 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{itemName}</h3>
              )}
              {isCompleted && !isEditing && (
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs ">
                  Completed
                </span>
              )}
            </div>
            {isCompleted && completedAt && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Completed: {formatTimestampToEST(completedAt)}
              </div>
            )}
          {description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{description}</p>
          )}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Items: {totalTasks}</span>
              {totalTasks > 0 && (
                <span>{completedTasks} purchased</span>
              )}
            </div>
            {totalTasks > 0 && (
              <div className="w-full bg-gray-200 dark:bg-gray-700  h-2">
                <div
                  className="bg-green-600 dark:bg-green-500 h-2  transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
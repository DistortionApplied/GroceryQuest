import { Card } from "@/components/ui/Card";
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
}: RequestCardProps) {
  const router = useRouter();
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const getItemIcon = (type: string) => {
    const rewardItem = findRewardItem(type);
    return rewardItem ? rewardItem.icon : "🎁";
  };

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on the delete button
    if ((e.target as HTMLElement).closest('.delete-button')) {
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

  return (
    <Card onClick={handleClick} className="mb-4 relative group">
      {onDelete && (
        <button
          onClick={handleDelete}
          className="delete-button absolute top-2 right-2 w-8 h-8 flex items-center justify-center  bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-600 dark:text-red-400 transition-colors"
          aria-label="Delete request"
        >
          🗑️
        </button>
      )}
      <div className="flex items-start gap-3 pr-10">
        <div className="text-2xl">{getItemIcon(itemType)}</div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{itemName}</h3>
              {isCompleted && (
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
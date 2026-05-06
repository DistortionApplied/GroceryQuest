"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { XPBar } from "@/components/XPBar";
import { RequestCard } from "@/components/RequestCard";
import { Button } from "@/components/ui/Button";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { NotificationModal } from "@/components/NotificationModal";
import {
  getCurrentUser,
  getRequestsForCurrentUser,
  deleteRequest,
  initializeDefaultUser,
  initializeDefaultRewardCategories,
  getXpForNextLevel,
  User,
  Request,
} from "@/lib/clientData";

export default function Requests() {
  const router = useRouter();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [deleteConfirmRequestId, setDeleteConfirmRequestId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    try {
      // Initialize data synchronously
      initializeDefaultRewardCategories();

      // Set state in a microtask to avoid direct setState in effect
      queueMicrotask(() => {
        setRequests(getRequestsForCurrentUser());
        setLoading(false);
      });
    } catch (error) {
      console.error('Error loading requests page:', error);
      queueMicrotask(() => setLoading(false));
    }
  }, []);

  // Refresh data when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        try {
          const updatedRequests = getRequestsForCurrentUser();
          setRequests(updatedRequests);
        } catch (error) {
          console.error('Error refreshing data:', error);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleDeleteRequest = (requestId: number) => {
    setDeleteConfirmRequestId(requestId);
  };

  const confirmDeleteRequest = () => {
    if (deleteConfirmRequestId === null) return;

    try {
      deleteRequest(deleteConfirmRequestId);
      const updatedRequests = getRequestsForCurrentUser();
      setRequests(updatedRequests);
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('dataUpdated', {
        detail: { type: 'request' }
      }));
      setNotification({ title: 'Request Deleted', message: 'Request deleted successfully.' });
    } catch (error) {
      console.error('Error deleting request:', error);
      setNotification({ title: 'Error', message: 'Failed to delete request.' });
    }
    setDeleteConfirmRequestId(null);
  };

  const activeRequests = requests.filter(r => !r.isCompleted);
  const archivedRequests = requests.filter(r => r.isCompleted);

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center py-12">
          <div className="animate-spin  h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading requests...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          My Grocery Lists
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create and manage your shopping lists
        </p>
      </div>



      {/* Grocery Items List */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Grocery Items
        </h2>

        {activeRequests.length === 0 && archivedRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">🛒</div>
            <p>No grocery lists yet. Create one to get started!</p>
            <Button
              onClick={() => router.push("/add")}
              className="mt-4"
            >
              + Create List
            </Button>
          </div>
        ) : activeRequests.length === 0 ? (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <p>All shopping complete! 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeRequests.map((request) => (
              <RequestCard
                key={request.id}
                id={request.id}
                itemName={request.itemName}
                itemType={request.itemType}
                description={request.description}
                isCompleted={Boolean(request.isCompleted)}
                completedTasks={request.completedTasksCount}
                totalTasks={request.requiredTasksCount}
                completedAt={request.completedAt}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>
        )}
      </div>

      {/* Completed Items Section */}
      {archivedRequests.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`flex items-center gap-2 text-lg font-semibold transition-colors ${
              showArchived
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            <span>{showArchived ? '▼' : '▶'}</span>
            <span>Completed Lists ({archivedRequests.length})</span>
          </button>

          {showArchived && (
            <div className="mt-3 space-y-3">
              {archivedRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  id={request.id}
                  itemName={request.itemName}
                  itemType={request.itemType}
                  description={request.description}
                  isCompleted={Boolean(request.isCompleted)}
                  completedTasks={request.completedTasksCount}
                  totalTasks={request.requiredTasksCount}
                  completedAt={request.completedAt}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {requests.length > 0 && (
        <Button
          onClick={() => router.push("/add")}
          variant="outline"
          className="w-full"
        >
          + Create New List
        </Button>
      )}

      {deleteConfirmRequestId !== null && (
        <ConfirmationModal
          title="Delete Request"
          message="Are you sure you want to delete this request? All associated tasks will be deleted."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDeleteRequest}
          onCancel={() => setDeleteConfirmRequestId(null)}
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
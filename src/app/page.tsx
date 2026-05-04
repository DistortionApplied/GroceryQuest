"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProfileSelector } from "@/components/ProfileSelector";
import { getCurrentUser } from "@/lib/clientData";

export default function Home() {
  const router = useRouter();
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mark as client-side
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);

    // Check if user already has a profile selected
    const currentUser = getCurrentUser();
    if (currentUser) {
      // User has a profile, go to requests
      router.replace("/requests");
    } else {
      // No profile selected, show profile selector
      setShowProfileSelector(true);
    }
    setIsLoading(false);
  }, [router]);

  // Show consistent loading state during SSR and initial client render
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show profile selector if no user selected
  if (showProfileSelector) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <ProfileSelector onProfileSelected={() => router.replace("/requests")} />
      </div>
    );
  }

  // This shouldn't be reached, but fallback to loading
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    </div>
  );
}
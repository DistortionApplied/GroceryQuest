'use client';

import { Button } from '@/components/ui/Button';

interface ConfirmationModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}: ConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-md mx-auto shadow-xl">
        <h3 className="text-xl font-bold mb-4 text-center">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">{message}</p>
        <div className="flex gap-3">
          <Button onClick={onCancel} variant="outline" className="flex-1">
            {cancelText}
          </Button>
          <Button onClick={onConfirm} className="flex-1">
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
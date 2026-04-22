import React from 'react';
import { useToast } from '../../contexts/ToastContext';
import { ToastNotification } from './ToastNotification';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastNotification
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          action={{
            label: 'Dismiss',
            onClick: () => removeToast(toast.id)
          }}
        />
      ))}
    </div>
  );
};

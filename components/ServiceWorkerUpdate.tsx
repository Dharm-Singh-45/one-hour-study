import { useEffect, useState } from 'react';
import { useServiceWorker, updateServiceWorker } from '@/lib/useServiceWorker';

export default function ServiceWorkerUpdate() {
  const { isUpdateAvailable, registration } = useServiceWorker();
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    if (isUpdateAvailable) {
      setShowUpdate(true);
    }
  }, [isUpdateAvailable]);

  const handleUpdate = async () => {
    if (registration && registration.waiting) {
      // Send message to service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      // Try to update
      await updateServiceWorker();
    }
    setShowUpdate(false);
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              Update Available
            </p>
            <p className="mt-1 text-sm text-gray-500">
              A new version of the app is available. Update now?
            </p>
          </div>
        </div>
        <div className="mt-4 flex space-x-3">
          <button
            onClick={handleUpdate}
            className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Update
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 bg-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}


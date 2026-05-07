import { useEffect, useState } from 'react';

interface UseServiceWorkerReturn {
  isUpdateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
}

export function useServiceWorker(): UseServiceWorkerReturn {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!('serviceWorker' in navigator)) {
      console.log('Service Workers not supported in this browser');
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        setRegistration(reg);

        // Check for updates periodically
        const checkForUpdates = async () => {
          try {
            await reg.update();
          } catch (error) {
            console.error('Failed to check for service worker updates:', error);
          }
        };

        // Check for updates every hour
        const interval = setInterval(checkForUpdates, 60 * 60 * 1000);

        // Listen for new service worker waiting
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;

          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                // New service worker is ready
                setIsUpdateAvailable(true);
              }
            });
          }
        });

        // Listen for controller change (new SW activated)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          // Reload the page to get new assets
          window.location.reload();
        });

        return () => clearInterval(interval);
      } catch (error) {
        console.error('Failed to register service worker:', error);
      }
    };

    registerServiceWorker();
  }, []);

  return { isUpdateAvailable, registration };
}

export async function updateServiceWorker(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const registration = await navigator.serviceWorker.getRegistration();

    if (registration?.waiting) {
      // Tell the service worker to skip waiting and activate
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      // Try to check for updates
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        await reg.update();
      }
    }
  } catch (error) {
    console.error('Failed to update service worker:', error);
  }
}

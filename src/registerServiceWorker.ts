interface ServiceWorkerNavigator {
  serviceWorker?: {
    getRegistrations?: () => Promise<ReadonlyArray<{ unregister: () => unknown }>>;
    register: (scriptUrl: string) => unknown;
  };
}

interface LoadWindow {
  addEventListener: (event: "load", callback: () => void | Promise<void>) => unknown;
  caches?: {
    keys: () => Promise<string[]>;
    delete: (key: string) => Promise<boolean>;
  };
}

interface RegisterServiceWorkerOptions {
  baseUrl: string;
  isProduction: boolean;
  navigatorLike: ServiceWorkerNavigator;
  windowLike: LoadWindow;
}

export function registerServiceWorker({ baseUrl, isProduction, navigatorLike, windowLike }: RegisterServiceWorkerOptions): void {
  if (!navigatorLike.serviceWorker) return;

  if (!isProduction) {
    windowLike.addEventListener("load", async () => {
      const registrations = await navigatorLike.serviceWorker?.getRegistrations?.();
      await Promise.all(registrations?.map((registration) => registration.unregister()) ?? []);

      const cacheKeys = await windowLike.caches?.keys();
      await Promise.all(cacheKeys?.map((key) => windowLike.caches?.delete(key)) ?? []);
    });
    return;
  }

  const serviceWorkerUrl = `${baseUrl.replace(/\/$/, "")}/sw.js`;
  windowLike.addEventListener("load", () => {
    navigatorLike.serviceWorker?.register(serviceWorkerUrl);
  });
}

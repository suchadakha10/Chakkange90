import { describe, expect, it, vi } from "vitest";
import { registerServiceWorker } from "../registerServiceWorker";

describe("registerServiceWorker", () => {
  it("cleans up existing service workers during development", async () => {
    let loadCallback: (() => void | Promise<void>) | undefined;
    const unregister = vi.fn();
    const addEventListener = vi.fn((event: string, callback: () => void | Promise<void>) => {
      if (event === "load") loadCallback = callback;
    });
    const register = vi.fn();
    const getRegistrations = vi.fn().mockResolvedValue([{ unregister }]);

    registerServiceWorker({
      baseUrl: "/Chakkange90/",
      isProduction: false,
      navigatorLike: { serviceWorker: { getRegistrations, register } },
      windowLike: { addEventListener },
    });

    await loadCallback?.();

    expect(getRegistrations).toHaveBeenCalled();
    expect(unregister).toHaveBeenCalled();
    expect(register).not.toHaveBeenCalled();
  });

  it("registers the service worker under the configured base path in production", () => {
    const register = vi.fn();
    const addEventListener = vi.fn((event: string, callback: () => void) => {
      if (event === "load") callback();
    });

    registerServiceWorker({
      baseUrl: "/Chakkange90/",
      isProduction: true,
      navigatorLike: { serviceWorker: { register } },
      windowLike: { addEventListener },
    });

    expect(register).toHaveBeenCalledWith("/Chakkange90/sw.js");
  });
});

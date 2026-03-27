"use client";

import { useEffect, useState, type ReactNode } from "react";

export default function MswProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(process.env.NEXT_PUBLIC_USE_MSW !== "true");

  useEffect(() => {
    let active = true;

    const startWorker = async () => {
      if (process.env.NEXT_PUBLIC_USE_MSW !== "true") {
        if (active) {
          setReady(true);
        }
        return;
      }

      const { worker } = await import("@/mocks/browser");
      await worker.start({ onUnhandledRequest: "bypass" });

      if (active) {
        setReady(true);
      }
    };

    void startWorker();

    return () => {
      active = false;
    };
  }, []);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}

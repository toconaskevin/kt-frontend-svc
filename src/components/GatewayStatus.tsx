"use client";

import { useEffect, useState } from "react";
import { GATEWAY_URL } from "@/lib/api";

export function GatewayStatus() {
  const [status, setStatus] = useState<"checking" | "ok" | "error">("checking");

  useEffect(() => {
    const url = `${GATEWAY_URL}/auth/health`;
    fetch(url)
      .then((res) => {
        if (res.ok) setStatus("ok");
        else setStatus("error");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex items-center gap-2 text-sm">
        <span
          className={`h-2 w-2 rounded-full ${
            status === "ok"
              ? "bg-green-500"
              : status === "error"
                ? "bg-red-500"
                : "animate-pulse bg-amber-500"
          }`}
          aria-hidden
        />
        <span className="text-zinc-600 dark:text-zinc-400">
          {status === "checking" && "Checking service availability…"}
          {status === "ok" && `Services are available`}
          {status === "error" && `Services are not available. Please check the logs for more information.`}
        </span>
      </div>
    </div>
  );
}

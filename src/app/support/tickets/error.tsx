"use client";

import RouteErrorFallback from "@/components/RouteErrorFallback";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteErrorFallback title="티켓 페이지를 불러오지 못했습니다" reset={reset} />;
}

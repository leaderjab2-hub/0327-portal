"use client";

type RouteErrorFallbackProps = {
  title?: string;
  message?: string;
  reset: () => void;
};

export default function RouteErrorFallback({
  title = "페이지를 불러오지 못했습니다",
  message = "잠시 후 다시 시도해 주세요.",
  reset,
}: RouteErrorFallbackProps) {
  return (
    <div className="flex min-h-[320px] items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg rounded-[18px] border border-rose-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
          !
        </div>
        <h2 className="text-[20px] font-bold text-gray-900">{title}</h2>
        <p className="mt-2 text-[14px] text-gray-500">{message}</p>
        <button
          className="mt-6 rounded-[10px] bg-primary-600 px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-primary-700"
          onClick={reset}
          type="button"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}

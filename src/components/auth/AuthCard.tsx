import type { ReactNode } from "react";
import Image from "next/image";

export default function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-md rounded-[18px] border border-[#E5E7EB] bg-white dark:bg-slate-800 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="mb-8">
        <Image
          src="/logo1.svg"
          alt="SKT Enterprise GPUaaS"
          width={176}
          height={40}
          className="mb-6 h-10 w-auto"
          loading="eager"
        />
        <h1 className="text-[28px] font-bold text-gray-900 dark:text-slate-100">{title}</h1>
        <p className="mt-2 text-[14px] leading-6 text-gray-500 dark:text-slate-400">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

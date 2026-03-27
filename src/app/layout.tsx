import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import MobileHeader from "@/components/MobileHeader";

export const metadata: Metadata = {
  title: "SKT Enterprise GPUaaS Operations Portal",
  description: "GPUaaS portal for operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`antialiased font-sans flex`}>
        <Sidebar />
        <div className="flex-1 md:ml-[240px] flex flex-col h-screen overflow-hidden min-w-0">
          <MobileHeader />
          <Topbar />
          <div className="flex-1 overflow-auto bg-[#F9FAFB] min-w-0">
            <main className="mx-auto w-full min-w-0 max-w-full lg:max-w-[1600px] px-4 md:px-[32px] py-4 md:py-[24px]">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

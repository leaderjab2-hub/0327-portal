import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { Providers } from "./providers";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "SKT Enterprise GPUaaS Operations Portal",
  description: "GPUaaS portal for operations",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let currentUser = null;

  try {
    currentUser = await getCurrentUser();
  } catch (error) {
    console.error("[layout] failed to load current user", error);
  }

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased font-sans">
        <Providers initialUser={currentUser}>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}

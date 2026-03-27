import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import MswProvider from "@/components/MswProvider";
import { AuthProvider } from "@/contexts/AuthContext";
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
    <html lang="ko">
      <body className="antialiased font-sans">
        <MswProvider>
          <AuthProvider initialUser={currentUser}>
            <AppShell>{children}</AppShell>
          </AuthProvider>
        </MswProvider>
      </body>
    </html>
  );
}

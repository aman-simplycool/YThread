import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/context/authProvider";
import { SessionProvider, useSession } from "next-auth/react";
import { ReactNode } from "react";
import "./globals.css";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" >
      <AuthProvider>
        <body >
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
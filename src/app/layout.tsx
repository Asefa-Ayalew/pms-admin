import "@mantine/notifications/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RootStyleRegistry from "./mantine";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";
import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { AuthProfileHandler } from "../components/AuthProfileHandler";
import { Providers } from "../store/provider";
import { ProtectedShell } from "@/shared/shell/protected-shell";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PMS Admin",
  description: "PMS Admin - Property Management System",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <RootStyleRegistry>
          <SessionProvider session={session}>
            <Providers>
              <ModalsProvider>
                <Notifications />

                <div aria-live="polite" aria-atomic="true" className="sr-only">
                  <div id="notification-region"></div>
                </div>
                <NextTopLoader
                  color="#23F184"
                  initialPosition={0.08}
                  crawlSpeed={200}
                  height={3}
                  crawl={true}
                  showSpinner={false}
                  easing="ease"
                  speed={200}
                  shadow="0 0 10px #6adca0,0 0 5px #6adca0"
                  template='
                  <div class="bar" role="bar">
                    <div class="peg"></div>
                  </div> 
                  <div class="spinner" role="spinner">
                    <div class="spinner-icon"></div>
                  </div>'
                  zIndex={1600}
                  showAtBottom={false}
                />

                <AuthProfileHandler />

                <div id="main-content" role="main" tabIndex={-1}>
                  <ProtectedShell>{children}</ProtectedShell>
                </div>
              </ModalsProvider>
            </Providers>
          </SessionProvider>
        </RootStyleRegistry>
      </body>
    </html>
  );
}

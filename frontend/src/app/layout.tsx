import type { Metadata } from "next";
import { defaultMetadata } from "../lib/meta";
import QueryProvider from "../providers/QueryProvider";
import "../styles/globals.css";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}

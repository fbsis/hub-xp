import type { Metadata } from "next";
import "./globals.css";
import "../../../../packages/components/src/styles.css";
import { QueryProvider } from "../providers/QueryProvider";

export const metadata: Metadata = {
  title: "Book Reviews Platform",
  description: "A platform for reviewing and discovering books",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <QueryProvider>
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}

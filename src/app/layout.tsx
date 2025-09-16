import type { Metadata } from "next";
import "./global.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export const metadata: Metadata = {
  title: "EHR Dashboard",
  description: "Electronic Health Records System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex bg-gray-50 text-gray-900">
        {/* Sidebar */}
        <Sidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header />

          {/* Main content */}
          <main className="p-6 flex-1 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}

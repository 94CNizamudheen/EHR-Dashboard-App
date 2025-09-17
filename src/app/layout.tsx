import "./global.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Hospital EHR Dashboard",
  description: "A secure Electronic Health Record management dashboard",
  keywords: ["EHR", "Hospital", "Dashboard", "Healthcare"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: "var(--hospital-bg)", color: "var(--hospital-text)" }}>
        <Header />
        <Sidebar />
        <main className="pt-16">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="md:ml-[260px]">{children}</div>
          </div>
        </main>
      </body>
    </html>
  );
}

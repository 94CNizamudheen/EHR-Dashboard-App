import "./global.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

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

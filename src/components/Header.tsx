"use client";

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <h2 className="text-lg font-medium">EHR Portal</h2>
      <button
        onClick={handleLogout}
        className="px-3 py-1 rounded-md border hover:bg-gray-50 text-sm"
      >
        Logout
      </button>
    </header>
  );
}

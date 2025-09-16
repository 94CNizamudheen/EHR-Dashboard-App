import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">Welcome to EHR Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card href="/patients" title="Patient Management" desc="Create / View patients" />
        <Card href="/appointments" title="Appointment Scheduling" desc="Manage appointments" />
        <Card href="/clinical" title="Clinical Operations" desc="Clinical workflows & notes" />
        <Card href="/billing" title="Billing & Administrative" desc="Invoices & payments" />
      </div>
    </div>
  );
}

function Card({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="block p-4 rounded-lg border hover:shadow bg-white">
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">{desc}</p>
    </Link>
  );
}

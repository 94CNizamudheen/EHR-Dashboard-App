"use client";

import { useEffect, useState } from "react";
import {API} from "../../lib/api";
import Link from "next/link";

export default function BillingOverview() {

  const [summary, setSummary] = useState<{ totalRevenue: number; totalOutstanding: number } | null>(null);

  useEffect(() => {
    fetchSummary();
  }, []);



  const fetchSummary = async () => {
    try {
      const res = await API.get("/billing/reports/summary");
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Billing & Administrative</h1>
        <div>
          <Link href="/billing/codes" className="px-3 py-2 bg-gray-100 rounded">Billing Codes</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium">Summary</h3>
          <p>Total revenue: {summary ? summary.totalRevenue : "-"}</p>
          <p>Total outstanding: {summary ? summary.totalOutstanding : "-"}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium">Quick actions</h3>
          <ul className="mt-2 text-sm">
            <li><Link href="/billing/new-payment" className="text-blue-600">Record Payment</Link></li>
          </ul>
        </div>
      </div>

    </div>
  );
}

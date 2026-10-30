import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/services/api";
import type { DeliveryRequest } from "@/types";
import { Card, Badge } from "@/components/ui";
import { FileText, Clock, Truck, Users } from "lucide-react";

export function AdminDashboard() {
  const [requests, setRequests] = useState<DeliveryRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ requests: DeliveryRequest[] }>("/admin/requests?limit=5")
      .then((r: any) => {
        setRequests(r.requests || r.data?.requests || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-red mb-4"></div>
        <p className="text-brand-grey">Loading dashboard...</p>
      </div>
    );
  }

  const total = requests.length;
  const newCount = requests.filter((r: DeliveryRequest) => r.status === "NEW").length;
  const reviewedCount = requests.filter((r: DeliveryRequest) => r.status === "REVIEWED").length;
  const completedCount = requests.filter((r: DeliveryRequest) => r.status === "COMPLETED").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-black">Dashboard</h1>
        <p className="text-brand-grey">Manage your delivery requests and website content.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total requests", value: total, icon: FileText },
          { label: "New", value: newCount, icon: Clock },
          { label: "Reviewed", value: reviewedCount, icon: Truck },
          { label: "Completed", value: completedCount, icon: Users },
        ].map((stat) => (
          <Card key={stat.label}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-brand-grey text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-brand-black">{stat.value}</p>
                </div>
                <div className="w-8 h-8 rounded bg-brand-light-bg flex items-center justify-center text-brand-black">
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-bold text-brand-black text-lg">Recent requests</h2>
        <Link to="/admin/requests" className="text-sm font-medium text-brand-red hover:underline">
          View all →
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-brand-black/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-black/10 bg-brand-light-bg">
              <th className="px-4 py-3 text-left text-brand-grey font-medium">Reference</th>
              <th className="px-4 py-3 text-left text-brand-grey font-medium">Customer</th>
              <th className="px-4 py-3 text-left text-brand-grey font-medium">Service</th>
              <th className="px-4 py-3 text-left text-brand-grey font-medium">Status</th>
              <th className="px-4 py-3 text-left text-brand-grey font-medium">Date</th>
              <th className="px-4 py-3 text-right text-brand-grey font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-brand-grey">
                  No requests yet.
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id} className="border-b border-brand-black/5 last:border-0">
                  <td className="px-4 py-3 text-brand-black font-mono text-xs">{r.referenceNumber}</td>
                  <td className="px-4 py-3 text-brand-black">{r.customerName}</td>
                  <td className="px-4 py-3 text-brand-grey text-sm">{r.service?.name || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={r.status === "NEW" ? "red" : "default"}>
                      {r.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-brand-grey text-sm">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/requests/${r.id}`} className="text-brand-red font-medium hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;

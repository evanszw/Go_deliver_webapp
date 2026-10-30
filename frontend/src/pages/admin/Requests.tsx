import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { api } from "@/services/api";
import type { DeliveryRequest } from "@/types";
import { Search, Filter, RefreshCw, X, ArrowUpRight } from "lucide-react";

export function AdminRequests() {
  const [requests, setRequests] = useState<DeliveryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests(isSilent = false) {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      // Fetch recent requests (up to 100 for comprehensive client-side searching and filtering)
      const r: any = await api.get("/admin/requests?limit=100");
      setRequests(r.requests || r.data?.requests || []);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // Pure client-side filtering by Request ID or Customer Name, plus status filter
  const filteredRequests = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return requests.filter((r) => {
      // Filter by status dropdown/tab
      if (statusFilter && r.status !== statusFilter) {
        return false;
      }
      // Filter by search query (Request ID / Reference Number or Customer Name)
      if (q) {
        const matchesRef =
          r.referenceNumber?.toLowerCase().includes(q) ||
          r.id?.toLowerCase().includes(q);
        const matchesCustomer = r.customerName?.toLowerCase().includes(q);
        const matchesPhone = r.customerPhone?.toLowerCase().includes(q);
        const matchesRecipient = r.recipientName?.toLowerCase().includes(q);

        return matchesRef || matchesCustomer || matchesPhone || matchesRecipient;
      }
      return true;
    });
  }, [requests, searchQuery, statusFilter]);

  // Compute status counts for quick-filter tabs
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: requests.length,
      NEW: 0,
      REVIEWED: 0,
      ACCEPTED: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };
    requests.forEach((r) => {
      if (counts[r.status] !== undefined) {
        counts[r.status]++;
      }
    });
    return counts;
  }, [requests]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return {
          label: "Pending Dispatch",
          textColor: "text-amber-800 bg-amber-50 border-amber-200",
        };
      case "REVIEWED":
        return {
          label: "Under Review",
          textColor: "text-sky-800 bg-sky-50 border-sky-200",
        };
      case "ACCEPTED":
        return {
          label: "In Transit / Accepted",
          textColor: "text-blue-800 bg-blue-50 border-blue-200",
        };
      case "COMPLETED":
        return {
          label: "Completed",
          textColor: "text-emerald-800 bg-emerald-50 border-emerald-200",
        };
      case "CANCELLED":
        return {
          label: "Cancelled",
          textColor: "text-rose-800 bg-rose-50 border-rose-200",
        };
      default:
        return {
          label: status,
          textColor: "text-slate-800 bg-slate-50 border-slate-200",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-red mb-4"></div>
        <span className="text-xs text-slate-500">Loading delivery requests...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-black tracking-tight">Delivery Requests</h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Live dispatch monitor. Filter by request ID or customer name instantly.
          </p>
        </div>
        <button
          onClick={() => loadRequests(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-brand-black transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-brand-red" : ""}`} />
          <span>{refreshing ? "Syncing..." : "Refresh"}</span>
        </button>
      </div>

      {/* Quick Status Filter Tabs with Visual Dots */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setStatusFilter("")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            statusFilter === ""
              ? "bg-brand-black text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-brand-black"
          }`}
        >
          <span>All Requests</span>
          <span className="font-mono text-[11px] opacity-80">({statusCounts.ALL})</span>
        </button>

        <button
          onClick={() => setStatusFilter("NEW")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            statusFilter === "NEW"
              ? "bg-amber-500 text-white shadow-sm"
              : "bg-amber-50 text-amber-900 border border-amber-200/60 hover:bg-amber-100"
          }`}
        >
          <span>Pending</span>
          <span className="font-mono text-[11px]">({statusCounts.NEW})</span>
        </button>

        <button
          onClick={() => setStatusFilter("ACCEPTED")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            statusFilter === "ACCEPTED"
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-blue-50 text-blue-900 border border-blue-200/60 hover:bg-blue-100"
          }`}
        >
          <span>In Transit / Accepted</span>
          <span className="font-mono text-[11px]">({statusCounts.ACCEPTED})</span>
        </button>

        <button
          onClick={() => setStatusFilter("COMPLETED")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            statusFilter === "COMPLETED"
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-emerald-50 text-emerald-900 border border-emerald-200/60 hover:bg-emerald-100"
          }`}
        >
          <span>Completed</span>
          <span className="font-mono text-[11px]">({statusCounts.COMPLETED})</span>
        </button>

        <button
          onClick={() => setStatusFilter("CANCELLED")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            statusFilter === "CANCELLED"
              ? "bg-rose-600 text-white shadow-sm"
              : "bg-rose-50 text-rose-900 border border-rose-200/60 hover:bg-rose-100"
          }`}
        >
          <span>Cancelled</span>
          <span className="font-mono text-[11px]">({statusCounts.CANCELLED})</span>
        </button>
      </div>

      {/* Search Input & Status Dropdown Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Client-side Search input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Request ID (e.g. GD-849201) or Customer Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-brand-black placeholder-slate-400 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-brand-black rounded"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Secondary status dropdown filter */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-7 py-2 bg-white border border-slate-200 rounded-lg text-xs text-brand-black font-medium focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red shadow-sm cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="NEW">🟡 Pending Dispatch</option>
              <option value="REVIEWED">🔵 Under Review</option>
              <option value="ACCEPTED">🔷 In Transit / Accepted</option>
              <option value="COMPLETED">🟢 Completed</option>
              <option value="CANCELLED">🔴 Cancelled</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 whitespace-nowrap pl-1 font-mono">
            {filteredRequests.length} of {requests.length}
          </div>
        </div>
      </div>

      {/* Results Count Banner if Filtering */}
      {(searchQuery.trim() || statusFilter) && (
        <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200/80">
          <span className="flex items-center gap-2">
            <span>Filtering by:</span>
            {searchQuery && (
              <span className="font-semibold text-brand-black bg-white px-2 py-0.5 rounded border border-slate-200">
                &ldquo;{searchQuery}&rdquo;
              </span>
            )}
            {statusFilter && (
              <span className="font-semibold text-brand-black bg-white px-2 py-0.5 rounded border border-slate-200">
                Status: {statusFilter}
              </span>
            )}
          </span>
          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("");
            }}
            className="text-brand-red hover:underline font-medium"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
              <th className="px-4 py-3">Reference / ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Route &amp; Destination</th>
              <th className="px-4 py-3">Service Tier</th>
              <th className="px-4 py-3">Visual Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="font-semibold text-brand-black text-sm">No matching requests found</p>
                    <p className="text-xs text-slate-400">
                      {searchQuery
                        ? `No deliveries match "${searchQuery}". Check the request ID or customer name.`
                        : "No requests in this status category."}
                    </p>
                    {(searchQuery || statusFilter) && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setStatusFilter("");
                        }}
                        className="mt-2 inline-flex text-xs font-semibold text-brand-red hover:underline"
                      >
                        Clear search filter
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredRequests.map((r) => {
                const badge = getStatusBadge(r.status);
                return (
                  <tr
                    key={r.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Reference / ID */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-mono font-bold text-xs text-brand-black">
                        {r.referenceNumber}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 truncate max-w-[120px]">
                        {r.id.substring(0, 8)}...
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-brand-black">
                        {r.customerName}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {r.customerPhone}
                      </div>
                    </td>

                    {/* Route */}
                    <td className="px-4 py-3.5 max-w-xs">
                      <div className="truncate text-xs font-medium text-slate-700" title={r.pickupAddress}>
                        <span className="text-slate-400 font-semibold mr-1">From:</span>
                        {r.pickupAddress}
                      </div>
                      <div className="truncate text-xs text-slate-600" title={r.deliveryDestination}>
                        <span className="text-slate-400 font-semibold mr-1">To:</span>
                        {r.deliveryDestination}
                      </div>
                    </td>

                    {/* Service */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-600">
                      {r.service?.name || "Standard Courier"}
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${badge.textColor}`}
                      >
                        {badge.label}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-500">
                      <div>{new Date(r.createdAt).toLocaleDateString()}</div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(r.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-right">
                      <Link
                        to={`/admin/requests/${r.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-brand-red bg-red-50 hover:bg-brand-red hover:text-white rounded-md transition-colors"
                      >
                        <span>Details</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminRequests;

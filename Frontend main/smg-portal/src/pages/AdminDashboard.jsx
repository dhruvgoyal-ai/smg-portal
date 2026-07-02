import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { StatCard, Badge, DataTable } from "../components/ui";
import { shipmentAPI } from "../services/api";
import {
  Package,
  Users,
  Truck,
  Clock,
  CheckCircle,
  MapPin,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
 
const RECENT_COLUMNS = [
  {
    key: "trackingNo",
    label: "Tracking No.",
    width: "140px",
    render: (v) => (
      <span className="font-mono font-bold text-[#1a6ab1] text-xs">{v}</span>
    ),
  },
  { key: "customer", label: "Customer" },
  {
    key: "destination",
    label: "Route",
    render: (v) => (
      <span className="flex items-center gap-1 text-slate-600 text-xs">
        <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
        {v}
      </span>
    ),
  },
  { key: "weight", label: "Weight", width: "80px" },
  { key: "date", label: "Date", width: "110px" },
  {
    key: "status",
    label: "Status",
    width: "140px",
    render: (v) => <Badge status={v} />,
  },
];
 
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalShipments: 0,
    activeShipments: 0,
    deliveredToday: 0,
    pendingPickup: 0,
    totalCustomers: 0,
    activePartners: 0,
  });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const recentRes = await shipmentAPI.getAll({
          sort: "-createdAt",
        });
        if (recentRes.data?.shipments) {
          const allShipments = recentRes.data.shipments;
          const totalShipments = allShipments.length;
          const activeShipments = allShipments.filter(
            (s) => s.status !== "Delivered" && s.status !== "Cancelled",
          ).length;
 
          const deliveredToday = allShipments.filter(
            (s) =>
              s.status === "Delivered" &&
              new Date(s.updatedAt).toDateString() ===
                new Date().toDateString(),
          ).length;
 
          const pendingPickup = allShipments.filter(
            (s) => s.status === "Pending",
          ).length;
 
          const totalCustomers = new Set(allShipments.map((s) => s.senderName))
            .size;
 
          const activePartners = new Set(
            allShipments
              .filter((s) => s.assignedPartner)
              .map((s) => s.assignedPartner._id),
          ).size;
 
          const shipments = allShipments.map((s) => ({
            _id: s._id,
            trackingNo: s.trackingId,
            customer: s.senderName,
            destination: `${s.senderAddress} → ${s.receiverAddress}`,
            status: s.status,
            date: new Date(s.createdAt).toLocaleDateString(),
            weight: s.weight || "-",
          }));
 
          setStats({
            totalShipments,
            activeShipments,
            deliveredToday,
            pendingPickup,
            totalCustomers,
            activePartners,
          });
 
          setRecent(shipments);
        }
      } catch {
        /* keep defaults */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
 
  return (
    <DashboardLayout pageTitle="Admin Dashboard">
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded px-4 py-2 mb-4 text-xs text-amber-700">
        <span>
          <strong>Welcome to SMG Logistics Management System</strong>
        </span>
        <a
          href="#"
          className="ml-auto text-[#1a6ab1] font-semibold hover:underline flex-shrink-0"
        >
        </a>
      </div>
 
      {/* Welcome strip */}
      <div className="bg-[#0d2137] rounded border border-[#1a3a5c] p-5 mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-base">
            Good morning, Administrator
          </h2>
          <p className="text-[#7fa8c9] text-xs mt-1">
            Here's your logistics network overview for today.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <div className="text-right">
            <p className="text-[#7fa8c9] text-[10px] uppercase tracking-wider">
              System Status
            </p>
            <p className="text-green-400 text-xs font-bold flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              All Operational
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>
 
      {/* Primary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard
          title="Total Shipments"
          value={stats.totalShipments?.toLocaleString("en-IN")}
          subtitle="All time"
          icon={Package}
          color="navy"
          
        />
        <StatCard
          title="Active Shipments"
          value={stats.activeShipments}
          subtitle="In progress"
          icon={Truck}
          color="blue"
          
        />
        <StatCard
          title="Delivered Today"
          value={stats.deliveredToday}
          subtitle="Successful"
          icon={CheckCircle}
          color="green"
          
        />
        <StatCard
          title="Pending Pickup"
          value={stats.pendingPickup}
          subtitle="Awaiting dispatch"
          icon={Clock}
          color="amber"
          
        />
      </div>
 
      {/* Secondary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers?.toLocaleString("en-IN")}
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Active Partners"
          value={stats.activePartners}
          icon={Truck}
          color="blue"
        />
      </div>
 
      {/* Recent shipments */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-[#0d2137] text-sm">
              Recent Shipments
            </h3>
            <p className="text-slate-400 text-[10px] mt-0.5">
              Latest activity across the network
            </p>
          </div>
          <a
            href="/admin/shipments"
            className="text-xs text-[#1a6ab1] font-semibold hover:underline"
          >
            View All →
          </a>
        </div>
        <DataTable columns={RECENT_COLUMNS} data={recent} loading={loading} />
      </div>
    </DashboardLayout>
  );
}
 
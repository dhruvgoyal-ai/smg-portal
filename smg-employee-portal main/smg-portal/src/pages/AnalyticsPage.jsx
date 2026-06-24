import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { adminAPI, shipmentAPI, customerAPI } from "../services/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
export default function AnalyticsPage() {
  const [shipments, setShipments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const shipmentRes = await shipmentAPI.getAll();
        setShipments(shipmentRes.data.shipments || []);

        const customerRes = await customerAPI.getAll();
        setCustomers(customerRes.data.customers || []);

        const usersRes = await adminAPI.getUsers();

        const partnersData = (usersRes.data.users || []).filter(
          (u) => u.role === "logisticsPartner",
        );
        console.log("Partners:", partners);
        console.log("Partners Length:", partners.length);
        setPartners(partnersData || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  const totalShipments = shipments.length;
  const totalCustomers = customers.length;
  const totalPartners = partners.length;

  const deliveredShipments = shipments.filter(
    (s) => s.status === "Delivered",
  ).length;

  const pendingShipments = shipments.filter(
    (s) => s.status === "Pending",
  ).length;

  const inTransitShipments = shipments.filter(
    (s) => s.status === "In Transit",
  ).length;

  const pickedUpShipments = shipments.filter(
    (s) => s.status === "Picked Up",
  ).length;

  const outForDeliveryShipments = shipments.filter(
    (s) => s.status === "Out For Delivery",
  ).length;
  const chartData = [
    {
      name: "Delivered",
      value: deliveredShipments,
      color: "#22c55e",
    },
    {
      name: "Pending",
      value: pendingShipments,
      color: "#f59e0b",
    },
    {
      name: "In Transit",
      value: inTransitShipments,
      color: "#3b82f6",
    },
    {
      name: "Picked Up",
      value: pickedUpShipments,
      color: "#8b5cf6",
    },
    {
      name: "Out For Delivery",
      value: outForDeliveryShipments,
      color: "#ec4899",
    },
  ].filter((item) => item.value > 0);
  const monthlyData = {};

  shipments.forEach((shipment) => {
    const month = new Date(shipment.createdAt).toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });

    monthlyData[month] = (monthlyData[month] || 0) + 1;
  });
  const activeCustomers = customers.filter((c) => c.status === "active").length;

  const inactiveCustomers = customers.filter(
    (c) => c.status === "inactive",
  ).length;

  const totalCustomerShipments = customers.reduce(
    (sum, c) => sum + c.totalShipments,
    0,
  );

  const avgShipmentPerCustomer =
    totalCustomers > 0
      ? (totalCustomerShipments / totalCustomers).toFixed(1)
      : 0;
  const chartMonthlyData = Object.keys(monthlyData).map((month) => ({
    month,
    shipments: monthlyData[month],
  }));

  const deliveryRate =
    totalShipments > 0
      ? ((deliveredShipments / totalShipments) * 100).toFixed(1)
      : 0;

  const cityCounts = {};

  customers.forEach((customer) => {
    cityCounts[customer.city] = (cityCounts[customer.city] || 0) + 1;
  });

  const cityData = Object.keys(cityCounts).map((city) => ({
    city,
    customers: cityCounts[city],
  }));

  const topCustomers = [...customers]
    .sort((a, b) => b.totalShipments - a.totalShipments)
    .slice(0, 5);

  const customerShipmentData = topCustomers.map((c) => ({
    name: c.name,
    shipments: c.totalShipments,
  }));

  const assignedShipments = shipments.filter((s) => s.assignedPartner).length;

  const avgShipmentsPerPartner =
    totalPartners > 0 ? (assignedShipments / totalPartners).toFixed(1) : 0;
  const activePartners = partners.length;

  const partnerWorkload = partners.map((partner) => ({
    name: partner.name,
    value: shipments.filter(
      (s) =>
        s.assignedPartner &&
        (s.assignedPartner._id === partner._id ||
          s.assignedPartner === partner._id),
    ).length,
  }));

  const partnerStats = partners
    .map((partner) => ({
      ...partner,
      shipmentCount: shipments.filter(
        (s) =>
          s.assignedPartner &&
          (s.assignedPartner._id === partner._id ||
            s.assignedPartner === partner._id),
      ).length,
    }))
    .sort((a, b) => b.shipmentCount - a.shipmentCount);

  const partnerMonthlyData = shipments.reduce((acc, shipment) => {
    const month = new Date(shipment.createdAt).toLocaleString("default", {
      month: "short",
    });

    const existing = acc.find((m) => m.month === month);

    if (existing) {
      existing.shipments++;
    } else {
      acc.push({
        month,
        shipments: 1,
      });
    }

    return acc;
  }, []);
  return (
    <DashboardLayout pageTitle="Analytics & Reports">
      <div>
        <h2 className="text-2xl font-bold mb-4">Shipment Overview</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-semibold">Total Shipments</h3>
          <p className="text-3xl font-bold text-blue-600">{totalShipments}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-semibold">Delivered</h3>
          <p className="text-2xl font-bold text-blue-600">
            {deliveredShipments}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-semibold">Pending</h3>
          <p className="text-3xl font-bold text-blue-600">{pendingShipments}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-semibold">In Transit</h3>
          <p className="text-2xl font-bold text-blue-600">
            {inTransitShipments}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-semibold">Picked Up</h3>
          <p className="text-2xl font-bold text-blue-600">
            {pickedUpShipments}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <h3 className="font-semibold">Out For Delivery</h3>
          <p className="text-2xl font-bold text-blue-600">
            {outForDeliveryShipments}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pie Chart */}
        <div className="card p-4">
          <h3 className="font-bold text-slate-800 mb-4">
            Shipment Status Breakdown
          </h3>
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <h3 className="font-semibold">Delivery Rate</h3>
            <p className="text-3xl font-bold text-green-600">{deliveryRate}%</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-5">
            <h3>Avg Shipments / Customer</h3>
            <p className="text-3xl font-bold">{avgShipmentPerCustomer}</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Trend Chart */}
        <div className="card p-4">
          <h3 className="font-bold text-slate-800 mb-4">
            Monthly Shipment Trend
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="shipments"
                stroke="#1a6ab1"
                fill="#7dd3fc"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Customers Overview</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-5">
          <h3>Total Customers</h3>
          <p className="text-3xl font-bold text-blue-600">{totalCustomers}</p>
        </div>

        <div className="card p-5">
          <h3>Active Customers</h3>
          <p className="text-3xl font-bold text-green-600">{activeCustomers}</p>
        </div>

        <div className="card p-5">
          <h3>Inactive Customers</h3>
          <p className="text-3xl font-bold text-red-500">{inactiveCustomers}</p>
        </div>

        <div className="card p-5">
          <h3>Avg Shipments</h3>
          <p className="text-3xl font-bold text-purple-600">
            {avgShipmentPerCustomer}
          </p>
        </div>
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card p-4">
          <h3 className="font-bold mb-4">Customers by City</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="customers" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-4">
          <h3 className="font-bold mb-4">Top Customers</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={customerShipmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="shipments" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Partners Overview</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-5">
          <h3>Total Partners</h3>
          <p className="text-3xl font-bold">{totalPartners}</p>
        </div>

        <div className="card p-5">
          <h3>Active Partners</h3>
          <p className="text-3xl font-bold text-green-600">{activePartners}</p>
        </div>

        <div className="card p-5">
          <h3>Assigned Shipments</h3>
          <p className="text-3xl font-bold text-blue-600">
            {assignedShipments}
          </p>
        </div>

        <div className="card p-5">
          <h3>Avg Shipments / Partner</h3>
          <p className="text-3xl font-bold text-purple-600">
            {avgShipmentsPerPartner}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-4">
          <h3 className="font-bold mb-4">Partner Workload Distribution</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={partnerWorkload}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4">
          <h3 className="font-bold mb-4">Partner Shipment Trend</h3>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={partnerMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="shipments"
                stroke="#2563eb"
                fill="#93c5fd"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>{" "}
    </DashboardLayout>
  );
}

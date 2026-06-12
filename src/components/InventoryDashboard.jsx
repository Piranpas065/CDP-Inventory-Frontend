import { useState } from "react";
import {
  LayoutDashboard, Package, Tag, Users, CreditCard,
  ShoppingCart, Truck, BarChart2, Settings, HelpCircle,
  LogOut, Bell, Search, AlertTriangle, XCircle,
  ChevronRight, Store, ArrowUpRight, ArrowDownRight,
  MoreHorizontal, RefreshCw, Filter, GitMerge,
  ClipboardList, RotateCcw, Layers, TrendingDown,
  Building2, Boxes, BadgeAlert, Wallet
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";
import BranchesPage from "./BranchesPage";
import ProductsPage from "./ProductsPage";
import CategoriesPage from "./CategoriesPage";
import BrandsPage from "./BrandsPage";
import SuppliersPage from "./SuppliersPage";
import UnitsPage from "./UnitsPage";
import PurchaseOrdersPage from "./PurchaseOrdersPage";
import GRNPage from "./GrnsPage";
import PurchaseReturnsPage from "./PurchaseReturnsPage";
import PaymentsPage from "./PaymentsPage";
import StockLedgerPage from "./StockLedgerPage";
import StockTransfersPage from "./StockTranfersPage";


// ── Mock Data ──────────────────────────────────────────────

const poTrendData = [
  { day: "Mon", PO: 4, GRN: 3 },
  { day: "Tue", PO: 7, GRN: 5 },
  { day: "Wed", PO: 5, GRN: 6 },
  { day: "Thu", PO: 9, GRN: 7 },
  { day: "Fri", PO: 6, GRN: 4 },
  { day: "Sat", PO: 3, GRN: 2 },
  { day: "Sun", PO: 2, GRN: 1 },
];

const stockByCategory = [
  { name: "Electronics", value: 320 },
  { name: "Clothing", value: 210 },
  { name: "Footwear", value: 180 },
  { name: "Accessories", value: 150 },
  { name: "Other", value: 90 },
];
const PIE_COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"];

const reorderAlerts = [
  { name: "Wireless Headphones", branch: "Main Branch", current: 8, min: 20, unit: "Pcs" },
  { name: "Cotton T-Shirt (L)", branch: "Branch 02", current: 5, min: 15, unit: "Pcs" },
  { name: "Running Shoes (42)", branch: "Branch 03", current: 3, min: 10, unit: "Pcs" },
  { name: "Leather Wallet", branch: "Main Branch", current: 6, min: 12, unit: "Pcs" },
];

const expiryAlerts = [
  { name: "Vitamin C Tablets", batch: "BATCH-001", expiry: "Jun 10, 2026", qty: 50, branch: "Main Branch" },
  { name: "Hand Sanitizer 500ml", batch: "BATCH-004", expiry: "Jun 18, 2026", qty: 30, branch: "Branch 02" },
  { name: "Face Moisturizer", batch: "BATCH-007", expiry: "Jun 25, 2026", qty: 20, branch: "Branch 03" },
];

const recentPOs = [
  { po: "PO-2026-001", supplier: "ABC Traders", branch: "Main Branch", amount: "Rs. 45,000", status: "approved" },
  { po: "PO-2026-002", supplier: "XYZ Supplies", branch: "Branch 02", amount: "Rs. 28,500", status: "pending" },
  { po: "PO-2026-003", supplier: "Global Imports", branch: "Branch 03", amount: "Rs. 72,000", status: "received" },
  { po: "PO-2026-004", supplier: "Local Mart", branch: "Main Branch", amount: "Rs. 15,000", status: "draft" },
];

const activityLog = [
  { user: "Rahul", action: "posted GRN-2026-018 for PO-2026-001 — 45 items received at Main Branch.", time: "2:45 PM", initials: "RA" },
  { user: "Priya", action: "created PRN-2026-005 for damaged goods returned to XYZ Supplies.", time: "2:10 PM", initials: "PR" },
  { user: "Arun", action: "approved Stock Transfer ST-2026-009 from Main Branch to Branch 02.", time: "1:30 PM", initials: "AR" },
  { user: "Meena", action: "completed Stock Take for Branch 03 — variance of 3 units found.", time: "12:00 PM", initials: "ME" },
];

const navGroups = [
  {
    label: "DISCOVER",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
      { icon: Building2, label: "Branches", id: "branches" },
    ],
  },
  {
    label: "INVENTORY",
    items: [
      { icon: Package, label: "Products", id: "products" },
      { icon: Tag, label: "Categories", id: "categories" },
      { icon: Layers, label: "Brands", id: "brands" },
      { icon: Users, label: "Suppliers", id: "suppliers" },
      { icon: Boxes, label: "Units", id: "units" },
    ],
  },
  {
    label: "PURCHASING",
    items: [
      { icon: ClipboardList, label: "Purchase Orders", id: "po" },
      { icon: Truck, label: "GRN", id: "grn" },
      { icon: RotateCcw, label: "Purchase Returns", id: "prn" },
      { icon: CreditCard, label: "Payments", id: "payments" },
    ],
  },
  {
    label: "STOCK",
    items: [
      { icon: BarChart2, label: "Stock Ledger", id: "stock_ledger" },
      { icon: GitMerge, label: "Stock Transfers", id: "stock_transfers" },
      { icon: ClipboardList, label: "Stock Takes", id: "stock_takes" },
      { icon: BadgeAlert, label: "Reorder Levels", id: "reorder" },
      { icon: AlertTriangle, label: "Expiry Records", id: "expiry" },
      { icon: XCircle, label: "Damage Records", id: "damage" },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      { icon: Settings, label: "Settings", id: "settings" },
      { icon: HelpCircle, label: "Help", id: "help" },
    ],
  },
];

const visibleNavGroups = navGroups;


const statCards = [
  { label: "Total Products", value: "1,284", change: "+12", up: true, icon: Package, iconBg: "bg-blue-100", iconColor: "text-blue-600", sub: "across all branches" },
  { label: "Pending POs", value: "23", change: "+5", up: true, icon: ClipboardList, iconBg: "bg-amber-100", iconColor: "text-amber-600", sub: "awaiting approval" },
  { label: "Low Stock Items", value: "47", change: "-3", up: false, icon: AlertTriangle, iconBg: "bg-orange-100", iconColor: "text-orange-600", sub: "below reorder level" },
  { label: "Expiring Soon", value: "18", change: "+2", up: true, icon: BadgeAlert, iconBg: "bg-red-100", iconColor: "text-red-600", sub: "within 30 days" },
  { label: "Active Suppliers", value: "56", change: "+1", up: true, icon: Users, iconBg: "bg-green-100", iconColor: "text-green-600", sub: "verified suppliers" },
  { label: "Stock Transfers", value: "9", change: "3 in transit", up: true, icon: GitMerge, iconBg: "bg-purple-100", iconColor: "text-purple-600", sub: "this week" },
  { label: "Damage Records", value: "12", change: "-2", up: false, icon: XCircle, iconBg: "bg-rose-100", iconColor: "text-rose-600", sub: "pending write-off" },
  { label: "Total Payments", value: "Rs. 2.4M", change: "+8%", up: true, icon: Wallet, iconBg: "bg-cyan-100", iconColor: "text-cyan-600", sub: "this month" },
];

const statusConfig = {
  draft:     { label: "Draft",     cls: "bg-gray-100 text-gray-600" },
  pending:   { label: "Pending",   cls: "bg-amber-100 text-amber-700" },
  approved:  { label: "Approved",  cls: "bg-blue-100 text-blue-700" },
  received:  { label: "Received",  cls: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", cls: "bg-red-100 text-red-600" },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.draft;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
};

// ── Component ──────────────────────────────────────────────

export default function InventoryDashboard({ activePage = "dashboard", onNavigate }) {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState(["DISCOVER", "INVENTORY", "PURCHASING", "STOCK", "SETTINGS"]);

  const toggleGroup = (label) => {
    setExpandedGroups(prev =>
      prev.includes(label) ? prev.filter(g => g !== label) : [...prev, label]
    );
  };

  const handleNavClick = (id) => {
    setActive(id);
    onNavigate?.(id);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" style={{ fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside
        className="flex flex-col justify-between bg-slate-900 text-slate-300 transition-all duration-300 flex-shrink-0"
        style={{ width: sidebarOpen ? 240 : 64 }}
      >
        {/* Logo */}
        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-700/60 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Boxes size={16} className="text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <span className="text-white font-bold text-base tracking-tight block leading-tight">CDP Inventory</span>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav className="nav-scrollbar px-2 pt-3 overflow-y-auto flex-1 space-y-1 pb-4">
            {visibleNavGroups.map((group) => (
              <div key={group.label} className="mb-1">
                {sidebarOpen && (
                  <button
                    onClick={() => toggleGroup(group.label)}
                    className="w-full flex items-center justify-between px-2 py-1 mb-1"
                  >
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{group.label}</span>
                    <ChevronRight
                      size={12}
                      className={`text-slate-600 transition-transform ${expandedGroups.includes(group.label) ? "rotate-90" : ""}`}
                    />
                  </button>
                )}
                {(expandedGroups.includes(group.label) || !sidebarOpen) && (
                  <ul className="space-y-0.5">
                    {group.items.map(({ icon: Icon, label, id }) => (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => handleNavClick(id)}
                          title={!sidebarOpen ? label : ""}
                          className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-all
                            ${active === id
                              ? "bg-blue-600 text-white"
                              : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`}
                        >
                          <Icon size={17} className="flex-shrink-0" />
                          {sidebarOpen && <span className="truncate">{label}</span>}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="px-2 pb-4 flex-shrink-0 border-t border-slate-700/60 pt-3">
          <button className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <LogOut size={17} className="flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="min-h-[72px] bg-white border-b border-gray-200 flex items-center justify-between px-5 py-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="px-4 py-2">
              <h1 className="text-base font-bold text-slate-800 leading-tight">Dashboard</h1>
              <p className="text-2xl font-bold text-slate-600">Welcome back, Super Admin</p>
            </div>
          </div>


          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, PO, GRN..."
                className="pl-9 pr-4 py-1.5 text-sm bg-gray-100 border border-gray-200 rounded-lg w-60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold">
                SA
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-semibold text-slate-800 leading-tight">Super Admin</p>
                <p className="text-xs text-slate-400">Main Branch</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {activePage === "branches" ? (
            <BranchesPage embedded />
          ) : activePage === "products" ? (
            <ProductsPage embedded />
          ) : activePage === "categories" ? (
            <CategoriesPage embedded />
          ) : activePage === "brands" ? (
            <BrandsPage embedded />
          ) : activePage === "suppliers" ? (
            <SuppliersPage embedded />
          ) : activePage === "units" ? (
            <UnitsPage embedded />
          ) : activePage === "po" ? (
            <PurchaseOrdersPage embedded />
          ) : activePage === "grn" ? (
            <GRNPage embedded />
          ) : activePage === "prn" ? (
            <PurchaseReturnsPage embedded />
          ) : activePage === "payments" ? (
            <PaymentsPage embedded />
          ) : activePage === "stock_ledger" ? (
            <StockLedgerPage embedded />
          ) : activePage === "stock_transfers" ? (
            <StockTransfersPage embedded />
          ) : (
            <div className="p-5">

          {/* Stat Cards — 4 col */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                      <Icon size={17} className={card.iconColor} />
                    </div>
                    <button className="text-gray-300 hover:text-gray-500">
                      <MoreHorizontal size={15} />
                    </button>
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-0.5">{card.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                  <div className={`flex items-center gap-1 mt-0.5 text-sm font-medium ${card.up ? "text-green-700" : "text-red-600"}`}>
                    {card.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    <span>{card.change}</span>
                    <span className="text-slate-600 font-normal ml-1">{card.sub}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Row 2 — Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
            {/* PO vs GRN Trend */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h2 className="text-sm font-semibold text-slate-700">PO vs GRN — This Week</h2>
                  <p className="text-xs text-gray-400">Purchase Orders vs Goods Received</p>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">Weekly</span>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={poTrendData} margin={{ top: 10, right: 0, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="poGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="grnGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                  <Area type="monotone" dataKey="PO" stroke="#2563eb" strokeWidth={2} fill="url(#poGrad)" dot={false} activeDot={{ r: 4 }} />
                  <Area type="monotone" dataKey="GRN" stroke="#10b981" strokeWidth={2} fill="url(#grnGrad)" dot={false} activeDot={{ r: 4 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Stock by Category */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-700">Stock by Category</h2>
                  <p className="text-xs text-gray-400">Total items distribution</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <PieChart width={110} height={110}>
                  <Pie data={stockByCategory} cx={50} cy={50} innerRadius={30} outerRadius={50} dataKey="value" strokeWidth={0}>
                    {stockByCategory.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                </PieChart>
                <div className="flex-1 space-y-1.5">
                  {stockByCategory.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                        <span className="text-xs text-gray-500 truncate max-w-[80px]">{item.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Row 3 — Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

            {/* Reorder Alerts */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-700">⚠️ Reorder Alerts</h2>
                  <p className="text-xs text-gray-400">Items below minimum stock level</p>
                </div>
                <button className="text-xs text-blue-600 hover:underline flex items-center gap-0.5">
                  View All <ChevronRight size={12} />
                </button>
              </div>
              <div className="space-y-3">
                {reorderAlerts.map((item) => {
                  const pct = Math.round((item.current / item.min) * 100);
                  return (
                    <div key={item.name} className="p-3 rounded-xl bg-orange-50 border border-orange-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-slate-700 truncate max-w-[160px]">{item.name}</span>
                        <span className="text-xs text-orange-600 font-medium">{item.current}/{item.min} {item.unit}</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-1.5">{item.branch}</p>
                      <div className="h-1.5 bg-orange-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-orange-400" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Expiry Alerts */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-700">🗓️ Expiring Soon</h2>
                  <p className="text-xs text-gray-400">Items expiring within 30 days</p>
                </div>
                <button className="text-xs text-blue-600 hover:underline flex items-center gap-0.5">
                  View All <ChevronRight size={12} />
                </button>
              </div>
              <div className="space-y-3">
                {expiryAlerts.map((item) => (
                  <div key={item.batch} className="p-3 rounded-xl bg-red-50 border border-red-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-700 truncate max-w-[160px]">{item.name}</span>
                      <span className="text-xs text-red-600 font-medium">{item.qty} Pcs</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{item.branch} · {item.batch}</span>
                      <span className="text-xs font-semibold text-red-500">{item.expiry}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4 — PO Table + Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Recent Purchase Orders */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div>
                  <h2 className="text-sm font-semibold text-slate-700">Recent Purchase Orders</h2>
                  <p className="text-xs text-gray-400">Latest POs across all branches</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                    <Filter size={12} /> Filter
                  </button>
                </div>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">PO Number</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Supplier</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Branch</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Amount</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPOs.map((po, i) => (
                    <tr key={po.po} className={`border-t border-gray-50 hover:bg-blue-50/30 transition ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                      <td className="px-5 py-3 text-xs font-mono text-blue-600 font-semibold">{po.po}</td>
                      <td className="px-4 py-3 text-xs font-medium text-slate-700">{po.supplier}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{po.branch}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-700">{po.amount}</td>
                      <td className="px-4 py-3"><StatusBadge status={po.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-700">Recent Activity</h2>
                  <p className="text-xs text-gray-400">Live system log</p>
                </div>
                <button className="text-xs text-blue-600 hover:underline flex items-center gap-0.5">
                  View All <ChevronRight size={12} />
                </button>
              </div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Today</p>
              <div className="space-y-4">
                {activityLog.map((log, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {log.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        <span className="font-semibold text-slate-800">{log.user}</span> {log.action}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

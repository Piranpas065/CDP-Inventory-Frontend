import { useState } from "react";
import {
  AlertTriangle, Plus, Eye, Edit, Trash2, Search,
  ChevronLeft, ChevronRight, XCircle, CheckCircle, Clock,
  Calendar, Building2, User, ShieldAlert, Sparkles
} from "lucide-react";
import {
  Button, Modal, FormField, CheckboxField,
  Badge, ActionButtons, SearchBar, Pagination
} from "./common/UIComponents";

// ── Mock Databases ──────────────────────────────────────────
const branches = ["Main Branch", "Branch 02", "Branch 03", "Kandy Branch", "Galle Branch"];

const flatProductList = [
  { product_name: "Wireless Bluetooth Headphones", sku: "SKU-001-BLK", variant: "Black", unit: "Pcs" },
  { product_name: "Wireless Bluetooth Headphones", sku: "SKU-001-WHT", variant: "White", unit: "Pcs" },
  { product_name: "Cotton Round Neck T-Shirt", sku: "SKU-002-LG", variant: "L", unit: "Pcs" },
  { product_name: "Cotton Round Neck T-Shirt", sku: "SKU-002-SM", variant: "S", unit: "Pcs" },
  { product_name: "Running Sneakers", sku: "SKU-003-42", variant: "42", unit: "Pcs" },
  { product_name: "Leather Wallet", sku: "SKU-004-BRN", variant: "Brown", unit: "Pcs" },
];

const initialExpiryRecords = [
  {
    id: 1,
    product_name: "Wireless Bluetooth Headphones",
    sku: "SKU-001-BLK",
    variant: "Black",
    unit: "Pcs",
    branch_name: "Main Branch",
    batch_number: "BATCH-2026-001",
    expiry_date: "2026-06-10", // past date (expired)
    quantity: 50,
    status: "expired",
    is_active: true,
  },
  {
    id: 2,
    product_name: "Cotton Round Neck T-Shirt",
    sku: "SKU-002-LG",
    variant: "L",
    unit: "Pcs",
    branch_name: "Branch 02",
    batch_number: "BATCH-2026-002",
    expiry_date: "2026-06-28", // within 30 days (expiring soon)
    quantity: 30,
    status: "active",
    is_active: true,
  },
  {
    id: 3,
    product_name: "Running Sneakers",
    sku: "SKU-003-42",
    variant: "42",
    unit: "Pcs",
    branch_name: "Branch 03",
    batch_number: "BATCH-2026-003",
    expiry_date: "2026-05-15", // past date, but disposed
    quantity: 10,
    status: "disposed",
    is_active: false,
  },
  {
    id: 4,
    product_name: "Leather Wallet",
    sku: "SKU-004-BRN",
    variant: "Brown",
    unit: "Pcs",
    branch_name: "Main Branch",
    batch_number: "BATCH-2026-004",
    expiry_date: "2026-10-15", // safe (healthy)
    quantity: 20,
    status: "active",
    is_active: true,
  }
];

const statusConfig = {
  active:   { label: "Active",   cls: "bg-green-100 text-green-700" },
  expired:  { label: "Expired",  cls: "bg-red-100 text-red-700 font-semibold" },
  disposed: { label: "Disposed", cls: "bg-slate-100 text-slate-600" },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.active;
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>{cfg.label}</span>;
};

export default function ExpiryRecordsPage({ embedded }) {
  const [records, setRecords] = useState(initialExpiryRecords);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const [form, setForm] = useState({
    product_name: "",
    sku: "",
    variant: "",
    unit: "Pcs",
    branch_name: "Main Branch",
    batch_number: "",
    expiry_date: "",
    quantity: 0,
    status: "active",
    is_active: true,
  });

  const getExpiryAlert = (record) => {
    if (record.status === "disposed") {
      return { label: "Disposed", cls: "bg-slate-50 text-slate-500 border border-slate-200", isExpired: false, isExpiringSoon: false };
    }
    const today = new Date("2026-06-12");
    const expDate = new Date(record.expiry_date);
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: "Expired", cls: "bg-red-50 text-red-600 border border-red-200 font-semibold", isExpired: true, isExpiringSoon: false };
    } else if (diffDays <= 30) {
      return { label: "Expiring Soon", cls: "bg-amber-50 text-amber-600 border border-amber-200 font-semibold", isExpired: false, isExpiringSoon: true };
    }
    return { label: "Healthy", cls: "bg-green-50 text-green-700 border border-green-200", isExpired: false, isExpiringSoon: false };
  };

  // Stats
  const totalRecords = records.length;
  const expiredCount = records.filter(r => getExpiryAlert(r).isExpired).length;
  const expiringSoonCount = records.filter(r => getExpiryAlert(r).isExpiringSoon).length;
  const disposedCount = records.filter(r => r.status === "disposed").length;

  // Filter & Search
  const filtered = records.filter(r => {
    const matchesSearch =
      r.product_name.toLowerCase().includes(search.toLowerCase()) ||
      r.sku.toLowerCase().includes(search.toLowerCase()) ||
      r.branch_name.toLowerCase().includes(search.toLowerCase()) ||
      r.batch_number.toLowerCase().includes(search.toLowerCase());

    const alertInfo = getExpiryAlert(r);
    let matchesStatus = true;
    if (filterStatus === "active") {
      matchesStatus = r.status === "active";
    } else if (filterStatus === "expired") {
      matchesStatus = alertInfo.isExpired;
    } else if (filterStatus === "soon") {
      matchesStatus = alertInfo.isExpiringSoon;
    } else if (filterStatus === "disposed") {
      matchesStatus = r.status === "disposed";
    }

    return matchesSearch && matchesStatus;
  });

  const total = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Actions
  const openAdd = () => {
    setEditItem(null);
    const defaultProduct = flatProductList[0];
    setForm({
      product_name: defaultProduct.product_name,
      sku: defaultProduct.sku,
      variant: defaultProduct.variant,
      unit: defaultProduct.unit,
      branch_name: "Main Branch",
      batch_number: `BAT-${Date.now().toString().slice(-6)}`,
      expiry_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 60 days from now
      quantity: 10,
      status: "active",
      is_active: true,
    });
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditItem(r);
    setForm({
      product_name: r.product_name,
      sku: r.sku,
      variant: r.variant,
      unit: r.unit,
      branch_name: r.branch_name,
      batch_number: r.batch_number,
      expiry_date: r.expiry_date,
      quantity: r.quantity,
      status: r.status,
      is_active: r.is_active,
    });
    setShowModal(true);
  };

  const handleProductChange = (skuVal) => {
    const selectedProd = flatProductList.find(p => p.sku === skuVal);
    if (!selectedProd) return;
    setForm(f => ({
      ...f,
      product_name: selectedProd.product_name,
      sku: selectedProd.sku,
      variant: selectedProd.variant,
      unit: selectedProd.unit,
    }));
  };

  const handleSave = () => {
    if (!form.sku || !form.branch_name || !form.expiry_date) return;
    if (parseFloat(form.quantity) < 0) {
      alert("Quantity must be a positive number.");
      return;
    }

    const payload = {
      ...form,
      quantity: parseFloat(form.quantity) || 0,
    };

    if (editItem) {
      setRecords(prev => prev.map(r => r.id === editItem.id ? { ...r, ...payload } : r));
    } else {
      setRecords(prev => [...prev, { ...payload, id: Date.now() }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this expiry record?")) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className={embedded ? "p-5" : "p-5 bg-gray-50 min-h-screen"}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Expiry Records</h1>
          <p className="text-sm text-gray-400 mt-0.5">Track batch expiry dates and quantities per branch</p>
        </div>
        <Button onClick={openAdd} icon={Plus}>New Expiry Record</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Batches", value: totalRecords, icon: Calendar, bg: "bg-blue-50", color: "text-blue-600" },
          { label: "Expired Batches", value: expiredCount, icon: ShieldAlert, bg: "bg-rose-50", color: "text-rose-600" },
          { label: "Expiring Soon", value: expiringSoonCount, icon: AlertTriangle, bg: "bg-amber-50", color: "text-amber-600" },
          { label: "Disposed Batches", value: disposedCount, icon: XCircle, bg: "bg-slate-50", color: "text-slate-500" },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}><c.icon size={18} className={c.color} /></div>
            <div>
              <p className="text-xs text-gray-400">{c.label}</p>
              <p className="text-xl font-bold text-slate-800">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mb-4">
        <SearchBar
          search={search}
          setSearch={val => { setSearch(val); setPage(1); }}
          placeholder="Search product, SKU, batch number, branch..."
          filterOptions={[
            { label: "All", value: "all" },
            { label: "Active", value: "active" },
            { label: "Expired", value: "expired" },
            { label: "Expiring Soon", value: "soon" },
            { label: "Disposed", value: "disposed" },
          ]}
          selectedFilter={filterStatus}
          setSelectedFilter={val => { setFilterStatus(val); setPage(1); }}
        />
      </div>

      <p className="text-sm text-slate-600 mb-4">Showing {filtered.length} batch records</p>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Product</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">SKU / Variant</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Branch</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Batch Number</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Expiry Date</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Qty</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Alert State</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r, i) => {
              const alertInfo = getExpiryAlert(r);
              return (
                <tr key={r.id} className={`border-t border-gray-50 hover:bg-blue-50/30 transition ${i % 2 !== 0 ? "bg-gray-50/30" : ""}`}>
                  <td className="px-4 py-3 text-sm font-medium text-slate-700 text-left">{r.product_name}</td>
                  <td className="px-4 py-3 text-left">
                    <span className="text-xs font-mono text-blue-600 block font-semibold">{r.sku}</span>
                    <span className="text-xs text-gray-400">{r.variant} ({r.unit})</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-black-900 text-left">{r.branch_name}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-600 text-left font-semibold">{r.batch_number || "—"}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 text-left">{r.expiry_date}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-700 text-center">{r.quantity}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${alertInfo.cls}`}>
                      {alertInfo.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <ActionButtons
                        onView={() => setViewItem(r)}
                        onEdit={() => openEdit(r)}
                        onDelete={() => handleDelete(r.id)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
            {paged.length === 0 && <tr><td colSpan={9} className="px-5 py-10 text-center text-sm text-gray-400">No expiry records found.</td></tr>}
          </tbody>
        </table>

        <Pagination
          currentPage={page}
          totalPages={total}
          setCurrentPage={setPage}
          showingText={`Showing ${Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–${Math.min(page * PER_PAGE, filtered.length)} of ${filtered.length}`}
        />
      </div>

      {/* View Modal */}
      {viewItem && (
        <Modal title="Expiry Record Details" onClose={() => setViewItem(null)}>
          <div className="space-y-4">
            <div className={`p-4 rounded-xl flex items-center justify-between ${getExpiryAlert(viewItem).isExpired ? "bg-rose-50/70 border border-rose-100" : getExpiryAlert(viewItem).isExpiringSoon ? "bg-amber-50/70 border border-amber-100" : "bg-green-50/70 border border-green-100"}`}>
              <div>
                <h3 className="text-base font-bold text-slate-800 leading-tight">{viewItem.product_name}</h3>
                <span className="text-xs font-mono text-blue-600 block mt-0.5">{viewItem.sku} &middot; {viewItem.variant}</span>
              </div>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${getExpiryAlert(viewItem).cls}`}>
                {getExpiryAlert(viewItem).label}
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { label: "Branch Name", value: viewItem.branch_name },
                { label: "Batch Number", value: <span className="font-mono text-slate-700 font-semibold">{viewItem.batch_number || "—"}</span> },
                { label: "Expiry Date", value: viewItem.expiry_date },
                { label: "Quantity", value: `${viewItem.quantity} ${viewItem.unit}` },
                { label: "Status Badge", value: <StatusBadge status={viewItem.status} /> },
                { label: "Record Active", value: <Badge active={viewItem.is_active} /> },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-50 last:border-0 items-center text-sm">
                  <span className="text-slate-400 font-medium">{label}</span>
                  <span className="font-semibold text-slate-800">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <Modal title={editItem ? "Edit Expiry Record" : "New Expiry Record"} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 font-sans">Product Variant <span className="text-red-400">*</span></label>
              <select
                value={form.sku}
                onChange={e => handleProductChange(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-sans"
              >
                {flatProductList.map(p => (
                  <option key={p.sku} value={p.sku}>
                    {p.product_name} ({p.variant}) — {p.sku}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 font-sans">Branch <span className="text-red-400">*</span></label>
              <select
                value={form.branch_name}
                onChange={e => setForm(f => ({ ...f, branch_name: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-sans"
              >
                {branches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Batch Number"
                type="text"
                value={form.batch_number}
                onChange={e => setForm(f => ({ ...f, batch_number: e.target.value }))}
              />
              <FormField
                label="Expiry Date"
                type="date"
                value={form.expiry_date}
                onChange={e => setForm(f => ({ ...f, expiry_date: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Quantity"
                type="number"
                value={form.quantity}
                onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                required
              />
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 font-sans">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-sans"
                >
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="disposed">Disposed</option>
                </select>
              </div>
            </div>

            <div className="py-2">
              <CheckboxField
                id="is_active_batch"
                label="Record Active (Enable tracking and monitoring for this batch)"
                checked={form.is_active}
                onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition focus:outline-none shadow-sm shadow-blue-200"
              >
                Save Record
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

import { useState } from "react";
import {
  XCircle, Plus, Eye, Edit, Trash2, Search,
  ChevronLeft, ChevronRight, CheckCircle, Clock,
  Calendar, Building2, User, AlertTriangle
} from "lucide-react";
import {
  Button, Modal, FormField, TextArea, CheckboxField,
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

const initialDamageRecords = [
  {
    id: 1,
    damage_number: "DMG-2026-001",
    product_name: "Wireless Bluetooth Headphones",
    sku: "SKU-001-BLK",
    variant: "Black",
    unit: "Pcs",
    branch_name: "Main Branch",
    quantity: 5,
    reason: "Water damage during transit",
    status: "written_off",
    reported_by: "Rahul",
    approved_by: "Arun",
    damage_date: "2026-06-08",
    is_active: true,
  },
  {
    id: 2,
    damage_number: "DMG-2026-002",
    product_name: "Cotton Round Neck T-Shirt",
    sku: "SKU-002-LG",
    variant: "L",
    unit: "Pcs",
    branch_name: "Branch 02",
    quantity: 12,
    reason: "Torn stitching found in batch",
    status: "reported",
    reported_by: "Priya",
    approved_by: "—",
    damage_date: "2026-06-11",
    is_active: true,
  },
  {
    id: 3,
    damage_number: "DMG-2026-003",
    product_name: "Running Sneakers",
    sku: "SKU-003-42",
    variant: "42",
    unit: "Pcs",
    branch_name: "Branch 03",
    quantity: 2,
    reason: "Discolored soles",
    status: "approved",
    reported_by: "Rahul",
    approved_by: "Super Admin",
    damage_date: "2026-06-12",
    is_active: true,
  }
];

const statusConfig = {
  reported:    { label: "Reported",    cls: "bg-amber-100 text-amber-700" },
  approved:    { label: "Approved",    cls: "bg-blue-100 text-blue-700" },
  written_off: { label: "Written Off", cls: "bg-green-100 text-green-700" },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.reported;
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>{cfg.label}</span>;
};

export default function DamagedRecordsPage({ embedded }) {
  const [records, setRecords] = useState(initialDamageRecords);
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
    quantity: 0,
    reason: "",
    damage_date: "",
    status: "reported",
    is_active: true,
  });

  // Stats
  const totalIncidents = records.length;
  const reportedCount = records.filter(r => r.status === "reported").length;
  const approvedCount = records.filter(r => r.status === "approved").length;
  const writtenOffCount = records.filter(r => r.status === "written_off").length;

  // Filter & Search
  const filtered = records.filter(r => {
    const matchesSearch =
      r.product_name.toLowerCase().includes(search.toLowerCase()) ||
      r.sku.toLowerCase().includes(search.toLowerCase()) ||
      r.branch_name.toLowerCase().includes(search.toLowerCase()) ||
      r.damage_number.toLowerCase().includes(search.toLowerCase()) ||
      r.reason.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" ? true : r.status === filterStatus;
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
      quantity: 1,
      reason: "",
      damage_date: new Date().toISOString().split("T")[0],
      status: "reported",
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
      quantity: r.quantity,
      reason: r.reason,
      damage_date: r.damage_date,
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
    if (!form.sku || !form.branch_name || !form.damage_date) return;
    if (parseFloat(form.quantity) <= 0) {
      alert("Quantity must be a positive number.");
      return;
    }

    const payload = {
      ...form,
      quantity: parseFloat(form.quantity) || 0,
    };

    if (editItem) {
      setRecords(prev => prev.map(r => r.id === editItem.id ? {
        ...r,
        ...payload,
        approved_by: payload.status === "approved" || payload.status === "written_off" ? "Super Admin" : r.approved_by
      } : r));
    } else {
      setRecords(prev => [
        {
          ...payload,
          id: Date.now(),
          damage_number: `DMG-2026-00${prev.length + 1}`,
          reported_by: "Super Admin",
          approved_by: payload.status === "approved" || payload.status === "written_off" ? "Super Admin" : "—"
        },
        ...prev
      ]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this damage record?")) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleStatusChangeAction = (record, newStatus) => {
    setRecords(prev => prev.map(r => r.id === record.id ? {
      ...r,
      status: newStatus,
      approved_by: newStatus === "approved" || newStatus === "written_off" ? "Super Admin" : r.approved_by
    } : r));
    setViewItem(null);
  };

  return (
    <div className={embedded ? "p-5" : "p-5 bg-gray-50 min-h-screen"}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Damage Records</h1>
          <p className="text-sm text-gray-400 mt-0.5">Track damaged inventory, write-offs, and approvals</p>
        </div>
        <Button onClick={openAdd} icon={Plus}>New Damage Record</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Incidents", value: totalIncidents, icon: AlertTriangle, bg: "bg-blue-50", color: "text-blue-600" },
          { label: "Reported Damages", value: reportedCount, icon: Clock, bg: "bg-amber-50", color: "text-amber-600" },
          { label: "Approved Records", value: approvedCount, icon: CheckCircle, bg: "bg-blue-50", color: "text-blue-600" },
          { label: "Written Off Items", value: writtenOffCount, icon: XCircle, bg: "bg-green-50", color: "text-green-600" },
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
          placeholder="Search by product, SKU, damage number, reason..."
          filterOptions={[
            { label: "All", value: "all" },
            { label: "Reported", value: "reported" },
            { label: "Approved", value: "approved" },
            { label: "Written Off", value: "written_off" },
          ]}
          selectedFilter={filterStatus}
          setSelectedFilter={val => { setFilterStatus(val); setPage(1); }}
        />
      </div>

      <p className="text-sm text-slate-600 mb-4">Showing {filtered.length} damage reports</p>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Damage No</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Product</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">SKU / Variant</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Branch</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Date</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Quantity</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Reported By</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Approved By</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r, i) => (
              <tr key={r.id} className={`border-t border-gray-50 hover:bg-blue-50/30 transition ${i % 2 !== 0 ? "bg-gray-50/30" : ""}`}>
                <td className="px-4 py-3 text-xs font-mono text-blue-600 font-semibold text-left">{r.damage_number}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-700 text-left">{r.product_name}</td>
                <td className="px-4 py-3 text-left">
                  <span className="text-xs font-mono text-blue-600 block font-semibold">{r.sku}</span>
                  <span className="text-xs text-gray-400">{r.variant} ({r.unit})</span>
                </td>
                <td className="px-4 py-3 text-xs text-black-900 text-left">{r.branch_name}</td>
                <td className="px-4 py-3 text-xs text-slate-500 text-left">{r.damage_date}</td>
                <td className="px-4 py-3 text-sm font-bold text-slate-700 text-center">{r.quantity}</td>
                <td className="px-4 py-3 text-xs text-slate-600 text-left">{r.reported_by}</td>
                <td className="px-4 py-3 text-xs text-slate-600 text-left">{r.approved_by}</td>
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
            ))}
            {paged.length === 0 && <tr><td colSpan={10} className="px-5 py-10 text-center text-sm text-gray-400">No damage records found.</td></tr>}
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
        <Modal title="Damage Record Details" onClose={() => setViewItem(null)}>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 leading-tight font-mono">{viewItem.damage_number}</h3>
                <span className="text-xs text-gray-500 block mt-0.5">{viewItem.product_name} &middot; {viewItem.variant}</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={viewItem.status} />
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                { label: "Branch Name", value: viewItem.branch_name },
                { label: "Incident Date", value: viewItem.damage_date },
                { label: "Damaged Quantity", value: `${viewItem.quantity} ${viewItem.unit}` },
                { label: "Reported By", value: viewItem.reported_by },
                { label: "Approved By", value: viewItem.approved_by },
                { label: "Record Active", value: <Badge active={viewItem.is_active} /> },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-50 last:border-0 items-center text-sm">
                  <span className="text-slate-400 font-medium">{label}</span>
                  <span className="font-semibold text-slate-800">{value}</span>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-400 block mb-1">Reason for Damage</span>
              <p className="text-sm text-slate-700 italic">"{viewItem.reason}"</p>
            </div>

            {/* Quick Action buttons */}
            {viewItem.status === "reported" && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleStatusChangeAction(viewItem, "approved")}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition focus:outline-none"
                >
                  Approve Damage
                </button>
                <button
                  onClick={() => handleStatusChangeAction(viewItem, "written_off")}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition focus:outline-none"
                >
                  Write Off Stock
                </button>
              </div>
            )}
            {viewItem.status === "approved" && (
              <button
                onClick={() => handleStatusChangeAction(viewItem, "written_off")}
                className="w-full py-2 text-xs font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition focus:outline-none"
              >
                Write Off Stock
              </button>
            )}
          </div>
        </Modal>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <Modal title={editItem ? "Edit Damage Record" : "New Damage Record"} onClose={() => setShowModal(false)}>
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
                label="Damaged Quantity"
                type="number"
                value={form.quantity}
                onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                required
              />
              <FormField
                label="Damage Date"
                type="date"
                value={form.damage_date}
                onChange={e => setForm(f => ({ ...f, damage_date: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 font-sans">Status</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-sans"
              >
                <option value="reported">Reported</option>
                <option value="approved">Approved</option>
                <option value="written_off">Written Off</option>
              </select>
            </div>

            <TextArea
              label="Reason for Damage"
              value={form.reason}
              onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
              placeholder="Provide a reason for the damage..."
              required
            />

            <div className="py-2">
              <CheckboxField
                id="is_active_damage"
                label="Record Active"
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

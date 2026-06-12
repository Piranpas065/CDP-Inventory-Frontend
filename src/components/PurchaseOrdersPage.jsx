import { useState } from "react";
import {
  Plus, Eye, Edit, Trash2, CheckCircle, Clock,
  FileText, Truck, XCircle
} from "lucide-react";
import { Button, Modal, FormField, TextArea, ActionButtons, SearchBar, Pagination } from "./common/UIComponents";

const mockPOs = [
  { id: 1, po_number: "PO-2026-001", supplier: "ABC Traders", branch: "Main Branch", order_date: "2026-06-01", expected_date: "2026-06-10", total_amount: "Rs. 45,000", status: "approved", items: 12, notes: "Urgent order" },
  { id: 2, po_number: "PO-2026-002", supplier: "XYZ Supplies", branch: "Branch 02", order_date: "2026-06-02", expected_date: "2026-06-12", total_amount: "Rs. 28,500", status: "pending", items: 8, notes: "" },
  { id: 3, po_number: "PO-2026-003", supplier: "Global Imports", branch: "Branch 03", order_date: "2026-06-03", expected_date: "2026-06-13", total_amount: "Rs. 72,000", status: "received", items: 20, notes: "Electronics batch" },
  { id: 4, po_number: "PO-2026-004", supplier: "Local Mart", branch: "Main Branch", order_date: "2026-06-04", expected_date: "2026-06-14", total_amount: "Rs. 15,000", status: "draft", items: 5, notes: "" },
  { id: 5, po_number: "PO-2026-005", supplier: "Premium Distributors", branch: "Kandy Branch", order_date: "2026-06-05", expected_date: "2026-06-15", total_amount: "Rs. 91,000", status: "approved", items: 30, notes: "Monthly restock" },
  { id: 6, po_number: "PO-2026-006", supplier: "Tech Wholesale", branch: "Galle Branch", order_date: "2026-06-06", expected_date: "2026-06-16", total_amount: "Rs. 33,000", status: "cancelled", items: 11, notes: "Cancelled by supplier" },
  { id: 7, po_number: "PO-2026-007", supplier: "ABC Traders", branch: "Branch 02", order_date: "2026-06-07", expected_date: "2026-06-17", total_amount: "Rs. 56,500", status: "pending", items: 17, notes: "" },
];

const statusConfig = {
  draft:     { label: "Draft",     cls: "bg-gray-100 text-gray-600",    icon: FileText },
  pending:   { label: "Pending",   cls: "bg-amber-100 text-amber-700",  icon: Clock },
  approved:  { label: "Approved",  cls: "bg-blue-100 text-blue-700",    icon: CheckCircle },
  received:  { label: "Received",  cls: "bg-green-100 text-green-700",  icon: Truck },
  cancelled: { label: "Cancelled", cls: "bg-red-100 text-red-600",      icon: XCircle },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.draft;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>
      <Icon size={10} /> {cfg.label}
    </span>
  );
};

const suppliers = ["ABC Traders", "XYZ Supplies", "Global Imports", "Local Mart", "Premium Distributors", "Tech Wholesale"];
const branches = ["Main Branch", "Branch 02", "Branch 03", "Kandy Branch", "Galle Branch"];

export default function PurchaseOrdersPage({ embedded }) {
  const [pos, setPOs] = useState(mockPOs);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [form, setForm] = useState({ supplier: "", branch: "", order_date: "", expected_date: "", notes: "", status: "draft" });
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = pos.filter(p =>
    (statusFilter === "all" || p.status === statusFilter) &&
    (p.po_number.toLowerCase().includes(search.toLowerCase()) ||
     p.supplier.toLowerCase().includes(search.toLowerCase()) ||
     p.branch.toLowerCase().includes(search.toLowerCase()))
  );
  const total = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openAdd = () => { setEditItem(null); setForm({ supplier: "", branch: "", order_date: "", expected_date: "", notes: "", status: "draft" }); setShowModal(true); };
  const openEdit = (p) => { setEditItem(p); setForm({ supplier: p.supplier, branch: p.branch, order_date: p.order_date, expected_date: p.expected_date, notes: p.notes, status: p.status }); setShowModal(true); };
  const handleSave = () => {
    if (!form.supplier || !form.branch) return;
    if (editItem) {
      setPOs(prev => prev.map(p => p.id === editItem.id ? { ...p, ...form } : p));
    } else {
      const num = `PO-2026-00${pos.length + 1}`;
      setPOs(prev => [...prev, { ...form, id: Date.now(), po_number: num, total_amount: "Rs. 0", items: 0 }]);
    }
    setShowModal(false);
  };
  const handleDelete = (id) => setPOs(prev => prev.filter(p => p.id !== id));

  const statCounts = Object.keys(statusConfig).reduce((acc, s) => ({ ...acc, [s]: pos.filter(p => p.status === s).length }), {});

  return (
    <div className={embedded ? "p-5" : "p-5 bg-gray-50 min-h-screen"}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Purchase Orders</h1>
          <p className="text-sm text-gray-400 mt-0.5">{pos.length} total orders across all branches</p>
        </div>
        <Button onClick={openAdd} icon={Plus}>New PO</Button>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        {Object.entries(statusConfig).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <button key={key} onClick={() => { setStatusFilter(statusFilter === key ? "all" : key); setPage(1); }}
              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${statusFilter === key ? "border-blue-400 ring-2 ring-blue-100 bg-blue-50" : "bg-white border-gray-100 hover:border-gray-200"} shadow-sm`}>
              <div className={`w-8 h-8 rounded-xl ${cfg.cls.split(" ")[0]} flex items-center justify-center`}><Icon size={15} className={cfg.cls.split(" ")[1]} /></div>
              <div className="text-left"><p className="text-lg font-bold text-slate-800">{statCounts[key] || 0}</p><p className="text-xs text-gray-400">{cfg.label}</p></div>
            </button>
          );
        })}
      </div>

      {/* Search and Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 w-full">
        <div className="flex-1 min-w-0">
          <SearchBar
            search={search}
            setSearch={val => { setSearch(val); setPage(1); }}
            placeholder="Search PO, supplier..."
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all duration-200"
          >
            <option value="all">All Statuses</option>
            {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>

      <p className="text-sm text-slate-600 mb-4">Showing {filtered.length} purchase orders</p>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">PO Number</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Supplier</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Branch</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Order Date</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Expected</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Amount</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Items</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((po, i) => (
              <tr key={po.id} className={`border-t border-gray-50 hover:bg-blue-50/30 transition ${i % 2 !== 0 ? "bg-gray-50/30" : ""}`}>
                <td className="px-4 py-3 text-xs font-mono text-blue-600 font-semibold text-left">{po.po_number}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-700 text-left">{po.supplier}</td>
                <td className="px-4 py-3 text-sm text-slate-500 text-left">{po.branch}</td>
                <td className="px-4 py-3 text-xs text-slate-500 text-left">{po.order_date}</td>
                <td className="px-4 py-3 text-xs text-slate-500 text-left">{po.expected_date}</td>
                <td className="px-4 py-3 text-sm font-semibold text-slate-700 text-center">{po.total_amount}</td>
                <td className="px-4 py-3 text-sm text-slate-600 text-center">{po.items}</td>
                <td className="px-4 py-3 text-center"><StatusBadge status={po.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <ActionButtons
                      onView={() => setViewItem(po)}
                      onEdit={() => openEdit(po)}
                      onDelete={() => handleDelete(po.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {paged.length === 0 && <tr><td colSpan={9} className="px-5 py-10 text-center text-sm text-gray-400">No purchase orders found.</td></tr>}
          </tbody>
        </table>

        <Pagination
          currentPage={page}
          totalPages={total}
          setCurrentPage={setPage}
          showingText={`Showing ${Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–${Math.min(page * PER_PAGE, filtered.length)} of ${filtered.length}`}
        />
      </div>

      {showModal && (
        <Modal title={editItem ? "Edit Purchase Order" : "New Purchase Order"} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Supplier <span className="text-red-400">*</span></label>
              <select value={form.supplier} onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                <option value="">Select supplier...</option>
                {suppliers.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Branch <span className="text-red-400">*</span></label>
              <select value={form.branch} onChange={e => setForm(f => ({ ...f, branch: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                <option value="">Select branch...</option>
                {branches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Order Date" type="date" value={form.order_date} onChange={e => setForm(f => ({ ...f, order_date: e.target.value }))} />
              <FormField label="Expected Date" type="date" value={form.expected_date} onChange={e => setForm(f => ({ ...f, expected_date: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <TextArea label="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes..." />
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
              <Button variant="primary" onClick={handleSave} className="flex-1">Save PO</Button>
            </div>
          </div>
        </Modal>
      )}

      {viewItem && (
        <Modal title="Purchase Order Details" onClose={() => setViewItem(null)}>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-800 font-mono">{viewItem.po_number}</h3>
                <StatusBadge status={viewItem.status} />
              </div>
              <p className="text-sm text-gray-500">{viewItem.supplier} · {viewItem.branch}</p>
            </div>
            {[
              { label: "Order Date", value: viewItem.order_date },
              { label: "Expected Date", value: viewItem.expected_date },
              { label: "Total Amount", value: viewItem.total_amount },
              { label: "Items", value: `${viewItem.items} line items` },
              { label: "Notes", value: viewItem.notes || "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-400">{label}</span>
                <span className="text-sm font-semibold text-slate-700">{value}</span>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
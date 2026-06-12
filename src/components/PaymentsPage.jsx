import { useState } from "react";
import {
  CreditCard, Plus, Filter, Eye, Edit, Trash2,
  ChevronLeft, ChevronRight, XCircle, CheckCircle,
  Clock, Wallet, TrendingUp, AlertCircle
} from "lucide-react";
import { SearchBar, ActionButtons } from "./common/UIComponents";

const mockPayments = [
  { id: 1, payment_ref: "PAY-2026-001", po_number: "PO-2026-001", supplier: "ABC Traders", branch: "Main Branch", payment_date: "2026-06-08", amount: "Rs. 45,000", method: "Bank Transfer", status: "completed", notes: "" },
  { id: 2, payment_ref: "PAY-2026-002", po_number: "PO-2026-003", supplier: "Global Imports", branch: "Branch 03", payment_date: "2026-06-09", amount: "Rs. 72,000", method: "Cheque", status: "completed", notes: "Cleared on 10th" },
  { id: 3, payment_ref: "PAY-2026-003", po_number: "PO-2026-005", supplier: "Premium Distributors", branch: "Kandy Branch", payment_date: "2026-06-10", amount: "Rs. 50,000", method: "Bank Transfer", status: "pending", notes: "Partial payment" },
  { id: 4, payment_ref: "PAY-2026-004", po_number: "PO-2026-002", supplier: "XYZ Supplies", branch: "Branch 02", payment_date: "2026-06-11", amount: "Rs. 28,500", method: "Cash", status: "pending", notes: "" },
  { id: 5, payment_ref: "PAY-2026-005", po_number: "PO-2026-007", supplier: "ABC Traders", branch: "Branch 02", payment_date: "2026-06-12", amount: "Rs. 56,500", method: "Bank Transfer", status: "draft", notes: "" },
  { id: 6, payment_ref: "PAY-2026-006", po_number: "PO-2026-004", supplier: "Local Mart", branch: "Main Branch", payment_date: "2026-06-12", amount: "Rs. 15,000", method: "Cash", status: "cancelled", notes: "Order cancelled" },
];

const statusConfig = {
  draft:     { label: "Draft",     cls: "bg-gray-100 text-gray-600" },
  pending:   { label: "Pending",   cls: "bg-amber-100 text-amber-700" },
  completed: { label: "Completed", cls: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", cls: "bg-red-100 text-red-600" },
};

const methodConfig = {
  "Bank Transfer": "bg-blue-50 text-blue-600",
  "Cheque":        "bg-purple-50 text-purple-600",
  "Cash":          "bg-emerald-50 text-emerald-600",
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.draft;
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>{cfg.label}</span>;
};

const MethodBadge = ({ method }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${methodConfig[method] || "bg-gray-100 text-gray-600"}`}>{method}</span>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <h2 className="text-base font-bold text-slate-800">{title}</h2>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition"><XCircle size={18} /></button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  </div>
);

const poOptions = ["PO-2026-001", "PO-2026-002", "PO-2026-003", "PO-2026-004", "PO-2026-005", "PO-2026-007"];
const paymentMethods = ["Bank Transfer", "Cheque", "Cash"];

export default function PaymentsPage({ embedded }) {
  const [payments, setPayments] = useState(mockPayments);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [form, setForm] = useState({ po_number: "", payment_date: "", amount: "", method: "Bank Transfer", notes: "", status: "draft" });
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = payments.filter(p => {
    const matchesSearch =
      p.payment_ref.toLowerCase().includes(search.toLowerCase()) ||
      p.supplier.toLowerCase().includes(search.toLowerCase()) ||
      p.po_number.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" ? true : p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  const total = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalCompleted = payments.filter(p => p.status === "completed").reduce((a, p) => {
    const n = parseInt(p.amount.replace(/[^0-9]/g, ""), 10) || 0;
    return a + n;
  }, 0);

  const openAdd = () => { setEditItem(null); setForm({ po_number: "", payment_date: "", amount: "", method: "Bank Transfer", notes: "", status: "draft" }); setShowModal(true); };
  const openEdit = (p) => { setEditItem(p); setForm({ po_number: p.po_number, payment_date: p.payment_date, amount: p.amount, method: p.method, notes: p.notes, status: p.status }); setShowModal(true); };
  const handleSave = () => {
    if (!form.po_number || !form.amount) return;
    if (editItem) {
      setPayments(prev => prev.map(p => p.id === editItem.id ? { ...p, ...form } : p));
    } else {
      setPayments(prev => [...prev, { ...form, id: Date.now(), payment_ref: `PAY-2026-00${prev.length + 1}`, supplier: "—", branch: "—" }]);
    }
    setShowModal(false);
  };
  const handleDelete = (id) => setPayments(prev => prev.filter(p => p.id !== id));

  return (
    <div className={embedded ? "p-5" : "p-5 bg-gray-50 min-h-screen"}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Payments</h1>
          <p className="text-sm text-gray-400 mt-0.5">Supplier payment records</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm">
          <Plus size={16} /> New Payment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Payments", value: payments.length, icon: CreditCard, bg: "bg-blue-50", color: "text-blue-600" },
          { label: "Completed", value: payments.filter(p => p.status === "completed").length, icon: CheckCircle, bg: "bg-green-50", color: "text-green-600" },
          { label: "Pending", value: payments.filter(p => p.status === "pending").length, icon: Clock, bg: "bg-amber-50", color: "text-amber-600" },
          { label: "Total Paid", value: `Rs. ${(totalCompleted / 1000).toFixed(0)}K`, icon: Wallet, bg: "bg-cyan-50", color: "text-cyan-600" },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}><c.icon size={18} className={c.color} /></div>
            <div><p className="text-xs text-gray-400">{c.label}</p><p className="text-xl font-bold text-slate-800">{c.value}</p></div>
          </div>
        ))}
      </div>

      {/* Search and Filter Toolbar */}
      <div className="mb-4">
        <SearchBar
          search={search}
          setSearch={val => { setSearch(val); setPage(1); }}
          placeholder="Search payments..."
          filterOptions={[
            { label: "All", value: "all" },
            { label: "Draft", value: "draft" },
            { label: "Pending", value: "pending" },
            { label: "Completed", value: "completed" },
            { label: "Cancelled", value: "cancelled" },
          ]}
          selectedFilter={filterStatus}
          setSelectedFilter={val => { setFilterStatus(val); setPage(1); }}
        />
      </div>

      <p className="text-sm text-slate-600 mb-4">Showing {filtered.length} payments</p>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Ref</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">PO Number</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Supplier</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Branch</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Date</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Amount</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Method</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((p, i) => (
              <tr key={p.id} className={`border-t border-gray-50 hover:bg-blue-50/30 transition ${i % 2 !== 0 ? "bg-gray-50/30" : ""}`}>
                <td className="px-4 py-3 text-xs font-mono text-blue-600 font-semibold text-left">{p.payment_ref}</td>
                <td className="px-4 py-3 text-xs font-mono text-slate-500 text-left">{p.po_number}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-700 text-left">{p.supplier}</td>
                <td className="px-4 py-3 text-sm text-slate-500 text-left">{p.branch}</td>
                <td className="px-4 py-3 text-xs text-slate-500 text-left">{p.payment_date}</td>
                <td className="px-4 py-3 text-sm font-semibold text-slate-700 text-center">{p.amount}</td>
                <td className="px-4 py-3 text-center"><MethodBadge method={p.method} /></td>
                <td className="px-4 py-3 text-center"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <ActionButtons
                      onView={() => setViewItem(p)}
                      onEdit={() => openEdit(p)}
                      onDelete={() => handleDelete(p.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {paged.length === 0 && <tr><td colSpan={9} className="px-5 py-10 text-center text-sm text-gray-400">No payments found.</td></tr>}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 text-gray-500 transition"><ChevronLeft size={14} /></button>
            {Array.from({ length: total }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)} className={`w-7 h-7 rounded-lg text-xs font-medium transition ${n === page ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-600"}`}>{n}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(total, p + 1))} disabled={page === total || total === 0} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 text-gray-500 transition"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {showModal && (
        <Modal title={editItem ? "Edit Payment" : "New Payment"} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Purchase Order <span className="text-red-400">*</span></label>
              <select value={form.po_number} onChange={e => setForm(f => ({ ...f, po_number: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                <option value="">Select PO...</option>
                {poOptions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Payment Date</label>
                <input type="date" value={form.payment_date} onChange={e => setForm(f => ({ ...f, payment_date: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Amount <span className="text-red-400">*</span></label>
                <input value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="Rs. 0" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Payment Method</label>
              <select value={form.method} onChange={e => setForm(f => ({ ...f, method: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Notes</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Optional notes..." className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition">Save Payment</button>
            </div>
          </div>
        </Modal>
      )}

      {viewItem && (
        <Modal title="Payment Details" onClose={() => setViewItem(null)}>
          <div className="space-y-4">
            <div className="p-4 bg-cyan-50 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 font-mono">{viewItem.payment_ref}</h3>
                <p className="text-sm text-gray-400">PO: {viewItem.po_number}</p>
              </div>
              <StatusBadge status={viewItem.status} />
            </div>
            {[
              { label: "Supplier", value: viewItem.supplier },
              { label: "Branch", value: viewItem.branch },
              { label: "Payment Date", value: viewItem.payment_date },
              { label: "Amount", value: viewItem.amount },
              { label: "Method", value: viewItem.method },
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
import { useState } from "react";
import {
  GitMerge, Plus, Filter, Eye, Edit, Trash2,
  ChevronLeft, ChevronRight, XCircle, CheckCircle,
  Clock, Truck, ArrowRight, Package
} from "lucide-react";
import { SearchBar, ActionButtons } from "./common/UIComponents";

const mockTransfers = [
  { id: 1, transfer_no: "ST-2026-001", from_branch: "Main Branch", to_branch: "Branch 02", transfer_date: "2026-06-06", approved_by: "Arun", items: 12, status: "completed", notes: "Monthly restock" },
  { id: 2, transfer_no: "ST-2026-002", from_branch: "Main Branch", to_branch: "Branch 03", transfer_date: "2026-06-07", approved_by: "Priya", items: 8, status: "in_transit", notes: "" },
  { id: 3, transfer_no: "ST-2026-003", from_branch: "Kandy Branch", to_branch: "Galle Branch", transfer_date: "2026-06-08", approved_by: "—", items: 5, status: "pending", notes: "Urgent transfer" },
  { id: 4, transfer_no: "ST-2026-004", from_branch: "Branch 02", to_branch: "Main Branch", transfer_date: "2026-06-09", approved_by: "Rahul", items: 3, status: "completed", notes: "Excess stock return" },
  { id: 5, transfer_no: "ST-2026-005", from_branch: "Main Branch", to_branch: "Kandy Branch", transfer_date: "2026-06-10", approved_by: "—", items: 20, status: "draft", notes: "" },
  { id: 6, transfer_no: "ST-2026-006", from_branch: "Galle Branch", to_branch: "Branch 02", transfer_date: "2026-06-11", approved_by: "Arun", items: 7, status: "in_transit", notes: "Priority items" },
];

const statusConfig = {
  draft:       { label: "Draft",       cls: "bg-gray-100 text-gray-600" },
  pending:     { label: "Pending",     cls: "bg-amber-100 text-amber-700" },
  in_transit:  { label: "In Transit",  cls: "bg-blue-100 text-blue-700" },
  completed:   { label: "Completed",   cls: "bg-green-100 text-green-700" },
  cancelled:   { label: "Cancelled",   cls: "bg-red-100 text-red-600" },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.draft;
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>{cfg.label}</span>;
};

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

const branches = ["Main Branch", "Branch 02", "Branch 03", "Kandy Branch", "Galle Branch"];

export default function StockTransfersPage({ embedded }) {
  const [transfers, setTransfers] = useState(mockTransfers);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [form, setForm] = useState({ from_branch: "", to_branch: "", transfer_date: "", notes: "", status: "draft" });
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = transfers.filter(t => {
    const matchesSearch =
      t.transfer_no.toLowerCase().includes(search.toLowerCase()) ||
      t.from_branch.toLowerCase().includes(search.toLowerCase()) ||
      t.to_branch.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" ? true : t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  const total = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openAdd = () => { setEditItem(null); setForm({ from_branch: "", to_branch: "", transfer_date: "", notes: "", status: "draft" }); setShowModal(true); };
  const openEdit = (t) => { setEditItem(t); setForm({ from_branch: t.from_branch, to_branch: t.to_branch, transfer_date: t.transfer_date, notes: t.notes, status: t.status }); setShowModal(true); };
  const handleSave = () => {
    if (!form.from_branch || !form.to_branch || form.from_branch === form.to_branch) return;
    if (editItem) {
      setTransfers(prev => prev.map(t => t.id === editItem.id ? { ...t, ...form } : t));
    } else {
      setTransfers(prev => [...prev, { ...form, id: Date.now(), transfer_no: `ST-2026-00${prev.length + 1}`, approved_by: "—", items: 0 }]);
    }
    setShowModal(false);
  };
  const handleDelete = (id) => setTransfers(prev => prev.filter(t => t.id !== id));

  return (
    <div className={embedded ? "p-5" : "p-5 bg-gray-50 min-h-screen"}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Stock Transfers</h1>
          <p className="text-sm text-gray-400 mt-0.5">Move stock between branches</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm">
          <Plus size={16} /> New Transfer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Transfers", value: transfers.length, icon: GitMerge, bg: "bg-blue-50", color: "text-blue-600" },
          { label: "In Transit", value: transfers.filter(t => t.status === "in_transit").length, icon: Truck, bg: "bg-blue-100", color: "text-blue-700" },
          { label: "Pending", value: transfers.filter(t => t.status === "pending").length, icon: Clock, bg: "bg-amber-50", color: "text-amber-600" },
          { label: "Completed", value: transfers.filter(t => t.status === "completed").length, icon: CheckCircle, bg: "bg-green-50", color: "text-green-600" },
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
          placeholder="Search transfer, branch..."
          filterOptions={[
            { label: "All", value: "all" },
            { label: "Draft", value: "draft" },
            { label: "Pending", value: "pending" },
            { label: "In Transit", value: "in_transit" },
            { label: "Completed", value: "completed" },
          ]}
          selectedFilter={filterStatus}
          setSelectedFilter={val => { setFilterStatus(val); setPage(1); }}
        />
      </div>

      <p className="text-sm text-slate-600 mb-4">Showing {filtered.length} transfers</p>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Transfer No</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">From → To</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Date</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Items</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Approved By</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((t, i) => (
              <tr key={t.id} className={`border-t border-gray-50 hover:bg-blue-50/30 transition ${i % 2 !== 0 ? "bg-gray-50/30" : ""}`}>
                <td className="px-4 py-3 text-xs font-mono text-blue-600 font-semibold text-left">{t.transfer_no}</td>
                <td className="px-4 py-3 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">{t.from_branch}</span>
                    <ArrowRight size={12} className="text-gray-400 flex-shrink-0" />
                    <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg">{t.to_branch}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500 text-left">{t.transfer_date}</td>
                <td className="px-4 py-3 text-sm text-slate-600 text-center">{t.items}</td>
                <td className="px-4 py-3 text-sm text-slate-600 text-left">{t.approved_by}</td>
                <td className="px-4 py-3 text-center"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <ActionButtons
                      onView={() => setViewItem(t)}
                      onEdit={() => openEdit(t)}
                      onDelete={() => handleDelete(t.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {paged.length === 0 && <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-gray-400">No transfers found.</td></tr>}
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
        <Modal title={editItem ? "Edit Transfer" : "New Stock Transfer"} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">From Branch <span className="text-red-400">*</span></label>
              <select value={form.from_branch} onChange={e => setForm(f => ({ ...f, from_branch: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                <option value="">Select source branch...</option>
                {branches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">To Branch <span className="text-red-400">*</span></label>
              <select value={form.to_branch} onChange={e => setForm(f => ({ ...f, to_branch: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                <option value="">Select destination branch...</option>
                {branches.filter(b => b !== form.from_branch).map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Transfer Date</label>
              <input type="date" value={form.transfer_date} onChange={e => setForm(f => ({ ...f, transfer_date: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
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
              <button onClick={handleSave} className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition">Save Transfer</button>
            </div>
          </div>
        </Modal>
      )}

      {viewItem && (
        <Modal title="Transfer Details" onClose={() => setViewItem(null)}>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl">
              <h3 className="text-base font-bold text-slate-800 font-mono mb-1">{viewItem.transfer_no}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-600 bg-white px-2 py-0.5 rounded-lg border">{viewItem.from_branch}</span>
                <ArrowRight size={14} className="text-gray-400" />
                <span className="text-sm font-medium text-blue-700 bg-white px-2 py-0.5 rounded-lg border border-blue-200">{viewItem.to_branch}</span>
              </div>
            </div>
            {[
              { label: "Transfer Date", value: viewItem.transfer_date },
              { label: "Items", value: `${viewItem.items} items` },
              { label: "Approved By", value: viewItem.approved_by },
              { label: "Status", value: <StatusBadge status={viewItem.status} /> },
              { label: "Notes", value: viewItem.notes || "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2 border-b border-gray-50 last:border-0 items-center">
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
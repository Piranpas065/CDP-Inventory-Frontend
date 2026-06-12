import { useState } from "react";
import { RotateCcw, Clock, CheckCircle, Package, Plus, Filter } from "lucide-react";
import { Button, Modal, FormField, ActionButtons, SearchBar, Pagination } from "./common/UIComponents";

const mockReturns = [
  { id: 1, prn_number: "PRN-2026-001", grn_number: "GRN-2026-001", supplier: "ABC Traders", branch: "Main Branch", return_date: "2026-06-09", reason: "Damaged goods", items: 5, amount: "Rs. 4,500", status: "approved" },
  { id: 2, prn_number: "PRN-2026-002", grn_number: "GRN-2026-002", supplier: "Global Imports", branch: "Branch 03", return_date: "2026-06-10", reason: "Wrong items delivered", items: 3, amount: "Rs. 8,000", status: "pending" },
  { id: 3, prn_number: "PRN-2026-003", grn_number: "GRN-2026-003", supplier: "Premium Distributors", branch: "Kandy Branch", return_date: "2026-06-10", reason: "Expiry date issue", items: 2, amount: "Rs. 3,200", status: "draft" },
  { id: 4, prn_number: "PRN-2026-004", grn_number: "GRN-2026-005", supplier: "ABC Traders", branch: "Branch 02", return_date: "2026-06-11", reason: "Quality not acceptable", items: 7, amount: "Rs. 11,000", status: "pending" },
  { id: 5, prn_number: "PRN-2026-005", grn_number: "GRN-2026-004", supplier: "XYZ Supplies", branch: "Branch 02", return_date: "2026-06-11", reason: "Overdelivery", items: 1, amount: "Rs. 2,500", status: "approved" },
];

const statusConfig = {
  draft:    { label: "Draft",    cls: "bg-gray-100 text-gray-600" },
  pending:  { label: "Pending",  cls: "bg-amber-100 text-amber-700" },
  approved: { label: "Approved", cls: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", cls: "bg-red-100 text-red-600" },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.draft;
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>{cfg.label}</span>;
};

const grnOptions = ["GRN-2026-001", "GRN-2026-002", "GRN-2026-003", "GRN-2026-004", "GRN-2026-005"];
const returnReasons = ["Damaged goods", "Wrong items delivered", "Expiry date issue", "Quality not acceptable", "Overdelivery", "Other"];

export default function PurchaseReturnsPage({ embedded }) {
  const [returns, setReturns] = useState(mockReturns);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [form, setForm] = useState({ grn_number: "", return_date: "", reason: "", items: "", amount: "", status: "draft" });
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = returns.filter(r => {
    const matchesSearch =
      r.prn_number.toLowerCase().includes(search.toLowerCase()) ||
      r.supplier.toLowerCase().includes(search.toLowerCase()) ||
      r.reason.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" ? true : r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  const total = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openAdd = () => { setEditItem(null); setForm({ grn_number: "", return_date: "", reason: "", items: "", amount: "", status: "draft" }); setShowModal(true); };
  const openEdit = (r) => { setEditItem(r); setForm({ grn_number: r.grn_number, return_date: r.return_date, reason: r.reason, items: r.items, amount: r.amount, status: r.status }); setShowModal(true); };
  const handleSave = () => {
    if (!form.grn_number || !form.reason) return;
    if (editItem) {
      setReturns(prev => prev.map(r => r.id === editItem.id ? { ...r, ...form } : r));
    } else {
      setReturns(prev => [...prev, { ...form, id: Date.now(), prn_number: `PRN-2026-00${prev.length + 1}`, supplier: "—", branch: "—" }]);
    }
    setShowModal(false);
  };
  const handleDelete = (id) => setReturns(prev => prev.filter(r => r.id !== id));

  return (
    <div className={embedded ? "p-5" : "p-5 bg-gray-50 min-h-screen"}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Purchase Returns</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage goods returned to suppliers</p>
        </div>
        <Button onClick={openAdd} icon={Plus}>New Return</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Returns", value: returns.length, icon: RotateCcw, bg: "bg-blue-50", color: "text-blue-600" },
          { label: "Pending", value: returns.filter(r => r.status === "pending").length, icon: Clock, bg: "bg-amber-50", color: "text-amber-600" },
          { label: "Approved", value: returns.filter(r => r.status === "approved").length, icon: CheckCircle, bg: "bg-green-50", color: "text-green-600" },
          { label: "Items Returned", value: returns.reduce((a, r) => a + (Number(r.items) || 0), 0), icon: Package, bg: "bg-red-50", color: "text-red-500" },
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
          placeholder="Search returns, supplier..."
          filterOptions={[
            { label: "All", value: "all" },
            { label: "Draft", value: "draft" },
            { label: "Pending", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Rejected", value: "rejected" },
          ]}
          selectedFilter={filterStatus}
          setSelectedFilter={val => { setFilterStatus(val); setPage(1); }}
        />
      </div>

      <p className="text-sm text-slate-600 mb-4">Showing {filtered.length} purchase returns</p>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">PRN Number</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">GRN Ref</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Supplier</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Branch</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Date</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Reason</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Items</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Amount</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r, i) => (
              <tr key={r.id} className={`border-t border-gray-50 hover:bg-blue-50/30 transition ${i % 2 !== 0 ? "bg-gray-50/30" : ""}`}>
                <td className="px-4 py-3 text-xs font-mono text-blue-600 font-semibold text-left">{r.prn_number}</td>
                <td className="px-4 py-3 text-xs font-mono text-slate-500 text-left">{r.grn_number}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-700 text-left">{r.supplier}</td>
                <td className="px-4 py-3 text-sm text-slate-500 text-left">{r.branch}</td>
                <td className="px-4 py-3 text-xs text-slate-500 text-left">{r.return_date}</td>
                <td className="px-4 py-3 text-xs text-slate-600 max-w-[120px] truncate text-left">{r.reason}</td>
                <td className="px-4 py-3 text-sm text-slate-600 text-center">{r.items}</td>
                <td className="px-4 py-3 text-sm font-semibold text-slate-700 text-center">{r.amount}</td>
                <td className="px-4 py-3 text-center"><StatusBadge status={r.status} /></td>
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
            {paged.length === 0 && <tr><td colSpan={10} className="px-5 py-10 text-center text-sm text-gray-400">No returns found.</td></tr>}
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
        <Modal title={editItem ? "Edit Purchase Return" : "New Purchase Return"} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">GRN Reference <span className="text-red-400">*</span></label>
              <select value={form.grn_number} onChange={e => setForm(f => ({ ...f, grn_number: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                <option value="">Select GRN...</option>
                {grnOptions.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <FormField label="Return Date" type="date" value={form.return_date} onChange={e => setForm(f => ({ ...f, return_date: e.target.value }))} />
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Reason <span className="text-red-400">*</span></label>
              <select value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                <option value="">Select reason...</option>
                {returnReasons.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Items" type="number" value={form.items} onChange={e => setForm(f => ({ ...f, items: e.target.value }))} placeholder="0" />
              <FormField label="Amount" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="Rs. 0" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
              <Button variant="primary" onClick={handleSave} className="flex-1">Save Return</Button>
            </div>
          </div>
        </Modal>
      )}

      {viewItem && (
        <Modal title="Return Details" onClose={() => setViewItem(null)}>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 font-mono">{viewItem.prn_number}</h3>
                <p className="text-sm text-gray-400">GRN: {viewItem.grn_number}</p>
              </div>
              <StatusBadge status={viewItem.status} />
            </div>
            {[
              { label: "Supplier", value: viewItem.supplier },
              { label: "Branch", value: viewItem.branch },
              { label: "Return Date", value: viewItem.return_date },
              { label: "Reason", value: viewItem.reason },
              { label: "Items Returned", value: viewItem.items },
              { label: "Amount", value: viewItem.amount },
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
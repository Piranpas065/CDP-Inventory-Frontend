import { useState } from "react";
import { Truck, Plus, Package, ClipboardList, CheckCircle, Filter } from "lucide-react";
import { Button, Modal, FormField, TextArea, ActionButtons, SearchBar, Pagination } from "./common/UIComponents";

const mockGRNs = [
  { id: 1, grn_number: "GRN-2026-001", po_number: "PO-2026-001", supplier: "ABC Traders", branch: "Main Branch", received_date: "2026-06-08", received_by: "Rahul", total_items: 45, total_amount: "Rs. 44,500", status: "posted", notes: "All items received in good condition" },
  { id: 2, grn_number: "GRN-2026-002", po_number: "PO-2026-003", supplier: "Global Imports", branch: "Branch 03", received_date: "2026-06-09", received_by: "Meena", total_items: 20, total_amount: "Rs. 71,000", status: "posted", notes: "" },
  { id: 3, grn_number: "GRN-2026-003", po_number: "PO-2026-005", supplier: "Premium Distributors", branch: "Kandy Branch", received_date: "2026-06-10", received_by: "Arun", total_items: 28, total_amount: "Rs. 90,000", status: "draft", notes: "Partial delivery" },
  { id: 4, grn_number: "GRN-2026-004", po_number: "PO-2026-002", supplier: "XYZ Supplies", branch: "Branch 02", received_date: "2026-06-11", received_by: "Priya", total_items: 8, total_amount: "Rs. 28,000", status: "draft", notes: "" },
  { id: 5, grn_number: "GRN-2026-005", po_number: "PO-2026-007", supplier: "ABC Traders", branch: "Branch 02", received_date: "2026-06-11", received_by: "Rahul", total_items: 17, total_amount: "Rs. 56,000", status: "posted", notes: "Monthly supply" },
];

const statusConfig = {
  draft:  { label: "Draft",  cls: "bg-gray-100 text-gray-600" },
  posted: { label: "Posted", cls: "bg-green-100 text-green-700" },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.draft;
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>{cfg.label}</span>;
};

const poOptions = ["PO-2026-001", "PO-2026-002", "PO-2026-003", "PO-2026-004", "PO-2026-005", "PO-2026-007"];
const branches = ["Main Branch", "Branch 02", "Branch 03", "Kandy Branch", "Galle Branch"];

export default function GRNPage({ embedded }) {
  const [grns, setGRNs] = useState(mockGRNs);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [form, setForm] = useState({ po_number: "", branch: "", received_date: "", received_by: "", notes: "", status: "draft" });
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = grns.filter(g => {
    const matchesSearch =
      g.grn_number.toLowerCase().includes(search.toLowerCase()) ||
      g.po_number.toLowerCase().includes(search.toLowerCase()) ||
      g.supplier.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" ? true : g.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  const total = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openAdd = () => { setEditItem(null); setForm({ po_number: "", branch: "", received_date: "", received_by: "", notes: "", status: "draft" }); setShowModal(true); };
  const openEdit = (g) => { setEditItem(g); setForm({ po_number: g.po_number, branch: g.branch, received_date: g.received_date, received_by: g.received_by, notes: g.notes, status: g.status }); setShowModal(true); };
  const handleSave = () => {
    if (!form.po_number || !form.branch) return;
    if (editItem) {
      setGRNs(prev => prev.map(g => g.id === editItem.id ? { ...g, ...form } : g));
    } else {
      setGRNs(prev => [...prev, { ...form, id: Date.now(), grn_number: `GRN-2026-00${prev.length + 1}`, supplier: "—", total_items: 0, total_amount: "Rs. 0" }]);
    }
    setShowModal(false);
  };
  const handleDelete = (id) => setGRNs(prev => prev.filter(g => g.id !== id));

  return (
    <div className={embedded ? "p-5" : "p-5 bg-gray-50 min-h-screen"}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Goods Received Notes</h1>
          <p className="text-sm text-gray-400 mt-0.5">{grns.length} GRNs recorded</p>
        </div>
        <Button onClick={openAdd} icon={Plus}>New GRN</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total GRNs", value: grns.length, icon: Truck, bg: "bg-blue-50", color: "text-blue-600" },
          { label: "Posted", value: grns.filter(g => g.status === "posted").length, icon: CheckCircle, bg: "bg-green-50", color: "text-green-600" },
          { label: "Draft", value: grns.filter(g => g.status === "draft").length, icon: ClipboardList, bg: "bg-gray-100", color: "text-gray-600" },
          { label: "Total Items", value: grns.reduce((a, g) => a + g.total_items, 0), icon: Package, bg: "bg-purple-50", color: "text-purple-600" },
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
          placeholder="Search GRN, PO, supplier..."
          filterOptions={[
            { label: "All", value: "all" },
            { label: "Posted", value: "posted" },
            { label: "Draft", value: "draft" },
          ]}
          selectedFilter={filterStatus}
          setSelectedFilter={val => { setFilterStatus(val); setPage(1); }}
        />
      </div>

      <p className="text-sm text-slate-600 mb-4">Showing {filtered.length} GRNs</p>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">GRN Number</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">PO Ref</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Supplier</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Branch</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Date</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Items</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Amount</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((g, i) => (
              <tr key={g.id} className={`border-t border-gray-50 hover:bg-blue-50/30 transition ${i % 2 !== 0 ? "bg-gray-50/30" : ""}`}>
                <td className="px-4 py-3 text-xs font-mono text-blue-600 font-semibold text-left">{g.grn_number}</td>
                <td className="px-4 py-3 text-xs font-mono text-slate-500 text-left">{g.po_number}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-700 text-left">{g.supplier}</td>
                <td className="px-4 py-3 text-sm text-slate-500 text-left">{g.branch}</td>
                <td className="px-4 py-3 text-xs text-slate-500 text-left">{g.received_date}</td>
                <td className="px-4 py-3 text-sm text-slate-600 text-center">{g.total_items}</td>
                <td className="px-4 py-3 text-sm font-semibold text-slate-700 text-center">{g.total_amount}</td>
                <td className="px-4 py-3 text-center"><StatusBadge status={g.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <ActionButtons
                      onView={() => setViewItem(g)}
                      onEdit={() => openEdit(g)}
                      onDelete={() => handleDelete(g.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {paged.length === 0 && <tr><td colSpan={9} className="px-5 py-10 text-center text-sm text-gray-400">No GRNs found.</td></tr>}
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
        <Modal title={editItem ? "Edit GRN" : "New GRN"} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Purchase Order <span className="text-red-400">*</span></label>
              <select value={form.po_number} onChange={e => setForm(f => ({ ...f, po_number: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                <option value="">Select PO...</option>
                {poOptions.map(p => <option key={p} value={p}>{p}</option>)}
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
              <FormField label="Received Date" type="date" value={form.received_date} onChange={e => setForm(f => ({ ...f, received_date: e.target.value }))} />
              <FormField label="Received By" value={form.received_by} onChange={e => setForm(f => ({ ...f, received_by: e.target.value }))} placeholder="Staff name" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                <option value="draft">Draft</option>
                <option value="posted">Posted</option>
              </select>
            </div>
            <TextArea label="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes..." />
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
              <Button variant="primary" onClick={handleSave} className="flex-1">Save GRN</Button>
            </div>
          </div>
        </Modal>
      )}

      {viewItem && (
        <Modal title="GRN Details" onClose={() => setViewItem(null)}>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 font-mono">{viewItem.grn_number}</h3>
                <p className="text-sm text-gray-400">Ref: {viewItem.po_number}</p>
              </div>
              <StatusBadge status={viewItem.status} />
            </div>
            {[
              { label: "Supplier", value: viewItem.supplier },
              { label: "Branch", value: viewItem.branch },
              { label: "Received Date", value: viewItem.received_date },
              { label: "Received By", value: viewItem.received_by },
              { label: "Total Items", value: viewItem.total_items },
              { label: "Total Amount", value: viewItem.total_amount },
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
import { useState } from "react";
import {
  Plus, Eye, Edit, Trash2, CheckCircle, Clock,
  FileText, XCircle, ChevronRight, Upload
} from "lucide-react";
import { Button, Modal, FormField, TextArea, ActionButtons, SearchBar, Pagination } from "./common/UIComponents";

const mockCheckOuts = [
  { id: 1, checkout_no: "CO-2026-001", branch: "Main Branch", checkout_date: "2026-06-10", destination_type: "Customer", recipient: "Lanka Retailers", reference_no: "DO-9921", checked_out_by: "Super Admin", items_count: 2, status: "completed", notes: "Regular stock dispatch", products: ["Wireless Bluetooth Headphones", "Cotton Round Neck T-Shirt"] },
  { id: 2, checkout_no: "CO-2026-002", branch: "Branch 02", checkout_date: "2026-06-11", destination_type: "Damage/Disposal", recipient: "—", reference_no: "DISP-8812", checked_out_by: "Priya", items_count: 1, status: "completed", notes: "Damaged during transit", products: ["Running Sneakers"] },
  { id: 3, checkout_no: "CO-2026-003", branch: "Branch 03", checkout_date: "2026-06-12", destination_type: "Internal Use", recipient: "Tech Team Sri Lanka", reference_no: "INT-1122", checked_out_by: "Meena", items_count: 1, status: "pending", notes: "Office equipment", products: ["Wireless Bluetooth Headphones"] },
  { id: 4, checkout_no: "CO-2026-004", branch: "Kandy Branch", checkout_date: "2026-06-13", destination_type: "Transfer", recipient: "Galle Branch", reference_no: "ST-2026-003", checked_out_by: "Arun", items_count: 1, status: "draft", notes: "Stock transfer request", products: ["Vitamin C Tablets 500mg"] },
];

const statusConfig = {
  draft:     { label: "Draft",     cls: "bg-gray-100 text-gray-600",    icon: FileText },
  pending:   { label: "Pending",   cls: "bg-amber-100 text-amber-700",  icon: Clock },
  completed: { label: "Completed", cls: "bg-green-100 text-green-700",  icon: CheckCircle },
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

const branches = ["Main Branch", "Branch 02", "Branch 03", "Kandy Branch", "Galle Sri Lanka"];
const availableProducts = [
  "Wireless Bluetooth Headphones",
  "Cotton Round Neck T-Shirt",
  "Running Sneakers",
  "Vitamin C Tablets 500mg"
];

export default function CheckOutPage({ embedded }) {
  const [checkouts, setCheckouts] = useState(mockCheckOuts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddPage, setShowAddPage] = useState(false);
  const [showEditPage, setShowEditPage] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [form, setForm] = useState({ branch: "", checkout_date: "", destination_type: "", recipient: "", reference_no: "", checked_out_by: "", status: "draft", products: [] });
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = checkouts.filter(c =>
    (statusFilter === "all" || c.status === statusFilter) &&
    (c.checkout_no.toLowerCase().includes(search.toLowerCase()) ||
     c.branch.toLowerCase().includes(search.toLowerCase()) ||
     c.recipient.toLowerCase().includes(search.toLowerCase()) ||
     c.reference_no.toLowerCase().includes(search.toLowerCase()))
  );
  const total = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openAdd = () => {
    setEditItem(null);
    setForm({ branch: "", checkout_date: "", destination_type: "", recipient: "", reference_no: "", checked_out_by: "", status: "draft", products: [] });
    setShowAddPage(true);
  };

  const openEdit = (c) => {
    setEditItem(c);
    setForm({ branch: c.branch, checkout_date: c.checkout_date, destination_type: c.destination_type, recipient: c.recipient, reference_no: c.reference_no, checked_out_by: c.checked_out_by, status: c.status, products: c.products || [] });
    setShowEditPage(true);
  };

  const handleSave = () => {
    if (!form.branch || !form.destination_type) return;
    if (editItem) {
      setCheckouts(prev => prev.map(c => c.id === editItem.id ? { ...c, ...form } : c));
      setShowEditPage(false);
    } else {
      const num = `CO-2026-00${checkouts.length + 1}`;
      setCheckouts(prev => [...prev, { ...form, id: Date.now(), checkout_no: num, items_count: form.products ? form.products.length : 0 }]);
      setShowAddPage(false);
    }
  };

  const handleDelete = (id) => setCheckouts(prev => prev.filter(c => c.id !== id));

  const CheckOutForm = ({ data, setData, onSave, onCancel, saveLabel }) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Branch <span className="text-red-400">*</span></label>
            <select value={data.branch} onChange={e => setData(f => ({ ...f, branch: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
              <option value="">Select branch...</option>
              {branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Destination Type <span className="text-red-400">*</span></label>
            <select value={data.destination_type} onChange={e => setData(f => ({ ...f, destination_type: e.target.value, recipient: e.target.value === "Damage/Disposal" ? "—" : f.recipient }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
              <option value="">Select destination type...</option>
              <option value="Customer">Customer</option>
              <option value="Internal Use">Internal Use</option>
              <option value="Damage/Disposal">Damage/Disposal</option>
              <option value="Transfer">Transfer</option>
            </select>
          </div>
        </div>

        {data.destination_type !== "Damage/Disposal" && (
          <div>
            <FormField label="Recipient (Customer / Employee / Target Branch)" placeholder="e.g. Lanka Retailers" value={data.recipient === "—" ? "" : data.recipient} onChange={e => setData(f => ({ ...f, recipient: e.target.value }))} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Check Out Date" type="date" value={data.checkout_date} onChange={e => setData(f => ({ ...f, checkout_date: e.target.value }))} />
          <FormField label="Reference Number" placeholder="DO-1234" value={data.reference_no} onChange={e => setData(f => ({ ...f, reference_no: e.target.value }))} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Checked Out By" placeholder="Staff Name" value={data.checked_out_by} onChange={e => setData(f => ({ ...f, checked_out_by: e.target.value }))} />
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
            <select value={data.status} onChange={e => setData(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
              {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-slate-700">Select Products to Check Out</p>
          <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200 max-h-36 overflow-y-auto">
            {availableProducts.map(prod => (
              <label key={prod} className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={data.products?.includes(prod)}
                  onChange={e => {
                    const checked = e.target.checked;
                    setData(f => {
                      const currentProds = f.products || [];
                      const nextProds = checked
                        ? [...currentProds, prod]
                        : currentProds.filter(p => p !== prod);
                      return { ...f, products: nextProds };
                    });
                  }}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
                {prod}
              </label>
            ))}
          </div>
        </div>

        <TextArea label="Notes" value={data.notes} onChange={e => setData(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes..." />
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button variant="secondary" onClick={onCancel} className="flex-1">Cancel</Button>
          <Button variant="primary" onClick={onSave} className="flex-1">{saveLabel}</Button>
        </div>
      </div>
    );
  };

  if (showAddPage) {
    return (
      <div className="p-5 min-h-full bg-gray-50 font-sans">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Add Stock Check Out</h1>
            <p className="text-sm text-slate-400 mt-0.5">Record outgoing inventory items</p>
          </div>
          <Button variant="primary" onClick={() => { setShowAddPage(false); }} className="shadow-sm">
            Back to Check Outs <ChevronRight size={16} />
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 w-full">
          <CheckOutForm
            data={form}
            setData={setForm}
            onSave={handleSave}
            onCancel={() => { setShowAddPage(false); }}
            saveLabel="Perform Check Out"
          />
        </div>
      </div>
    );
  }

  if (showEditPage && editItem) {
    return (
      <div className="p-5 min-h-full bg-gray-50 font-sans">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Edit Stock Check Out</h1>
            <p className="text-sm text-slate-400 mt-0.5">Modify check out details</p>
          </div>
          <Button variant="primary" onClick={() => { setShowEditPage(false); setEditItem(null); }} className="shadow-sm">
            Back to Check Outs <ChevronRight size={16} />
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 w-full">
          <CheckOutForm
            data={form}
            setData={setForm}
            onSave={handleSave}
            onCancel={() => { setShowEditPage(false); setEditItem(null); }}
            saveLabel="Save Changes"
          />
        </div>
      </div>
    );
  }

  const statCounts = Object.keys(statusConfig).reduce((acc, s) => ({ ...acc, [s]: checkouts.filter(c => c.status === s).length }), {});

  return (
    <div className={embedded ? "p-5" : "p-5 bg-gray-50 min-h-screen"}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800 font-sans">Stock Check Outs</h1>
          <p className="text-sm text-gray-400 mt-0.5">{checkouts.length} total records across all branches</p>
        </div>
        <Button onClick={openAdd} icon={Plus}>New Check Out</Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Check Outs", value: checkouts.length, icon: Upload, bg: "bg-blue-50", color: "text-blue-600" },
          { label: "Draft", value: statCounts.draft || 0, icon: FileText, bg: "bg-gray-100", color: "text-gray-600" },
          { label: "Pending", value: statCounts.pending || 0, icon: Clock, bg: "bg-amber-50", color: "text-amber-600" },
          { label: "Completed", value: statCounts.completed || 0, icon: CheckCircle, bg: "bg-green-50", color: "text-green-600" },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}><c.icon size={18} className={c.color} /></div>
            <div><p className="text-xs text-gray-400">{c.label}</p><p className="text-xl font-bold text-slate-800">{c.value}</p></div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 w-full">
        <div className="flex-1 min-w-0">
          <SearchBar
            search={search}
            setSearch={val => { setSearch(val); setPage(1); }}
            placeholder="Search Check Out, branch, recipient..."
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all duration-200 font-sans"
          >
            <option value="all">All Statuses</option>
            {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>

      <p className="text-sm text-slate-600 mb-4 font-sans">Showing {filtered.length} check out records</p>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm font-sans">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Check Out No</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Branch</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Date</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Destination</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Recipient</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Ref No</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Items</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c, i) => (
              <tr key={c.id} className={`border-t border-gray-50 hover:bg-blue-50/30 transition ${i % 2 !== 0 ? "bg-gray-50/30" : ""}`}>
                <td className="px-4 py-3 text-xs font-mono text-blue-600 font-semibold text-left">{c.checkout_no}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-700 text-left">{c.branch}</td>
                <td className="px-4 py-3 text-xs text-slate-500 text-left">{c.checkout_date}</td>
                <td className="px-4 py-3 text-xs font-medium text-slate-600 text-left">{c.destination_type}</td>
                <td className="px-4 py-3 text-sm text-slate-500 text-left">{c.recipient}</td>
                <td className="px-4 py-3 text-xs text-slate-500 text-left font-mono">{c.reference_no}</td>
                <td className="px-4 py-3 text-sm text-slate-600 text-center">{c.items_count}</td>
                <td className="px-4 py-3 text-center"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <ActionButtons
                      onView={() => setViewItem(c)}
                      onEdit={() => openEdit(c)}
                      onDelete={() => handleDelete(c.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {paged.length === 0 && <tr><td colSpan={9} className="px-5 py-10 text-center text-sm text-gray-400">No check outs found.</td></tr>}
          </tbody>
        </table>

        <Pagination
          currentPage={page}
          totalPages={total}
          setCurrentPage={setPage}
          showingText={`Showing ${Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–${Math.min(page * PER_PAGE, filtered.length)} of ${filtered.length}`}
        />
      </div>

      {viewItem && (
        <Modal title="Check Out Details" onClose={() => setViewItem(null)}>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-800 font-mono">{viewItem.checkout_no}</h3>
                <StatusBadge status={viewItem.status} />
              </div>
              <p className="text-sm text-gray-500">{viewItem.branch} · Ref: {viewItem.reference_no}</p>
            </div>
            {[
              { label: "Check Out Date", value: viewItem.checkout_date },
              { label: "Destination Type", value: viewItem.destination_type },
              { label: "Recipient", value: viewItem.recipient },
              { label: "Checked Out By", value: viewItem.checked_out_by },
              { label: "Items Count", value: `${viewItem.items_count} items` },
              { label: "Notes", value: viewItem.notes || "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-400">{label}</span>
                <span className="text-sm font-semibold text-slate-700">{value}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Products Checked Out</p>
              <div className="flex flex-wrap gap-1.5">
                {viewItem.products && viewItem.products.length > 0 ? (
                  viewItem.products.map(p => (
                    <span key={p} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-semibold border border-blue-100">
                      {p}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400 font-medium">None</span>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

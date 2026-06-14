import { useState } from "react";
import {
  Plus, Eye, Edit, Trash2, CheckCircle, Clock,
  FileText, XCircle, ChevronRight, Download
} from "lucide-react";
import { Button, Modal, FormField, TextArea, ActionButtons, SearchBar, Pagination } from "./common/UIComponents";

const mockCheckIns = [
  { id: 1, checkin_no: "CI-2026-001", branch: "Main Branch", checkin_date: "2026-06-10", source_type: "Supplier", supplier: "ABC Traders", reference_no: "INV-99812", checked_in_by: "Super Admin", items_count: 2, status: "completed", notes: "Regular stock replenish", products: ["Wireless Bluetooth Headphones", "Cotton Round Neck T-Shirt"] },
  { id: 2, checkin_no: "CI-2026-002", branch: "Branch 02", checkin_date: "2026-06-11", source_type: "Return", supplier: "—", reference_no: "RET-7712", checked_in_by: "Rahul", items_count: 1, status: "completed", notes: "Customer returned items", products: ["Wireless Bluetooth Headphones"] },
  { id: 3, checkin_no: "CI-2026-003", branch: "Branch 03", checkin_date: "2026-06-12", source_type: "Supplier", supplier: "Global Imports", reference_no: "INV-10992", checked_in_by: "Meena", items_count: 1, status: "pending", notes: "Under inspection", products: ["Cotton Round Neck T-Shirt"] },
  { id: 4, checkin_no: "CI-2026-004", branch: "Kandy Branch", checkin_date: "2026-06-13", source_type: "Adjustment", supplier: "—", reference_no: "ADJ-0012", checked_in_by: "Arun", items_count: 1, status: "draft", notes: "Found during audit", products: ["Running Sneakers"] },
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
const suppliers = ["ABC Traders", "XYZ Supplies", "Global Imports", "Local Mart", "Premium Distributors", "Tech Wholesale"];
const availableProducts = [
  "Wireless Bluetooth Headphones",
  "Cotton Round Neck T-Shirt",
  "Running Sneakers",
  "Vitamin C Tablets 500mg"
];

export default function CheckInPage({ embedded }) {
  const [checkins, setCheckins] = useState(mockCheckIns);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddPage, setShowAddPage] = useState(false);
  const [showEditPage, setShowEditPage] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [form, setForm] = useState({ branch: "", checkin_date: "", source_type: "", supplier: "", reference_no: "", checked_in_by: "", status: "draft", products: [] });
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = checkins.filter(c =>
    (statusFilter === "all" || c.status === statusFilter) &&
    (c.checkin_no.toLowerCase().includes(search.toLowerCase()) ||
     c.branch.toLowerCase().includes(search.toLowerCase()) ||
     c.supplier.toLowerCase().includes(search.toLowerCase()) ||
     c.reference_no.toLowerCase().includes(search.toLowerCase()))
  );
  const total = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openAdd = () => {
    setEditItem(null);
    setForm({ branch: "", checkin_date: "", source_type: "", supplier: "", reference_no: "", checked_in_by: "", status: "draft", products: [] });
    setShowAddPage(true);
  };

  const openEdit = (c) => {
    setEditItem(c);
    setForm({ branch: c.branch, checkin_date: c.checkin_date, source_type: c.source_type, supplier: c.supplier, reference_no: c.reference_no, checked_in_by: c.checked_in_by, status: c.status, products: c.products || [] });
    setShowEditPage(true);
  };

  const handleSave = () => {
    if (!form.branch || !form.source_type) return;
    if (editItem) {
      setCheckins(prev => prev.map(c => c.id === editItem.id ? { ...c, ...form } : c));
      setShowEditPage(false);
    } else {
      const num = `CI-2026-00${checkins.length + 1}`;
      setCheckins(prev => [...prev, { ...form, id: Date.now(), checkin_no: num, items_count: form.products ? form.products.length : 0 }]);
      setShowAddPage(false);
    }
  };

  const handleDelete = (id) => setCheckins(prev => prev.filter(c => c.id !== id));

  const CheckInForm = ({ data, setData, onSave, onCancel, saveLabel }) => {
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
            <label className="block text-sm font-semibold text-slate-700 mb-1">Source Type <span className="text-red-400">*</span></label>
            <select value={data.source_type} onChange={e => setData(f => ({ ...f, source_type: e.target.value, supplier: e.target.value === "Supplier" || e.target.value === "Purchase Order" ? f.supplier : "—" }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
              <option value="">Select source type...</option>
              <option value="Supplier">Supplier</option>
              <option value="Purchase Order">Purchase Order</option>
              <option value="Return">Return</option>
              <option value="Adjustment">Adjustment</option>
            </select>
          </div>
        </div>

        {(data.source_type === "Supplier" || data.source_type === "Purchase Order") && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Supplier</label>
            <select value={data.supplier === "—" ? "" : data.supplier} onChange={e => setData(f => ({ ...f, supplier: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
              <option value="">Select supplier...</option>
              {suppliers.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Check In Date" type="date" value={data.checkin_date} onChange={e => setData(f => ({ ...f, checkin_date: e.target.value }))} />
          <FormField label="Reference Number" placeholder="INV-1234" value={data.reference_no} onChange={e => setData(f => ({ ...f, reference_no: e.target.value }))} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Checked In By" placeholder="Staff Name" value={data.checked_in_by} onChange={e => setData(f => ({ ...f, checked_in_by: e.target.value }))} />
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
            <select value={data.status} onChange={e => setData(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
              {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-slate-700">Select Products to Check In</p>
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
            <h1 className="text-2xl font-bold text-slate-800">Add Stock Check In</h1>
            <p className="text-sm text-slate-400 mt-0.5">Record incoming inventory items</p>
          </div>
          <Button variant="primary" onClick={() => { setShowAddPage(false); }} className="shadow-sm">
            Back to Check Ins <ChevronRight size={16} />
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 w-full">
          <CheckInForm
            data={form}
            setData={setForm}
            onSave={handleSave}
            onCancel={() => { setShowAddPage(false); }}
            saveLabel="Perform Check In"
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
            <h1 className="text-2xl font-bold text-slate-800">Edit Stock Check In</h1>
            <p className="text-sm text-slate-400 mt-0.5">Modify check in details</p>
          </div>
          <Button variant="primary" onClick={() => { setShowEditPage(false); setEditItem(null); }} className="shadow-sm">
            Back to Check Ins <ChevronRight size={16} />
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 w-full">
          <CheckInForm
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

  const statCounts = Object.keys(statusConfig).reduce((acc, s) => ({ ...acc, [s]: checkins.filter(c => c.status === s).length }), {});

  return (
    <div className={embedded ? "p-5" : "p-5 bg-gray-50 min-h-screen"}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800 font-sans">Stock Check Ins</h1>
          <p className="text-sm text-gray-400 mt-0.5">{checkins.length} total records across all branches</p>
        </div>
        <Button onClick={openAdd} icon={Plus}>New Check In</Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Check Ins", value: checkins.length, icon: Download, bg: "bg-blue-50", color: "text-blue-600" },
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
            placeholder="Search Check In, branch, reference..."
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

      <p className="text-sm text-slate-600 mb-4 font-sans">Showing {filtered.length} check in records</p>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm font-sans">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Check In No</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Branch</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Date</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Source Type</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Supplier</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Ref No</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Items</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c, i) => (
              <tr key={c.id} className={`border-t border-gray-50 hover:bg-blue-50/30 transition ${i % 2 !== 0 ? "bg-gray-50/30" : ""}`}>
                <td className="px-4 py-3 text-xs font-mono text-blue-600 font-semibold text-left">{c.checkin_no}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-700 text-left">{c.branch}</td>
                <td className="px-4 py-3 text-xs text-slate-500 text-left">{c.checkin_date}</td>
                <td className="px-4 py-3 text-xs font-medium text-slate-600 text-left">{c.source_type}</td>
                <td className="px-4 py-3 text-sm text-slate-500 text-left">{c.supplier}</td>
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
            {paged.length === 0 && <tr><td colSpan={9} className="px-5 py-10 text-center text-sm text-gray-400">No check ins found.</td></tr>}
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
        <Modal title="Check In Details" onClose={() => setViewItem(null)}>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-800 font-mono">{viewItem.checkin_no}</h3>
                <StatusBadge status={viewItem.status} />
              </div>
              <p className="text-sm text-gray-500">{viewItem.branch} · Ref: {viewItem.reference_no}</p>
            </div>
            {[
              { label: "Check In Date", value: viewItem.checkin_date },
              { label: "Source Type", value: viewItem.source_type },
              { label: "Supplier", value: viewItem.supplier },
              { label: "Checked In By", value: viewItem.checked_in_by },
              { label: "Items Count", value: `${viewItem.items_count} items` },
              { label: "Notes", value: viewItem.notes || "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-400">{label}</span>
                <span className="text-sm font-semibold text-slate-700">{value}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Products Checked In</p>
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

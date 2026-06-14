import { useState } from "react";
import {
  Plus, Eye, Edit, Trash2, CheckCircle, Clock,
  FileText, XCircle, ChevronRight, CornerDownLeft, AlertCircle
} from "lucide-react";
import { Button, Modal, FormField, TextArea, ActionButtons, SearchBar, Pagination } from "./common/UIComponents";

const mockRequests = [
  { id: 1, request_no: "BR-2026-001", branch: "Branch 02", request_date: "2026-06-10", requested_by: "Rahul", priority: "High", status: "pending", notes: "Low stock on key electronics", requested_products: [{ name: "Wireless Bluetooth Headphones", qty: 25 }, { name: "Cotton Round Neck T-Shirt", qty: 40 }] },
  { id: 2, request_no: "BR-2026-002", branch: "Branch 03", request_date: "2026-06-11", requested_by: "Meena", priority: "Medium", status: "approved", notes: "Weekly replenishment", requested_products: [{ name: "Running Sneakers", qty: 15 }] },
  { id: 3, request_no: "BR-2026-003", branch: "Kandy Branch", request_date: "2026-06-12", requested_by: "Arun", priority: "Low", status: "fulfilled", notes: "Office requisitions fulfilled", requested_products: [{ name: "Vitamin C Tablets 500mg", qty: 50 }] },
  { id: 4, request_no: "BR-2026-004", branch: "Branch 02", request_date: "2026-06-13", requested_by: "Rahul", priority: "High", status: "rejected", notes: "Outside budget allocation", requested_products: [{ name: "Wireless Bluetooth Headphones", qty: 100 }] },
];

const priorityConfig = {
  High:   { label: "High",   cls: "bg-red-50 text-red-600 border border-red-100" },
  Medium: { label: "Medium", cls: "bg-amber-50 text-amber-600 border border-amber-100" },
  Low:    { label: "Low",    cls: "bg-slate-50 text-slate-600 border border-slate-100" },
};

const statusConfig = {
  pending:   { label: "Pending",   cls: "bg-amber-100 text-amber-700",  icon: Clock },
  approved:  { label: "Approved",  cls: "bg-blue-100 text-blue-700",    icon: CheckCircle },
  fulfilled: { label: "Fulfilled", cls: "bg-green-100 text-green-700",  icon: CheckCircle },
  rejected:  { label: "Rejected",  cls: "bg-red-100 text-red-600",      icon: XCircle },
};

const PriorityBadge = ({ priority }) => {
  const cfg = priorityConfig[priority] || priorityConfig.Low;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.pending;
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

export default function BranchRequestsPage({ embedded }) {
  const [requests, setRequests] = useState(mockRequests);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showAddPage, setShowAddPage] = useState(false);
  const [showEditPage, setShowEditPage] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [form, setForm] = useState({ branch: "", request_date: "", requested_by: "", priority: "Medium", status: "pending", notes: "", requested_products: [] });
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = requests.filter(r =>
    (statusFilter === "all" || r.status === statusFilter) &&
    (priorityFilter === "all" || r.priority === priorityFilter) &&
    (r.request_no.toLowerCase().includes(search.toLowerCase()) ||
     r.branch.toLowerCase().includes(search.toLowerCase()) ||
     r.requested_by.toLowerCase().includes(search.toLowerCase()))
  );
  const total = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openAdd = () => {
    setEditItem(null);
    setForm({ branch: "", request_date: "", requested_by: "", priority: "Medium", status: "pending", notes: "", requested_products: [] });
    setShowAddPage(true);
  };

  const openEdit = (r) => {
    setEditItem(r);
    setForm({ branch: r.branch, request_date: r.request_date, requested_by: r.requested_by, priority: r.priority, status: r.status, notes: r.notes, requested_products: r.requested_products || [] });
    setShowEditPage(true);
  };

  const handleSave = () => {
    if (!form.branch || !form.requested_by) return;
    if (editItem) {
      setRequests(prev => prev.map(r => r.id === editItem.id ? { ...r, ...form } : r));
      setShowEditPage(false);
    } else {
      const num = `BR-2026-00${requests.length + 1}`;
      setRequests(prev => [...prev, { ...form, id: Date.now(), request_no: num }]);
      setShowAddPage(false);
    }
  };

  const handleDelete = (id) => setRequests(prev => prev.filter(r => r.id !== id));

  const BranchRequestForm = ({ data, setData, onSave, onCancel, saveLabel, isAdminMode }) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Branch <span className="text-red-400">*</span></label>
            <select disabled={isAdminMode} value={data.branch} onChange={e => setData(f => ({ ...f, branch: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 disabled:opacity-60">
              <option value="">Select branch...</option>
              {branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <FormField disabled={isAdminMode} label="Requested By" required placeholder="Manager Name" value={data.requested_by} onChange={e => setData(f => ({ ...f, requested_by: e.target.value }))} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField disabled={isAdminMode} label="Request Date" type="date" value={data.request_date} onChange={e => setData(f => ({ ...f, request_date: e.target.value }))} />
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Priority</label>
            <select disabled={isAdminMode} value={data.priority} onChange={e => setData(f => ({ ...f, priority: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 disabled:opacity-60">
              {Object.keys(priorityConfig).map(pr => <option key={pr} value={pr}>{pr}</option>)}
            </select>
          </div>
        </div>

        {isAdminMode && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
            <select value={data.status} onChange={e => setData(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
              {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-slate-700">Requested Products & Quantities</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200 max-h-56 overflow-y-auto">
            {availableProducts.map(prod => {
              const item = data.requested_products?.find(p => p.name === prod);
              const isChecked = !!item;
              return (
                <div key={prod} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 font-medium">
                    <input
                      disabled={isAdminMode}
                      type="checkbox"
                      checked={isChecked}
                      onChange={e => {
                        const checked = e.target.checked;
                        setData(f => {
                          const list = f.requested_products || [];
                          const next = checked
                            ? [...list, { name: prod, qty: 1 }]
                            : list.filter(p => p.name !== prod);
                          return { ...f, requested_products: next };
                        });
                      }}
                      className="w-4 h-4 accent-blue-600 rounded cursor-pointer disabled:opacity-60"
                    />
                    {prod}
                  </label>
                  {isChecked && (
                    <input
                      disabled={isAdminMode}
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.qty || ""}
                      onChange={e => {
                        const val = parseInt(e.target.value) || 1;
                        setData(f => ({
                          ...f,
                          requested_products: f.requested_products.map(p => p.name === prod ? { ...p, qty: val } : p)
                        }));
                      }}
                      className="w-16 px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50 disabled:opacity-60 text-right"
                    />
                  )}
                </div>
              );
            })}
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
            <h1 className="text-2xl font-bold text-slate-800">Add Branch Request</h1>
            <p className="text-sm text-slate-400 mt-0.5">Create a new branch requisition request</p>
          </div>
          <Button variant="primary" onClick={() => { setShowAddPage(false); }} className="shadow-sm">
            Back to Requests <ChevronRight size={16} />
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 w-full">
          <BranchRequestForm
            data={form}
            setData={setForm}
            onSave={handleSave}
            onCancel={() => { setShowAddPage(false); }}
            saveLabel="Submit Request"
            isAdminMode={false}
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
            <h1 className="text-2xl font-bold text-slate-800">Review Branch Request</h1>
            <p className="text-sm text-slate-400 mt-0.5">Admin review and status modification</p>
          </div>
          <Button variant="primary" onClick={() => { setShowEditPage(false); setEditItem(null); }} className="shadow-sm">
            Back to Requests <ChevronRight size={16} />
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 w-full">
          <BranchRequestForm
            data={form}
            setData={setForm}
            onSave={handleSave}
            onCancel={() => { setShowEditPage(false); setEditItem(null); }}
            saveLabel="Save Changes"
            isAdminMode={true}
          />
        </div>
      </div>
    );
  }

  const statCounts = Object.keys(statusConfig).reduce((acc, s) => ({ ...acc, [s]: requests.filter(r => r.status === s).length }), {});

  return (
    <div className={embedded ? "p-5" : "p-5 bg-gray-50 min-h-screen"}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800 font-sans">Branch Requests</h1>
          <p className="text-sm text-gray-400 mt-0.5">{requests.length} stock requisitions recorded</p>
        </div>
        <Button onClick={openAdd} icon={Plus}>New Request</Button>
      </div>

      {/* Stats Summary Cards (Static) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><FileText size={18} className="text-blue-600" /></div>
          <div><p className="text-xs text-gray-400">Total Requests</p><p className="text-xl font-bold text-slate-800">{requests.length}</p></div>
        </div>
        {Object.entries(statusConfig).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <div key={key} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${cfg.cls.split(" ")[0]} flex items-center justify-center`}><Icon size={18} className={cfg.cls.split(" ")[1]} /></div>
              <div><p className="text-xs text-gray-400">{cfg.label}</p><p className="text-xl font-bold text-slate-800">{statCounts[key] || 0}</p></div>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 w-full">
        <div className="flex-1 min-w-0">
          <SearchBar
            search={search}
            setSearch={val => { setSearch(val); setPage(1); }}
            placeholder="Search request, branch, staff..."
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all duration-200 font-sans"
          >
            <option value="all">All Statuses</option>
            {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select
            value={priorityFilter}
            onChange={e => { setPriorityFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all duration-200 font-sans"
          >
            <option value="all">All Priorities</option>
            {Object.keys(priorityConfig).map(pr => <option key={pr} value={pr}>{pr}</option>)}
          </select>
        </div>
      </div>

      <p className="text-sm text-slate-600 mb-4 font-sans font-medium">Showing {filtered.length} request records</p>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm font-sans">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Request No</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Branch</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Requested By</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Date</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Priority</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Items</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r, i) => (
              <tr key={r.id} className={`border-t border-gray-50 hover:bg-blue-50/30 transition ${i % 2 !== 0 ? "bg-gray-50/30" : ""}`}>
                <td className="px-4 py-3 text-xs font-mono text-blue-600 font-semibold text-left">{r.request_no}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-700 text-left">{r.branch}</td>
                <td className="px-4 py-3 text-sm text-slate-600 text-left">{r.requested_by}</td>
                <td className="px-4 py-3 text-xs text-slate-500 text-left">{r.request_date}</td>
                <td className="px-4 py-3 text-center"><PriorityBadge priority={r.priority} /></td>
                <td className="px-4 py-3 text-sm text-slate-600 text-center font-semibold">{r.requested_products ? r.requested_products.length : 0}</td>
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
            {paged.length === 0 && <tr><td colSpan={8} className="px-5 py-10 text-center text-sm text-gray-400">No requests found.</td></tr>}
          </tbody>
        </table>

        <Pagination
          currentPage={page}
          totalPages={total}
          setCurrentPage={setPage}
          showingText={`Showing ${Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–${Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}`}
        />
      </div>

      {viewItem && (
        <Modal title="Branch Requisition Details" onClose={() => setViewItem(null)}>
          <div className="space-y-4 font-sans">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-800 font-mono">{viewItem.request_no}</h3>
                <StatusBadge status={viewItem.status} />
              </div>
              <p className="text-sm text-gray-500">{viewItem.branch} · Priority: <span className="font-semibold">{viewItem.priority}</span></p>
            </div>
            {[
              { label: "Requested By", value: viewItem.requested_by },
              { label: "Request Date", value: viewItem.request_date },
              { label: "Notes", value: viewItem.notes || "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-400">{label}</span>
                <span className="text-sm font-semibold text-slate-700">{value}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Requested Products List</p>
              <div className="space-y-2">
                {viewItem.requested_products && viewItem.requested_products.length > 0 ? (
                  viewItem.requested_products.map(p => (
                    <div key={p.name} className="flex justify-between items-center p-2.5 bg-blue-50/40 rounded-xl border border-blue-50 text-xs">
                      <span className="font-semibold text-slate-800">{p.name}</span>
                      <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full font-bold">Qty : {p.qty}</span>
                    </div>
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

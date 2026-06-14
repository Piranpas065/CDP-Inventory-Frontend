import { useState } from "react";
import {
  Plus, Eye, Edit, Trash2, CheckCircle, Clock,
  FileText, Truck, XCircle, ChevronRight
} from "lucide-react";
import { Button, Modal, FormField, TextArea, ActionButtons, SearchBar, Pagination } from "./common/UIComponents";

const mockPOs = [
  { id: 1, po_number: "PO-2026-001", supplier: "ABC Traders", branch: "Main Branch", order_date: "2026-06-01", expected_date: "2026-06-10", total_amount: "Rs. 45,000", status: "approved", items: 12, notes: "Urgent order", ordered_products: ["Wireless Bluetooth Headphones"] },
  { id: 2, po_number: "PO-2026-002", supplier: "XYZ Supplies", branch: "Branch 02", order_date: "2026-06-02", expected_date: "2026-06-12", total_amount: "Rs. 28,500", status: "pending", items: 8, notes: "", ordered_products: ["Wireless Bluetooth Headphones"] },
  { id: 3, po_number: "PO-2026-003", supplier: "Global Imports", branch: "Branch 03", order_date: "2026-06-03", expected_date: "2026-06-13", total_amount: "Rs. 72,000", status: "received", items: 20, notes: "Electronics batch", ordered_products: ["Cotton Round Neck T-Shirt"] },
  { id: 4, po_number: "PO-2026-004", supplier: "Local Mart", branch: "Main Branch", order_date: "2026-06-04", expected_date: "2026-06-14", total_amount: "Rs. 15,000", status: "draft", items: 5, notes: "", ordered_products: ["Cotton Round Neck T-Shirt"] },
  { id: 5, po_number: "PO-2026-005", supplier: "Premium Distributors", branch: "Kandy Branch", order_date: "2026-06-05", expected_date: "2026-06-15", total_amount: "Rs. 91,000", status: "approved", items: 30, notes: "Monthly restock", ordered_products: ["Running Sneakers"] },
  { id: 6, po_number: "PO-2026-006", supplier: "Tech Wholesale", branch: "Galle Branch", order_date: "2026-06-06", expected_date: "2026-06-16", total_amount: "Rs. 33,000", status: "cancelled", items: 11, notes: "Cancelled by supplier", ordered_products: ["Vitamin C Tablets 500mg"] },
  { id: 7, po_number: "PO-2026-007", supplier: "ABC Traders", branch: "Branch 02", order_date: "2026-06-07", expected_date: "2026-06-17", total_amount: "Rs. 56,500", status: "pending", items: 17, notes: "", ordered_products: ["Wireless Bluetooth Headphones", "Cotton Round Neck T-Shirt"] },
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

const supplierProductsMap = {
  "ABC Traders": ["Wireless Bluetooth Headphones", "Cotton Round Neck T-Shirt"],
  "XYZ Supplies": ["Wireless Bluetooth Headphones"],
  "Global Imports": ["Cotton Round Neck T-Shirt"],
  "Local Mart": ["Cotton Round Neck T-Shirt"],
  "Premium Distributors": ["Running Sneakers"],
  "Tech Wholesale": ["Vitamin C Tablets 500mg"],
};

export default function PurchaseOrdersPage({ embedded }) {
  const [pos, setPOs] = useState(mockPOs);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddPage, setShowAddPage] = useState(false);
  const [showEditPage, setShowEditPage] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [form, setForm] = useState({ supplier: "", branch: "", order_date: "", expected_date: "", notes: "", status: "draft", ordered_products: [] });
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

  const openAdd = () => {
    setEditItem(null);
    setForm({ supplier: "", branch: "", order_date: "", expected_date: "", notes: "", status: "draft", ordered_products: [] });
    setShowAddPage(true);
  };
  const openEdit = (p) => {
    setEditItem(p);
    setForm({ supplier: p.supplier, branch: p.branch, order_date: p.order_date, expected_date: p.expected_date, notes: p.notes, status: p.status, ordered_products: p.ordered_products || [] });
    setShowEditPage(true);
  };
  const handleSave = () => {
    if (!form.supplier || !form.branch) return;
    if (editItem) {
      setPOs(prev => prev.map(p => p.id === editItem.id ? { ...p, ...form } : p));
      setShowEditPage(false);
    } else {
      const num = `PO-2026-00${pos.length + 1}`;
      setPOs(prev => [...prev, { ...form, id: Date.now(), po_number: num, total_amount: "Rs. 0", items: form.ordered_products ? form.ordered_products.length : 0, ordered_products: form.ordered_products || [] }]);
      setShowAddPage(false);
    }
  };
  const handleDelete = (id) => setPOs(prev => prev.filter(p => p.id !== id));

  const PurchaseOrderForm = ({ data, setData, onSave, onCancel, saveLabel }) => {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Supplier <span className="text-red-400">*</span></label>
          <select value={data.supplier} onChange={e => setData(f => ({ ...f, supplier: e.target.value, ordered_products: [] }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
            <option value="">Select supplier...</option>
            {suppliers.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {data.supplier && (
            <div className="mt-3 space-y-1.5">
              <p className="text-sm font-semibold text-slate-700">Select Products to Order</p>
              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200 max-h-36 overflow-y-auto">
                {supplierProductsMap[data.supplier] && supplierProductsMap[data.supplier].length > 0 ? (
                  supplierProductsMap[data.supplier].map(prod => (
                    <label key={prod} className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 font-medium">
                      <input
                        type="checkbox"
                        checked={data.ordered_products?.includes(prod)}
                        onChange={e => {
                          const checked = e.target.checked;
                          setData(f => {
                            const currentProds = f.ordered_products || [];
                            const nextProds = checked
                              ? [...currentProds, prod]
                              : currentProds.filter(p => p !== prod);
                            return { ...f, ordered_products: nextProds };
                          });
                        }}
                        className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                      />
                      {prod}
                    </label>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 font-medium">No products available</span>
                )}
              </div>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Branch <span className="text-red-400">*</span></label>
          <select value={data.branch} onChange={e => setData(f => ({ ...f, branch: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
            <option value="">Select branch...</option>
            {branches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Order Date" type="date" value={data.order_date} onChange={e => setData(f => ({ ...f, order_date: e.target.value }))} />
          <FormField label="Expected Date" type="date" value={data.expected_date} onChange={e => setData(f => ({ ...f, expected_date: e.target.value }))} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
          <select value={data.status} onChange={e => setData(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
            {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
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
      <div className="p-5 min-h-full bg-gray-50" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Add Purchase Order</h1>
            <p className="text-sm text-slate-400 mt-0.5">Create a new purchase order</p>
          </div>
          <Button variant="primary" onClick={() => { setShowAddPage(false); }} className="shadow-sm">
            Back to Purchase Orders <ChevronRight size={16} />
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 w-full">
          <PurchaseOrderForm
            data={form}
            setData={setForm}
            onSave={handleSave}
            onCancel={() => { setShowAddPage(false); }}
            saveLabel="Add PO"
          />
        </div>
      </div>
    );
  }

  if (showEditPage && editItem) {
    return (
      <div className="p-5 min-h-full bg-gray-50" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Edit Purchase Order</h1>
            <p className="text-sm text-slate-400 mt-0.5">Update purchase order details</p>
          </div>
          <Button variant="primary" onClick={() => { setShowEditPage(false); setEditItem(null); }} className="shadow-sm">
            Back to Purchase Orders <ChevronRight size={16} />
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 w-full">
          <PurchaseOrderForm
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

      {/* Add/Edit Modal is replaced by full pages */}

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
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Products Ordered</p>
              <div className="flex flex-wrap gap-1.5">
                {viewItem.ordered_products && viewItem.ordered_products.length > 0 ? (
                  viewItem.ordered_products.map(p => (
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
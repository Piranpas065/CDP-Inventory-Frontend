import { useState } from "react";
import {
  ClipboardList, Plus, FileSpreadsheet, Eye, Edit, Trash2,
  ChevronLeft, ChevronRight, XCircle, CheckCircle, Clock,
  Calendar, Building2, User, AlertTriangle, RefreshCw
} from "lucide-react";
import {
  Button, Modal, FormField, TextArea,
  ActionButtons, SearchBar, Pagination
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

const mockSystemStock = {
  "Main Branch": {
    "SKU-001-BLK": 50,
    "SKU-001-WHT": 15,
    "SKU-002-LG": 30,
    "SKU-002-SM": 25,
    "SKU-003-42": 20,
    "SKU-004-BRN": 45,
  },
  "Branch 02": {
    "SKU-001-BLK": 40,
    "SKU-001-WHT": 10,
    "SKU-002-LG": 20,
    "SKU-002-SM": 15,
    "SKU-003-42": 15,
    "SKU-004-BRN": 40,
  },
  "Branch 03": {
    "SKU-001-BLK": 30,
    "SKU-001-WHT": 10,
    "SKU-002-LG": 15,
    "SKU-002-SM": 10,
    "SKU-003-42": 10,
    "SKU-004-BRN": 35,
  },
  "Kandy Branch": {
    "SKU-001-BLK": 25,
    "SKU-001-WHT": 5,
    "SKU-002-LG": 10,
    "SKU-002-SM": 8,
    "SKU-003-42": 5,
    "SKU-004-BRN": 20,
  },
  "Galle Branch": {
    "SKU-001-BLK": 20,
    "SKU-001-WHT": 5,
    "SKU-002-LG": 8,
    "SKU-002-SM": 5,
    "SKU-003-42": 5,
    "SKU-004-BRN": 15,
  }
};

const initialStockTakes = [
  {
    id: 1,
    take_number: "STK-2026-001",
    branch_name: "Main Branch",
    take_date: "2026-06-10",
    status: "approved",
    created_by: "Rahul",
    approved_by: "Arun",
    notes: "Quarterly electronics audit",
    items: [
      { id: 1, product_name: "Wireless Bluetooth Headphones", sku: "SKU-001-BLK", variant: "Black", unit: "Pcs", system_qty: 50, physical_qty: 53, variance: 3 },
      { id: 2, product_name: "Cotton Round Neck T-Shirt", sku: "SKU-002-LG", variant: "L", unit: "Pcs", system_qty: 30, physical_qty: 27, variance: -3 },
    ]
  },
  {
    id: 2,
    take_number: "STK-2026-002",
    branch_name: "Branch 02",
    take_date: "2026-06-11",
    status: "in_progress",
    created_by: "Priya",
    approved_by: "—",
    notes: "Routine monthly check",
    items: [
      { id: 3, product_name: "Running Sneakers", sku: "SKU-003-42", variant: "42", unit: "Pcs", system_qty: 15, physical_qty: 12, variance: -3 },
      { id: 4, product_name: "Leather Wallet", sku: "SKU-004-BRN", variant: "Brown", unit: "Pcs", system_qty: 40, physical_qty: 40, variance: 0 },
    ]
  },
  {
    id: 3,
    take_number: "STK-2026-003",
    branch_name: "Branch 03",
    take_date: "2026-06-12",
    status: "draft",
    created_by: "Super Admin",
    approved_by: "—",
    notes: "Pending confirmation from warehouse staff",
    items: [
      { id: 5, product_name: "Wireless Bluetooth Headphones", sku: "SKU-001-WHT", variant: "White", unit: "Pcs", system_qty: 10, physical_qty: 10, variance: 0 },
    ]
  }
];

const statusConfig = {
  draft:       { label: "Draft",       cls: "bg-gray-100 text-gray-600" },
  in_progress: { label: "In Progress", cls: "bg-blue-100 text-blue-700" },
  completed:   { label: "Completed",   cls: "bg-amber-100 text-amber-700" },
  approved:    { label: "Approved",    cls: "bg-green-100 text-green-700" },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.draft;
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>{cfg.label}</span>;
};

export default function StockTakesPage({ embedded }) {
  const [takes, setTakes] = useState(initialStockTakes);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const [form, setForm] = useState({
    branch_name: "",
    take_date: "",
    status: "draft",
    notes: "",
  });
  const [formItems, setFormItems] = useState([]);

  // Stats
  const totalTakes = takes.length;
  const approvedTakes = takes.filter(t => t.status === "approved").length;
  const inProgressTakes = takes.filter(t => t.status === "in_progress" || t.status === "draft").length;
  const discrepancyTakes = takes.filter(t => t.items.some(item => item.variance !== 0)).length;

  // Filter & Search
  const filtered = takes.filter(t => {
    const matchesSearch =
      t.take_number.toLowerCase().includes(search.toLowerCase()) ||
      t.branch_name.toLowerCase().includes(search.toLowerCase()) ||
      t.notes.toLowerCase().includes(search.toLowerCase()) ||
      t.created_by.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" ? true : t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const total = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Actions
  const openAdd = () => {
    setEditItem(null);
    setForm({
      branch_name: "Main Branch",
      take_date: new Date().toISOString().split("T")[0],
      status: "draft",
      notes: "",
    });
    setFormItems([{ id: Date.now(), product_name: "", sku: "", variant: "", unit: "Pcs", system_qty: 0, physical_qty: 0, variance: 0 }]);
    setShowModal(true);
  };

  const openEdit = (t) => {
    setEditItem(t);
    setForm({
      branch_name: t.branch_name,
      take_date: t.take_date,
      status: t.status,
      notes: t.notes,
    });
    setFormItems(t.items.map(item => ({ ...item })));
    setShowModal(true);
  };

  const handleBranchChange = (branchName) => {
    setForm(f => ({ ...f, branch_name: branchName }));
    // Update system quantities for items already in the form list based on new branch
    setFormItems(prev => prev.map(item => {
      if (!item.sku) return item;
      const systemQty = mockSystemStock[branchName]?.[item.sku] ?? 0;
      return {
        ...item,
        system_qty: systemQty,
        variance: item.physical_qty - systemQty
      };
    }));
  };

  const handleItemProductChange = (index, productSku) => {
    const selectedProd = flatProductList.find(p => p.sku === productSku);
    if (!selectedProd) return;

    const currentBranch = form.branch_name || "Main Branch";
    const systemQty = mockSystemStock[currentBranch]?.[productSku] ?? 0;

    setFormItems(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        product_name: selectedProd.product_name,
        sku: selectedProd.sku,
        variant: selectedProd.variant,
        unit: selectedProd.unit,
        system_qty: systemQty,
        variance: updated[index].physical_qty - systemQty
      };
      return updated;
    });
  };

  const handleItemPhysicalQtyChange = (index, physicalQtyVal) => {
    const physicalQty = parseFloat(physicalQtyVal) || 0;
    setFormItems(prev => {
      const updated = [...prev];
      const systemQty = updated[index].system_qty || 0;
      updated[index] = {
        ...updated[index],
        physical_qty: physicalQty,
        variance: physicalQty - systemQty
      };
      return updated;
    });
  };

  const handleItemSystemQtyChange = (index, systemQtyVal) => {
    const systemQty = parseFloat(systemQtyVal) || 0;
    setFormItems(prev => {
      const updated = [...prev];
      const physicalQty = updated[index].physical_qty || 0;
      updated[index] = {
        ...updated[index],
        system_qty: systemQty,
        variance: physicalQty - systemQty
      };
      return updated;
    });
  };

  const addRow = () => {
    setFormItems(prev => [...prev, { id: Date.now(), product_name: "", sku: "", variant: "", unit: "Pcs", system_qty: 0, physical_qty: 0, variance: 0 }]);
  };

  const removeRow = (index) => {
    setFormItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!form.branch_name || !form.take_date) return;
    const validItems = formItems.filter(item => item.sku !== "");
    if (validItems.length === 0) return;

    if (editItem) {
      setTakes(prev => prev.map(t => t.id === editItem.id ? {
        ...t,
        ...form,
        items: validItems,
        approved_by: form.status === "approved" ? "Super Admin" : t.approved_by === "—" ? "—" : t.approved_by
      } : t));
    } else {
      setTakes(prev => [
        {
          ...form,
          id: Date.now(),
          take_number: `STK-2026-00${prev.length + 1}`,
          created_by: "Super Admin",
          approved_by: form.status === "approved" ? "Super Admin" : "—",
          items: validItems
        },
        ...prev
      ]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Stock Take?")) {
      setTakes(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleApprove = (take) => {
    setTakes(prev => prev.map(t => t.id === take.id ? { ...t, status: "approved", approved_by: "Super Admin" } : t));
    setViewItem(null);
  };

  return (
    <div className={embedded ? "p-5" : "p-5 bg-gray-50 min-h-screen"}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Stock Takes</h1>
          <p className="text-sm text-gray-400 mt-0.5">Audit and reconcile physical inventory</p>
        </div>
        <Button onClick={openAdd} icon={Plus}>New Stock Take</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Audits", value: totalTakes, icon: ClipboardList, bg: "bg-blue-50", color: "text-blue-600" },
          { label: "Approved Takes", value: approvedTakes, icon: CheckCircle, bg: "bg-green-50", color: "text-green-600" },
          { label: "In Progress", value: inProgressTakes, icon: Clock, bg: "bg-amber-50", color: "text-amber-600" },
          { label: "Discrepancy Takes", value: discrepancyTakes, icon: AlertTriangle, bg: "bg-rose-50", color: "text-rose-600" },
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
          placeholder="Search by take number, branch, creator..."
          filterOptions={[
            { label: "All", value: "all" },
            { label: "Draft", value: "draft" },
            { label: "In Progress", value: "in_progress" },
            { label: "Completed", value: "completed" },
            { label: "Approved", value: "approved" },
          ]}
          selectedFilter={filterStatus}
          setSelectedFilter={val => { setFilterStatus(val); setPage(1); }}
        />
      </div>

      <p className="text-sm text-slate-600 mb-4">Showing {filtered.length} stock takes</p>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Take No</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Branch</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Date</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Total Items</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Discrepancies</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Created By</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Approved By</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((t, i) => {
              const discrepanciesCount = t.items.filter(item => item.variance !== 0).length;
              return (
                <tr key={t.id} className={`border-t border-gray-50 hover:bg-blue-50/30 transition ${i % 2 !== 0 ? "bg-gray-50/30" : ""}`}>
                  <td className="px-4 py-3 text-xs font-mono text-blue-600 font-semibold text-left">{t.take_number}</td>
                  <td className="px-4 py-3 text-left">
                    <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">{t.branch_name}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 text-left">{t.take_date}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 text-center">{t.items.length}</td>
                  <td className="px-4 py-3 text-center">
                    {discrepanciesCount > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600">
                        <AlertTriangle size={10} /> {discrepanciesCount} {discrepanciesCount === 1 ? "item" : "items"}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                        <CheckCircle size={10} /> None
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 text-left">{t.created_by}</td>
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
              );
            })}
            {paged.length === 0 && <tr><td colSpan={9} className="px-5 py-10 text-center text-sm text-gray-400">No stock takes found.</td></tr>}
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
        <Modal title="Stock Take Details" onClose={() => setViewItem(null)} wide>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50/70 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 font-mono mb-1">{viewItem.take_number}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-600 bg-white px-2 py-0.5 rounded-lg border">{viewItem.branch_name}</span>
                  <span className="text-xs text-gray-400">{viewItem.take_date}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={viewItem.status} />
                {viewItem.status !== "approved" && (
                  <Button variant="primary" onClick={() => handleApprove(viewItem)}>
                    Approve Take
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-100">
              <div>
                <span className="text-xs text-gray-400 block">Created By</span>
                <span className="text-sm font-semibold text-slate-700">{viewItem.created_by}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Approved By</span>
                <span className="text-sm font-semibold text-slate-700">{viewItem.approved_by}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Total Items</span>
                <span className="text-sm font-semibold text-slate-700">{viewItem.items.length} items</span>
              </div>
            </div>

            {viewItem.notes && (
              <div className="bg-gray-50 p-3 rounded-xl">
                <span className="text-xs text-gray-400 block mb-1">Notes</span>
                <p className="text-sm text-slate-600">{viewItem.notes}</p>
              </div>
            )}

            {/* Audit Items Table */}
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-2">Audit Items</h4>
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Product</th>
                      <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">SKU / Variant</th>
                      <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase text-center">Unit</th>
                      <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase text-center">System Qty</th>
                      <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase text-center">Physical Qty</th>
                      <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase text-center">Variance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewItem.items.map((item, i) => (
                      <tr key={item.id || i} className="border-t border-gray-50">
                        <td className="px-4 py-2.5 text-sm font-medium text-slate-800">{item.product_name}</td>
                        <td className="px-4 py-2.5 text-xs">
                          <span className="font-mono text-blue-600 block">{item.sku}</span>
                          <span className="text-gray-400">{item.variant}</span>
                        </td>
                        <td className="px-4 py-2.5 text-xs text-gray-600 text-center">{item.unit}</td>
                        <td className="px-4 py-2.5 text-sm font-semibold text-slate-700 text-center">{item.system_qty}</td>
                        <td className="px-4 py-2.5 text-sm font-semibold text-slate-700 text-center">{item.physical_qty}</td>
                        <td className="px-4 py-2.5 text-center">
                          {item.variance > 0 ? (
                            <span className="text-sm font-bold text-green-600">+{item.variance}</span>
                          ) : item.variance < 0 ? (
                            <span className="text-sm font-bold text-rose-600">{item.variance}</span>
                          ) : (
                            <span className="text-sm font-medium text-slate-400">Match</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <Modal title={editItem ? "Edit Stock Take" : "New Stock Take"} onClose={() => setShowModal(false)} wide>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Branch Name <span className="text-red-400">*</span></label>
                <select
                  value={form.branch_name}
                  onChange={e => handleBranchChange(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                >
                  {branches.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <FormField
                label="Take Date"
                type="date"
                value={form.take_date}
                onChange={e => setForm(f => ({ ...f, take_date: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                >
                  <option value="draft">Draft</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="approved">Approved</option>
                </select>
              </div>
            </div>

            <TextArea
              label="Notes"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Optional notes about this audit..."
            />

            {/* Items Editor */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-bold text-slate-700">Audit Products</h4>
                <Button variant="secondary" onClick={addRow} icon={Plus} className="py-1.5 px-3 text-xs">
                  Add Item
                </Button>
              </div>

              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Product Variant <span className="text-red-400">*</span></th>
                      <th className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase text-center w-20">Unit</th>
                      <th className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase text-center w-28">System Qty</th>
                      <th className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase text-center w-28">Physical Qty</th>
                      <th className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase text-center w-24">Variance</th>
                      <th className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase text-center w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formItems.map((item, index) => (
                      <tr key={item.id} className="border-t border-gray-50">
                        <td className="p-2">
                          <select
                            value={item.sku}
                            onChange={e => handleItemProductChange(index, e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                          >
                            <option value="">Select item...</option>
                            {flatProductList.map(p => (
                              <option key={p.sku} value={p.sku}>
                                {p.product_name} ({p.variant})
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-2 text-center text-xs text-gray-500">
                          {item.unit || "—"}
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={item.system_qty}
                            onChange={e => handleItemSystemQtyChange(index, e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-semibold text-slate-700"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={item.physical_qty}
                            onChange={e => handleItemPhysicalQtyChange(index, e.target.value)}
                            placeholder="0"
                            className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-semibold text-slate-700"
                          />
                        </td>
                        <td className="p-2 text-center">
                          {item.variance > 0 ? (
                            <span className="text-xs font-bold text-green-600">+{item.variance}</span>
                          ) : item.variance < 0 ? (
                            <span className="text-xs font-bold text-rose-600">{item.variance}</span>
                          ) : (
                            <span className="text-xs font-semibold text-slate-400">Match</span>
                          )}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => removeRow(index)}
                            disabled={formItems.length === 1}
                            className="p-1 rounded text-red-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 transition focus:outline-none"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                Save Audit
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

import { useState } from "react";
import {
  BadgeAlert, Plus, Eye, Edit, Trash2, Search,
  ChevronLeft, ChevronRight, XCircle, CheckCircle, Clock,
  Building2, User, AlertTriangle, ShieldCheck
} from "lucide-react";
import {
  Button, Modal, FormField, CheckboxField,
  Badge, ActionButtons, SearchBar, Pagination
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

const mockCurrentStock = {
  "Main Branch": {
    "SKU-001-BLK": 8,   // Triggered (min: 20)
    "SKU-001-WHT": 25,
    "SKU-002-LG": 30,
    "SKU-002-SM": 25,
    "SKU-003-42": 20,
    "SKU-004-BRN": 15,  // Not Triggered because rule is inactive (but would trigger if active, current: 15, min: 12)
  },
  "Branch 02": {
    "SKU-001-BLK": 45,
    "SKU-002-LG": 5,   // Triggered (min: 15)
  },
  "Branch 03": {
    "SKU-003-42": 3,   // Triggered (min: 10)
    "SKU-004-BRN": 6,
  },
  "Kandy Branch": {},
  "Galle Branch": {}
};

const initialReorderLevels = [
  {
    id: 1,
    product_name: "Wireless Bluetooth Headphones",
    sku: "SKU-001-BLK",
    variant: "Black",
    unit: "Pcs",
    branch_name: "Main Branch",
    min_quantity: 20,
    reorder_quantity: 50,
    is_active: true,
  },
  {
    id: 2,
    product_name: "Cotton Round Neck T-Shirt",
    sku: "SKU-002-LG",
    variant: "L",
    unit: "Pcs",
    branch_name: "Branch 02",
    min_quantity: 15,
    reorder_quantity: 30,
    is_active: true,
  },
  {
    id: 3,
    product_name: "Running Sneakers",
    sku: "SKU-003-42",
    variant: "42",
    unit: "Pcs",
    branch_name: "Branch 03",
    min_quantity: 10,
    reorder_quantity: 25,
    is_active: true,
  },
  {
    id: 4,
    product_name: "Leather Wallet",
    sku: "SKU-004-BRN",
    variant: "Brown",
    unit: "Pcs",
    branch_name: "Main Branch",
    min_quantity: 12,
    reorder_quantity: 24,
    is_active: false,
  }
];

export default function ReorderLevelsPage({ embedded }) {
  const [levels, setLevels] = useState(initialReorderLevels);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const [form, setForm] = useState({
    product_name: "",
    sku: "",
    variant: "",
    unit: "Pcs",
    branch_name: "Main Branch",
    min_quantity: 0,
    reorder_quantity: 0,
    is_active: true,
  });

  const getAlertStatus = (rule) => {
    if (!rule.is_active) {
      return { label: "Disabled", cls: "bg-slate-100 text-slate-500 border border-slate-200", triggered: false };
    }
    const currentStock = mockCurrentStock[rule.branch_name]?.[rule.sku] ?? 0;
    if (currentStock <= rule.min_quantity) {
      return { label: "Triggered Alert", cls: "bg-rose-50 text-rose-600 border border-rose-200 font-semibold", triggered: true };
    }
    return { label: "Healthy", cls: "bg-green-50 text-green-700 border border-green-200", triggered: false };
  };

  // Stats
  const totalRules = levels.length;
  const activeRules = levels.filter(l => l.is_active).length;
  const inactiveRules = levels.filter(l => !l.is_active).length;
  const triggeredAlerts = levels.filter(l => getAlertStatus(l).triggered).length;

  // Filter & Search
  const filtered = levels.filter(l => {
    const matchesSearch =
      l.product_name.toLowerCase().includes(search.toLowerCase()) ||
      l.sku.toLowerCase().includes(search.toLowerCase()) ||
      l.branch_name.toLowerCase().includes(search.toLowerCase()) ||
      l.variant.toLowerCase().includes(search.toLowerCase());

    const alertStatus = getAlertStatus(l);
    let matchesStatus = true;
    if (filterStatus === "active") {
      matchesStatus = l.is_active;
    } else if (filterStatus === "inactive") {
      matchesStatus = !l.is_active;
    } else if (filterStatus === "triggered") {
      matchesStatus = alertStatus.triggered;
    }

    return matchesSearch && matchesStatus;
  });

  const total = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Actions
  const openAdd = () => {
    setEditItem(null);
    const defaultProduct = flatProductList[0];
    setForm({
      product_name: defaultProduct.product_name,
      sku: defaultProduct.sku,
      variant: defaultProduct.variant,
      unit: defaultProduct.unit,
      branch_name: "Main Branch",
      min_quantity: 10,
      reorder_quantity: 20,
      is_active: true,
    });
    setShowModal(true);
  };

  const openEdit = (l) => {
    setEditItem(l);
    setForm({
      product_name: l.product_name,
      sku: l.sku,
      variant: l.variant,
      unit: l.unit,
      branch_name: l.branch_name,
      min_quantity: l.min_quantity,
      reorder_quantity: l.reorder_quantity,
      is_active: l.is_active,
    });
    setShowModal(true);
  };

  const handleProductChange = (skuVal) => {
    const selectedProd = flatProductList.find(p => p.sku === skuVal);
    if (!selectedProd) return;
    setForm(f => ({
      ...f,
      product_name: selectedProd.product_name,
      sku: selectedProd.sku,
      variant: selectedProd.variant,
      unit: selectedProd.unit,
    }));
  };

  const handleSave = () => {
    if (!form.sku || !form.branch_name) return;
    if (parseFloat(form.min_quantity) < 0 || parseFloat(form.reorder_quantity) < 0) {
      alert("Quantities must be positive values.");
      return;
    }

    // Unique combination check
    const isDuplicate = levels.some(l =>
      l.sku === form.sku &&
      l.branch_name === form.branch_name &&
      (!editItem || l.id !== editItem.id)
    );
    if (isDuplicate) {
      alert("A reorder level rule already exists for this product variant in the selected branch!");
      return;
    }

    const payload = {
      ...form,
      min_quantity: parseFloat(form.min_quantity) || 0,
      reorder_quantity: parseFloat(form.reorder_quantity) || 0,
    };

    if (editItem) {
      setLevels(prev => prev.map(l => l.id === editItem.id ? { ...l, ...payload } : l));
    } else {
      setLevels(prev => [...prev, { ...payload, id: Date.now() }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this reorder level rule?")) {
      setLevels(prev => prev.filter(l => l.id !== id));
    }
  };

  return (
    <div className={embedded ? "p-5" : "p-5 bg-gray-50 min-h-screen"}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Reorder Levels</h1>
          <p className="text-sm text-gray-400 mt-0.5">Configure minimum inventory alert levels per branch</p>
        </div>
        <Button onClick={openAdd} icon={Plus}>New Reorder Level</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Configured Rules", value: totalRules, icon: BadgeAlert, bg: "bg-blue-50", color: "text-blue-600" },
          { label: "Active Rules", value: activeRules, icon: CheckCircle, bg: "bg-green-50", color: "text-green-600" },
          { label: "Inactive Rules", value: inactiveRules, icon: XCircle, bg: "bg-slate-50", color: "text-slate-500" },
          { label: "Triggered Alerts", value: triggeredAlerts, icon: AlertTriangle, bg: "bg-rose-50", color: "text-rose-600" },
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
          placeholder="Search by product, SKU, branch..."
          filterOptions={[
            { label: "All", value: "all" },
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
            { label: "Triggered Alerts", value: "triggered" },
          ]}
          selectedFilter={filterStatus}
          setSelectedFilter={val => { setFilterStatus(val); setPage(1); }}
        />
      </div>

      <p className="text-sm text-slate-600 mb-4">Showing {filtered.length} reorder level settings</p>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Product</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">SKU / Variant</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Branch</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Min Qty</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Reorder Qty</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Current Stock</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Alert State</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((l, i) => {
              const currentStock = mockCurrentStock[l.branch_name]?.[l.sku] ?? 0;
              const alertStatus = getAlertStatus(l);
              return (
                <tr key={l.id} className={`border-t border-gray-50 hover:bg-blue-50/30 transition ${i % 2 !== 0 ? "bg-gray-50/30" : ""}`}>
                  <td className="px-4 py-3 text-sm font-medium text-slate-700 text-left">{l.product_name}</td>
                  <td className="px-4 py-3 text-left">
                    <span className="text-xs font-mono text-blue-600 block font-semibold">{l.sku}</span>
                    <span className="text-xs text-gray-400">{l.variant} ({l.unit})</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-black-900 text-left">{l.branch_name}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-600 text-center">{l.min_quantity}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-600 text-center">{l.reorder_quantity}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-sm font-bold ${alertStatus.triggered ? "text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100" : "text-green-600 bg-green-50 px-2 py-0.5 rounded-lg border border-green-100"}`}>
                      {currentStock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge active={l.is_active} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${alertStatus.cls}`}>
                      {alertStatus.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <ActionButtons
                        onView={() => setViewItem(l)}
                        onEdit={() => openEdit(l)}
                        onDelete={() => handleDelete(l.id)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
            {paged.length === 0 && <tr><td colSpan={9} className="px-5 py-10 text-center text-sm text-gray-400">No reorder level rules found.</td></tr>}
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
        <Modal title="Reorder Level Rule Details" onClose={() => setViewItem(null)}>
          <div className="space-y-4">
            <div className={`p-4 rounded-xl flex items-center justify-between ${getAlertStatus(viewItem).triggered ? "bg-rose-50/70 border border-rose-100" : "bg-green-50/70 border border-green-100"}`}>
              <div>
                <h3 className="text-base font-bold text-slate-800 leading-tight">{viewItem.product_name}</h3>
                <span className="text-xs font-mono text-blue-600 block mt-0.5">{viewItem.sku} &middot; {viewItem.variant}</span>
              </div>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${getAlertStatus(viewItem).cls}`}>
                {getAlertStatus(viewItem).label}
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { label: "Branch Name", value: <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg text-xs">{viewItem.branch_name}</span> },
                { label: "Unit", value: viewItem.unit },
                { label: "Min Quantity Alert Limit", value: `${viewItem.min_quantity} ${viewItem.unit}` },
                { label: "Reorder Quantity", value: `${viewItem.reorder_quantity} ${viewItem.unit}` },
                {
                  label: "Current Physical Stock",
                  value: (
                    <span className={`font-bold ${getAlertStatus(viewItem).triggered ? "text-rose-600" : "text-green-600"}`}>
                      {mockCurrentStock[viewItem.branch_name]?.[viewItem.sku] ?? 0} {viewItem.unit}
                    </span>
                  )
                },
                { label: "Rule Status", value: <Badge active={viewItem.is_active} /> },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-50 last:border-0 items-center text-sm">
                  <span className="text-slate-400 font-medium">{label}</span>
                  <span className="font-semibold text-slate-800">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <Modal title={editItem ? "Edit Reorder Level Rule" : "New Reorder Level Rule"} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 font-sans">Product Variant <span className="text-red-400">*</span></label>
              <select
                value={form.sku}
                onChange={e => handleProductChange(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-sans"
              >
                {flatProductList.map(p => (
                  <option key={p.sku} value={p.sku}>
                    {p.product_name} ({p.variant}) — {p.sku}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 font-sans">Branch <span className="text-red-400">*</span></label>
              <select
                value={form.branch_name}
                onChange={e => setForm(f => ({ ...f, branch_name: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-sans"
              >
                {branches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Min Quantity Threshold"
                type="number"
                value={form.min_quantity}
                onChange={e => setForm(f => ({ ...f, min_quantity: e.target.value }))}
                required
              />
              <FormField
                label="Reorder Quantity"
                type="number"
                value={form.reorder_quantity}
                onChange={e => setForm(f => ({ ...f, reorder_quantity: e.target.value }))}
                required
              />
            </div>

            <div className="py-2">
              <CheckboxField
                id="is_active_rule"
                label="Rule Active (Trigger low stock alerts when threshold is met)"
                checked={form.is_active}
                onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
              />
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
                Save Rule
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

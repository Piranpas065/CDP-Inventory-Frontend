import { useState } from "react";
import {
  BarChart2, Search, ChevronLeft, ChevronRight,
  XCircle, ArrowUpCircle, ArrowDownCircle, RefreshCw,
  Package, Building2, Calendar, Filter
} from "lucide-react";
import { SearchBar } from "./common/UIComponents";

const mockLedger = [
  { id: 1, date: "2026-06-08", product: "Wireless Headphones", sku: "SKU-001-BLK", branch: "Main Branch", type: "IN", reference: "GRN-2026-001", qty: 45, unit_cost: "Rs. 980", balance: 53 },
  { id: 2, date: "2026-06-08", product: "Cotton T-Shirt (L)", sku: "SKU-002-LG", branch: "Branch 02", type: "IN", reference: "GRN-2026-002", qty: 20, unit_cost: "Rs. 350", balance: 27 },
  { id: 3, date: "2026-06-09", product: "Running Sneakers (42)", sku: "SKU-003-42", branch: "Branch 03", type: "OUT", reference: "ST-2026-009", qty: 5, unit_cost: "Rs. 2,200", balance: 12 },
  { id: 4, date: "2026-06-09", product: "Wireless Headphones", sku: "SKU-001-BLK", branch: "Main Branch", type: "OUT", reference: "PRN-2026-001", qty: 5, unit_cost: "Rs. 980", balance: 48 },
  { id: 5, date: "2026-06-10", product: "Leather Wallet", sku: "SKU-004-BRN", branch: "Main Branch", type: "IN", reference: "GRN-2026-003", qty: 28, unit_cost: "Rs. 450", balance: 34 },
  { id: 6, date: "2026-06-10", product: "Cotton T-Shirt (L)", sku: "SKU-002-LG", branch: "Branch 02", type: "ADJ", reference: "ST-2026-004", qty: -2, unit_cost: "Rs. 350", balance: 25 },
  { id: 7, date: "2026-06-11", product: "Running Sneakers (42)", sku: "SKU-003-42", branch: "Branch 03", type: "IN", reference: "GRN-2026-004", qty: 8, unit_cost: "Rs. 2,200", balance: 20 },
  { id: 8, date: "2026-06-11", product: "Leather Wallet", sku: "SKU-004-BRN", branch: "Branch 02", type: "OUT", reference: "ST-2026-010", qty: 6, unit_cost: "Rs. 450", balance: 28 },
  { id: 9, date: "2026-06-12", product: "Wireless Headphones", sku: "SKU-001-WHT", branch: "Kandy Branch", type: "IN", reference: "GRN-2026-005", qty: 17, unit_cost: "Rs. 980", balance: 17 },
  { id: 10, date: "2026-06-12", product: "Cotton T-Shirt (S)", sku: "SKU-002-SM", branch: "Main Branch", type: "IN", reference: "GRN-2026-005", qty: 30, unit_cost: "Rs. 350", balance: 38 },
];

const typeConfig = {
  IN:  { label: "Stock In",    cls: "bg-green-100 text-green-700",  icon: ArrowUpCircle },
  OUT: { label: "Stock Out",   cls: "bg-red-100 text-red-600",      icon: ArrowDownCircle },
  ADJ: { label: "Adjustment",  cls: "bg-amber-100 text-amber-700",  icon: RefreshCw },
};

const TypeBadge = ({ type }) => {
  const cfg = typeConfig[type] || typeConfig.ADJ;
  const Icon = cfg.icon;
  return <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}><Icon size={10} />{cfg.label}</span>;
};

export default function StockLedgerPage({ embedded }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const PER_PAGE = 7;

  const filtered = mockLedger.filter(l =>
    (typeFilter === "all" || l.type === typeFilter) &&
    (l.product.toLowerCase().includes(search.toLowerCase()) ||
     l.sku.toLowerCase().includes(search.toLowerCase()) ||
     l.branch.toLowerCase().includes(search.toLowerCase()) ||
     l.reference.toLowerCase().includes(search.toLowerCase()))
  );
  const total = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalIn = mockLedger.filter(l => l.type === "IN").reduce((a, l) => a + l.qty, 0);
  const totalOut = mockLedger.filter(l => l.type === "OUT").reduce((a, l) => a + Math.abs(l.qty), 0);

  return (
    <div className={embedded ? "p-5" : "p-5 bg-gray-50 min-h-screen"}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Stock Ledger</h1>
          <p className="text-sm text-gray-400 mt-0.5">Complete stock movement history</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm">
          <Filter size={13} /> Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Entries", value: mockLedger.length, icon: BarChart2, bg: "bg-blue-50", color: "text-blue-600" },
          { label: "Stock In", value: totalIn, icon: ArrowUpCircle, bg: "bg-green-50", color: "text-green-600" },
          { label: "Stock Out", value: totalOut, icon: ArrowDownCircle, bg: "bg-red-50", color: "text-red-500" },
          { label: "Adjustments", value: mockLedger.filter(l => l.type === "ADJ").length, icon: RefreshCw, bg: "bg-amber-50", color: "text-amber-600" },
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
          placeholder="Search product, SKU, branch..."
          filterOptions={[
            { label: "All", value: "all" },
            { label: "Stock In", value: "IN" },
            { label: "Stock Out", value: "OUT" },
            { label: "Adjustment", value: "ADJ" },
          ]}
          selectedFilter={typeFilter}
          setSelectedFilter={val => { setTypeFilter(val); setPage(1); }}
        />
      </div>

      <p className="text-sm text-slate-600 mb-4">Showing {filtered.length} entries</p>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Date</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Product</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">SKU</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Branch</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Type</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Reference</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Qty</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Unit Cost</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Balance</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((l, i) => (
              <tr key={l.id} className={`border-t border-gray-50 hover:bg-blue-50/30 transition ${i % 2 !== 0 ? "bg-gray-50/30" : ""}`}>
                <td className="px-4 py-3 text-xs text-slate-500 text-left">{l.date}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-700 max-w-[140px] truncate text-left">{l.product}</td>
                <td className="px-4 py-3 text-xs font-mono text-blue-600 text-left">{l.sku}</td>
                <td className="px-4 py-3 text-xs text-slate-500 text-left">{l.branch}</td>
                <td className="px-4 py-3 text-center"><TypeBadge type={l.type} /></td>
                <td className="px-4 py-3 text-xs font-mono text-slate-500 text-left">{l.reference}</td>
                <td className={`px-4 py-3 text-sm font-bold text-center ${l.qty > 0 ? "text-green-600" : "text-red-500"}`}>
                  {l.qty > 0 ? `+${l.qty}` : l.qty}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500 text-center">{l.unit_cost}</td>
                <td className="px-4 py-3 text-sm font-semibold text-slate-700 text-center">{l.balance}</td>
              </tr>
            ))}
            {paged.length === 0 && <tr><td colSpan={9} className="px-5 py-10 text-center text-sm text-gray-400">No records found.</td></tr>}
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
    </div>
  );
}
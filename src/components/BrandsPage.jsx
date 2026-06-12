import { useState } from "react";
import {
  Award, Plus, Search, Edit, Trash2, Eye,
  ChevronLeft, ChevronRight, ArrowUpDown,
  XCircle, CheckCircle, Star, Layers,
  Hash, BookOpen
} from "lucide-react";
import { Button, Modal, FormField, TextArea, CheckboxField, Badge, ActionButtons, SearchBar, Pagination } from "./common/UIComponents";

// ── Mock Data ──────────────────────────────────────────────
const mockBrands = [
  {
    id: 1,
    name: "Apple",
    slug: "apple",
    description: "Consumer electronics, smartphones, smartwatches, and computer software.",
    is_active: true,
    is_featured: true,
    created_by: "Super Admin",
    product_count: 42,
  },
  {
    id: 2,
    name: "Samsung",
    slug: "samsung",
    description: "Electronics, mobile devices, home appliances, and semiconductors.",
    is_active: true,
    is_featured: true,
    created_by: "Super Admin",
    product_count: 35,
  },
  {
    id: 3,
    name: "Sony",
    slug: "sony",
    description: "Gaming consoles, audio equipment, professional cameras, and entertainment.",
    is_active: true,
    is_featured: false,
    created_by: "Arun",
    product_count: 18,
  },
  {
    id: 4,
    name: "Nike",
    slug: "nike",
    description: "Athletic footwear, activewear, sports equipment, and accessories.",
    is_active: true,
    is_featured: true,
    created_by: "Priya",
    product_count: 24,
  },
  {
    id: 5,
    name: "Adidas",
    slug: "adidas",
    description: "Sportswear, casual apparel, and sports footwear.",
    is_active: false,
    is_featured: false,
    created_by: "Meena",
    product_count: 12,
  },
  {
    id: 6,
    name: "Dell",
    slug: "dell",
    description: "Personal computers, laptops, servers, data storage, and IT solutions.",
    is_active: true,
    is_featured: false,
    created_by: "Super Admin",
    product_count: 29,
  }
];

// ── Helpers ────────────────────────────────────────────────
const FlagBadge = ({ show, label, color }) => show ? (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-medium ${color}`}>
    {label}
  </span>
) : null;

const brandColors = [
  "bg-blue-100 text-blue-600",
  "bg-purple-100 text-purple-600",
  "bg-green-100 text-green-600",
  "bg-orange-100 text-orange-600",
  "bg-pink-100 text-pink-600",
  "bg-cyan-100 text-cyan-600",
];

const emptyBrand = { name: "", slug: "", description: "", is_active: true, is_featured: false, product_count: 0 };

export default function BrandsPage({ embedded = false }) {
  const [brands, setBrands] = useState(mockBrands);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  // Modals
  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyBrand);

  // Filtered Brands
  const filteredBrands = brands.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.slug.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" ? true : filterStatus === "active" ? b.is_active : !b.is_active;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredBrands.length / perPage);
  const paginated = filteredBrands.slice((currentPage - 1) * perPage, currentPage * perPage);

  const stats = {
    total: brands.length,
    active: brands.filter(b => b.is_active).length,
    featured: brands.filter(b => b.is_featured).length,
    totalProducts: brands.reduce((acc, b) => acc + b.product_count, 0)
  };

  const handleAdd = () => {
    setBrands([...brands, { ...form, id: Date.now(), created_by: "Super Admin" }]);
    setShowAdd(false);
    setForm(emptyBrand);
  };

  const handleEdit = () => {
    setBrands(brands.map(b => b.id === selected.id ? { ...selected } : b));
    setShowEdit(false);
  };

  const handleDelete = () => {
    setBrands(brands.filter(b => b.id !== selected.id));
    setShowDelete(false);
  };

  return (
    <div className={`${embedded ? "p-5 min-h-full" : "p-6 min-h-screen"} bg-gray-50`} style={{ fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Brands</h1>
          <p className="text-sm text-slate-600 mt-0.5">Manage product brands and their configurations</p>
        </div>
        <Button onClick={() => setShowAdd(true)} icon={Plus}>Add Brand</Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Brands", value: stats.total, icon: Award, bg: "bg-blue-50", color: "text-blue-600" },
          { label: "Active Brands", value: stats.active, icon: CheckCircle, bg: "bg-green-50", color: "text-green-600" },
          { label: "Featured Brands", value: stats.featured, icon: Star, bg: "bg-purple-50", color: "text-purple-600" },
          { label: "Branded Products", value: stats.totalProducts, icon: Layers, bg: "bg-cyan-50", color: "text-cyan-600" },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center flex-shrink-0`}>
              <card.icon size={18} className={card.color} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">{card.label}</p>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter Toolbar */}
      <div className="mb-4">
        <SearchBar
          search={search}
          setSearch={setSearch}
          placeholder="Search by brand name or slug..."
          filterOptions={[
            { label: "All", value: "all" },
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
          selectedFilter={filterStatus}
          setSelectedFilter={setFilterStatus}
        />
      </div>

      <p className="text-sm text-slate-600 mb-4">Showing {filteredBrands.length} brands</p>

      {/* Brands Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Brand</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Slug</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Products Count</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Created By</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((brand, i) => (
              <tr key={brand.id} className={`border-t border-gray-50 hover:bg-blue-50/20 transition ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${brandColors[i % brandColors.length]}`}>
                      <Award size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                        {brand.name}
                        {brand.is_featured && <span className="inline-flex items-center text-amber-500 text-[10px]" title="Featured"><Star size={10} fill="currentColor" /></span>}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm font-mono text-slate-700 text-center">{brand.slug}</td>
                <td className="px-5 py-3 text-center text-sm font-semibold text-slate-600">{brand.product_count}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {brand.created_by[0]}
                    </div>
                    <span className="text-sm text-slate-700">{brand.created_by}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-center"><Badge active={brand.is_active} /></td>
                <td className="px-5 py-3">
                  <div className="flex justify-center">
                    <ActionButtons
                      onView={() => { setSelected(brand); setShowView(true); }}
                      onEdit={() => { setSelected({ ...brand }); setShowEdit(true); }}
                      onDelete={() => { setSelected(brand); setShowDelete(true); }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          showingText={`Showing ${Math.min((currentPage - 1) * perPage + 1, filteredBrands.length)}–${Math.min(currentPage * perPage, filteredBrands.length)} of ${filteredBrands.length}`}
        />
      </div>

      {/* ── Add Brand Modal ── */}
      {showAdd && (
        <Modal title="Add Brand" onClose={() => setShowAdd(false)}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <FormField label="Brand Name" icon={Award} required placeholder="Sony" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <FormField label="Slug" icon={Hash} placeholder="sony" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
            <div className="col-span-2">
              <TextArea label="Description" placeholder="Brand description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5 mb-5">
            <CheckboxField label="Active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
            <CheckboxField label="Featured" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAdd}>Add Brand</Button>
          </div>
        </Modal>
      )}

      {/* ── View Brand Modal ── */}
      {showView && selected && (
        <Modal title="Brand Details" onClose={() => setShowView(false)}>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                <Award size={22} className="text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">{selected.name}</h3>
                <p className="text-xs font-mono text-gray-400">{selected.slug}</p>
              </div>
              <div className="ml-auto flex items-center gap-2 flex-wrap">
                <Badge active={selected.is_active} />
                <FlagBadge show={selected.is_featured} label="⭐ Featured" color="bg-amber-100 text-amber-600" />
              </div>
            </div>
            {selected.description && (
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Description</p>
                <p className="text-sm text-slate-600">{selected.description}</p>
              </div>
            )}
            <div className="flex items-center gap-4 py-2 border-b border-gray-50">
              <Layers size={15} className="text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Associated Products Count</p>
                <p className="text-sm font-semibold text-slate-800">{selected.product_count} products</p>
              </div>
            </div>
            <div className="flex items-center gap-4 py-2 border-b border-gray-50">
              <BookOpen size={15} className="text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Created By</p>
                <p className="text-sm font-semibold text-slate-800">{selected.created_by}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-5 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setShowView(false)}>Close</Button>
          </div>
        </Modal>
      )}

      {/* ── Edit Brand Modal ── */}
      {showEdit && selected && (
        <Modal title="Edit Brand" onClose={() => setShowEdit(false)}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <FormField label="Brand Name" icon={Award} required value={selected.name} onChange={e => setSelected({ ...selected, name: e.target.value })} />
            <FormField label="Slug" icon={Hash} value={selected.slug} onChange={e => setSelected({ ...selected, slug: e.target.value })} />
            <div className="col-span-2">
              <TextArea label="Description" value={selected.description} onChange={e => setSelected({ ...selected, description: e.target.value })} />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5 mb-5">
            <CheckboxField label="Active" checked={selected.is_active} onChange={e => setSelected({ ...selected, is_active: e.target.checked })} />
            <CheckboxField label="Featured" checked={selected.is_featured} onChange={e => setSelected({ ...selected, is_featured: e.target.checked })} />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleEdit}>Save Changes</Button>
          </div>
        </Modal>
      )}

      {/* ── Delete Brand Modal ── */}
      {showDelete && selected && (
        <Modal title="Delete Brand" onClose={() => setShowDelete(false)}>
          <div className="text-center py-2">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-2">Delete "{selected.name}"?</h3>
            <p className="text-sm text-gray-400">This brand and all associated records will be permanently deleted. This cannot be undone.</p>
          </div>
          <div className="flex items-center justify-center gap-3 mt-5 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Yes, Delete</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

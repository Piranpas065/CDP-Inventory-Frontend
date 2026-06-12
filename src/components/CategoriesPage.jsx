import { useState, Fragment } from "react";
import {
  Tag, Plus, Search, Edit, Trash2, Eye,
  ChevronLeft, ChevronRight, ArrowUpDown,
  XCircle, CheckCircle, Star, Layers,
  ChevronDown, ChevronUp, Hash, AlignLeft,
  Bookmark, ToggleLeft, Users
} from "lucide-react";
import { Button, Modal, FormField, TextArea, CheckboxField, Badge, SearchBar, ActionButtons, Pagination } from "./common/UIComponents";

// ── Mock Data ──────────────────────────────────────────────
const mockCategories = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    description: "Electronic devices and accessories.",
    is_active: true,
    is_featured: true,
    is_default: true,
    created_by: "Super Admin",
    sub_categories: [
      { id: 1, name: "Mobile Phones", slug: "mobile-phones", description: "Smartphones and feature phones.", is_active: true, is_featured: true, is_default: false, created_by: "Super Admin" },
      { id: 2, name: "Laptops", slug: "laptops", description: "Portable computers.", is_active: true, is_featured: false, is_default: false, created_by: "Super Admin" },
      { id: 3, name: "Audio Devices", slug: "audio-devices", description: "Headphones, speakers and earbuds.", is_active: false, is_featured: false, is_default: false, created_by: "Rahul" },
    ],
  },
  {
    id: 2,
    name: "Clothing",
    slug: "clothing",
    description: "Men, women and kids clothing.",
    is_active: true,
    is_featured: true,
    is_default: false,
    created_by: "Super Admin",
    sub_categories: [
      { id: 4, name: "T-Shirts", slug: "t-shirts", description: "Casual and formal t-shirts.", is_active: true, is_featured: true, is_default: true, created_by: "Super Admin" },
      { id: 5, name: "Jeans", slug: "jeans", description: "Denim jeans for all ages.", is_active: true, is_featured: false, is_default: false, created_by: "Priya" },
    ],
  },
  {
    id: 3,
    name: "Footwear",
    slug: "footwear",
    description: "Shoes, sandals, boots and sneakers.",
    is_active: true,
    is_featured: false,
    is_default: false,
    created_by: "Arun",
    sub_categories: [
      { id: 6, name: "Sneakers", slug: "sneakers", description: "Sports and casual sneakers.", is_active: true, is_featured: true, is_default: false, created_by: "Arun" },
      { id: 7, name: "Boots", slug: "boots", description: "Leather and waterproof boots.", is_active: false, is_featured: false, is_default: false, created_by: "Meena" },
    ],
  },
  {
    id: 4,
    name: "Health & Beauty",
    slug: "health-beauty",
    description: "Healthcare, skincare and wellness products.",
    is_active: false,
    is_featured: false,
    is_default: false,
    created_by: "Super Admin",
    sub_categories: [],
  },
];

// ── Helpers ────────────────────────────────────────────────
const FlagBadge = ({ show, label, color }) => show ? (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-medium ${color}`}>
    {label}
  </span>
) : null;

const categoryColors = [
  "bg-blue-100 text-blue-600",
  "bg-purple-100 text-purple-600",
  "bg-green-100 text-green-600",
  "bg-orange-100 text-orange-600",
  "bg-pink-100 text-pink-600",
  "bg-cyan-100 text-cyan-600",
];

const emptyMainCat = { name: "", slug: "", description: "", is_active: true, is_featured: false, is_default: false };
const emptySubCat  = { name: "", slug: "", description: "", is_active: true, is_featured: false, is_default: false, main_category_id: "" };

// ── Sub Category Form ──────────────────────────────────────
const SubCatForm = ({ data, setData, mainCategories, onSave, onCancel, saveLabel }) => (
  <>
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="col-span-2">
        <label className="block text-sm font-semibold text-slate-700 mb-1">Main Category <span className="text-red-400">*</span></label>
        <select
          value={data.main_category_id}
          onChange={e => setData({ ...data, main_category_id: e.target.value })}
          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
        >
          <option value="">Select main category...</option>
          {mainCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <FormField label="Sub Category Name" icon={Tag} required placeholder="T-Shirts" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
      <FormField label="Slug" icon={Hash} placeholder="t-shirts" value={data.slug} onChange={e => setData({ ...data, slug: e.target.value })} />
      <div className="col-span-2">
        <TextArea label="Description" placeholder="Sub category description..." value={data.description} onChange={e => setData({ ...data, description: e.target.value })} />
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-5 mb-5">
      <CheckboxField label="Active" checked={data.is_active} onChange={e => setData({ ...data, is_active: e.target.checked })} />
      <CheckboxField label="Featured" checked={data.is_featured} onChange={e => setData({ ...data, is_featured: e.target.checked })} />
      <CheckboxField label="Default" checked={data.is_default} onChange={e => setData({ ...data, is_default: e.target.checked })} />
    </div>
    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
      <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition">Cancel</button>
      <button onClick={onSave} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition">{saveLabel}</button>
    </div>
  </>
);

// ── Main Page ──────────────────────────────────────────────
export default function CategoriesPage({ embedded = false }) {
  const [categories, setCategories] = useState(mockCategories);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("main"); // main | sub
  const [expandedRows, setExpandedRows] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  // Modals
  const [showAddMain, setShowAddMain]     = useState(false);
  const [showAddSub, setShowAddSub]       = useState(false);
  const [showView, setShowView]           = useState(false);
  const [showViewSub, setShowViewSub]     = useState(false);
  const [showEditMain, setShowEditMain]   = useState(false);
  const [showEditSub, setShowEditSub]     = useState(false);
  const [showDeleteMain, setShowDeleteMain] = useState(false);
  const [showDeleteSub, setShowDeleteSub]   = useState(false);
  const [selected, setSelected]           = useState(null);
  const [selectedSub, setSelectedSub]     = useState(null);
  const [formMain, setFormMain]           = useState(emptyMainCat);
  const [formSub, setFormSub]             = useState(emptySubCat);

  // All sub categories flat list
  const allSubs = categories.flatMap(c =>
    c.sub_categories.map(s => ({ ...s, main_category_name: c.name, main_category_id: c.id }))
  );

  // Filtered
  const filteredMain = categories.filter(c => {
    const ms = c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.toLowerCase().includes(search.toLowerCase());
    const mst = filterStatus === "all" ? true : filterStatus === "active" ? c.is_active : !c.is_active;
    return ms && mst;
  });

  const filteredSub = allSubs.filter(s => {
    const ms = s.name.toLowerCase().includes(search.toLowerCase()) || s.slug.toLowerCase().includes(search.toLowerCase()) || s.main_category_name.toLowerCase().includes(search.toLowerCase());
    const mst = filterStatus === "all" ? true : filterStatus === "active" ? s.is_active : !s.is_active;
    return ms && mst;
  });

  const data = activeTab === "main" ? filteredMain : filteredSub;
  const totalPages = Math.ceil(data.length / perPage);
  const paginated = data.slice((currentPage - 1) * perPage, currentPage * perPage);

  const stats = {
    mainTotal: categories.length,
    mainActive: categories.filter(c => c.is_active).length,
    subTotal: allSubs.length,
    subActive: allSubs.filter(s => s.is_active).length,
  };

  const toggleExpand = id => setExpandedRows(p => ({ ...p, [id]: !p[id] }));

  // CRUD — Main
  const handleAddMain = () => {
    setCategories([...categories, { ...formMain, id: Date.now(), sub_categories: [], created_by: "Super Admin" }]);
    setShowAddMain(false); setFormMain(emptyMainCat);
  };
  const handleEditMain = () => {
    setCategories(categories.map(c => c.id === selected.id ? { ...selected } : c));
    setShowEditMain(false);
  };
  const handleDeleteMain = () => {
    setCategories(categories.filter(c => c.id !== selected.id));
    setShowDeleteMain(false);
  };

  // CRUD — Sub
  const handleAddSub = () => {
    const parentId = Number(formSub.main_category_id);
    setCategories(categories.map(c =>
      c.id === parentId
        ? { ...c, sub_categories: [...c.sub_categories, { ...formSub, id: Date.now(), created_by: "Super Admin" }] }
        : c
    ));
    setShowAddSub(false); setFormSub(emptySubCat);
  };
  const handleEditSub = () => {
    setCategories(categories.map(c => ({
      ...c,
      sub_categories: c.sub_categories.map(s => s.id === selectedSub.id ? { ...selectedSub } : s),
    })));
    setShowEditSub(false);
  };
  const handleDeleteSub = () => {
    setCategories(categories.map(c => ({
      ...c,
      sub_categories: c.sub_categories.filter(s => s.id !== selectedSub.id),
    })));
    setShowDeleteSub(false);
  };

  return (
    <div className={`${embedded ? "p-5 min-h-full" : "p-6 min-h-screen"} bg-gray-50`} style={{ fontFamily: "'Segoe UI', sans-serif" }}>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Categories</h1>
          <p className="text-sm text-slate-600 mt-0.5">Manage main categories and sub categories</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setShowAddSub(true)} icon={Plus}>Add Sub Category</Button>
          <Button variant="primary" onClick={() => setShowAddMain(true)} icon={Plus}>Add Main Category</Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Main Categories", value: stats.mainTotal, icon: Tag, bg: "bg-blue-50", color: "text-blue-600" },
          { label: "Active Main", value: stats.mainActive, icon: CheckCircle, bg: "bg-green-50", color: "text-green-600" },
          { label: "Sub Categories", value: stats.subTotal, icon: Layers, bg: "bg-purple-50", color: "text-purple-600" },
          { label: "Active Sub", value: stats.subActive, icon: CheckCircle, bg: "bg-cyan-50", color: "text-cyan-600" },
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

      {/* Tabs + Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
          <button onClick={() => { setActiveTab("main"); setCurrentPage(1); }}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition flex items-center gap-1.5
              ${activeTab === "main" ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-gray-100"}`}>
            <Tag size={12} /> Main Categories
          </button>
          <button onClick={() => { setActiveTab("sub"); setCurrentPage(1); }}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition flex items-center gap-1.5
              ${activeTab === "sub" ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-gray-100"}`}>
            <Layers size={12} /> Sub Categories
          </button>
        </div>

        <div className="flex-1 min-w-[200px]">
          <SearchBar
            search={search}
            setSearch={val => { setSearch(val); setCurrentPage(1); }}
            placeholder="Search by name or slug..."
            filterOptions={[
              { label: "All", value: "all" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
            selectedFilter={filterStatus}
            setSelectedFilter={val => { setFilterStatus(val); setCurrentPage(1); }}
          />
        </div>
      </div>

      <p className="text-sm text-slate-600 mb-4">Showing {data.length} {activeTab === "main" ? "main categories" : "sub categories"}</p>

      {/* ── Main Categories Table ── */}
      {activeTab === "main" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 w-8"></th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Category</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Slug</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Sub Count</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Created By</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((cat, i) => (
                <Fragment key={cat.id}>
                  <tr className={`border-t border-gray-50 hover:bg-blue-50/20 transition ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                    <td className="px-2 py-3 text-center">
                      {cat.sub_categories.length > 0 && (
                        <button onClick={() => toggleExpand(cat.id)}
                          className="p-1 rounded-lg hover:bg-blue-100 text-blue-400 transition">
                          {expandedRows[cat.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-left">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${categoryColors[i % categoryColors.length]}`}>
                          <Tag size={14} />
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-700 text-center">{cat.slug}</td>
                    <td className="px-4 py-3 text-center text-sm font-bold text-slate-500">
                      {cat.sub_categories.length}
                    </td>
                    <td className="px-4 py-3 text-left">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {cat.created_by[0]}
                        </div>
                        <span className="text-sm text-slate-700">{cat.created_by}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center"><Badge active={cat.is_active} /></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <ActionButtons
                          onView={() => { setSelected(cat); setShowView(true); }}
                          onEdit={() => { setSelected({ ...cat }); setShowEditMain(true); }}
                          onDelete={() => { setSelected(cat); setShowDeleteMain(true); }}
                        />
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Sub Categories */}
                  {expandedRows[cat.id] && (
                    <tr key={`${cat.id}-subs`}>
                      <td colSpan={7} className="px-6 py-3 bg-blue-50/30">
                        <p className="text-sm font-bold text-blue-700 uppercase tracking-wide mb-2">Sub Categories of {cat.name}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {cat.sub_categories.map(sub => (
                            <div key={sub.id} className="bg-white border border-blue-100 rounded-xl p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-semibold text-slate-900">{sub.name}</span>
                                <Badge active={sub.is_active} />
                              </div>
                              <p className="text-sm font-mono text-slate-700 mb-1">{sub.slug}</p>
                              <div className="flex items-center gap-1 flex-wrap">
                                <FlagBadge show={sub.is_featured} label="⭐ Featured" color="bg-amber-100 text-amber-600" />
                                <FlagBadge show={sub.is_default} label="✓ Default" color="bg-blue-100 text-blue-600" />
                              </div>
                              <div className="mt-2 flex justify-start">
                                <ActionButtons
                                  onView={() => { setSelectedSub({ ...sub, main_category_id: cat.id }); setShowViewSub(true); }}
                                  onEdit={() => { setSelectedSub({ ...sub, main_category_id: cat.id }); setShowEditSub(true); }}
                                  onDelete={() => { setSelectedSub(sub); setShowDeleteSub(true); }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            showingText={`Showing ${Math.min((currentPage-1)*perPage+1, filteredMain.length)}–${Math.min(currentPage*perPage, filteredMain.length)} of ${filteredMain.length}`}
          />
        </div>
      )}

      {/* ── Sub Categories Table ── */}
      {activeTab === "sub" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Sub Category</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Main Category</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Slug</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Created By</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((sub, i) => (
                <tr key={sub.id} className={`border-t border-gray-50 hover:bg-blue-50/20 transition ${i%2===0?"":"bg-gray-50/30"}`}>
                  <td className="px-4 py-3 text-left">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${categoryColors[i % categoryColors.length]}`}>
                        <Layers size={13} />
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{sub.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                      <Tag size={10} /> {sub.main_category_name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-slate-700 text-center">{sub.slug}</td>
                  <td className="px-4 py-3 text-left">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">{sub.created_by[0]}</div>
                      <span className="text-sm text-slate-700">{sub.created_by}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center"><Badge active={sub.is_active} /></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <ActionButtons
                        onView={() => { setSelectedSub(sub); setShowViewSub(true); }}
                        onEdit={() => { setSelectedSub({...sub}); setShowEditSub(true); }}
                        onDelete={() => { setSelectedSub(sub); setShowDeleteSub(true); }}
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
            showingText={`Showing ${Math.min((currentPage-1)*perPage+1,filteredSub.length)}–${Math.min(currentPage*perPage,filteredSub.length)} of ${filteredSub.length}`}
          />
        </div>
      )}

      {/* ── Add Main Modal ── */}
      {showAddMain && (
        <Modal title="Add Main Category" onClose={() => setShowAddMain(false)}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <FormField label="Category Name" icon={Tag} required placeholder="Electronics" value={formMain.name} onChange={e => setFormMain({...formMain, name: e.target.value})} />
            <FormField label="Slug" icon={Hash} placeholder="electronics" value={formMain.slug} onChange={e => setFormMain({...formMain, slug: e.target.value})} />
            <div className="col-span-2">
              <TextArea label="Description" placeholder="Category description..." value={formMain.description} onChange={e => setFormMain({...formMain, description: e.target.value})} />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5 mb-5">
            <CheckboxField label="Active" checked={formMain.is_active} onChange={e => setFormMain({...formMain, is_active: e.target.checked})} />
            <CheckboxField label="Featured" checked={formMain.is_featured} onChange={e => setFormMain({...formMain, is_featured: e.target.checked})} />
            <CheckboxField label="Default" checked={formMain.is_default} onChange={e => setFormMain({...formMain, is_default: e.target.checked})} />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setShowAddMain(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddMain}>Add Category</Button>
          </div>
        </Modal>
      )}

      {/* ── Add Sub Modal ── */}
      {showAddSub && (
        <Modal title="Add Sub Category" onClose={() => setShowAddSub(false)}>
          <SubCatForm data={formSub} setData={setFormSub} mainCategories={categories} onSave={handleAddSub} onCancel={() => setShowAddSub(false)} saveLabel="Add Sub Category" />
        </Modal>
      )}

      {/* ── View Main Modal ── */}
      {showView && selected && (
        <Modal title="Category Details" onClose={() => setShowView(false)} wide>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                <Tag size={22} className="text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">{selected.name}</h3>
                <p className="text-xs font-mono text-gray-400">{selected.slug}</p>
              </div>
              <div className="ml-auto flex items-center gap-2 flex-wrap">
                <Badge active={selected.is_active} />
                <FlagBadge show={selected.is_featured} label="⭐ Featured" color="bg-amber-100 text-amber-600" />
                <FlagBadge show={selected.is_default} label="✓ Default" color="bg-blue-100 text-blue-600" />
              </div>
            </div>
            {selected.description && (
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Description</p>
                <p className="text-sm text-slate-600">{selected.description}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Sub Categories ({selected.sub_categories.length})</p>
              {selected.sub_categories.length === 0
                ? <p className="text-xs text-gray-400 text-center py-3 bg-gray-50 rounded-xl">No sub categories yet.</p>
                : <div className="grid grid-cols-2 gap-2">
                    {selected.sub_categories.map(s => (
                      <div key={s.id} className="border border-gray-100 rounded-xl p-3 text-xs">
                        <div className="flex justify-between mb-1">
                          <span className="font-semibold text-slate-700">{s.name}</span>
                          <Badge active={s.is_active} />
                        </div>
                        <p className="font-mono text-gray-400">{s.slug}</p>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>
          <div className="flex justify-end mt-5 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setShowView(false)}>Close</Button>
          </div>
        </Modal>
      )}

      {/* ── View Sub Modal ── */}
      {showViewSub && selectedSub && (
        <Modal title="Sub Category Details" onClose={() => setShowViewSub(false)}>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center">
                <Layers size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">{selectedSub.name}</h3>
                <p className="text-xs font-mono text-gray-400">{selectedSub.slug}</p>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl text-xs">
              <p className="text-gray-400 mb-1">Main Category</p>
              <p className="font-semibold text-slate-700">{selectedSub.main_category_name}</p>
            </div>
            {selectedSub.description && (
              <div className="p-3 bg-gray-50 rounded-xl text-xs">
                <p className="text-gray-400 mb-1">Description</p>
                <p className="text-slate-600">{selectedSub.description}</p>
              </div>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge active={selectedSub.is_active} />
              <FlagBadge show={selectedSub.is_featured} label="⭐ Featured" color="bg-amber-100 text-amber-600" />
              <FlagBadge show={selectedSub.is_default} label="✓ Default" color="bg-blue-100 text-blue-600" />
            </div>
          </div>
          <div className="flex justify-end mt-5 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setShowViewSub(false)}>Close</Button>
          </div>
        </Modal>
      )}

      {/* ── Edit Main Modal ── */}
      {showEditMain && selected && (
        <Modal title="Edit Main Category" onClose={() => setShowEditMain(false)}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <FormField label="Category Name" icon={Tag} required value={selected.name} onChange={e => setSelected({...selected, name: e.target.value})} />
            <FormField label="Slug" icon={Hash} value={selected.slug} onChange={e => setSelected({...selected, slug: e.target.value})} />
            <div className="col-span-2">
              <TextArea label="Description" value={selected.description} onChange={e => setSelected({...selected, description: e.target.value})} />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5 mb-5">
            <CheckboxField label="Active" checked={selected.is_active} onChange={e => setSelected({...selected, is_active: e.target.checked})} />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setShowEditMain(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleEditMain}>Save Changes</Button>
          </div>
        </Modal>
      )}

      {/* ── Edit Sub Modal ── */}
      {showEditSub && selectedSub && (
        <Modal title="Edit Sub Category" onClose={() => setShowEditSub(false)}>
          <SubCatForm data={selectedSub} setData={setSelectedSub} mainCategories={categories} onSave={handleEditSub} onCancel={() => setShowEditSub(false)} saveLabel="Save Changes" />
        </Modal>
      )}

      {/* ── Delete Main Modal ── */}
      {showDeleteMain && selected && (
        <Modal title="Delete Category" onClose={() => setShowDeleteMain(false)}>
          <div className="text-center py-2">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-2">Delete "{selected.name}"?</h3>
            <p className="text-sm text-gray-400">This will also delete all {selected.sub_categories.length} sub category(s). This cannot be undone.</p>
          </div>
          <div className="flex items-center justify-center gap-3 mt-5 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setShowDeleteMain(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteMain}>Yes, Delete</Button>
          </div>
        </Modal>
      )}

      {/* ── Delete Sub Modal ── */}
      {showDeleteSub && selectedSub && (
        <Modal title="Delete Sub Category" onClose={() => setShowDeleteSub(false)}>
          <div className="text-center py-2">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-2">Delete "{selectedSub.name}"?</h3>
            <p className="text-sm text-gray-400">This sub category will be permanently deleted.</p>
          </div>
          <div className="flex items-center justify-center gap-3 mt-5 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setShowDeleteSub(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteSub}>Yes, Delete</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

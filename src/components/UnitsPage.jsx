import { useState } from "react";
import { Boxes, Plus, Edit, Trash2, Filter, CheckCircle, XCircle } from "lucide-react";
import { Button, Modal, FormField, TextArea, CheckboxField, Badge, SearchBar, Pagination } from "./common/UIComponents";

const mockUnits = [
  { id: 1, unit_code: "UNT-001", name: "Pieces", abbreviation: "Pcs", description: "Individual items", is_active: true },
  { id: 2, unit_code: "UNT-002", name: "Box", abbreviation: "Box", description: "Boxed quantity", is_active: true },
  { id: 3, unit_code: "UNT-003", name: "Kilogram", abbreviation: "Kg", description: "Weight measurement", is_active: true },
  { id: 4, unit_code: "UNT-004", name: "Litre", abbreviation: "L", description: "Volume measurement", is_active: true },
  { id: 5, unit_code: "UNT-005", name: "Dozen", abbreviation: "Dzn", description: "12 items per unit", is_active: false },
  { id: 6, unit_code: "UNT-006", name: "Carton", abbreviation: "Ctn", description: "Carton packing", is_active: true },
  { id: 7, unit_code: "UNT-007", name: "Gram", abbreviation: "g", description: "Small weight unit", is_active: true },
  { id: 8, unit_code: "UNT-008", name: "Millilitre", abbreviation: "ml", description: "Small volume unit", is_active: false },
];

export default function UnitsPage({ embedded }) {
  const [units, setUnits] = useState(mockUnits);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: "", abbreviation: "", description: "", is_active: true });
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const filtered = units.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.abbreviation.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" ? true : filterStatus === "active" ? u.is_active : !u.is_active;
    return matchesSearch && matchesStatus;
  });
  const total = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openAdd = () => { setEditItem(null); setForm({ name: "", abbreviation: "", description: "", is_active: true }); setShowModal(true); };
  const openEdit = (u) => { setEditItem(u); setForm({ name: u.name, abbreviation: u.abbreviation, description: u.description, is_active: u.is_active }); setShowModal(true); };
  const handleSave = () => {
    if (!form.name.trim() || !form.abbreviation.trim()) return;
    if (editItem) {
      setUnits(prev => prev.map(u => u.id === editItem.id ? { ...u, ...form } : u));
    } else {
      setUnits(prev => [...prev, { ...form, id: Date.now(), unit_code: `UNT-00${prev.length + 1}` }]);
    }
    setShowModal(false);
  };
  const handleDelete = (id) => setUnits(prev => prev.filter(u => u.id !== id));

  return (
    <div className={embedded ? "p-5" : "p-5 bg-gray-50 min-h-screen"}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Units</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage measurement units for products</p>
        </div>
        <Button onClick={openAdd} icon={Plus}>Add Unit</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Total Units", value: units.length, icon: Boxes, bg: "bg-blue-50", color: "text-blue-600" },
          { label: "Active", value: units.filter(u => u.is_active).length, icon: CheckCircle, bg: "bg-green-50", color: "text-green-600" },
          { label: "Inactive", value: units.filter(u => !u.is_active).length, icon: XCircle, bg: "bg-red-50", color: "text-red-500" },
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
          placeholder="Search units..."
          filterOptions={[
            { label: "All", value: "all" },
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
          selectedFilter={filterStatus}
          setSelectedFilter={val => { setFilterStatus(val); setPage(1); }}
        />
      </div>

      <p className="text-sm text-slate-600 mb-4">Showing {filtered.length} units</p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paged.map(u => (
            <div key={u.id} className=" bg-gray-50 border border-gray-200 rounded-2xl p-4 hover:border-blue-200 hover:shadow-sm transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">{u.abbreviation}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{u.name}</p>
                    <p className="text-xs text-gray-400 font-mono">{u.unit_code}</p>
                  </div>
                </div>
                <Badge active={u.is_active} />
              </div>
              <p className="text-xs text-gray-500 mb-3">{u.description || "No description"}</p>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="amberOutline" onClick={() => openEdit(u)} icon={Edit} className="flex-1 !py-1.5 text-xs">Edit</Button>
                <Button variant="dangerOutline" onClick={() => handleDelete(u.id)} icon={Trash2} className="flex-1 !py-1.5 text-xs">Delete</Button>
              </div>
            </div>
          ))}
          {paged.length === 0 && <div className="col-span-3 py-10 text-center text-sm text-gray-400">No units found.</div>}
        </div>

        <Pagination
          currentPage={page}
          totalPages={total}
          setCurrentPage={setPage}
          showingText={`Showing ${Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–${Math.min(page * PER_PAGE, filtered.length)} of ${filtered.length}`}
        />
      </div>

      {showModal && (
        <Modal title={editItem ? "Edit Unit" : "Add Unit"} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <FormField label="Unit Name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Pieces" />
            <FormField label="Abbreviation" required value={form.abbreviation} onChange={e => setForm(f => ({ ...f, abbreviation: e.target.value }))} placeholder="e.g. Pcs" />
            <TextArea label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short description..." rows={2} />
            <div className="flex items-center gap-2">
              <CheckboxField id="unit_active" label="Active" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
              <Button variant="primary" onClick={handleSave} className="flex-1">Save Unit</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
import { useState } from "react";
import {
  Building2, Plus, Search, Filter, MoreVertical,
  MapPin, Phone, Mail, Hash, Star, CheckCircle,
  XCircle, Edit, Trash2, Eye, ChevronLeft, ChevronRight,
  ArrowUpDown, Shield
} from "lucide-react";
import { Button, Modal, FormField, CheckboxField, Badge, ActionButtons, SearchBar, Pagination } from "./common/UIComponents";


const mockBranches = [
  {
    id: 1,
    name: "Main Branch",
    address: "123, Main Street, Colombo 03",
    code_number: "COD-001",
    branch_code: "MB-001",
    email: "main@stockpro.lk",
    contact_number: "+94 11 234 5678",
    is_active: true,
    is_main_branch: true,
  },
  {
    id: 2,
    name: "Kandy Branch",
    address: "45, Peradeniya Road, Kandy",
    code_number: "KDY-002",
    branch_code: "KB-002",
    email: "kandy@stockpro.lk",
    contact_number: "+94 81 223 4567",
    is_active: true,
    is_main_branch: false,
  },
  {
    id: 3,
    name: "Galle Branch",
    address: "78, Matara Road, Galle",
    code_number: "GLE-003",
    branch_code: "GB-003",
    email: "galle@stockpro.lk",
    contact_number: "+94 91 234 5678",
    is_active: false,
    is_main_branch: false,
  },
  {
    id: 4,
    name: "Jaffna Branch",
    address: "12, Hospital Road, Jaffna",
    code_number: "JFN-004",
    branch_code: "JB-004",
    email: "jaffna@stockpro.lk",
    contact_number: "+94 21 222 3456",
    is_active: true,
    is_main_branch: false,
  },
  {
    id: 5,
    name: "Negombo Branch",
    address: "56, Colombo Road, Negombo",
    code_number: "NGM-005",
    branch_code: "NB-005",
    email: "negombo@stockpro.lk",
    contact_number: "+94 31 223 4567",
    is_active: true,
    is_main_branch: false,
  },
  {
    id: 6,
    name: "Badulla Branch",
    address: "34, Bandarawela Road, Badulla",
    code_number: "BDL-006",
    branch_code: "BB-006",
    email: "badulla@stockpro.lk",
    contact_number: "+94 55 222 3456",
    is_active: false,
    is_main_branch: false,
  },
];

const BranchCard = ({ branch, onView, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all p-5 relative
      ${branch.is_main_branch ? "border-blue-200 ring-1 ring-blue-100" : "border-gray-100"}`}>

      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
            ${branch.is_main_branch ? "bg-blue-600" : "bg-slate-100"}`}>
            <Building2 size={20} className={branch.is_main_branch ? "text-white" : "text-slate-500"} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800">{branch.name}</h3>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Code: <span className="font-mono font-semibold text-slate-900">{branch.branch_code}</span></p>
          </div>
        </div>

        {/* Status + Menu */}
        <div className="flex items-start gap-2">
          <div className="flex flex-col items-end gap-1.5">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
              ${branch.is_active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
              {branch.is_active
                ? <><CheckCircle size={11} /> Active</>
                : <><XCircle size={11} /> Inactive</>}
            </span>
            {branch.is_main_branch && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                <Star size={10} fill="currentColor" /> Main
              </span>
            )}
          </div>
          <div className="relative mt-0.5">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition"
            >
              <MoreVertical size={15} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 bg-white border border-gray-100 rounded-xl shadow-lg z-10 py-1 w-36">
                <button onClick={() => { onView(branch); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-gray-50">
                  <Eye size={13} /> View Details
                </button>
                <button onClick={() => { onEdit(branch); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-gray-50">
                  <Edit size={13} /> Edit
                </button>
                <button onClick={() => { onDelete(branch); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50">
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-50 my-3" />

      {/* Info */}
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <MapPin size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-slate-700 leading-relaxed">{branch.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={13} className="text-gray-400 flex-shrink-0" />
          <span className="text-sm text-slate-700">{branch.contact_number}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail size={13} className="text-gray-400 flex-shrink-0" />
          <span className="text-sm text-slate-700">{branch.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Hash size={13} className="text-gray-400 flex-shrink-0" />
          <span className="text-sm text-slate-700">Code No: <span className="font-mono font-semibold text-slate-800">{branch.code_number}</span></span>
        </div>
      </div>
    </div>
  );
};


// ── Main Page ──────────────────────────────────────────────
export default function BranchesPage({ embedded = false }) {
  const [branches, setBranches] = useState(mockBranches);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid | table
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [form, setForm] = useState({
    name: "", address: "", code_number: "", branch_code: "",
    email: "", contact_number: "", is_active: true, is_main_branch: false
  });

  const filtered = branches.filter(b => {
    const matchSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.branch_code.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" ? true :
      filterStatus === "active" ? b.is_active :
      !b.is_active;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: branches.length,
    active: branches.filter(b => b.is_active).length,
    inactive: branches.filter(b => !b.is_active).length,
    main: branches.filter(b => b.is_main_branch).length,
  };

  const handleAdd = () => {
    setBranches([...branches, { ...form, id: Date.now() }]);
    setShowAddModal(false);
    setForm({ name: "", address: "", code_number: "", branch_code: "", email: "", contact_number: "", is_active: true, is_main_branch: false });
  };

  const handleEdit = () => {
    setBranches(branches.map(b => b.id === selectedBranch.id ? { ...selectedBranch } : b));
    setShowEditModal(false);
  };

  const handleDelete = () => {
    setBranches(branches.filter(b => b.id !== selectedBranch.id));
    setShowDeleteModal(false);
  };

  return (
    <div className={`${embedded ? "p-5 min-h-full" : "p-6 min-h-screen"} bg-gray-50`} style={{ fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl px-3 font-bold text-slate-800">Branches</h1>
          <p className="text-sm px-3 text-slate-400 mt-0.5">Manage all your business branches</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} icon={Plus}>Add Branch</Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Branches", value: stats.total, icon: Building2, bg: "bg-blue-50", color: "text-blue-600" },
          { label: "Active", value: stats.active, icon: CheckCircle, bg: "bg-green-50", color: "text-green-600" },
          { label: "Inactive", value: stats.inactive, icon: XCircle, bg: "bg-red-50", color: "text-red-500" },
          { label: "Main Branch", value: stats.main, icon: Shield, bg: "bg-purple-50", color: "text-purple-600" },
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

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex-1 min-w-[200px]">
          <SearchBar
            search={search}
            setSearch={setSearch}
            placeholder="Search by name, code, email..."
            filterOptions={[
              { label: "All", value: "all" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
            selectedFilter={filterStatus}
            setSelectedFilter={setFilterStatus}
          />
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition
              ${viewMode === "grid" ? "bg-blue-600 text-white text-sm" : "text-slate-700 hover:bg-gray-100 text-sm"}`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition
              ${viewMode === "table" ? "bg-blue-600 text-white text-sm" : "text-slate-700 hover:bg-gray-100 text-sm"}`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-400 mb-4">Showing {filtered.length} of {branches.length} branches</p>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(branch => (
            <BranchCard
              key={branch.id}
              branch={branch}
              onView={b => { setSelectedBranch(b); setShowViewModal(true); }}
              onEdit={b => { setSelectedBranch({ ...b }); setShowEditModal(true); }}
              onDelete={b => { setSelectedBranch(b); setShowDeleteModal(true); }}
            />
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Branch Name</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Branch Code</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Contact</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Email</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Type</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr key={b.id} className={`border-t border-gray-50 hover:bg-blue-50/30 transition ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                  <td className="px-4 py-3 text-left">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${b.is_main_branch ? "bg-blue-600" : "bg-slate-100"}`}>
                        <Building2 size={13} className={b.is_main_branch ? "text-white" : "text-slate-500"} />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{b.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-900 font-semibold text-left">{b.branch_code}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 text-left">{b.contact_number}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 text-left">{b.email}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${b.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {b.is_active ? <><CheckCircle size={10} /> Active</> : <><XCircle size={10} /> Inactive</>}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {b.is_main_branch
                      ? <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600"><Star size={10} fill="currentColor" /> Main</span>
                      : <span className="text-xs text-gray-400">Sub</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <ActionButtons
                        onView={() => { setSelectedBranch(b); setShowViewModal(true); }}
                        onEdit={() => { setSelectedBranch({ ...b }); setShowEditModal(true); }}
                        onDelete={() => { setSelectedBranch(b); setShowDeleteModal(true); }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={1}
            totalPages={1}
            setCurrentPage={() => {}}
            showingText={`Showing ${filtered.length} of ${branches.length} branches`}
          />
        </div>
      )}

      {/* ── Add Modal ── */}
      {showAddModal && (
        <Modal title="Add New Branch" onClose={() => setShowAddModal(false)}>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Branch Name *" icon={Building2} placeholder="Main Branch" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <FormField label="Branch Code *" icon={Hash} placeholder="MB-001" value={form.branch_code} onChange={e => setForm({ ...form, branch_code: e.target.value })} />
            <FormField label="Code Number *" icon={Hash} placeholder="COD-001" value={form.code_number} onChange={e => setForm({ ...form, code_number: e.target.value })} />
            <FormField label="Contact Number *" icon={Phone} placeholder="+94 11 234 5678" value={form.contact_number} onChange={e => setForm({ ...form, contact_number: e.target.value })} />
            <div className="col-span-2">
              <FormField label="Email *" icon={Mail} placeholder="branch@company.lk" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="col-span-2">
              <FormField label="Address *" icon={MapPin} placeholder="123, Main Street, Colombo" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="flex items-center gap-3 col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-blue-600" />
                <span className="text-sm text-slate-600 font-medium">Is Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_main_branch} onChange={e => setForm({ ...form, is_main_branch: e.target.checked })} className="w-4 h-4 accent-blue-600" />
                <span className="text-sm text-slate-600 font-medium">Is Main Branch</span>
              </label>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAdd}>Add Branch</Button>
          </div>
        </Modal>
      )}

      {/* ── View Modal ── */}
      {showViewModal && selectedBranch && (
        <Modal title="Branch Details" onClose={() => setShowViewModal(false)}>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedBranch.is_main_branch ? "bg-blue-600" : "bg-slate-200"}`}>
                <Building2 size={22} className={selectedBranch.is_main_branch ? "text-white" : "text-slate-600"} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">{selectedBranch.name}</h3>
                <p className="text-xs text-gray-400">{selectedBranch.branch_code} · {selectedBranch.is_main_branch ? "Main Branch" : "Sub Branch"}</p>
              </div>
            </div>
            {[
              { icon: Hash, label: "Code Number", value: selectedBranch.code_number },
              { icon: MapPin, label: "Address", value: selectedBranch.address },
              { icon: Phone, label: "Contact", value: selectedBranch.contact_number },
              { icon: Mail, label: "Email", value: selectedBranch.email },
            ].map(row => (
              <div key={row.label} className="flex items-start gap-3 py-2 border-b border-gray-50">
                <row.icon size={15} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-600">{row.label}</p>
                  <p className="text-base font-medium text-slate-900">{row.value}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-3 pt-1">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${selectedBranch.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                {selectedBranch.is_active ? "Active" : "Inactive"}
              </span>
              {selectedBranch.is_main_branch && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                  <Star size={10} fill="currentColor" /> Main Branch
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-5 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
          </div>
        </Modal>
      )}

      {/* ── Edit Modal ── */}
      {showEditModal && selectedBranch && (
        <Modal title="Edit Branch" onClose={() => setShowEditModal(false)}>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Branch Name" icon={Building2} value={selectedBranch.name} onChange={e => setSelectedBranch({ ...selectedBranch, name: e.target.value })} />
            <FormField label="Branch Code" icon={Hash} value={selectedBranch.branch_code} onChange={e => setSelectedBranch({ ...selectedBranch, branch_code: e.target.value })} />
            <FormField label="Code Number" icon={Hash} value={selectedBranch.code_number} onChange={e => setSelectedBranch({ ...selectedBranch, code_number: e.target.value })} />
            <FormField label="Contact Number" icon={Phone} value={selectedBranch.contact_number} onChange={e => setSelectedBranch({ ...selectedBranch, contact_number: e.target.value })} />
            <div className="col-span-2">
              <FormField label="Email" icon={Mail} value={selectedBranch.email} onChange={e => setSelectedBranch({ ...selectedBranch, email: e.target.value })} />
            </div>
            <div className="col-span-2">
              <FormField label="Address" icon={MapPin} value={selectedBranch.address} onChange={e => setSelectedBranch({ ...selectedBranch, address: e.target.value })} />
            </div>
            <div className="flex items-center gap-3 col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={selectedBranch.is_active} onChange={e => setSelectedBranch({ ...selectedBranch, is_active: e.target.checked })} className="w-4 h-4 accent-blue-600" />
                <span className="text-sm text-slate-600 font-medium">Is Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={selectedBranch.is_main_branch} onChange={e => setSelectedBranch({ ...selectedBranch, is_main_branch: e.target.checked })} className="w-4 h-4 accent-blue-600" />
                <span className="text-sm text-slate-600 font-medium">Is Main Branch</span>
              </label>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleEdit}>Save Changes</Button>
          </div>
        </Modal>
      )}

      {/* ── Delete Modal ── */}
      {showDeleteModal && selectedBranch && (
        <Modal title="Delete Branch" onClose={() => setShowDeleteModal(false)}>
          <div className="text-center py-2">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-2">Delete "{selectedBranch.name}"?</h3>
            <p className="text-sm text-gray-400">This action cannot be undone. All data related to this branch will be permanently deleted.</p>
          </div>
          <div className="flex items-center justify-center gap-3 mt-5 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Yes, Delete</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

import { useState } from "react";
import {
  Users, Plus, Search, Filter, MoreVertical,
  Edit, Trash2, Eye, ChevronLeft, ChevronRight,
  Phone, Mail, MapPin, Hash, Building2, Globe,
  CheckCircle, XCircle, Star
} from "lucide-react";
import { Button, Modal, FormField, CheckboxField, Badge, ActionButtons, SearchBar, Pagination } from "./common/UIComponents";

const availableProducts = [
  "Wireless Bluetooth Headphones",
  "Cotton Round Neck T-Shirt",
  "Running Sneakers",
  "Vitamin C Tablets 500mg"
];

const mockSuppliers = [
  { id: 1, supplier_code: "SUP-001", name: "ABC Traders", contact_person: "Kamal Perera", email: "kamal@abctraders.lk", phone: "+94 11 234 5678", address: "45, Main Street, Colombo 03", city: "Colombo", country: "Sri Lanka", is_active: true, total_orders: 24, outstanding: "Rs. 45,000", products: ["Wireless Bluetooth Headphones", "Cotton Round Neck T-Shirt"] },
  { id: 2, supplier_code: "SUP-002", name: "XYZ Supplies", contact_person: "Nimal Silva", email: "nimal@xyz.lk", phone: "+94 81 223 4567", address: "12, Peradeniya Road, Kandy", city: "Kandy", country: "Sri Lanka", is_active: true, total_orders: 18, outstanding: "Rs. 28,500", products: ["Wireless Bluetooth Headphones"] },
  { id: 3, supplier_code: "SUP-003", name: "Global Imports", contact_person: "Suresh Kumar", email: "suresh@globalimports.lk", phone: "+94 91 234 5678", address: "78, Matara Road, Galle", city: "Galle", country: "Sri Lanka", is_active: false, total_orders: 9, outstanding: "Rs. 0", products: ["Cotton Round Neck T-Shirt"] },
  { id: 4, supplier_code: "SUP-004", name: "Local Mart", contact_person: "Priya Jayawardena", email: "priya@localmart.lk", phone: "+94 21 222 3456", address: "56, Hospital Road, Jaffna", city: "Jaffna", country: "Sri Lanka", is_active: true, total_orders: 31, outstanding: "Rs. 15,000", products: ["Cotton Round Neck T-Shirt"] },
  { id: 5, supplier_code: "SUP-005", name: "Premium Distributors", contact_person: "Rashmi Fernando", email: "rashmi@premium.lk", phone: "+94 31 223 4567", address: "34, Colombo Road, Negombo", city: "Negombo", country: "Sri Lanka", is_active: true, total_orders: 45, outstanding: "Rs. 72,000", products: ["Running Sneakers"] },
  { id: 6, supplier_code: "SUP-006", name: "Tech Wholesale", contact_person: "Dinesh Rathnayake", email: "dinesh@techwholesale.lk", phone: "+94 55 222 3456", address: "23, Main Road, Badulla", city: "Badulla", country: "Sri Lanka", is_active: false, total_orders: 6, outstanding: "Rs. 0", products: ["Vitamin C Tablets 500mg"] },
];

export default function SuppliersPage({ embedded }) {
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddPage, setShowAddPage] = useState(false);
  const [showEditPage, setShowEditPage] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [form, setForm] = useState({ name: "", contact_person: "", email: "", phone: "", address: "", city: "", country: "Sri Lanka", is_active: true, products: [] });
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = suppliers.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.supplier_code.toLowerCase().includes(search.toLowerCase()) ||
      s.contact_person.toLowerCase().includes(search.toLowerCase()) ||
      (s.products && s.products.some(p => p.toLowerCase().includes(search.toLowerCase())));
    const matchesStatus = filterStatus === "all" ? true : filterStatus === "active" ? s.is_active : !s.is_active;
    return matchesSearch && matchesStatus;
  });
  const total = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openAdd = () => {
    setEditItem(null);
    setForm({ name: "", contact_person: "", email: "", phone: "", address: "", city: "", country: "Sri Lanka", is_active: true, products: [] });
    setShowAddPage(true);
  };
  const openEdit = (s) => {
    setEditItem(s);
    setForm({ name: s.name, contact_person: s.contact_person, email: s.email, phone: s.phone, address: s.address, city: s.city, country: s.country, is_active: s.is_active, products: s.products || [] });
    setShowEditPage(true);
  };
  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editItem) {
      setSuppliers(prev => prev.map(s => s.id === editItem.id ? { ...s, ...form } : s));
      setShowEditPage(false);
    } else {
      setSuppliers(prev => [...prev, { ...form, id: Date.now(), supplier_code: `SUP-00${prev.length + 1}`, total_orders: 0, outstanding: "Rs. 0", products: form.products || [] }]);
      setShowAddPage(false);
    }
  };
  const handleDelete = (id) => setSuppliers(prev => prev.filter(s => s.id !== id));

  const SupplierForm = ({ data, setData, onSave, onCancel, saveLabel }) => {
    return (
      <div className="space-y-4">
        <FormField label="Supplier Name" icon={Users} required value={data.name} onChange={e => setData(f => ({ ...f, name: e.target.value }))} placeholder="e.g. ABC Traders" />
        <FormField label="Contact Person" icon={Users} required value={data.contact_person} onChange={e => setData(f => ({ ...f, contact_person: e.target.value }))} placeholder="e.g. Kamal Perera" />
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Email" icon={Mail} type="email" value={data.email} onChange={e => setData(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" />
          <FormField label="Phone" icon={Phone} value={data.phone} onChange={e => setData(f => ({ ...f, phone: e.target.value }))} placeholder="+94 11 234 5678" />
        </div>
        <FormField label="Address" icon={MapPin} value={data.address} onChange={e => setData(f => ({ ...f, address: e.target.value }))} placeholder="Street address" />
        <div className="grid grid-cols-2 gap-3">
          <FormField label="City" icon={Building2} value={data.city} onChange={e => setData(f => ({ ...f, city: e.target.value }))} placeholder="Colombo" />
          <FormField label="Country" icon={Globe} value={data.country} onChange={e => setData(f => ({ ...f, country: e.target.value }))} placeholder="Sri Lanka" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Distributing Products</label>
          <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200 max-h-36 overflow-y-auto">
            {availableProducts.map(prod => (
              <label key={prod} className="flex items-center gap-2 cursor-pointer select-none text-sm text-slate-600 font-medium">
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
        <div className="flex items-center gap-2">
          <CheckboxField id="is_active" label="Active" checked={data.is_active} onChange={e => setData(f => ({ ...f, is_active: e.target.checked }))} />
        </div>
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" onClick={onSave}>{saveLabel}</Button>
        </div>
      </div>
    );
  };

  if (showAddPage) {
    return (
      <div className="p-5 min-h-full bg-gray-50" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Add Supplier</h1>
            <p className="text-sm text-slate-400 mt-0.5">Create a new supplier profile</p>
          </div>
          <Button variant="primary" onClick={() => { setShowAddPage(false); }} className="shadow-sm">
            Back to Suppliers <ChevronRight size={16} />
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 w-full">
          <SupplierForm
            data={form}
            setData={setForm}
            onSave={handleSave}
            onCancel={() => { setShowAddPage(false); }}
            saveLabel="Add Supplier"
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
            <h1 className="text-2xl font-bold text-slate-800">Edit Supplier</h1>
            <p className="text-sm text-slate-400 mt-0.5">Update supplier details and distributed products</p>
          </div>
          <Button variant="primary" onClick={() => { setShowEditPage(false); setEditItem(null); }} className="shadow-sm">
            Back to Suppliers <ChevronRight size={16} />
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 w-full">
          <SupplierForm
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

  return (
    <div className={embedded ? "p-5" : "p-5 bg-gray-50 min-h-screen"}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Suppliers</h1>
          <p className="text-sm text-gray-400 mt-0.5">{suppliers.filter(s => s.is_active).length} active suppliers</p>
        </div>
        <Button onClick={openAdd} icon={Plus}>Add Supplier</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Total Suppliers", value: suppliers.length, icon: Users, bg: "bg-blue-50", color: "text-blue-600" },
          { label: "Active", value: suppliers.filter(s => s.is_active).length, icon: CheckCircle, bg: "bg-green-50", color: "text-green-600" },
          { label: "Inactive", value: suppliers.filter(s => !s.is_active).length, icon: XCircle, bg: "bg-red-50", color: "text-red-500" },
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
          placeholder="Search suppliers..."
          filterOptions={[
            { label: "All", value: "all" },
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
          selectedFilter={filterStatus}
          setSelectedFilter={val => { setFilterStatus(val); setPage(1); }}
        />
      </div>

      <p className="text-sm text-slate-600 mb-4">Showing {filtered.length} suppliers</p>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-max">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 ">
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Code</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Supplier</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Contact</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Phone</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">City</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Products</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Outstanding</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((s, i) => (
              <tr key={s.id} className={`border-t border-gray-50 hover:bg-blue-50/30 transition ${i % 2 !== 0 ? "bg-gray-50/30" : ""}`}>
                <td className="px-5 py-3 text-xs font-mono text-blue-600 font-semibold text-left">{s.supplier_code}</td>
                <td className="px-5 py-3 text-left">
                  <p className="text-sm font-semibold text-slate-800">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.email}</p>
                </td>
                <td className="px-5 py-3 text-sm text-slate-600 text-left">{s.contact_person}</td>
                <td className="px-5 py-3 text-sm text-slate-600 text-left">{s.phone}</td>
                <td className="px-5 py-3 text-sm text-slate-600 text-left">{s.city}</td>
                <td className="px-5 py-3 text-left">
                  <div className="flex flex-wrap gap-1 max-w-[220px]">
                    {s.products && s.products.length > 0 ? (
                      s.products.map(p => (
                        <span key={p} className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md font-medium border border-blue-100 truncate max-w-[180px]" title={p}>
                          {p}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3 text-sm font-semibold text-slate-700 text-center">{s.outstanding}</td>
                <td className="px-5 py-3 text-center"><Badge active={s.is_active} /></td>
                <td className="px-5 py-3">
                  <div className="flex justify-center">
                    <ActionButtons
                      onView={() => setViewItem(s)}
                      onEdit={() => openEdit(s)}
                      onDelete={() => handleDelete(s.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr><td colSpan={9} className="px-5 py-10 text-center text-sm text-gray-400">No suppliers found.</td></tr>
            )}
          </tbody>
        </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={total}
          setCurrentPage={setPage}
          showingText={`Showing ${Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–${Math.min(page * PER_PAGE, filtered.length)} of ${filtered.length}`}
        />
      </div>

      {/* Add/Edit Modal is replaced by full pages */}

      {/* View Modal */}
      {viewItem && (
        <Modal title="Supplier Details" onClose={() => setViewItem(null)}>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">
                <Users size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">{viewItem.name}</h3>
                <p className="text-sm text-gray-400">{viewItem.supplier_code}</p>
                <Badge active={viewItem.is_active} />
              </div>
            </div>
            {[
              { label: "Contact Person", value: viewItem.contact_person, icon: Users },
              { label: "Email", value: viewItem.email, icon: Mail },
              { label: "Phone", value: viewItem.phone, icon: Phone },
              { label: "Address", value: viewItem.address, icon: MapPin },
              { label: "City", value: viewItem.city, icon: Building2 },
              { label: "Total Orders", value: viewItem.total_orders, icon: Hash },
              { label: "Outstanding", value: viewItem.outstanding, icon: Hash },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0"><Icon size={14} className="text-gray-500" /></div>
                <div><p className="text-xs text-gray-400">{label}</p><p className="text-sm font-semibold text-slate-700">{value}</p></div>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Products</p>
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
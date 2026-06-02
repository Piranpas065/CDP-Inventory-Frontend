import { useState } from "react";
import {
  Package, Plus, Search, Filter, MoreVertical,
  Edit, Trash2, Eye, ChevronLeft, ChevronRight,
  ArrowUpDown, Tag, Layers, Box, Ruler, FlaskConical,
  ToggleLeft, ToggleRight, XCircle, CheckCircle,
  Star, ChevronDown, ChevronUp, Barcode, Palette,
  Shirt, Hash
} from "lucide-react";

// ── Mock Data ──────────────────────────────────────────────
const brands = ["Nike", "Adidas", "Samsung", "Apple", "Generic"];
const suppliers = ["ABC Traders", "XYZ Supplies", "Global Imports", "Local Mart", "Premium Distributors"];
const mainCategories = ["Electronics", "Clothing", "Footwear", "Accessories", "Health"];
const subCategories = {
  Electronics: ["Mobile", "Laptop", "Audio"],
  Clothing: ["T-Shirt", "Jeans", "Jacket"],
  Footwear: ["Sneakers", "Boots", "Sandals"],
  Accessories: ["Watch", "Wallet", "Bag"],
  Health: ["Vitamins", "Skincare", "Fitness"],
};
const units = ["Pcs", "Box", "Kg", "Litre", "Dozen"];
const measurements = ["cm", "mm", "inch", "ml", "g"];
const containers = ["Bottle", "Can", "Pack", "Bag", "Carton"];

const mockProducts = [
  {
    id: 1,
    product_code: "PRD-001",
    product_name: "Wireless Bluetooth Headphones",
    slug: "wireless-bluetooth-headphones",
    description: "High quality wireless headphones with noise cancellation.",
    brand_id: "Samsung",
    main_category_id: "Electronics",
    sub_category_id: "Audio",
    measurement_id: "cm",
    unit_id: "Pcs",
    container_id: "Box",
    is_variant: true,
    is_active: true,
    is_default: true,
    variants: [
      { id: 1, sku: "SKU-001-BLK", barcode: "8901234567890", code: "V001", color: "Black", size: "One Size", material: "Plastic", style: "Over-ear", supplier_id: "ABC Traders", is_default: true, is_active: true },
      { id: 2, sku: "SKU-001-WHT", barcode: "8901234567891", code: "V002", color: "White", size: "One Size", material: "Plastic", style: "Over-ear", supplier_id: "XYZ Supplies", is_default: false, is_active: true },
    ],
  },
  {
    id: 2,
    product_code: "PRD-002",
    product_name: "Cotton Round Neck T-Shirt",
    slug: "cotton-round-neck-tshirt",
    description: "Comfortable 100% cotton round neck t-shirt.",
    brand_id: "Nike",
    main_category_id: "Clothing",
    sub_category_id: "T-Shirt",
    measurement_id: "inch",
    unit_id: "Pcs",
    container_id: "Pack",
    is_variant: true,
    is_active: true,
    is_default: false,
    variants: [
      { id: 3, sku: "SKU-002-SM", barcode: "8901234567892", code: "V003", color: "Red", size: "S", material: "Cotton", style: "Casual", supplier_id: "Global Imports", is_default: true, is_active: true },
      { id: 4, sku: "SKU-002-MD", barcode: "8901234567893", code: "V004", color: "Red", size: "M", material: "Cotton", style: "Casual", supplier_id: "Local Mart", is_default: false, is_active: true },
      { id: 5, sku: "SKU-002-LG", barcode: "8901234567894", code: "V005", color: "Blue", size: "L", material: "Cotton", style: "Casual", supplier_id: "ABC Traders", is_default: false, is_active: false },
    ],
  },
  {
    id: 3,
    product_code: "PRD-003",
    product_name: "Running Sneakers",
    slug: "running-sneakers",
    description: "Lightweight running sneakers for daily training.",
    brand_id: "Adidas",
    main_category_id: "Footwear",
    sub_category_id: "Sneakers",
    measurement_id: "cm",
    unit_id: "Pcs",
    container_id: "Box",
    is_variant: false,
    is_active: true,
    is_default: false,
    variants: [],
  },
  {
    id: 4,
    product_code: "PRD-004",
    product_name: "Vitamin C Tablets 500mg",
    slug: "vitamin-c-tablets-500mg",
    description: "Immunity booster Vitamin C tablets.",
    brand_id: "Generic",
    main_category_id: "Health",
    sub_category_id: "Vitamins",
    measurement_id: "g",
    unit_id: "Box",
    container_id: "Bottle",
    is_variant: false,
    is_active: false,
    is_default: false,
    variants: [],
  },
];

// ── Helpers ────────────────────────────────────────────────
const Badge = ({ active }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium
    ${active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
    {active ? <><CheckCircle size={10} /> Active</> : <><XCircle size={10} /> Inactive</>}
  </span>
);

const Modal = ({ title, onClose, children, wide }) => (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
    <div className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? "max-w-3xl" : "max-w-lg"} max-h-[90vh] overflow-y-auto`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <h2 className="text-base font-bold text-slate-800">{title}</h2>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition">
          <XCircle size={18} />
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  </div>
);

const FormField = ({ label, icon: Icon, type = "text", required, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-1">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
    <div className="relative">
      {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
      <input
        type={type}
        className={`w-full ${Icon ? "pl-9" : "pl-3"} pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
        {...props}
      />
    </div>
  </div>
);

const SelectField = ({ label, icon: Icon, options, required, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-1">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
    <div className="relative">
      {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
      <select
        className={`w-full ${Icon ? "pl-9" : "pl-3"} pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 appearance-none`}
        {...props}
      >
        <option value="">Select...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  </div>
);

const TextArea = ({ label, required, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-1">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
    <textarea
      rows={3}
      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
      {...props}
    />
  </div>
);

// ── Variant Row ────────────────────────────────────────────
const VariantRow = ({ variant, onRemove, onChange }) => (
  <div className="border border-gray-100 rounded-xl p-3 bg-gray-50 space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-sm font-semibold text-slate-700">Variant</span>
      <button onClick={onRemove} className="p-1 rounded-lg hover:bg-red-50 text-red-400 transition">
        <XCircle size={15} />
      </button>
    </div>
    <div className="grid grid-cols-3 gap-2">
      <FormField label="SKU" icon={Hash} placeholder="SKU-001" value={variant.sku} onChange={e => onChange("sku", e.target.value)} />
      <FormField label="Barcode" icon={Barcode} placeholder="8901234567890" value={variant.barcode} onChange={e => onChange("barcode", e.target.value)} />
      <FormField label="Code" placeholder="V001" value={variant.code} onChange={e => onChange("code", e.target.value)} />
      <FormField label="Color" icon={Palette} placeholder="Black" value={variant.color} onChange={e => onChange("color", e.target.value)} />
      <FormField label="Size" placeholder="M / 42" value={variant.size} onChange={e => onChange("size", e.target.value)} />
      <FormField label="Material" placeholder="Cotton" value={variant.material} onChange={e => onChange("material", e.target.value)} />
      <FormField label="Style" icon={Shirt} placeholder="Casual" value={variant.style} onChange={e => onChange("style", e.target.value)} />
      <SelectField label="Supplier" options={suppliers} value={variant.supplier_id} onChange={e => onChange("supplier_id", e.target.value)} />
      <div className="flex items-center gap-4 col-span-2 pt-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={variant.is_default} onChange={e => onChange("is_default", e.target.checked)} className="w-4 h-4 accent-blue-600" />
          <span className="text-sm text-slate-700 font-medium">Default</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={variant.is_active} onChange={e => onChange("is_active", e.target.checked)} className="w-4 h-4 accent-blue-600" />
          <span className="text-sm text-slate-700 font-medium">Active</span>
        </label>
      </div>
    </div>
  </div>
);

// ── Product Form ───────────────────────────────────────────
const emptyProduct = {
  product_code: "", product_name: "", slug: "", description: "",
  brand_id: "", main_category_id: "", sub_category_id: "",
  measurement_id: "", unit_id: "", container_id: "",
  is_variant: false, is_active: true, is_default: false,
  variants: [],
};
const emptyVariant = { sku: "", barcode: "", code: "", color: "", size: "", material: "", style: "", supplier_id: "", is_default: false, is_active: true };

// ── Main Page ──────────────────────────────────────────────
export default function ProductsPage({ embedded = false }) {
  const [products, setProducts] = useState(mockProducts);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showAddPage, setShowAddPage] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [expandedVariants, setExpandedVariants] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const filtered = products.filter(p => {
    const matchSearch =
      p.product_name.toLowerCase().includes(search.toLowerCase()) ||
      p.product_code.toLowerCase().includes(search.toLowerCase()) ||
      p.brand_id.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" ? true :
      filterStatus === "active" ? p.is_active : !p.is_active;
    const matchCategory =
      filterCategory === "all" ? true : p.main_category_id === filterCategory;
    return matchSearch && matchStatus && matchCategory;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const stats = {
    total: products.length,
    active: products.filter(p => p.is_active).length,
    inactive: products.filter(p => !p.is_active).length,
    withVariants: products.filter(p => p.is_variant).length,
  };

  const toggleVariantExpand = (id) =>
    setExpandedVariants(prev => ({ ...prev, [id]: !prev[id] }));

  const addVariantToForm = () =>
    setForm(f => ({ ...f, variants: [...f.variants, { ...emptyVariant, id: Date.now() }] }));

  const removeVariantFromForm = (vid) =>
    setForm(f => ({ ...f, variants: f.variants.filter(v => v.id !== vid) }));

  const updateVariantInForm = (vid, key, val) =>
    setForm(f => ({ ...f, variants: f.variants.map(v => v.id === vid ? { ...v, [key]: val } : v) }));

  const handleAdd = () => {
    setProducts([...products, { ...form, id: Date.now() }]);
    setShowAddPage(false);
    setForm(emptyProduct);
  };

  const handleEdit = () => {
    setProducts(products.map(p => p.id === selectedProduct.id ? { ...selectedProduct } : p));
    setShowEditModal(false);
  };

  const handleDelete = () => {
    setProducts(products.filter(p => p.id !== selectedProduct.id));
    setShowDeleteModal(false);
  };

  const ProductForm = ({ data, setData, onSave, onCancel, saveLabel }) => (
    <>
      {/* Section: Basic Info */}
      <div className="mb-4">
        <p className="text-sm font-bold text-blue-700 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Package size={13} /> Basic Information
        </p>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Product Code" icon={Hash} placeholder="PRD-001" required value={data.product_code} onChange={e => setData({ ...data, product_code: e.target.value })} />
          <FormField label="Product Name" icon={Package} placeholder="Product name" required value={data.product_name} onChange={e => setData({ ...data, product_name: e.target.value })} />
          <FormField label="Slug" placeholder="product-name-slug" value={data.slug} onChange={e => setData({ ...data, slug: e.target.value })} />
          <SelectField label="Brand" icon={Star} options={brands} value={data.brand_id} onChange={e => setData({ ...data, brand_id: e.target.value })} />
          <div className="col-span-2">
            <TextArea label="Description" placeholder="Product description..." value={data.description} onChange={e => setData({ ...data, description: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Section: Category */}
      <div className="mb-4">
        <p className="text-sm font-bold text-blue-700 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Tag size={13} /> Category & Units
        </p>
        <div className="grid grid-cols-2 gap-3">
          <SelectField label="Main Category" icon={Tag} options={mainCategories} value={data.main_category_id} onChange={e => setData({ ...data, main_category_id: e.target.value, sub_category_id: "" })} />
          <SelectField label="Sub Category" icon={Tag} options={subCategories[data.main_category_id] || []} value={data.sub_category_id} onChange={e => setData({ ...data, sub_category_id: e.target.value })} />
          <SelectField label="Unit" icon={Box} options={units} value={data.unit_id} onChange={e => setData({ ...data, unit_id: e.target.value })} />
          <SelectField label="Measurement" icon={Ruler} options={measurements} value={data.measurement_id} onChange={e => setData({ ...data, measurement_id: e.target.value })} />
          <SelectField label="Container" icon={FlaskConical} options={containers} value={data.container_id} onChange={e => setData({ ...data, container_id: e.target.value })} />
        </div>
      </div>

      {/* Section: Flags */}
      <div className="mb-4">
        <p className="text-sm font-bold text-blue-700 uppercase tracking-widest mb-3">Settings</p>
        <div className="flex flex-wrap items-center gap-5">
          {[
            { key: "is_active", label: "Active" },
            { key: "is_default", label: "Default" },
            { key: "is_variant", label: "Has Variants" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data[key]}
                onChange={e => setData({ ...data, [key]: e.target.checked })}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-sm text-slate-600 font-medium">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Section: Variants */}
      {data.is_variant && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-blue-700 uppercase tracking-widest flex items-center gap-2">
              <Layers size={13} /> Product Variants
            </p>
            <button
              onClick={addVariantToForm}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={12} /> Add Variant
            </button>
          </div>
          {data.variants.length === 0 && (
            <p className="text-sm text-slate-600 text-center py-4 bg-gray-50 rounded-xl">No variants added yet. Click "Add Variant".</p>
          )}
          <div className="space-y-3">
            {data.variants.map(v => (
              <VariantRow
                key={v.id}
                variant={v}
                onRemove={() => removeVariantFromForm(v.id)}
                onChange={(key, val) => updateVariantInForm(v.id, key, val)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition">Cancel</button>
        <button onClick={onSave} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition">{saveLabel}</button>
      </div>
    </>
  );

  // If showing the add product page, render as full-page form
  if (showAddPage) {
    return (
      <div className="p-5 min-h-full bg-gray-50" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => { setShowAddPage(false); setForm(emptyProduct); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition"
          >
            <ChevronLeft size={16} /> Back to Products
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Add New Product</h1>
            <p className="text-sm text-slate-400 mt-0.5">Create a new product with variants</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <ProductForm
            data={form} setData={setForm}
            onSave={handleAdd}
            onCancel={() => { setShowAddPage(false); setForm(emptyProduct); }}
            saveLabel="Add Product"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`${embedded ? "p-5 min-h-full" : "p-6 min-h-screen"} bg-gray-50`} style={{ fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Products</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage products and variants</p>
        </div>
        <button
          onClick={() => setShowAddPage(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm shadow-blue-200"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total Products", value: stats.total, icon: Package, bg: "bg-blue-50", color: "text-blue-600" },
          { label: "Active", value: stats.active, icon: CheckCircle, bg: "bg-green-50", color: "text-green-600" },
          { label: "Inactive", value: stats.inactive, icon: XCircle, bg: "bg-red-50", color: "text-red-500" },
          { label: "With Variants", value: stats.withVariants, icon: Layers, bg: "bg-purple-50", color: "text-purple-600" },
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
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search by name, code, brand..."
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
          {["all", "active", "inactive"].map(s => (
            <button key={s} onClick={() => { setFilterStatus(s); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition
                ${filterStatus === s ? "bg-blue-600 text-white text-sm" : "text-slate-700 hover:bg-gray-100 text-sm"}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <select
          value={filterCategory}
          onChange={e => { setFilterCategory(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {mainCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <p className="text-sm text-slate-600 mb-4">Showing {filtered.length} of {products.length} products</p>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3 w-8"></th>
              {["Product", "Code", "Category", "Brand", "Unit", "Variant", "Suppliers", "Status", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-sm font-semibold text-slate-700 uppercase tracking-wide whitespace-nowrap">
                  <div className="flex items-center gap-1">{h} <ArrowUpDown size={10} className="text-gray-300" /></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((p, i) => (
              <>
                <tr key={p.id} className={`border-t border-gray-50 hover:bg-blue-50/20 transition ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                  {/* Expand toggle */}
                  <td className="px-2 py-3 text-center">
                    {p.is_variant && p.variants.length > 0 && (
                      <button
                        onClick={() => toggleVariantExpand(p.id)}
                        className="p-1 rounded-lg hover:bg-blue-100 text-blue-400 transition"
                      >
                        {expandedVariants[p.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Package size={14} className="text-blue-500" />
                      </div>
                      <span className="text-sm font-semibold text-slate-900 max-w-[160px] truncate">{p.product_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-slate-900 font-semibold">{p.product_code}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-slate-700">{p.main_category_id}</div>
                    <div className="text-sm text-slate-600">{p.sub_category_id}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">{p.brand_id}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{p.unit_id}</td>
                  <td className="px-4 py-3">
                    {p.is_variant
                      ? <span className="block w-full text-center text-sm font-semibold">
                          {p.variants.length}
                        </span>
                      : <span className="text-sm text-slate-600">No variants</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    {p.is_variant && p.variants.length > 0
                      ? <div className="text-sm text-slate-700">
                          {Array.from(new Set(p.variants.map(v => v.supplier_id).filter(Boolean))).join(", ") || "—"}
                        </div>
                      : <span className="text-sm text-slate-600">—</span>
                    }
                  </td>
                  <td className="px-4 py-3"><Badge active={p.is_active} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setSelectedProduct(p); setShowViewModal(true); }}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition" title="View">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => { setSelectedProduct({ ...p, variants: [...p.variants] }); setShowEditModal(true); }}
                        className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition" title="Edit">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => { setSelectedProduct(p); setShowDeleteModal(true); }}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
                {/* Expanded Variants Row */}
                {expandedVariants[p.id] && p.variants.length > 0 && (
                  <tr key={`${p.id}-variants`} className="bg-blue-50/30">
                    <td colSpan={9} className="px-6 py-3">
                      <p className="text-sm font-bold text-blue-700 mb-2 uppercase tracking-wide">Variants</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {p.variants.map(v => (
                          <div key={v.id} className="bg-white border border-blue-100 rounded-xl p-3 text-sm space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-900 font-mono">{v.sku}</span>
                              <div className="flex items-center gap-1">
                                {v.is_default && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-sm">Default</span>}
                                <Badge active={v.is_active} />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-x-3 text-slate-700">
                              {v.color && <span>🎨 {v.color}</span>}
                              {v.size && <span>📐 {v.size}</span>}
                              {v.material && <span>🧵 {v.material}</span>}
                              {v.style && <span>👗 {v.style}</span>}
                              <span className="col-span-2 font-mono text-slate-700">📦 {v.barcode}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
          <p className="text-sm text-slate-600">
            Showing {Math.min((currentPage - 1) * perPage + 1, filtered.length)}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length} results
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 transition"
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
              <button key={pg} onClick={() => setCurrentPage(pg)}
                className={`w-7 h-7 rounded-lg text-sm font-semibold transition
                  ${currentPage === pg ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-slate-700"}`}>
                {pg}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 transition"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>



      {/* ── Edit Modal ── */}
      {showEditModal && selectedProduct && (
        <Modal title="Edit Product" onClose={() => setShowEditModal(false)} wide>
          <ProductForm
            data={selectedProduct} setData={setSelectedProduct}
            onSave={handleEdit} onCancel={() => setShowEditModal(false)}
            saveLabel="Save Changes"
          />
        </Modal>
      )}

      {/* ── View Modal ── */}
      {showViewModal && selectedProduct && (
        <Modal title="Product Details" onClose={() => setShowViewModal(false)} wide>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                <Package size={22} className="text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">{selectedProduct.product_name}</h3>
                <p className="text-sm text-slate-600 font-mono">{selectedProduct.product_code}</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Badge active={selectedProduct.is_active} />
                {selectedProduct.is_default && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">Default</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Brand", value: selectedProduct.brand_id, icon: Star },
                { label: "Main Category", value: selectedProduct.main_category_id, icon: Tag },
                { label: "Sub Category", value: selectedProduct.sub_category_id, icon: Tag },
                { label: "Unit", value: selectedProduct.unit_id, icon: Box },
                { label: "Measurement", value: selectedProduct.measurement_id, icon: Ruler },
                { label: "Container", value: selectedProduct.container_id, icon: FlaskConical },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                  <row.icon size={14} className="text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-slate-600">{row.label}</p>
                    <p className="font-semibold text-slate-900">{row.value || "—"}</p>
                  </div>
                </div>
              ))}
            </div>

            {selectedProduct.description && (
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-sm font-semibold text-slate-600 mb-1">Description</p>
                <p className="text-base text-slate-800">{selectedProduct.description}</p>
              </div>
            )}

            {selectedProduct.is_variant && selectedProduct.variants.length > 0 && (
              <div>
                <p className="text-sm font-bold text-blue-700 uppercase tracking-widest mb-2">Variants ({selectedProduct.variants.length})</p>
                <div className="space-y-2">
                  {selectedProduct.variants.map(v => (
                    <div key={v.id} className="border border-gray-100 rounded-xl p-3 text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-slate-900 font-mono">{v.sku}</span>
                        <Badge active={v.is_active} />
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-slate-700">
                        {v.color && <span>🎨 {v.color}</span>}
                        {v.size && <span>📐 {v.size}</span>}
                        {v.material && <span>🧵 {v.material}</span>}
                        {v.style && <span>👗 {v.style}</span>}
                        <span className="col-span-2 font-mono text-slate-700">📦 {v.barcode}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end mt-5 pt-4 border-t border-gray-100">
            <button onClick={() => setShowViewModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition">Close</button>
          </div>
        </Modal>
      )}

      {/* ── Delete Modal ── */}
      {showDeleteModal && selectedProduct && (
        <Modal title="Delete Product" onClose={() => setShowDeleteModal(false)}>
          <div className="text-center py-2">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-2">Delete "{selectedProduct.product_name}"?</h3>
            <p className="text-sm text-gray-400">This will also delete all {selectedProduct.variants.length} variant(s). This action cannot be undone.</p>
          </div>
          <div className="flex items-center justify-center gap-3 mt-5 pt-4 border-t border-gray-100">
            <button onClick={() => setShowDeleteModal(false)} className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition">Cancel</button>
            <button onClick={handleDelete} className="px-5 py-2 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition">Yes, Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

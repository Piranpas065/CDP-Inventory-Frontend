import React from "react";
import {
  XCircle, Search, Eye, Edit, Trash2,
  ChevronLeft, ChevronRight, CheckCircle,
  ArrowUpDown
} from "lucide-react";

// ── Button Component ─────────────────────────────────────────
export function Button({ variant = "primary", icon: Icon, children, className = "", ...props }) {
  const baseStyle = "inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 focus:ring-blue-500",
    secondary: "bg-white border border-gray-200 text-slate-700 hover:bg-gray-50 focus:ring-gray-300",
    outline: "bg-gray-100 text-gray-600 hover:bg-gray-200 focus:ring-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-red-200 focus:ring-red-500",
    dangerOutline: "bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-200",
    amberOutline: "bg-amber-50 text-amber-600 hover:bg-amber-100 focus:ring-amber-200",
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon size={15} />}
      {children}
    </button>
  );
}

// ── Modal Component ──────────────────────────────────────────
export function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? "max-w-2xl" : "max-w-lg"} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-base font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition focus:outline-none">
            <XCircle size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ── FormField Component ───────────────────────────────────────
export function FormField({ label, icon: Icon, required, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
        <input
          className={`w-full ${Icon ? "pl-9" : "pl-3"} pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50`}
          {...props}
        />
      </div>
    </div>
  );
}

// ── TextArea Component ────────────────────────────────────────
export function TextArea({ label, required, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <textarea
        rows={3}
        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
        {...props}
      />
    </div>
  );
}

// ── CheckboxField Component ───────────────────────────────────
export function CheckboxField({ label, checked, onChange, id }) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
      />
      <span className="text-sm text-slate-600 font-medium">{label}</span>
    </label>
  );
}

// ── Badge Component ──────────────────────────────────────────
export function Badge({ active }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
      ${active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
      {active ? <><CheckCircle size={10} /> Active</> : <><XCircle size={10} /> Inactive</>}
    </span>
  );
}

// ── ActionButtons Component ───────────────────────────────────
export function ActionButtons({ onView, onEdit, onDelete, viewTitle = "View", editTitle = "Edit", deleteTitle = "Delete" }) {
  return (
    <div className="flex items-center gap-1">
      {onView && (
        <button onClick={onView} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition focus:outline-none" title={viewTitle}>
          <Eye size={14} />
        </button>
      )}
      {onEdit && (
        <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500 transition focus:outline-none" title={editTitle}>
          <Edit size={14} />
        </button>
      )}
      {onDelete && (
        <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition focus:outline-none" title={deleteTitle}>
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

// ── SearchBar Component ───────────────────────────────────────
export function SearchBar({ search, setSearch, filterOptions, selectedFilter, setSelectedFilter, placeholder = "Search..." }) {
  return (
    <div className="flex flex-wrap items-center gap-3 w-full">
      <div className="relative flex-1 min-w-0 max-w-full">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          placeholder={placeholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
        />
      </div>

      {filterOptions && setSelectedFilter && (
        <div className="flex flex-wrap items-center gap-1 bg-slate-50 border border-slate-200 rounded-full p-1 shadow-sm">
          {filterOptions.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelectedFilter(opt.value)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none
                ${selectedFilter === opt.value ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900 hover:bg-white/40"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Pagination Component ──────────────────────────────────────
export function Pagination({ currentPage, totalPages, setCurrentPage, showingText }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
      <p className="text-sm text-slate-600">{showingText}</p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 transition focus:outline-none"
        >
          <ChevronLeft size={15} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
          <button
            key={pg}
            onClick={() => setCurrentPage(pg)}
            className={`w-7 h-7 rounded-lg text-sm font-semibold transition focus:outline-none
              ${currentPage === pg ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-slate-700"}`}
          >
            {pg}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 transition focus:outline-none"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

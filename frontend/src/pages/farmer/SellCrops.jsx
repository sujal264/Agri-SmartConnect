import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import FarmerLayout from "./FarmerLayout";
import { useLang } from "./FarmerLayout";
import {
  Plus, Pencil, Trash2, X, Loader,
  ShoppingBag, ChevronDown, Package,
  CheckCircle, Clock, Tag
} from "lucide-react";

const API = "http://localhost:8000";

// ── Translations ──────────────────────────────────────────────
const st = {
  en: {
    title:       "Sell Crops",
    subtitle:    "Post and manage your crop, dairy & equipment listings",
    addNew:      "Add New Listing",
    myListings:  "My Listings",
    noListings:  "No listings yet. Click 'Add New Listing' to get started!",
    formTitle:   "Create New Listing",
    editTitle:   "Edit Listing",
    prodTitle:   "Product Title *",
    category:    "Category *",
    price:       "Price *",
    unit:        "Unit *",
    quantity:    "Quantity *",
    location:    "Location",
    phone:       "Contact Phone",
    description: "Description",
    imageUrl:    "Image URL (optional)",
    status:      "Status",
    submit:      "Post Listing",
    update:      "Update Listing",
    cancel:      "Cancel",
    delete:      "Delete",
    edit:        "Edit",
    available:   "Available",
    sold:        "Sold",
    reserved:    "Reserved",
    categories:  ["crops", "dairy", "equipment", "seeds", "other"],
    units:       ["kg", "quintal", "ton", "litre", "dozen", "piece", "bag"],
    statuses:    ["available", "sold", "reserved"],
    perUnit:     "per",
    qty:         "Qty",
    postedOn:    "Posted",
    contact:     "Contact",
    deleteConfirm: "Are you sure you want to delete this listing?",
  },
  hi: {
    title:       "फसल बेचें",
    subtitle:    "अपनी फसल, डेयरी और उपकरण सूचीबद्ध करें",
    addNew:      "नई लिस्टिंग जोड़ें",
    myListings:  "मेरी लिस्टिंग",
    noListings:  "कोई लिस्टिंग नहीं। 'नई लिस्टिंग जोड़ें' पर क्लिक करें!",
    formTitle:   "नई लिस्टिंग बनाएं",
    editTitle:   "लिस्टिंग संपादित करें",
    prodTitle:   "उत्पाद का नाम *",
    category:    "श्रेणी *",
    price:       "मूल्य *",
    unit:        "इकाई *",
    quantity:    "मात्रा *",
    location:    "स्थान",
    phone:       "संपर्क फोन",
    description: "विवरण",
    imageUrl:    "छवि URL (वैकल्पिक)",
    status:      "स्थिति",
    submit:      "लिस्टिंग पोस्ट करें",
    update:      "लिस्टिंग अपडेट करें",
    cancel:      "रद्द करें",
    delete:      "हटाएं",
    edit:        "संपादित करें",
    available:   "उपलब्ध",
    sold:        "बिक गया",
    reserved:    "आरक्षित",
    categories:  ["crops", "dairy", "equipment", "seeds", "other"],
    units:       ["kg", "quintal", "ton", "litre", "dozen", "piece", "bag"],
    statuses:    ["available", "sold", "reserved"],
    perUnit:     "प्रति",
    qty:         "मात्रा",
    postedOn:    "पोस्ट किया",
    contact:     "संपर्क",
    deleteConfirm: "क्या आप इस लिस्टिंग को हटाना चाहते हैं?",
  },
  mr: {
    title:       "पीक विका",
    subtitle:    "तुमचे पीक, दुग्धजन्य पदार्थ आणि उपकरणे सूचीबद्ध करा",
    addNew:      "नवीन यादी जोडा",
    myListings:  "माझ्या यादी",
    noListings:  "कोणतीही यादी नाही. 'नवीन यादी जोडा' वर क्लिक करा!",
    formTitle:   "नवीन यादी तयार करा",
    editTitle:   "यादी संपादित करा",
    prodTitle:   "उत्पादनाचे नाव *",
    category:    "श्रेणी *",
    price:       "किंमत *",
    unit:        "एकक *",
    quantity:    "प्रमाण *",
    location:    "ठिकाण",
    phone:       "संपर्क फोन",
    description: "वर्णन",
    imageUrl:    "प्रतिमा URL (पर्यायी)",
    status:      "स्थिती",
    submit:      "यादी पोस्ट करा",
    update:      "यादी अपडेट करा",
    cancel:      "रद्द करा",
    delete:      "हटवा",
    edit:        "संपादित करा",
    available:   "उपलब्ध",
    sold:        "विकले",
    reserved:    "राखीव",
    categories:  ["crops", "dairy", "equipment", "seeds", "other"],
    units:       ["kg", "quintal", "ton", "litre", "dozen", "piece", "bag"],
    statuses:    ["available", "sold", "reserved"],
    perUnit:     "प्रति",
    qty:         "प्रमाण",
    postedOn:    "पोस्ट केले",
    contact:     "संपर्क",
    deleteConfirm: "तुम्हाला ही यादी हटवायची आहे का?",
  },
};

// ── Category emoji map ────────────────────────────────────────
const catEmoji = {
  crops:     "🌾",
  dairy:     "🥛",
  equipment: "🚜",
  seeds:     "🌱",
  other:     "📦",
};

// ── Status badge ──────────────────────────────────────────────
function StatusBadge({ status, labels }) {
  const styles = {
    available: "bg-green-100 text-green-700",
    sold:      "bg-red-100 text-red-600",
    reserved:  "bg-yellow-100 text-yellow-700",
  };
  const icons = {
    available: <CheckCircle className="w-3 h-3" />,
    sold:      <Tag className="w-3 h-3" />,
    reserved:  <Clock className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${styles[status]}`}>
      {icons[status]}
      {labels[status]}
    </span>
  );
}

// ── Select Field ──────────────────────────────────────────────
function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 mb-1.5">{label}</label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 pr-10"
        >
          <option value="">-- Select --</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

// ── Product Form Modal ────────────────────────────────────────
function ProductForm({ labels, onClose, onSave, editData }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [form, setForm] = useState({
    title:        editData?.title        || "",
    category:     editData?.category     || "",
    price:        editData?.price        || "",
    unit:         editData?.unit         || "kg",
    quantity:     editData?.quantity     || "",
    location:     editData?.location     || user.location || "",
    contactPhone: editData?.contactPhone || user.phone    || "",
    description:  editData?.description  || "",
    image:        editData?.image        || "",
    status:       editData?.status       || "available",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.price || !form.quantity) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (editData) {
        await axios.put(`${API}/api/products/${editData._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Listing updated! ✅");
      } else {
        await axios.post(`${API}/api/products`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Listing posted! 🎉");
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl">
          <h3 className="font-display font-bold text-gray-800 text-lg">
            {editData ? labels.editTitle : labels.formTitle}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">{labels.prodTitle}</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Fresh Tomatoes, Buffalo Milk, Tractor"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          {/* Category + Status */}
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label={labels.category}
              name="category"
              value={form.category}
              onChange={handleChange}
              options={labels.categories}
            />
            <SelectField
              label={labels.status}
              name="status"
              value={form.status}
              onChange={handleChange}
              options={labels.statuses}
            />
          </div>

          {/* Price + Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">{labels.price} (₹)</label>
              <input
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 2500"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <SelectField
              label={labels.unit}
              name="unit"
              value={form.unit}
              onChange={handleChange}
              options={labels.units}
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">{labels.quantity}</label>
            <input
              name="quantity"
              type="number"
              min="0"
              value={form.quantity}
              onChange={handleChange}
              placeholder="e.g. 500"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          {/* Location + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">{labels.location}</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Nashik, Maharashtra"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">{labels.phone}</label>
              <input
                name="contactPhone"
                value={form.contactPhone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">{labels.description}</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe your product quality, harvest date, etc."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">{labels.imageUrl}</label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-all text-sm"
            >
              {labels.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {editData ? labels.update : labels.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Product Card ──────────────────────────────────────────────
function ProductCard({ product, labels, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Image or Emoji */}
      <div className="h-40 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center relative">
        {product.image ? (
          <img src={product.image} alt={product.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <span className="text-6xl">{catEmoji[product.category] || "📦"}</span>
        )}
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={product.status} labels={labels} />
        </div>
        {/* Category badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
          <span className="text-xs font-bold text-gray-600 capitalize">{product.category}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-base mb-1 truncate">{product.title}</h3>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-primary-700 font-display font-bold text-xl">₹{product.price}</span>
          <span className="text-gray-400 text-xs">{labels.perUnit} {product.unit}</span>
        </div>

        {/* Details */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span>📦 {labels.qty}: {product.quantity} {product.unit}</span>
          {product.location && <span>📍 {product.location}</span>}
        </div>

        {product.description && (
          <p className="text-gray-500 text-xs mb-3 line-clamp-2">{product.description}</p>
        )}

        {product.contactPhone && (
          <p className="text-xs text-gray-400 mb-3">📞 {product.contactPhone}</p>
        )}

        <p className="text-gray-300 text-xs mb-3">
          {labels.postedOn}: {new Date(product.createdAt).toLocaleDateString("en-IN")}
        </p>

        {/* Quick status change */}
        <div className="flex gap-2 mb-3">
          {["available", "sold", "reserved"].map((s) => (
            <button key={s}
              onClick={() => onStatusChange(product._id, s)}
              className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all ${
                product.status === s
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {labels[s]}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-1.5 border border-primary-200 text-primary-600 hover:bg-primary-50 font-semibold py-2 rounded-xl text-xs transition-all">
            <Pencil className="w-3 h-3" />
            {labels.edit}
          </button>
          <button onClick={() => onDelete(product._id)}
            className="flex-1 flex items-center justify-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 font-semibold py-2 rounded-xl text-xs transition-all">
            <Trash2 className="w-3 h-3" />
            {labels.delete}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
function SellCropsContent() {
  const lang    = useLang();
  const labels  = st[lang];

  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filter, setFilter]     = useState("all");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API}/api/products/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(data.products || []);
    } catch (err) {
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(labels.deleteConfirm)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Listing deleted");
      fetchProducts();
    } catch {
      toast.error("Failed to delete listing");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API}/api/products/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Marked as ${status}`);
      fetchProducts();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleEdit = (product) => {
    setEditData(product);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditData(null);
  };

  const handleFormSave = () => {
    handleFormClose();
    fetchProducts();
  };

  // Filter products
  const filtered = filter === "all"
    ? products
    : products.filter((p) => p.category === filter || p.status === filter);

  // Stats
  const available = products.filter((p) => p.status === "available").length;
  const sold      = products.filter((p) => p.status === "sold").length;
  const reserved  = products.filter((p) => p.status === "reserved").length;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-orange-600 to-earth-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">🛒</div>
            <div>
              <h2 className="font-display text-xl font-bold">{labels.title}</h2>
              <p className="text-orange-100 text-sm mt-0.5">{labels.subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => { setEditData(null); setShowForm(true); }}
            className="flex items-center gap-2 bg-white text-orange-700 font-bold px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-all text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {labels.addNew}
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: labels.available, value: available, emoji: "✅", color: "bg-green-50 border-green-200" },
          { label: labels.sold,      value: sold,      emoji: "🏷️", color: "bg-red-50 border-red-200" },
          { label: labels.reserved,  value: reserved,  emoji: "⏳", color: "bg-yellow-50 border-yellow-200" },
        ].map((s, i) => (
          <div key={i} className={`${s.color} border rounded-2xl p-4 text-center`}>
            <div className="text-3xl mb-1">{s.emoji}</div>
            <p className="font-display font-bold text-2xl text-gray-800">{s.value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "all",       label: lang === "en" ? "All" : lang === "hi" ? "सभी" : "सर्व" },
          { key: "crops",     label: "🌾 " + (lang === "en" ? "Crops" : lang === "hi" ? "फसलें" : "पिके") },
          { key: "dairy",     label: "🥛 " + (lang === "en" ? "Dairy" : lang === "hi" ? "डेयरी" : "दुग्धजन्य") },
          { key: "equipment", label: "🚜 " + (lang === "en" ? "Equipment" : lang === "hi" ? "उपकरण" : "उपकरणे") },
          { key: "seeds",     label: "🌱 " + (lang === "en" ? "Seeds" : lang === "hi" ? "बीज" : "बियाणे") },
          { key: "available", label: "✅ " + labels.available },
          { key: "sold",      label: "🏷️ " + labels.sold },
        ].map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === f.key
                ? "bg-primary-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-primary-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="flex justify-center items-center h-48">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        </div>
      )}

      {/* ── No listings ── */}
      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">🌾</div>
          <p className="text-gray-500 text-sm mb-4">{labels.noListings}</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary-600 text-white font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 hover:bg-primary-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            {labels.addNew}
          </button>
        </div>
      )}

      {/* ── Product Grid ── */}
      {!loading && filtered.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              labels={labels}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* ── Form Modal ── */}
      {showForm && (
        <ProductForm
          labels={labels}
          onClose={handleFormClose}
          onSave={handleFormSave}
          editData={editData}
        />
      )}
    </div>
  );
}

export default function SellCrops() {
  return (
    <FarmerLayout>
      <SellCropsContent />
    </FarmerLayout>
  );
}
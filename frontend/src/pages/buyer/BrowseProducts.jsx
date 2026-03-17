import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import BuyerLayout from "./BuyerLayout";
import { useBuyerLang, bt } from "./BuyerLayout";
import {
  Search, Filter, ShoppingBag, X, Loader,
  MapPin, Phone, ChevronDown, RefreshCw, Star
} from "lucide-react";

const API = "http://localhost:8000";

// ── Translations ──────────────────────────────────────────────
const bpt = {
  en: {
    title:       "Browse Products",
    subtitle:    "Fresh produce directly from verified farmers",
    search:      "Search products...",
    allCats:     "All Categories",
    allStates:   "All Locations",
    sortBy:      "Sort By",
    refresh:     "Refresh",
    noProducts:  "No products found. Try different filters.",
    orderNow:    "Order Now",
    perUnit:     "per",
    available:   "Available",
    qty:         "Qty",
    farmer:      "Farmer",
    location:    "Location",
    contact:     "Contact",
    orderTitle:  "Place Order",
    quantity:    "Quantity *",
    address:     "Delivery Address *",
    note:        "Note (optional)",
    totalPrice:  "Total Price",
    placeOrder:  "Confirm Order",
    cancel:      "Cancel",
    categories: {
      crops:     "🌾 Crops",
      dairy:     "🥛 Dairy",
      equipment: "🚜 Equipment",
      seeds:     "🌱 Seeds",
      other:     "📦 Other",
    },
    sortOptions: ["Latest", "Price: Low to High", "Price: High to Low"],
  },
  hi: {
    title:       "उत्पाद देखें",
    subtitle:    "सत्यापित किसानों से सीधे ताजी उपज",
    search:      "उत्पाद खोजें...",
    allCats:     "सभी श्रेणियां",
    allStates:   "सभी स्थान",
    sortBy:      "क्रमबद्ध करें",
    refresh:     "रीफ्रेश",
    noProducts:  "कोई उत्पाद नहीं मिला।",
    orderNow:    "अभी ऑर्डर करें",
    perUnit:     "प्रति",
    available:   "उपलब्ध",
    qty:         "मात्रा",
    farmer:      "किसान",
    location:    "स्थान",
    contact:     "संपर्क",
    orderTitle:  "ऑर्डर दें",
    quantity:    "मात्रा *",
    address:     "डिलीवरी पता *",
    note:        "नोट (वैकल्पिक)",
    totalPrice:  "कुल कीमत",
    placeOrder:  "ऑर्डर कन्फर्म करें",
    cancel:      "रद्द करें",
    categories: {
      crops:     "🌾 फसलें",
      dairy:     "🥛 डेयरी",
      equipment: "🚜 उपकरण",
      seeds:     "🌱 बीज",
      other:     "📦 अन्य",
    },
    sortOptions: ["नवीनतम", "कीमत: कम से अधिक", "कीमत: अधिक से कम"],
  },
  mr: {
    title:       "उत्पादने पहा",
    subtitle:    "सत्यापित शेतकऱ्यांकडून थेट ताजी उत्पादने",
    search:      "उत्पादने शोधा...",
    allCats:     "सर्व श्रेणी",
    allStates:   "सर्व ठिकाणे",
    sortBy:      "क्रमवारी",
    refresh:     "रीफ्रेश",
    noProducts:  "कोणतेही उत्पादन आढळले नाही.",
    orderNow:    "आता ऑर्डर करा",
    perUnit:     "प्रति",
    available:   "उपलब्ध",
    qty:         "प्रमाण",
    farmer:      "शेतकरी",
    location:    "ठिकाण",
    contact:     "संपर्क",
    orderTitle:  "ऑर्डर द्या",
    quantity:    "प्रमाण *",
    address:     "वितरण पत्ता *",
    note:        "नोंद (पर्यायी)",
    totalPrice:  "एकूण किंमत",
    placeOrder:  "ऑर्डर कन्फर्म करा",
    cancel:      "रद्द करा",
    categories: {
      crops:     "🌾 पिके",
      dairy:     "🥛 दुग्धजन्य",
      equipment: "🚜 उपकरणे",
      seeds:     "🌱 बियाणे",
      other:     "📦 इतर",
    },
    sortOptions: ["नवीनतम", "किंमत: कमी ते जास्त", "किंमत: जास्त ते कमी"],
  },
};

const CAT_EMOJI = {
  crops: "🌾", dairy: "🥛", equipment: "🚜", seeds: "🌱", other: "📦",
};

// ── Order Modal ───────────────────────────────────────────────
function OrderModal({ product, labels, onClose, onSuccess }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [quantity, setQuantity] = useState(1);
  const [address,  setAddress]  = useState(user.location || "");
  const [note,     setNote]     = useState("");
  const [loading,  setLoading]  = useState(false);

  const totalPrice = product.price * quantity;

  const handleOrder = async () => {
    if (!address.trim()) { toast.error("Please enter delivery address"); return; }
    if (quantity < 1)    { toast.error("Quantity must be at least 1"); return; }
    if (quantity > product.quantity) {
      toast.error(`Only ${product.quantity} ${product.unit} available`);
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API}/api/orders`,
        { productId: product._id, quantity, deliveryAddress: address, note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order placed successfully! 🎉");
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="font-display font-bold text-gray-800 text-lg">{labels.orderTitle}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Product summary */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-2xl">
              {CAT_EMOJI[product.category] || "📦"}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-sm">{product.title}</p>
              <p className="text-xs text-gray-400">
                {labels.farmer}: {product.farmer?.name || "Farmer"}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg" style={{ color: "#a16207" }}>
                ₹{product.price}
              </p>
              <p className="text-xs text-gray-400">{labels.perUnit} {product.unit}</p>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">{labels.quantity}</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max={product.quantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                +
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {labels.available}: {product.quantity} {product.unit}
            </p>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">{labels.address}</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              placeholder="Enter full delivery address..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">{labels.note}</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any special instructions..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Total */}
          <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-4">
            <span className="font-bold text-gray-700">{labels.totalPrice}</span>
            <span className="font-display font-bold text-2xl" style={{ color: "#a16207" }}>
              ₹{totalPrice.toLocaleString()}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-all text-sm"
            >
              {labels.cancel}
            </button>
            <button
              onClick={handleOrder}
              disabled={loading}
              className="flex-1 text-white font-bold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ backgroundColor: "#a16207" }}
            >
              {loading
                ? <Loader className="w-4 h-4 animate-spin" />
                : <ShoppingBag className="w-4 h-4" />
              }
              {labels.placeOrder}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Product Card ──────────────────────────────────────────────
function ProductCard({ product, labels, onOrder }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
      {/* Image / Emoji */}
      <div className="h-44 bg-gradient-to-br from-primary-50 to-green-50 flex items-center justify-center relative">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <span className="text-7xl">{CAT_EMOJI[product.category] || "📦"}</span>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-xs font-bold px-2.5 py-1 rounded-full text-gray-700 capitalize">
            {product.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {labels.available}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-base mb-1 truncate">{product.title}</h3>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-3">
          <span className="font-display font-bold text-2xl" style={{ color: "#a16207" }}>
            ₹{product.price}
          </span>
          <span className="text-gray-400 text-xs">{labels.perUnit} {product.unit}</span>
        </div>

        {/* Details */}
        <div className="space-y-1.5 mb-3">
          {product.farmer?.name && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>👨‍🌾</span>
              <span>{product.farmer.name}</span>
              {product.farmer.farmName && (
                <span className="text-gray-400">• {product.farmer.farmName}</span>
              )}
            </div>
          )}
          {product.location && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="w-3 h-3" />
              <span>{product.location}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span>📦</span>
            <span>{labels.qty}: {product.quantity} {product.unit}</span>
          </div>
          {product.contactPhone && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Phone className="w-3 h-3" />
              <span>{product.contactPhone}</span>
            </div>
          )}
        </div>

        {product.description && (
          <p className="text-gray-400 text-xs mb-3 line-clamp-2">{product.description}</p>
        )}

        {/* Order Button */}
        <button
          onClick={() => onOrder(product)}
          className="w-full text-white font-bold py-2.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 hover:opacity-90"
          style={{ backgroundColor: "#a16207" }}
        >
          <ShoppingBag className="w-4 h-4" />
          {labels.orderNow}
        </button>
      </div>
    </div>
  );
}

// ── Main Content ──────────────────────────────────────────────
function BrowseContent() {
  const lang   = useBuyerLang();
  const labels = bpt[lang];

  const [products,    setProducts]    = useState([]);
  const [filtered,    setFiltered]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [selCat,      setSelCat]      = useState("");
  const [sortBy,      setSortBy]      = useState("Latest");
  const [orderProduct,setOrderProduct]= useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(data.products || []);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // Filter + Sort
  useEffect(() => {
    let result = [...products];
    if (search) result = result.filter((p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    );
    if (selCat) result = result.filter((p) => p.category === selCat);
    if (sortBy === labels.sortOptions[1]) result.sort((a, b) => a.price - b.price);
    if (sortBy === labels.sortOptions[2]) result.sort((a, b) => b.price - a.price);
    setFiltered(result);
  }, [products, search, selCat, sortBy]);

  const handleOrderSuccess = () => {
    setOrderProduct(null);
    fetchProducts();
  };

  // Category counts
  const catCounts = {};
  products.forEach((p) => { catCounts[p.category] = (catCounts[p.category] || 0) + 1; });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-2xl p-6 text-white"
        style={{ background: "linear-gradient(to right, #a16207, #854d0e)" }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">🛒</div>
            <div>
              <h2 className="font-display text-xl font-bold">{labels.title}</h2>
              <p className="text-yellow-100 text-sm mt-0.5">{labels.subtitle}</p>
            </div>
          </div>
          <button
            onClick={fetchProducts}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            {labels.refresh}
          </button>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelCat("")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
            selCat === ""
              ? "text-white border-transparent"
              : "border-gray-200 bg-white text-gray-600 hover:border-yellow-400"
          }`}
          style={selCat === "" ? { backgroundColor: "#a16207", borderColor: "#a16207" } : {}}
        >
          {labels.allCats} ({products.length})
        </button>
        {Object.entries(labels.categories).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelCat(key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
              selCat === key
                ? "text-white border-transparent"
                : "border-gray-200 bg-white text-gray-600 hover:border-yellow-400"
            }`}
            style={selCat === key ? { backgroundColor: "#a16207", borderColor: "#a16207" } : {}}
          >
            {label} {catCounts[key] ? `(${catCounts[key]})` : ""}
          </button>
        ))}
      </div>

      {/* Search + Sort */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={labels.search}
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-700"
            >
              {labels.sortOptions.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {(search || selCat) && (
            <button
              onClick={() => { setSearch(""); setSelCat(""); }}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold px-3 py-2 border border-red-200 rounded-xl"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-gray-500">
          {lang === "en" ? `Showing ${filtered.length} products`
          : lang === "hi" ? `${filtered.length} उत्पाद दिखाए जा रहे हैं`
          : `${filtered.length} उत्पादने दाखवत आहे`}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-2xl">🛒</div>
          </div>
        </div>
      )}

      {/* No products */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500 text-sm">{labels.noProducts}</p>
          {(search || selCat) && (
            <button
              onClick={() => { setSearch(""); setSelCat(""); }}
              className="mt-4 text-sm font-bold px-5 py-2.5 rounded-xl text-white transition-all"
              style={{ backgroundColor: "#a16207" }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Product Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              labels={labels}
              onOrder={setOrderProduct}
            />
          ))}
        </div>
      )}

      {/* Order Modal */}
      {orderProduct && (
        <OrderModal
          product={orderProduct}
          labels={labels}
          onClose={() => setOrderProduct(null)}
          onSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
}

export default function BrowseProducts() {
  return (
    <BuyerLayout>
      <BrowseContent />
    </BuyerLayout>
  );
}
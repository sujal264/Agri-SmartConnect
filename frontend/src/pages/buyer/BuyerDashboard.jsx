import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BuyerLayout from "./BuyerLayout";
import { useBuyerLang, bt } from "./BuyerLayout";
import { ShoppingBag, ArrowRight, Package } from "lucide-react";

const API = "http://localhost:8000";

function DashboardContent() {
  const lang = useBuyerLang();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [orders,   setOrders]   = useState([]);
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const prodRes = await axios.get(`${API}/api/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(prodRes.data.products || []);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featureCards = [
    {
      label: bt[lang].browse,
      emoji: "🛒",
      path:  "/buyer/browse",
      desc:  lang === "en" ? "Browse fresh farm produce"
           : lang === "hi" ? "ताजी कृषि उपज देखें"
           : "ताजे शेती उत्पादने पहा",
    },
    {
      label: bt[lang].myOrders,
      emoji: "📦",
      path:  "/buyer/orders",
      desc:  lang === "en" ? "Track your orders"
           : lang === "hi" ? "अपने ऑर्डर ट्रैक करें"
           : "तुमचे ऑर्डर ट्रॅक करा",
    },
    {
      label: bt[lang].marketPrice,
      emoji: "📈",
      path:  "/buyer/market-prices",
      desc:  lang === "en" ? "Check live market rates"
           : lang === "hi" ? "लाइव बाज़ार दर देखें"
           : "थेट बाजार दर पहा",
    },
    {
      label: bt[lang].community,
      emoji: "👥",
      path:  "/buyer/community",
      desc:  lang === "en" ? "Connect with farmers"
           : lang === "hi" ? "किसानों से जुड़ें"
           : "शेतकऱ्यांशी जोडा",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(to right, #a16207, #854d0e)" }}
      >
        <div className="absolute right-0 top-0 text-8xl opacity-10 leading-none">🛒</div>
        <p className="text-yellow-200 text-sm font-semibold mb-1">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}
        </p>
        <h2 className="font-display text-2xl font-bold mb-1">
          {bt[lang].hello}, {user.name?.split(" ")[0] || bt[lang].buyer}! 🛒
        </h2>
        <p className="text-yellow-200 text-sm mb-4">
          {lang === "en" ? "Source fresh produce directly from farmers"
          : lang === "hi" ? "किसानों से सीधे ताजी उपज खरीदें"
          : "शेतकऱ्यांकडून थेट ताजी उत्पादने खरेदी करा"}
        </p>
        <Link
          to="/buyer/browse"
          className="inline-flex items-center gap-2 bg-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-yellow-50 transition-all"
          style={{ color: "#a16207" }}
        >
          {lang === "en" ? "Browse Products"
          : lang === "hi" ? "उत्पाद देखें"
          : "उत्पादने पहा"}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { emoji: "🛒", label: lang === "en" ? "Total Orders"  : lang === "hi" ? "कुल ऑर्डर"   : "एकूण ऑर्डर",  value: orders.length },
          { emoji: "🌾", label: lang === "en" ? "Products"      : lang === "hi" ? "उत्पाद"       : "उत्पादने",    value: products.length },
          { emoji: "✅", label: lang === "en" ? "Delivered"     : lang === "hi" ? "डिलीवर हुए"  : "वितरित",      value: orders.filter((o) => o.status === "delivered").length },
          { emoji: "⏳", label: lang === "en" ? "Pending"       : lang === "hi" ? "प्रतीक्षारत" : "प्रलंबित",    value: orders.filter((o) => o.status === "pending").length },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <div className="text-3xl mb-2">{s.emoji}</div>
            <p className="font-display font-bold text-2xl text-gray-800">{loading ? "..." : s.value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div>
        <h3 className="font-display font-bold text-gray-700 text-lg mb-4">
          {lang === "en" ? "Quick Access" : lang === "hi" ? "त्वरित पहुंच" : "जलद प्रवेश"}
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featureCards.map((card, i) => (
            <Link
              key={i}
              to={card.path}
              className="group p-5 rounded-2xl border border-yellow-200 bg-yellow-50 hover:shadow-md transition-all duration-200"
            >
              <div className="text-4xl mb-3">{card.emoji}</div>
              <p className="font-bold text-gray-800 text-sm mb-1">{card.label}</p>
              <p className="text-gray-500 text-xs leading-tight">{card.desc}</p>
              <div
                className="flex items-center gap-1 mt-3 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: "#a16207" }}
              >
                {lang === "en" ? "Open" : lang === "hi" ? "खोलें" : "उघडा"}
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Fresh Listings Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-gray-700 text-lg">
            {lang === "en" ? "Fresh Listings" : lang === "hi" ? "ताजी लिस्टिंग" : "ताज्या यादी"}
          </h3>
          <Link
            to="/buyer/browse"
            className="text-xs font-semibold hover:underline flex items-center gap-1"
            style={{ color: "#a16207" }}
          >
            {lang === "en" ? "View All" : lang === "hi" ? "सभी देखें" : "सर्व पहा"}
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-40 border border-gray-100 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center">
            <div className="text-5xl mb-3">📦</div>
            <p className="text-gray-500 text-sm">
              {lang === "en" ? "No products available yet"
              : lang === "hi" ? "अभी कोई उत्पाद उपलब्ध नहीं"
              : "अद्याप कोणतेही उत्पादन उपलब्ध नाही"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {products.slice(0, 3).map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-2xl">
                    {product.category === "crops"      ? "🌾"
                    : product.category === "dairy"     ? "🥛"
                    : product.category === "equipment" ? "🚜"
                    : product.category === "seeds"     ? "🌱"
                    : "📦"}
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full capitalize">
                    {product.category}
                  </span>
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-1 truncate">{product.title}</h4>
                <p className="font-display font-bold text-lg" style={{ color: "#a16207" }}>
                  ₹{product.price}/{product.unit}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  📍 {product.location || "India"} • {product.quantity} {product.unit}
                </p>
                <Link
                  to="/buyer/browse"
                  className="mt-3 w-full flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-xl transition-all"
                  style={{ backgroundColor: "#fef9c3", color: "#a16207" }}
                >
                  <ShoppingBag className="w-3 h-3" />
                  {lang === "en" ? "View & Order"
                  : lang === "hi" ? "देखें और ऑर्डर करें"
                  : "पहा आणि ऑर्डर करा"}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <Package className="w-4 h-4" style={{ color: "#ca8a04" }} />
            {lang === "en" ? "Recent Orders" : lang === "hi" ? "हाल के ऑर्डर" : "अलीकडील ऑर्डर"}
          </h3>
          <Link
            to="/buyer/orders"
            className="text-xs font-semibold hover:underline flex items-center gap-1"
            style={{ color: "#a16207" }}
          >
            {lang === "en" ? "View All" : lang === "hi" ? "सभी देखें" : "सर्व पहा"}
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-5xl mb-3">📦</div>
          <p className="text-gray-500 text-sm mb-4">
            {lang === "en" ? "No orders yet. Start browsing!"
            : lang === "hi" ? "कोई ऑर्डर नहीं। खरीदारी शुरू करें!"
            : "कोणताही ऑर्डर नाही. खरेदी सुरू करा!"}
          </p>
          <Link
            to="/buyer/browse"
            className="text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all"
            style={{ backgroundColor: "#a16207" }}
          >
            <ShoppingBag className="w-4 h-4" />
            {lang === "en" ? "Browse Products"
            : lang === "hi" ? "उत्पाद देखें"
            : "उत्पादने पहा"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BuyerDashboard() {
  return (
    <BuyerLayout>
      <DashboardContent />
    </BuyerLayout>
  );
}
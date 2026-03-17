import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import BuyerLayout from "./BuyerLayout";
import { useBuyerLang } from "./BuyerLayout";
import {
  Package, RefreshCw, X, CheckCircle,
  Clock, Truck, XCircle, Star
} from "lucide-react";

const API = "http://localhost:8000";

const ot = {
  en: {
    title:      "My Orders",
    subtitle:   "Track all your orders from farmers",
    refresh:    "Refresh",
    noOrders:   "No orders yet. Start browsing products!",
    browseBtn:  "Browse Products",
    orderId:    "Order ID",
    product:    "Product",
    farmer:     "Farmer",
    quantity:   "Quantity",
    total:      "Total",
    status:     "Status",
    date:       "Date",
    address:    "Delivery Address",
    cancel:     "Cancel Order",
    cancelNote: "You can only cancel pending orders.",
    statuses: {
      pending:   "Pending",
      confirmed: "Confirmed",
      shipped:   "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
    },
    filter: {
      all:       "All Orders",
      pending:   "Pending",
      confirmed: "Confirmed",
      shipped:   "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
    },
    totalSpent:  "Total Spent",
    totalOrders: "Total Orders",
    delivered_c: "Delivered",
    pending_c:   "Pending",
  },
  hi: {
    title:      "मेरे ऑर्डर",
    subtitle:   "किसानों से अपने सभी ऑर्डर ट्रैक करें",
    refresh:    "रीफ्रेश",
    noOrders:   "कोई ऑर्डर नहीं। उत्पाद देखना शुरू करें!",
    browseBtn:  "उत्पाद देखें",
    orderId:    "ऑर्डर ID",
    product:    "उत्पाद",
    farmer:     "किसान",
    quantity:   "मात्रा",
    total:      "कुल",
    status:     "स्थिति",
    date:       "दिनांक",
    address:    "डिलीवरी पता",
    cancel:     "ऑर्डर रद्द करें",
    cancelNote: "केवल प्रतीक्षारत ऑर्डर रद्द किए जा सकते हैं।",
    statuses: {
      pending:   "प्रतीक्षारत",
      confirmed: "पुष्टि हुई",
      shipped:   "भेजा गया",
      delivered: "डिलीवर हुआ",
      cancelled: "रद्द",
    },
    filter: {
      all:       "सभी ऑर्डर",
      pending:   "प्रतीक्षारत",
      confirmed: "पुष्टि हुई",
      shipped:   "भेजा गया",
      delivered: "डिलीवर हुआ",
      cancelled: "रद्द",
    },
    totalSpent:  "कुल खर्च",
    totalOrders: "कुल ऑर्डर",
    delivered_c: "डिलीवर",
    pending_c:   "प्रतीक्षारत",
  },
  mr: {
    title:      "माझे ऑर्डर",
    subtitle:   "शेतकऱ्यांकडून तुमचे सर्व ऑर्डर ट्रॅक करा",
    refresh:    "रीफ्रेश",
    noOrders:   "कोणताही ऑर्डर नाही. उत्पादने पाहणे सुरू करा!",
    browseBtn:  "उत्पादने पहा",
    orderId:    "ऑर्डर ID",
    product:    "उत्पादन",
    farmer:     "शेतकरी",
    quantity:   "प्रमाण",
    total:      "एकूण",
    status:     "स्थिती",
    date:       "दिनांक",
    address:    "वितरण पत्ता",
    cancel:     "ऑर्डर रद्द करा",
    cancelNote: "फक्त प्रलंबित ऑर्डर रद्द करता येतात.",
    statuses: {
      pending:   "प्रलंबित",
      confirmed: "पुष्टी झाली",
      shipped:   "पाठवले",
      delivered: "वितरित",
      cancelled: "रद्द",
    },
    filter: {
      all:       "सर्व ऑर्डर",
      pending:   "प्रलंबित",
      confirmed: "पुष्टी झाली",
      shipped:   "पाठवले",
      delivered: "वितरित",
      cancelled: "रद्द",
    },
    totalSpent:  "एकूण खर्च",
    totalOrders: "एकूण ऑर्डर",
    delivered_c: "वितरित",
    pending_c:   "प्रलंबित",
  },
};

const STATUS_STYLES = {
  pending:   { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
  confirmed: { bg: "bg-blue-100",   text: "text-blue-700",   icon: CheckCircle },
  shipped:   { bg: "bg-purple-100", text: "text-purple-700", icon: Truck },
  delivered: { bg: "bg-green-100",  text: "text-green-700",  icon: CheckCircle },
  cancelled: { bg: "bg-red-100",    text: "text-red-600",    icon: XCircle },
};

const STATUS_STEPS = ["pending", "confirmed", "shipped", "delivered"];

function StatusTracker({ status }) {
  if (status === "cancelled") return null;
  const currentStep = STATUS_STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-1 mt-3">
      {STATUS_STEPS.map((step, i) => (
        <div key={step} className="flex items-center flex-1">
          <div className={`w-full h-1.5 rounded-full transition-all ${
            i <= currentStep ? "" : "bg-gray-200"
          }`}
          style={i <= currentStep ? { backgroundColor: "#a16207" } : {}}
          />
          {i < STATUS_STEPS.length - 1 && <div className="w-1" />}
        </div>
      ))}
    </div>
  );
}

function OrderCard({ order, labels, onCancel }) {
  const style   = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
  const StatusIcon = style.icon;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-mono">
            #{order._id?.slice(-8).toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text}`}>
            <StatusIcon className="w-3 h-3" />
            {labels.statuses[order.status]}
          </span>
          {order.status === "pending" && (
            <button
              onClick={() => onCancel(order._id)}
              className="text-red-400 hover:text-red-600 transition-colors"
              title={labels.cancel}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Product emoji */}
          <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
            {order.product?.category === "crops"      ? "🌾"
            : order.product?.category === "dairy"     ? "🥛"
            : order.product?.category === "equipment" ? "🚜"
            : order.product?.category === "seeds"     ? "🌱"
            : "📦"}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800 text-base truncate">
              {order.product?.title || order.product?.name || "Product"}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              👨‍🌾 {order.farmer?.name || "Farmer"}
              {order.farmer?.farmName && ` • ${order.farmer.farmName}`}
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                📦 {order.quantity} {order.product?.unit}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "#fef9c3", color: "#a16207" }}>
                ₹{order.totalPrice?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Progress tracker */}
        <StatusTracker status={order.status} />

        {/* Footer info */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-3 text-xs text-gray-400">
          <span>📅 {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
          {order.deliveryAddress && (
            <span className="truncate">📍 {order.deliveryAddress}</span>
          )}
          {order.farmer?.phone && (
            <span>📞 {order.farmer.phone}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function OrdersContent() {
  const lang   = useBuyerLang();
  const labels = ot[lang];

  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("all");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API}/api/orders/buyer`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data.orders || []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API}/api/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Order cancelled");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cannot cancel this order");
    }
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const totalSpent = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + (o.totalPrice || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-2xl p-6 text-white"
        style={{ background: "linear-gradient(to right, #a16207, #854d0e)" }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">📦</div>
            <div>
              <h2 className="font-display text-xl font-bold">{labels.title}</h2>
              <p className="text-yellow-100 text-sm mt-0.5">{labels.subtitle}</p>
            </div>
          </div>
          <button onClick={fetchOrders}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
            <RefreshCw className="w-4 h-4" />
            {labels.refresh}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { emoji: "🛒", label: labels.totalOrders, value: orders.length },
          { emoji: "💰", label: labels.totalSpent,  value: `₹${totalSpent.toLocaleString()}` },
          { emoji: "✅", label: labels.delivered_c, value: orders.filter((o) => o.status === "delivered").length },
          { emoji: "⏳", label: labels.pending_c,   value: orders.filter((o) => o.status === "pending").length },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <div className="text-3xl mb-2">{s.emoji}</div>
            <p className="font-display font-bold text-xl text-gray-800">{loading ? "..." : s.value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(labels.filter).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
              filter === key
                ? "text-white border-transparent"
                : "border-gray-200 bg-white text-gray-600"
            }`}
            style={filter === key ? { backgroundColor: "#a16207", borderColor: "#a16207" } : {}}
          >
            {label}
            {key !== "all" && orders.filter((o) => o.status === key).length > 0 && (
              <span className="ml-1.5 bg-white/30 px-1.5 py-0.5 rounded-full text-xs">
                {orders.filter((o) => o.status === key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-48">
          <div className="w-12 h-12 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin" />
        </div>
      )}

      {/* No orders */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-500 text-sm mb-4">{labels.noOrders}</p>
          <a
            href="/buyer/browse"
            className="text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
            style={{ backgroundColor: "#a16207" }}
          >
            {labels.browseBtn}
          </a>
        </div>
      )}

      {/* Orders list */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              labels={labels}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}

      {/* Cancel note */}
      {orders.some((o) => o.status === "pending") && (
        <p className="text-xs text-gray-400 text-center">{labels.cancelNote}</p>
      )}
    </div>
  );
}

export default function MyOrders() {
  return (
    <BuyerLayout>
      <OrdersContent />
    </BuyerLayout>
  );
}
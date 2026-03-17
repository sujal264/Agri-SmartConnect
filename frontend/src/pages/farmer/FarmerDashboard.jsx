import { Link } from "react-router-dom";
import FarmerLayout from "./FarmerLayout";
import { useLang, t } from "./FarmerLayout";
import {
  Sprout, CloudSun, TrendingUp, ShoppingBag,
  Leaf, Bug, Landmark, Wallet, Users, ArrowRight
} from "lucide-react";

const featureCards = (lang) => [
  { label: t[lang].cropRec,      icon: Sprout,       path: "/farmer/crop-recommendation", color: "bg-green-50 border-green-200",   iconBg: "bg-green-100",  iconColor: "text-green-600",  emoji: "🌱" },
  { label: t[lang].weather,      icon: CloudSun,     path: "/farmer/weather",              color: "bg-blue-50 border-blue-200",    iconBg: "bg-blue-100",   iconColor: "text-blue-600",   emoji: "🌤️" },
  { label: t[lang].marketPrices, icon: TrendingUp,   path: "/farmer/market-prices",        color: "bg-yellow-50 border-yellow-200",iconBg: "bg-yellow-100", iconColor: "text-yellow-600", emoji: "📈" },
  { label: t[lang].sellCrops,    icon: ShoppingBag,  path: "/farmer/sell-crops",           color: "bg-orange-50 border-orange-200",iconBg: "bg-orange-100", iconColor: "text-orange-600", emoji: "🛒" },
  { label: t[lang].fertilizer,   icon: Leaf,         path: "/farmer/fertilizer",           color: "bg-lime-50 border-lime-200",    iconBg: "bg-lime-100",   iconColor: "text-lime-600",   emoji: "🧪" },
  { label: t[lang].disease,      icon: Bug,          path: "/farmer/disease-detection",    color: "bg-red-50 border-red-200",      iconBg: "bg-red-100",    iconColor: "text-red-600",    emoji: "🔬" },
  { label: t[lang].schemes,      icon: Landmark,     path: "/farmer/schemes",              color: "bg-purple-50 border-purple-200",iconBg: "bg-purple-100", iconColor: "text-purple-600", emoji: "🏛️" },
  { label: t[lang].expenses,     icon: Wallet,       path: "/farmer/expenses",             color: "bg-pink-50 border-pink-200",    iconBg: "bg-pink-100",   iconColor: "text-pink-600",   emoji: "💰" },
  { label: t[lang].community,    icon: Users,        path: "/farmer/community",            color: "bg-indigo-50 border-indigo-200",iconBg: "bg-indigo-100", iconColor: "text-indigo-600", emoji: "👥" },
];

function DashboardContent() {
  const lang = useLang();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const cards = featureCards(lang);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 text-8xl opacity-10 leading-none">🌾</div>
        <p className="text-primary-200 text-sm font-semibold mb-1">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
        <h2 className="font-display text-2xl font-bold mb-1">
          {t[lang].hello}, {user.name?.split(" ")[0] || t[lang].farmer}! 🌾
        </h2>
        <p className="text-primary-200 text-sm">
          {lang === "en" && "What would you like to do today?"}
          {lang === "hi" && "आज आप क्या करना चाहते हैं?"}
          {lang === "mr" && "आज तुम्हाला काय करायचे आहे?"}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: lang === "en" ? "My Listings" : lang === "hi" ? "मेरी लिस्टिंग" : "माझ्या यादी", value: "0", emoji: "📦" },
          { label: lang === "en" ? "Orders"      : lang === "hi" ? "ऑर्डर"        : "ऑर्डर",       value: "0", emoji: "🛒" },
          { label: lang === "en" ? "Earnings"    : lang === "hi" ? "कमाई"         : "कमाई",         value: "₹0", emoji: "💰" },
          { label: lang === "en" ? "Forum Posts" : lang === "hi" ? "पोस्ट"        : "पोस्ट",        value: "0", emoji: "💬" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <div className="text-3xl mb-2">{s.emoji}</div>
            <p className="font-display font-bold text-2xl text-gray-800">{s.value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Feature Cards Grid */}
      <div>
        <h3 className="font-display font-bold text-gray-700 text-lg mb-4">
          {lang === "en" ? "All Features" : lang === "hi" ? "सभी सुविधाएं" : "सर्व वैशिष्ट्ये"}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Link
                key={i}
                to={card.path}
                className={`group p-5 rounded-2xl border ${card.color} hover:shadow-md transition-all duration-200 flex flex-col gap-3`}
              >
                <div className={`w-11 h-11 ${card.iconBg} rounded-xl flex items-center justify-center text-xl`}>
                  {card.emoji}
                </div>
                <div className="flex items-center justify-between">
                  <p className={`font-bold text-sm text-gray-700`}>{card.label}</p>
                  <ArrowRight className={`w-4 h-4 ${card.iconColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function FarmerDashboardPage() {
  return (
    <FarmerLayout>
      <DashboardContent />
    </FarmerLayout>
  );
}
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Leaf, LayoutDashboard, CloudSun, TrendingUp, ShoppingBag,
  Sprout, Bug, Landmark, Wallet, Users, Globe, LogOut,
  Menu, X, ChevronRight, Bell
} from "lucide-react";

// ── Language Context (global for farmer section) ──────────────
import { createContext, useContext } from "react";
export const LangContext = createContext("en");
export const useLang = () => useContext(LangContext);

// ── Translations ──────────────────────────────────────────────
export const t = {
  en: {
    dashboard:      "Dashboard",
    cropRec:        "Crop Recommendation",
    weather:        "Weather Forecast",
    marketPrices:   "Market Prices",
    sellCrops:      "Sell Crops",
    fertilizer:     "Fertilizer Advice",
    disease:        "Disease Detection",
    schemes:        "Government Schemes",
    expenses:       "Expense Tracker",
    community:      "Community Forum",
    language:       "Language",
    logout:         "Logout",
    hello:          "Hello",
    farmer:         "Farmer",
  },
  hi: {
    dashboard:      "डैशबोर्ड",
    cropRec:        "फसल सिफारिश",
    weather:        "मौसम पूर्वानुमान",
    marketPrices:   "बाज़ार भाव",
    sellCrops:      "फसल बेचें",
    fertilizer:     "उर्वरक सलाह",
    disease:        "रोग पहचान",
    schemes:        "सरकारी योजनाएं",
    expenses:       "खर्च ट्रैकर",
    community:      "समुदाय मंच",
    language:       "भाषा",
    logout:         "लॉगआउट",
    hello:          "नमस्ते",
    farmer:         "किसान",
  },
  mr: {
    dashboard:      "डॅशबोर्ड",
    cropRec:        "पीक शिफारस",
    weather:        "हवामान अंदाज",
    marketPrices:   "बाजार भाव",
    sellCrops:      "पीक विका",
    fertilizer:     "खत सल्ला",
    disease:        "रोग ओळख",
    schemes:        "सरकारी योजना",
    expenses:       "खर्च ट्रॅकर",
    community:      "समुदाय मंच",
    language:       "भाषा",
    logout:         "लॉगआउट",
    hello:          "नमस्कार",
    farmer:         "शेतकरी",
  },
};

// ── Nav Items ─────────────────────────────────────────────────
const navItems = (lang) => [
  { key: "dashboard",    label: t[lang].dashboard,    icon: LayoutDashboard, path: "/farmer/dashboard" },
  { key: "crop",         label: t[lang].cropRec,      icon: Sprout,          path: "/farmer/crop-recommendation" },
  { key: "weather",      label: t[lang].weather,      icon: CloudSun,        path: "/farmer/weather" },
  { key: "market",       label: t[lang].marketPrices, icon: TrendingUp,      path: "/farmer/market-prices" },
  { key: "sell",         label: t[lang].sellCrops,    icon: ShoppingBag,     path: "/farmer/sell-crops" },
  { key: "fertilizer",   label: t[lang].fertilizer,   icon: Leaf,            path: "/farmer/fertilizer" },
  { key: "disease",      label: t[lang].disease,      icon: Bug,             path: "/farmer/disease-detection" },
  { key: "schemes",      label: t[lang].schemes,      icon: Landmark,        path: "/farmer/schemes" },
  { key: "expenses",     label: t[lang].expenses,     icon: Wallet,          path: "/farmer/expenses" },
  { key: "community",    label: t[lang].community,    icon: Users,           path: "/farmer/community" },
];

// ── Sidebar ───────────────────────────────────────────────────
function Sidebar({ lang, setLang, open, setOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const items = navItems(lang);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-30 w-64 bg-primary-900 flex flex-col
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:flex
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-primary-700">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm leading-tight">Agri-Smart</p>
              <p className="text-primary-400 text-xs -mt-0.5">Connect</p>
            </div>
          </Link>
          <button onClick={() => setOpen(false)} className="md:hidden text-primary-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-5 py-4 border-b border-primary-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-lg">
              👨‍🌾
            </div>
            <div className="overflow-hidden">
              <p className="text-white font-bold text-sm truncate">{user.name || "Farmer"}</p>
              <p className="text-primary-400 text-xs">{t[lang].farmer}</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.key}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group ${
                  active
                    ? "bg-primary-600 text-white"
                    : "text-primary-300 hover:bg-primary-800 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                {active && <ChevronRight className="w-3 h-3" />}
              </Link>
            );
          })}
        </nav>

        {/* Language Switcher */}
        <div className="px-4 py-3 border-t border-primary-700">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-primary-400" />
            <span className="text-primary-400 text-xs font-semibold uppercase tracking-wider">
              {t[lang].language}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {[
              { code: "en", label: "EN" },
              { code: "hi", label: "हि" },
              { code: "mr", label: "म" },
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                  lang === l.code
                    ? "bg-primary-500 text-white"
                    : "bg-primary-800 text-primary-300 hover:bg-primary-700"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-primary-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all text-sm font-semibold"
          >
            <LogOut className="w-4 h-4" />
            {t[lang].logout}
          </button>
        </div>
      </aside>
    </>
  );
}

// ── Top Header ────────────────────────────────────────────────
function Header({ lang, setOpen }) {
  const location = useLocation();
  const items = navItems(lang);
  const current = items.find((i) => i.path === location.pathname);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden text-gray-500 hover:text-primary-600"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display font-bold text-gray-800 text-lg leading-tight">
            {current?.label || t[lang].dashboard}
          </h1>
          <p className="text-gray-400 text-xs">
            {t[lang].hello}, {user.name?.split(" ")[0] || t[lang].farmer}! 👋
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-primary-50 transition-colors">
          <Bell className="w-4 h-4 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-base">
          👨‍🌾
        </div>
      </div>
    </header>
  );
}

// ── Main Layout Wrapper ───────────────────────────────────────
export default function FarmerLayout({ children }) {
  const [lang, setLang] = useState("en");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <LangContext.Provider value={lang}>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar
          lang={lang}
          setLang={setLang}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header lang={lang} setOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </LangContext.Provider>
  );
}
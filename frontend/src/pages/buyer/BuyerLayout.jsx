import { useState, createContext, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingBag, LayoutDashboard, ClipboardList,
  TrendingUp, Users, LogOut, Menu, X,
  ChevronRight, Bell, Globe
} from "lucide-react";

export const BuyerLangContext = createContext("en");
export const useBuyerLang = () => useContext(BuyerLangContext);

export const bt = {
  en: {
    dashboard:   "Dashboard",
    browse:      "Browse Products",
    myOrders:    "My Orders",
    marketPrice: "Market Prices",
    community:   "Community Forum",
    language:    "Language",
    logout:      "Logout",
    hello:       "Hello",
    buyer:       "Buyer",
  },
  hi: {
    dashboard:   "डैशबोर्ड",
    browse:      "उत्पाद देखें",
    myOrders:    "मेरे ऑर्डर",
    marketPrice: "बाज़ार भाव",
    community:   "समुदाय मंच",
    language:    "भाषा",
    logout:      "लॉगआउट",
    hello:       "नमस्ते",
    buyer:       "खरीदार",
  },
  mr: {
    dashboard:   "डॅशबोर्ड",
    browse:      "उत्पादने पहा",
    myOrders:    "माझे ऑर्डर",
    marketPrice: "बाजार भाव",
    community:   "समुदाय मंच",
    language:    "भाषा",
    logout:      "लॉगआउट",
    hello:       "नमस्कार",
    buyer:       "खरेदीदार",
  },
};

const navItems = (lang) => [
  { key: "dashboard", label: bt[lang].dashboard,   icon: LayoutDashboard, path: "/buyer/dashboard" },
  { key: "browse",    label: bt[lang].browse,      icon: ShoppingBag,     path: "/buyer/browse" },
  { key: "orders",    label: bt[lang].myOrders,    icon: ClipboardList,   path: "/buyer/orders" },
  { key: "market",    label: bt[lang].marketPrice, icon: TrendingUp,      path: "/buyer/market-prices" },
  { key: "community", label: bt[lang].community,   icon: Users,           path: "/buyer/community" },
];

function Sidebar({ lang, setLang, open, setOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("user") || "{}");
  const items    = navItems(lang);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setOpen(false)} />
      )}
      <aside
        className={`fixed top-0 left-0 h-full z-30 w-64 flex flex-col transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:flex`}
        style={{ backgroundColor: "#a16207" }}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-yellow-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#ca8a04" }}>
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm leading-tight">Agri-Smart</p>
              <p className="text-yellow-300 text-xs -mt-0.5">Connect</p>
            </div>
          </Link>
          <button onClick={() => setOpen(false)} className="md:hidden text-yellow-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 border-b border-yellow-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: "#ca8a04" }}>
              👩‍💼
            </div>
            <div className="overflow-hidden">
              <p className="text-white font-bold text-sm truncate">{user.name || "Buyer"}</p>
              <p className="text-yellow-300 text-xs">{bt[lang].buyer}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {items.map((item) => {
            const Icon   = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.key}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${active ? "text-white" : "text-yellow-200 hover:text-white"}`}
                style={active ? { backgroundColor: "#ca8a04" } : {}}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                {active && <ChevronRight className="w-3 h-3" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-yellow-800">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-yellow-300" />
            <span className="text-yellow-300 text-xs font-semibold uppercase tracking-wider">{bt[lang].language}</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {[{ code: "en", label: "EN" }, { code: "hi", label: "हि" }, { code: "mr", label: "म" }].map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className="py-1.5 rounded-lg text-xs font-bold transition-all text-white"
                style={lang === l.code ? { backgroundColor: "#ca8a04" } : { backgroundColor: "#854d0e" }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-4 border-t border-yellow-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 transition-all text-sm font-semibold"
          >
            <LogOut className="w-4 h-4" />
            {bt[lang].logout}
          </button>
        </div>
      </aside>
    </>
  );
}

function Header({ lang, setOpen }) {
  const location = useLocation();
  const items    = navItems(lang);
  const current  = items.find((i) => i.path === location.pathname);
  const user     = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        <button onClick={() => setOpen(true)} className="md:hidden text-gray-500">
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display font-bold text-gray-800 text-lg leading-tight">
            {current?.label || bt[lang].dashboard}
          </h1>
          <p className="text-gray-400 text-xs">
            {bt[lang].hello}, {user.name?.split(" ")[0] || bt[lang].buyer}! 👋
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
          <Bell className="w-4 h-4 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base" style={{ backgroundColor: "#ca8a04" }}>
          👩‍💼
        </div>
      </div>
    </header>
  );
}

export default function BuyerLayout({ children }) {
  const [lang,        setLang]        = useState("en");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BuyerLangContext.Provider value={lang}>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar lang={lang} setLang={setLang} open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header lang={lang} setOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </BuyerLangContext.Provider>
  );
}
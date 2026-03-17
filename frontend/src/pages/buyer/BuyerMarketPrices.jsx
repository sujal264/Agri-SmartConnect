import { useState, useEffect } from "react";
import BuyerLayout from "./BuyerLayout";
import { useBuyerLang, bt } from "./BuyerLayout";
import {
  TrendingUp, TrendingDown, Minus,
  Search, RefreshCw, Filter, ChevronDown, BarChart3
} from "lucide-react";

const bmt = {
  en: {
    title:      "Market Prices",
    subtitle:   "Live commodity prices to make informed buying decisions",
    search:     "Search crop name...",
    refresh:    "Refresh",
    loading:    "Fetching live market prices...",
    noData:     "No market data found. Try a different filter.",
    minPrice:   "Min Price",
    maxPrice:   "Max Price",
    modalPrice: "Best Price",
    market:     "Market",
    district:   "District",
    state_col:  "State",
    date:       "Date",
    allStates:  "All States",
    allCrops:   "All Crops",
    perQtl:     "per Quintal",
    lastUpdated:"Last Updated",
    totalRec:   "Total Records",
    note:       "Prices in ₹ per Quintal (100 kg)",
    savingsNote:"Potential savings by buying direct from farmers",
    viewFarmers:"View Farmers",
  },
  hi: {
    title:      "बाज़ार भाव",
    subtitle:   "सूचित खरीदारी के लिए लाइव कमोडिटी कीमतें",
    search:     "फसल का नाम खोजें...",
    refresh:    "रीफ्रेश",
    loading:    "लाइव बाज़ार भाव लोड हो रहे हैं...",
    noData:     "कोई डेटा नहीं मिला।",
    minPrice:   "न्यूनतम भाव",
    maxPrice:   "अधिकतम भाव",
    modalPrice: "सर्वश्रेष्ठ भाव",
    market:     "मंडी",
    district:   "जिला",
    state_col:  "राज्य",
    date:       "दिनांक",
    allStates:  "सभी राज्य",
    allCrops:   "सभी फसलें",
    perQtl:     "प्रति क्विंटल",
    lastUpdated:"अंतिम अपडेट",
    totalRec:   "कुल रिकॉर्ड",
    note:       "कीमतें ₹ प्रति क्विंटल में",
    savingsNote:"किसानों से सीधे खरीदने से संभावित बचत",
    viewFarmers:"किसान देखें",
  },
  mr: {
    title:      "बाजार भाव",
    subtitle:   "सूचित खरीदीसाठी थेट कमोडिटी किमती",
    search:     "पीकाचे नाव शोधा...",
    refresh:    "रीफ्रेश",
    loading:    "थेट बाजार भाव लोड होत आहेत...",
    noData:     "डेटा आढळला नाही.",
    minPrice:   "किमान भाव",
    maxPrice:   "कमाल भाव",
    modalPrice: "सर्वोत्तम भाव",
    market:     "मंडी",
    district:   "जिल्हा",
    state_col:  "राज्य",
    date:       "दिनांक",
    allStates:  "सर्व राज्ये",
    allCrops:   "सर्व पिके",
    perQtl:     "प्रति क्विंटल",
    lastUpdated:"शेवटचे अपडेट",
    totalRec:   "एकूण नोंदी",
    note:       "किमती ₹ प्रति क्विंटल मध्ये",
    savingsNote:"शेतकऱ्यांकडून थेट खरेदीने संभाव्य बचत",
    viewFarmers:"शेतकरी पहा",
  },
};

const FALLBACK_DATA = [
  { commodity: "Tomato",    state: "Maharashtra",    district: "Pune",       market: "Pune",        min_price: "800",  max_price: "1200", modal_price: "1000", arrival_date: "16/03/2025" },
  { commodity: "Onion",     state: "Maharashtra",    district: "Nashik",     market: "Lasalgaon",   min_price: "600",  max_price: "900",  modal_price: "750",  arrival_date: "16/03/2025" },
  { commodity: "Potato",    state: "Uttar Pradesh",  district: "Agra",       market: "Agra",        min_price: "400",  max_price: "700",  modal_price: "550",  arrival_date: "16/03/2025" },
  { commodity: "Rice",      state: "Punjab",         district: "Ludhiana",   market: "Ludhiana",    min_price: "1800", max_price: "2200", modal_price: "2000", arrival_date: "16/03/2025" },
  { commodity: "Wheat",     state: "Punjab",         district: "Amritsar",   market: "Amritsar",    min_price: "2100", max_price: "2400", modal_price: "2250", arrival_date: "16/03/2025" },
  { commodity: "Cotton",    state: "Gujarat",        district: "Ahmedabad",  market: "Ahmedabad",   min_price: "5500", max_price: "6500", modal_price: "6000", arrival_date: "16/03/2025" },
  { commodity: "Soybean",   state: "Madhya Pradesh", district: "Indore",     market: "Indore",      min_price: "3800", max_price: "4200", modal_price: "4000", arrival_date: "16/03/2025" },
  { commodity: "Maize",     state: "Karnataka",      district: "Davangere",  market: "Davangere",   min_price: "1400", max_price: "1800", modal_price: "1600", arrival_date: "16/03/2025" },
  { commodity: "Banana",    state: "Tamil Nadu",     district: "Trichy",     market: "Trichy",      min_price: "1000", max_price: "1500", modal_price: "1200", arrival_date: "16/03/2025" },
  { commodity: "Mango",     state: "Andhra Pradesh", district: "Vijayawada", market: "Vijayawada",  min_price: "2000", max_price: "4000", modal_price: "3000", arrival_date: "16/03/2025" },
];

function PriceTrend({ min, max, modal }) {
  const minN = parseInt(min), maxN = parseInt(max), modalN = parseInt(modal);
  const mid  = (minN + maxN) / 2;
  if (modalN < mid) return <TrendingDown className="w-4 h-4 text-green-500" />;
  if (modalN > mid) return <TrendingUp className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-gray-500" />;
}

function PriceCard({ item, labels }) {
  const savings = Math.round((parseInt(item.max_price) - parseInt(item.modal_price)) / parseInt(item.max_price) * 100);
  
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 pb-3 border-b border-gray-100">
        <div>
          <h3 className="font-display font-bold text-gray-800 text-lg">{item.commodity}</h3>
          <p className="text-xs text-gray-500 mt-1">{item.market}, {item.district}</p>
        </div>
        <PriceTrend min={item.min_price} max={item.max_price} modal={item.modal_price} />
      </div>

      {/* Prices Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 bg-red-50 rounded-xl">
          <p className="text-xs text-gray-600 mb-1">{labels.maxPrice}</p>
          <p className="font-display font-bold text-lg text-red-600">₹{item.max_price}</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-xl">
          <p className="text-xs text-gray-600 mb-1">{labels.modalPrice}</p>
          <p className="font-display font-bold text-lg text-blue-600">₹{item.modal_price}</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-xl">
          <p className="text-xs text-gray-600 mb-1">{labels.minPrice}</p>
          <p className="font-display font-bold text-lg text-green-600">₹{item.min_price}</p>
        </div>
      </div>

      {/* Savings Badge */}
      {savings > 0 && (
        <div className="bg-green-50 rounded-xl p-3 mb-4">
          <p className="text-xs text-gray-600 mb-1">{labels.savingsNote}</p>
          <p className="text-sm font-bold text-green-600">Save up to ₹{parseInt(item.max_price) - parseInt(item.modal_price)}/quintal ({savings}%)</p>
        </div>
      )}

      {/* Location info */}
      <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 rounded-xl p-3">
        <span>{item.state}</span>
        <span>{labels.lastUpdated}: {item.arrival_date}</span>
      </div>
    </div>
  );
}

function MarketContent() {
  const lang   = useBuyerLang();
  const labels = bmt[lang];

  const [prices,      setPrices]      = useState([]);
  const [filtered,    setFiltered]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [selState,    setSelState]    = useState("");

  // Get unique states
  const states = [...new Set(FALLBACK_DATA.map(p => p.state))];
  const crops  = [...new Set(FALLBACK_DATA.map(p => p.commodity))];

  useEffect(() => {
    setTimeout(() => {
      setPrices(FALLBACK_DATA);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    let result = [...prices];
    if (search) {
      result = result.filter(p =>
        p.commodity.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selState) {
      result = result.filter(p => p.state === selState);
    }
    setFiltered(result);
  }, [prices, search, selState]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-2xl p-6 text-white"
        style={{ background: "linear-gradient(to right, #a16207, #854d0e)" }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">📊</div>
            <div>
              <h2 className="font-display text-xl font-bold">{labels.title}</h2>
              <p className="text-yellow-100 text-sm mt-0.5">{labels.subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            {labels.refresh}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
          <div className="text-3xl mb-2">📈</div>
          <p className="font-display font-bold text-2xl text-gray-800">{prices.length}</p>
          <p className="text-gray-500 text-xs mt-0.5">{labels.totalRec}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
          <div className="text-3xl mb-2">🗺️</div>
          <p className="font-display font-bold text-2xl text-gray-800">{states.length}</p>
          <p className="text-gray-500 text-xs mt-0.5">{lang === "en" ? "States" : lang === "hi" ? "राज्य" : "राज्ये"}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
          <div className="text-3xl mb-2">🌾</div>
          <p className="font-display font-bold text-2xl text-gray-800">{crops.length}</p>
          <p className="text-gray-500 text-xs mt-0.5">{lang === "en" ? "Crops" : lang === "hi" ? "फसलें" : "पिके"}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-bold text-gray-700">{lang === "en" ? "Filters" : lang === "hi" ? "फिल्टर" : "फिल्टर"}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={labels.search}
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* State Filter */}
          <div className="relative">
            <select
              value={selState}
              onChange={(e) => setSelState(e.target.value)}
              className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-700"
            >
              <option value="">{labels.allStates}</option>
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Clear button */}
        {(search || selState) && (
          <button
            onClick={() => { setSearch(""); setSelState(""); }}
            className="text-xs font-bold px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Note */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
        <p className="text-xs text-blue-700 flex items-center gap-2">
          <span>ℹ️</span>
          {labels.note}
        </p>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-gray-500">
          {lang === "en" ? `Showing ${filtered.length} prices`
          : lang === "hi" ? `${filtered.length} भाव दिखाए जा रहे हैं`
          : `${filtered.length} भाव दाखवत आहे`}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-2xl">📊</div>
          </div>
        </div>
      )}

      {/* No data */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500 text-sm mb-4">{labels.noData}</p>
          {(search || selState) && (
            <button
              onClick={() => { setSearch(""); setSelState(""); }}
              className="text-sm font-bold px-5 py-2.5 rounded-xl text-white transition-all"
              style={{ backgroundColor: "#a16207" }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Price Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item, idx) => (
            <PriceCard key={idx} item={item} labels={labels} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BuyerMarketPrices() {
  return (
    <BuyerLayout>
      <MarketContent />
    </BuyerLayout>
  );
}

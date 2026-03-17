import { useState, useEffect } from "react";
import FarmerLayout from "./FarmerLayout";
import { useLang } from "./FarmerLayout";
import {
  TrendingUp, TrendingDown, Minus,
  Search, RefreshCw, Filter, ChevronDown
} from "lucide-react";

const mt = {
  en: {
    title:      "Market Prices",
    subtitle:   "Live Indian commodity prices from government mandi data",
    search:     "Search crop name...",
    refresh:    "Refresh",
    loading:    "Fetching live market prices...",
    noData:     "No market data found. Try a different filter.",
    minPrice:   "Min Price",
    maxPrice:   "Max Price",
    modalPrice: "Modal Price",
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
  },
  hi: {
    title:      "बाज़ार भाव",
    subtitle:   "सरकारी मंडी डेटा से लाइव कमोडिटी कीमतें",
    search:     "फसल का नाम खोजें...",
    refresh:    "रीफ्रेश",
    loading:    "लाइव बाज़ार भाव लोड हो रहे हैं...",
    noData:     "कोई डेटा नहीं मिला।",
    minPrice:   "न्यूनतम भाव",
    maxPrice:   "अधिकतम भाव",
    modalPrice: "मोडल भाव",
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
  },
  mr: {
    title:      "बाजार भाव",
    subtitle:   "सरकारी मंडी डेटामधून थेट कमोडिटी किमती",
    search:     "पीकाचे नाव शोधा...",
    refresh:    "रीफ्रेश",
    loading:    "थेट बाजार भाव लोड होत आहेत...",
    noData:     "डेटा आढळला नाही.",
    minPrice:   "किमान भाव",
    maxPrice:   "कमाल भाव",
    modalPrice: "मोडल भाव",
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
  { commodity: "Sugarcane", state: "Maharashtra",    district: "Kolhapur",   market: "Kolhapur",    min_price: "280",  max_price: "320",  modal_price: "300",  arrival_date: "16/03/2025" },
  { commodity: "Groundnut", state: "Gujarat",        district: "Rajkot",     market: "Rajkot",      min_price: "4500", max_price: "5500", modal_price: "5000", arrival_date: "16/03/2025" },
  { commodity: "Turmeric",  state: "Telangana",      district: "Nizamabad",  market: "Nizamabad",   min_price: "6000", max_price: "8000", modal_price: "7000", arrival_date: "16/03/2025" },
  { commodity: "Chilli",    state: "Andhra Pradesh", district: "Guntur",     market: "Guntur",      min_price: "8000", max_price: "12000",modal_price: "10000",arrival_date: "16/03/2025" },
  { commodity: "Garlic",    state: "Madhya Pradesh", district: "Mandsaur",   market: "Mandsaur",    min_price: "3000", max_price: "5000", modal_price: "4000", arrival_date: "16/03/2025" },
  { commodity: "Brinjal",   state: "Karnataka",      district: "Bangalore",  market: "Bangalore",   min_price: "500",  max_price: "900",  modal_price: "700",  arrival_date: "16/03/2025" },
  { commodity: "Cauliflower",state:"West Bengal",    district: "Hooghly",    market: "Hooghly",     min_price: "400",  max_price: "700",  modal_price: "550",  arrival_date: "16/03/2025" },
  { commodity: "Cabbage",   state: "West Bengal",    district: "Darjeeling", market: "Darjeeling",  min_price: "300",  max_price: "600",  modal_price: "450",  arrival_date: "16/03/2025" },
  { commodity: "Mustard",   state: "Rajasthan",      district: "Alwar",      market: "Alwar",       min_price: "4800", max_price: "5500", modal_price: "5100", arrival_date: "16/03/2025" },
  { commodity: "Bajra",     state: "Haryana",        district: "Hisar",      market: "Hisar",       min_price: "1800", max_price: "2200", modal_price: "2000", arrival_date: "16/03/2025" },
];

function PriceTrend({ min, max, modal }) {
  const minN = parseInt(min), maxN = parseInt(max), modalN = parseInt(modal);
  const mid  = (minN + maxN) / 2;
  if (modalN > mid + (maxN - minN) * 0.2)
    return <span className="flex items-center gap-1 text-green-600 text-xs font-bold"><TrendingUp className="w-3 h-3" /> High</span>;
  if (modalN < mid - (maxN - minN) * 0.2)
    return <span className="flex items-center gap-1 text-red-500 text-xs font-bold"><TrendingDown className="w-3 h-3" /> Low</span>;
  return <span className="flex items-center gap-1 text-gray-500 text-xs font-bold"><Minus className="w-3 h-3" /> Avg</span>;
}

function PriceBar({ min, max, modal }) {
  const minN = parseInt(min) || 0, maxN = parseInt(max) || 1, modalN = parseInt(modal) || 0;
  const pct  = Math.min(100, Math.max(0, ((modalN - minN) / (maxN - minN)) * 100));
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
      <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
    </div>
  );
}

function SelectField({ value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 pr-10 text-gray-700"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

function MarketPricesContent() {
  const lang   = useLang();
  const labels = mt[lang];

  const [data,         setData]         = useState([]);
  const [filtered,     setFiltered]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [selState,     setSelState]     = useState("");
  const [selCrop,      setSelCrop]      = useState("");
  const [lastUpdated,  setLastUpdated]  = useState(null);

  const states = [...new Set(data.map((d) => d.state))].sort();
  const crops  = [...new Set(data.map((d) => d.commodity))].sort();

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setData(FALLBACK_DATA);
      setFiltered(FALLBACK_DATA);
      setLastUpdated(new Date().toLocaleTimeString());
      setLoading(false);
    }, 800);
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    let result = [...data];
    if (search)   result = result.filter((d) => d.commodity?.toLowerCase().includes(search.toLowerCase()));
    if (selState) result = result.filter((d) => d.state === selState);
    if (selCrop)  result = result.filter((d) => d.commodity === selCrop);
    setFiltered(result);
  }, [search, selState, selCrop, data]);

  const avgModal     = filtered.length ? Math.round(filtered.reduce((s, d) => s + (parseInt(d.modal_price) || 0), 0) / filtered.length) : 0;
  const highestPrice = filtered.reduce((max, d) => Math.max(max, parseInt(d.modal_price) || 0), 0);
  const lowestPrice  = filtered.reduce((min, d) => Math.min(min, parseInt(d.modal_price) || Infinity), Infinity);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-earth-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">📈</div>
            <div>
              <h2 className="font-display text-xl font-bold">{labels.title}</h2>
              <p className="text-yellow-100 text-sm mt-0.5">{labels.subtitle}</p>
            </div>
          </div>
          <button onClick={fetchData}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
            <RefreshCw className="w-4 h-4" />
            {labels.refresh}
          </button>
        </div>
      </div>

      {/* Info notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-2">
        <span className="text-blue-500 text-sm mt-0.5">ℹ️</span>
        <p className="text-blue-700 text-xs">
          {lang === "en" ? "Showing sample mandi prices. Live prices can be connected via data.gov.in API."
          : lang === "hi" ? "नमूना मंडी भाव दिखाए जा रहे हैं।"
          : "नमुना मंडी भाव दाखवले जात आहेत."}
        </p>
      </div>

      {/* Summary */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { emoji: "📊", label: labels.totalRec,   value: filtered.length },
            { emoji: "💰", label: labels.modalPrice, value: `₹${avgModal}` },
            { emoji: "📈", label: labels.maxPrice,   value: `₹${highestPrice}` },
            { emoji: "📉", label: labels.minPrice,   value: `₹${lowestPrice === Infinity ? 0 : lowestPrice}` },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <div className="text-3xl mb-2">{s.emoji}</div>
              <p className="font-display font-bold text-xl text-gray-800">{s.value}</p>
              <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-primary-600" />
          <h3 className="font-bold text-gray-700 text-sm">
            {lang === "en" ? "Filter & Search" : lang === "hi" ? "फ़िल्टर और खोज" : "फिल्टर आणि शोध"}
          </h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={labels.search}
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
          <SelectField value={selState} onChange={setSelState} options={states} placeholder={labels.allStates} />
          <SelectField value={selCrop}  onChange={setSelCrop}  options={crops}  placeholder={labels.allCrops} />
        </div>
        {(search || selState || selCrop) && (
          <button
            onClick={() => { setSearch(""); setSelState(""); setSelCrop(""); }}
            className="mt-3 text-xs text-red-500 hover:text-red-700 font-semibold"
          >
            ✕ {lang === "en" ? "Clear filters" : lang === "hi" ? "फ़िल्टर हटाएं" : "फिल्टर काढा"}
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-48 gap-3">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-primary-600 text-sm font-semibold animate-pulse">{labels.loading}</p>
        </div>
      )}

      {/* No data */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center h-40 text-center">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-gray-500 text-sm">{labels.noData}</p>
        </div>
      )}

      {/* Table */}
      {!loading && filtered.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-700 text-sm">
              {filtered.length} {lang === "en" ? "records" : lang === "hi" ? "रिकॉर्ड" : "नोंदी"}
            </h3>
            {lastUpdated && (
              <span className="text-xs text-gray-400">{labels.lastUpdated}: {lastUpdated}</span>
            )}
          </div>
          <div className="px-6 py-2 bg-yellow-50 border-b border-yellow-100">
            <p className="text-yellow-700 text-xs">💡 {labels.note}</p>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  {[labels.commodity || "Commodity", labels.market, labels.district, labels.state_col, labels.minPrice, labels.modalPrice, labels.maxPrice, labels.date, "Trend"].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3"><span className="font-bold text-gray-800 text-sm">{row.commodity}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{row.market}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{row.district}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{row.state}</td>
                    <td className="px-4 py-3"><span className="text-red-500 font-semibold text-sm">₹{row.min_price}</span></td>
                    <td className="px-4 py-3">
                      <span className="text-primary-700 font-bold text-sm">₹{row.modal_price}</span>
                      <PriceBar min={row.min_price} max={row.max_price} modal={row.modal_price} />
                    </td>
                    <td className="px-4 py-3"><span className="text-green-600 font-semibold text-sm">₹{row.max_price}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{row.arrival_date}</td>
                    <td className="px-4 py-3"><PriceTrend min={row.min_price} max={row.max_price} modal={row.modal_price} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {filtered.map((row, i) => (
              <div key={i} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-gray-800">{row.commodity}</p>
                    <p className="text-gray-500 text-xs">{row.market}, {row.district}</p>
                  </div>
                  <PriceTrend min={row.min_price} max={row.max_price} modal={row.modal_price} />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="bg-red-50 rounded-xl p-2 text-center">
                    <p className="text-red-500 font-bold text-sm">₹{row.min_price}</p>
                    <p className="text-gray-400 text-xs">{labels.minPrice}</p>
                  </div>
                  <div className="bg-primary-50 rounded-xl p-2 text-center">
                    <p className="text-primary-700 font-bold text-sm">₹{row.modal_price}</p>
                    <p className="text-gray-400 text-xs">{labels.modalPrice}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-2 text-center">
                    <p className="text-green-600 font-bold text-sm">₹{row.max_price}</p>
                    <p className="text-gray-400 text-xs">{labels.maxPrice}</p>
                  </div>
                </div>
                <PriceBar min={row.min_price} max={row.max_price} modal={row.modal_price} />
                <p className="text-gray-400 text-xs mt-2">{row.arrival_date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MarketPrices() {
  return (
    <FarmerLayout>
      <MarketPricesContent />
    </FarmerLayout>
  );
}
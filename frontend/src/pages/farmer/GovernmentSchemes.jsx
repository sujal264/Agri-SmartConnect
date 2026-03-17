import { useState } from "react";
import FarmerLayout from "./FarmerLayout";
import { useLang } from "./FarmerLayout";
import {
  Landmark, Loader, Search, ExternalLink,
  ChevronDown, RotateCcw, CheckCircle, Clock, Archive
} from "lucide-react";

const gt = {
  en: {
    title:       "Government Schemes",
    subtitle:    "Past, current & upcoming schemes for Indian farmers",
    searchBtn:   "Search Schemes",
    loading:     "Fetching government schemes...",
    reset:       "Reset",
    result:      "Schemes & Benefits",
    placeholder: "Select filters and search for government schemes.",
    state:       "Your State",
    category:    "Scheme Category",
    crop:        "Crop Type (optional)",
    current:     "Current",
    past:        "Past",
    upcoming:    "Upcoming",
    categories:  ["All", "Subsidy", "Loan & Credit", "Insurance", "Technology", "Marketing", "Water & Irrigation", "Organic Farming"],
    states:      ["All States","Maharashtra","Punjab","Uttar Pradesh","Madhya Pradesh","Rajasthan","Gujarat","Karnataka","Andhra Pradesh","Tamil Nadu","Bihar","West Bengal","Haryana","Other"],
    quickLinks:  "Quick Official Links",
    applyOnline: "Apply Online",
  },
  hi: {
    title:       "सरकारी योजनाएं",
    subtitle:    "भारतीय किसानों के लिए पुरानी, वर्तमान और आगामी योजनाएं",
    searchBtn:   "योजनाएं खोजें",
    loading:     "सरकारी योजनाएं लोड हो रही हैं...",
    reset:       "रीसेट",
    result:      "योजनाएं और लाभ",
    placeholder: "फ़िल्टर चुनें और सरकारी योजनाएं खोजें।",
    state:       "आपका राज्य",
    category:    "योजना श्रेणी",
    crop:        "फसल प्रकार (वैकल्पिक)",
    current:     "वर्तमान",
    past:        "पुरानी",
    upcoming:    "आगामी",
    categories:  ["सभी", "सब्सिडी", "ऋण और क्रेडिट", "बीमा", "तकनीक", "विपणन", "जल और सिंचाई", "जैविक खेती"],
    states:      ["सभी राज्य","महाराष्ट्र","पंजाब","उत्तर प्रदेश","मध्य प्रदेश","राजस्थान","गुजरात","कर्नाटक","आंध्र प्रदेश","तमिलनाडु","बिहार","पश्चिम बंगाल","हरियाणा","अन्य"],
    quickLinks:  "आधिकारिक लिंक",
    applyOnline: "ऑनलाइन आवेदन",
  },
  mr: {
    title:       "सरकारी योजना",
    subtitle:    "भारतीय शेतकऱ्यांसाठी जुन्या, सध्याच्या आणि येणाऱ्या योजना",
    searchBtn:   "योजना शोधा",
    loading:     "सरकारी योजना लोड होत आहेत...",
    reset:       "रीसेट",
    result:      "योजना आणि फायदे",
    placeholder: "फिल्टर निवडा आणि सरकारी योजना शोधा.",
    state:       "तुमचे राज्य",
    category:    "योजनेची श्रेणी",
    crop:        "पीक प्रकार (पर्यायी)",
    current:     "सध्याची",
    past:        "जुनी",
    upcoming:    "येणारी",
    categories:  ["सर्व", "अनुदान", "कर्ज आणि क्रेडिट", "विमा", "तंत्रज्ञान", "विपणन", "जल आणि सिंचन", "सेंद्रिय शेती"],
    states:      ["सर्व राज्ये","महाराष्ट्र","पंजाब","उत्तर प्रदेश","मध्य प्रदेश","राजस्थान","गुजरात","कर्नाटक","आंध्र प्रदेश","तामिळनाडू","बिहार","पश्चिम बंगाल","हरियाणा","इतर"],
    quickLinks:  "अधिकृत दुवे",
    applyOnline: "ऑनलाइन अर्ज",
  },
};

const QUICK_LINKS = [
  { name: "PM-KISAN Portal",        url: "https://pmkisan.gov.in",        emoji: "🌾" },
  { name: "Kisan Credit Card",      url: "https://www.nabard.org",        emoji: "💳" },
  { name: "PM Fasal Bima Yojana",   url: "https://pmfby.gov.in",          emoji: "🛡️" },
  { name: "Soil Health Card",       url: "https://soilhealth.dac.gov.in", emoji: "🧪" },
  { name: "eNAM Portal",            url: "https://www.enam.gov.in",       emoji: "📊" },
  { name: "Kisan Suvidha App",      url: "https://dackkms.gov.in",        emoji: "📱" },
  { name: "AgriStack Portal",       url: "https://agristack.gov.in",      emoji: "🏛️" },
  { name: "Rashtriya Krishi Vikas", url: "https://rkvy.nic.in",           emoji: "📈" },
];

const KEY_SCHEMES = [
  {
    name:    "PM-KISAN",
    emoji:   "💰",
    benefit: "₹6,000/year",
    descEn:  "Direct income support to farmer families",
    descHi:  "किसान परिवारों को प्रत्यक्ष आय सहायता",
    descMr:  "शेतकरी कुटुंबांना थेट उत्पन्न सहाय्य",
    url:     "https://pmkisan.gov.in",
  },
  {
    name:    "PM Fasal Bima",
    emoji:   "🛡️",
    benefit: "Crop Insurance",
    descEn:  "Financial support for crop loss due to natural calamities",
    descHi:  "प्राकृतिक आपदा से फसल नुकसान पर बीमा",
    descMr:  "नैसर्गिक आपत्तीमुळे पीक नुकसानीसाठी विमा",
    url:     "https://pmfby.gov.in",
  },
  {
    name:    "Kisan Credit Card",
    emoji:   "💳",
    benefit: "Up to ₹3 Lakh",
    descEn:  "Short-term credit for farming needs at low interest",
    descHi:  "कम ब्याज पर कृषि ऋण",
    descMr:  "कमी व्याजावर शेती कर्ज",
    url:     "https://www.nabard.org",
  },
  {
    name:    "Soil Health Card",
    emoji:   "🧪",
    benefit: "Free Testing",
    descEn:  "Free soil testing and fertilizer recommendation",
    descHi:  "मुफ्त मिट्टी जांच और उर्वरक सिफारिश",
    descMr:  "मोफत माती परीक्षण आणि खत शिफारस",
    url:     "https://soilhealth.dac.gov.in",
  },
];

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 mb-1.5">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 pr-10 text-gray-700"
        >
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === "current") {
    return (
      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
        <CheckCircle className="w-3 h-3" />
        Active
      </span>
    );
  }
  if (status === "upcoming") {
    return (
      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
        <Clock className="w-3 h-3" />
        Upcoming
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full">
      <Archive className="w-3 h-3" />
      Past
    </span>
  );
}

function renderLine(line, i) {
  const trimmed = line.trim();

  if (trimmed.startsWith("## ")) {
    return (
      <h2 key={i} className="font-display text-lg font-bold text-purple-800 mt-5 mb-2">
        {"🏛️ " + trimmed.replace("## ", "")}
      </h2>
    );
  }

  if (trimmed.startsWith("### ")) {
    return (
      <h3 key={i} className="font-bold text-gray-800 text-sm mt-4 mb-1 bg-purple-50 px-3 py-1.5 rounded-lg">
        {trimmed.replace("### ", "")}
      </h3>
    );
  }

  if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
    return (
      <div key={i} className="flex items-start gap-2 my-1 pl-2">
        <span className="text-purple-400 mt-0.5 flex-shrink-0">✓</span>
        <p className="text-gray-600 text-sm">{trimmed.replace(/^[-•] /, "")}</p>
      </div>
    );
  }

  if (/^\d+\./.test(trimmed)) {
    const num = trimmed.match(/^\d+/)[0];
    return (
      <div key={i} className="flex items-start gap-2 my-1 pl-2">
        <span className="text-purple-600 font-bold text-sm flex-shrink-0 w-5">{num}.</span>
        <p className="text-gray-600 text-sm">{trimmed.replace(/^\d+\.\s*/, "")}</p>
      </div>
    );
  }

  if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
    return (
      <p key={i} className="font-bold text-gray-800 text-sm mt-2 pl-2">
        {trimmed.replace(/\*\*/g, "")}
      </p>
    );
  }

  if (trimmed.startsWith("http") || trimmed.startsWith("https")) {
    const linkEl = (
      <a
        key={i}
        href={trimmed}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm pl-2 underline break-all"
      >
        <ExternalLink className="w-3 h-3 flex-shrink-0" />
        {trimmed}
      </a>
    );
    return linkEl;
  }

  if (trimmed === "" || trimmed === "---") {
    return null;
  }

  return (
    <p key={i} className="text-gray-600 text-sm my-1 leading-relaxed pl-1">
      {trimmed.replace(/\*\*/g, "")}
    </p>
  );
}

function ResultCard({ content }) {
  const lines = content.split("\n").filter((l) => l.trim());
  return (
    <div className="space-y-1">
      {lines.map((line, i) => renderLine(line, i))}
    </div>
  );
}

function SchemesContent() {
  const lang   = useLang();
  const labels = gt[lang];
  const user   = JSON.parse(localStorage.getItem("user") || "{}");

  const [state,    setState]    = useState("All States");
  const [category, setCategory] = useState("All");
  const [status,   setStatus]   = useState("All");
  const [crop,     setCrop]     = useState("");
  const [result,   setResult]   = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [searched, setSearched] = useState(false);

  const handleReset = () => {
    setState("All States");
    setCategory("All");
    setStatus("All");
    setCrop("");
    setResult("");
    setError("");
    setSearched(false);
  };

  const handleSearch = async () => {
    setLoading(true);
    setResult("");
    setError("");
    setSearched(true);

    const langName = lang === "en" ? "English" : lang === "hi" ? "Hindi" : "Marathi";

    const prompt = `You are an expert on Indian government agricultural schemes and policies.

Farmer Details:
- Name: ${user.name || "Farmer"}
- State: ${state !== "All States" ? state : "All India"}
- Category: ${category !== "All" ? category : "All categories"}
- Status filter: ${status !== "All" ? status : "All (past, current, upcoming)"}
- Crop Type: ${crop || "General farming"}

Please provide comprehensive information in ${langName}.

## Currently Active Schemes (2024-2025)

For each scheme:
### [Scheme Name] — [Ministry]
- What it is and who benefits
- Key benefit amount (₹)
- Eligibility
- How to apply
- Documents required

## State-Specific Schemes for ${state !== "All States" ? state : "Major States"}

## Upcoming Schemes (2025-2026)

## Important Past Schemes

## Step-by-Step Application Guide

## Helpline Numbers and Portal Links

Include: PM-KISAN, PM Fasal Bima Yojana, Kisan Credit Card, Soil Health Card.
Be specific with amounts, dates, and portal URLs.`;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/ai/government-schemes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.success && data.text) {
        setResult(data.text);
      } else {
        setError(data.message || "No response. Please try again.");
      }
    } catch {
      setError("Failed to connect to server. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
            🏛️
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">{labels.title}</h2>
            <p className="text-purple-100 text-sm mt-0.5">{labels.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Status Pills */}
      <div className="flex gap-3 flex-wrap">
        {[
          { key: "All",      label: lang === "en" ? "All Schemes" : lang === "hi" ? "सभी योजनाएं" : "सर्व योजना", icon: "📋" },
          { key: "current",  label: labels.current,  icon: "✅" },
          { key: "upcoming", label: labels.upcoming, icon: "🔜" },
          { key: "past",     label: labels.past,     icon: "📁" },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setStatus(s.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
              status === s.key
                ? "border-purple-500 bg-purple-50 text-purple-700"
                : "border-transparent bg-gray-100 text-gray-700"
            }`}
          >
            <span>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* Left: Filters */}
        <div className="md:col-span-1 space-y-4">

          {/* Filter Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-700 flex items-center gap-2 text-sm">
                <Landmark className="w-4 h-4 text-purple-600" />
                {lang === "en" ? "Filter Schemes" : lang === "hi" ? "फ़िल्टर करें" : "फिल्टर करा"}
              </h3>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                {labels.reset}
              </button>
            </div>

            <SelectField label={labels.state}    value={state}    onChange={setState}    options={labels.states} />
            <SelectField label={labels.category} value={category} onChange={setCategory} options={labels.categories} />

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">{labels.crop}</label>
              <input
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                placeholder={lang === "en" ? "e.g. Wheat, Cotton" : lang === "hi" ? "जैसे गेहूं, कपास" : "उदा. गहू, कापूस"}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              {loading
                ? <><Loader className="w-4 h-4 animate-spin" />{labels.loading}</>
                : <><Search className="w-4 h-4" />{labels.searchBtn}</>
              }
            </button>
          </div>

          {/* Quick Links Card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-700 text-sm mb-4 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-purple-500" />
              {labels.quickLinks}
            </h3>
            <div className="space-y-1">
              {QUICK_LINKS.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-purple-50 transition-colors group"
                >
                  <span className="text-lg">{link.emoji}</span>
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-purple-700 flex-1">
                    {link.name}
                  </span>
                  <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-purple-500" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span className="text-lg">📋</span>
            {labels.result}
          </h3>

          {/* Placeholder */}
          {!result && !loading && !error && !searched && (
            <div className="flex flex-col items-center justify-center h-80 text-center">
              <div className="text-7xl mb-4">🏛️</div>
              <h3 className="font-display font-bold text-gray-700 text-lg mb-2">
                {lang === "en" ? "Find Your Benefits" : lang === "hi" ? "अपने लाभ खोजें" : "तुमचे फायदे शोधा"}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">{labels.placeholder}</p>
              <button
                onClick={handleSearch}
                className="mt-6 bg-purple-600 text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-purple-700 transition-all flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                {lang === "en" ? "Search All Schemes" : lang === "hi" ? "सभी योजनाएं खोजें" : "सर्व योजना शोधा"}
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center h-80 gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-2xl">🏛️</div>
              </div>
              <p className="text-purple-600 text-sm font-semibold animate-pulse">{labels.loading}</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm font-semibold mb-1">❌ Error</p>
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div className="overflow-y-auto max-h-[600px] pr-1">
              <ResultCard content={result} />
            </div>
          )}
        </div>
      </div>

      {/* Key Schemes Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {KEY_SCHEMES.map((scheme, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{scheme.emoji}</span>
              <StatusBadge status="current" />
            </div>
            <h4 className="font-bold text-gray-800 text-sm mb-1">{scheme.name}</h4>
            <p className="text-purple-700 font-bold text-lg mb-2">{scheme.benefit}</p>
            <p className="text-gray-500 text-xs leading-relaxed mb-4">
              {lang === "en" ? scheme.descEn : lang === "hi" ? scheme.descHi : scheme.descMr}
            </p>
            <a
              href={scheme.url}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold py-2 rounded-xl text-xs transition-all"
            >
              <ExternalLink className="w-3 h-3" />
              {labels.applyOnline}
            </a>
          </div>
        ))}
      </div>

    </div>
  );
}

export default function GovernmentSchemes() {
  return (
    <FarmerLayout>
      <SchemesContent />
    </FarmerLayout>
  );
}

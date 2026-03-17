import { useState } from "react";
import FarmerLayout from "./FarmerLayout";
import { useLang } from "./FarmerLayout";
import { Leaf, Loader, RotateCcw, ChevronDown } from "lucide-react";

// ── Translations ──────────────────────────────────────────────
const ft = {
  en: {
    title:        "Fertilizer Advice",
    subtitle:     "Get AI-powered fertilizer recommendations for your crops",
    crop:         "Crop Name *",
    soil:         "Soil Type *",
    stage:        "Growth Stage *",
    problem:      "Current Problem (optional)",
    area:         "Farm Area (acres)",
    budget:       "Budget Level",
    getBtn:       "Get Fertilizer Advice",
    loading:      "Analyzing fertilizer needs...",
    reset:        "Reset",
    result:       "Fertilizer Recommendation",
    placeholder:  "Fill the form to get personalized fertilizer advice.",
    cropPlaceholder: "e.g. Tomato, Wheat, Rice",
    problemPlaceholder: "e.g. Yellowing leaves, slow growth, pest attack",
    soilTypes:    ["Black Soil", "Red Soil", "Alluvial Soil", "Sandy Soil", "Loamy Soil", "Clay Soil", "Laterite Soil"],
    stages:       ["Seed/Germination", "Seedling", "Vegetative Growth", "Flowering", "Fruiting/Grain Filling", "Harvesting"],
    budgets:      ["Low (< ₹5,000)", "Medium (₹5,000–₹15,000)", "High (> ₹15,000)"],
  },
  hi: {
    title:        "उर्वरक सलाह",
    subtitle:     "अपनी फसल के लिए AI उर्वरक सिफारिश पाएं",
    crop:         "फसल का नाम *",
    soil:         "मिट्टी का प्रकार *",
    stage:        "विकास अवस्था *",
    problem:      "वर्तमान समस्या (वैकल्पिक)",
    area:         "खेत क्षेत्र (एकड़)",
    budget:       "बजट स्तर",
    getBtn:       "उर्वरक सलाह पाएं",
    loading:      "उर्वरक आवश्यकता का विश्लेषण हो रहा है...",
    reset:        "रीसेट",
    result:       "उर्वरक सिफारिश",
    placeholder:  "फॉर्म भरें और उर्वरक सलाह पाएं।",
    cropPlaceholder: "जैसे टमाटर, गेहूं, चावल",
    problemPlaceholder: "जैसे पत्तियां पीली होना, धीमी वृद्धि",
    soilTypes:    ["काली मिट्टी", "लाल मिट्टी", "जलोढ़ मिट्टी", "रेतीली मिट्टी", "दोमट मिट्टी", "चिकनी मिट्टी", "लेटराइट मिट्टी"],
    stages:       ["बीज/अंकुरण", "पौध अवस्था", "वानस्पतिक विकास", "फूल आना", "फल/दाना भरना", "कटाई"],
    budgets:      ["कम (< ₹5,000)", "मध्यम (₹5,000–₹15,000)", "अधिक (> ₹15,000)"],
  },
  mr: {
    title:        "खत सल्ला",
    subtitle:     "तुमच्या पिकासाठी AI खत शिफारस मिळवा",
    crop:         "पिकाचे नाव *",
    soil:         "मातीचा प्रकार *",
    stage:        "वाढीची अवस्था *",
    problem:      "सध्याची समस्या (पर्यायी)",
    area:         "शेत क्षेत्र (एकर)",
    budget:       "बजेट पातळी",
    getBtn:       "खत सल्ला मिळवा",
    loading:      "खत गरजेचे विश्लेषण होत आहे...",
    reset:        "रीसेट",
    result:       "खत शिफारस",
    placeholder:  "फॉर्म भरा आणि खत सल्ला मिळवा.",
    cropPlaceholder: "उदा. टोमॅटो, गहू, भात",
    problemPlaceholder: "उदा. पाने पिवळी होणे, मंद वाढ",
    soilTypes:    ["काळी माती", "लाल माती", "गाळाची माती", "वालुकामय माती", "चिकणमाती", "चिकट माती", "लॅटेराइट माती"],
    stages:       ["बीज/उगवण", "रोपे अवस्था", "वनस्पती वाढ", "फुलोरा", "फळ/दाणे भरणे", "कापणी"],
    budgets:      ["कमी (< ₹5,000)", "मध्यम (₹5,000–₹15,000)", "जास्त (> ₹15,000)"],
  },
};

// ── Select Field ──────────────────────────────────────────────
function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 mb-1.5">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 pr-10 text-gray-700"
        >
          <option value="">-- Select --</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

// ── Result Renderer ───────────────────────────────────────────
function ResultCard({ content }) {
  const lines = content.split("\n").filter((l) => l.trim());
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith("## "))
          return (
            <h2 key={i} className="font-display text-lg font-bold text-lime-800 mt-4 mb-2">
              🧪 {line.replace("## ", "")}
            </h2>
          );
        if (line.startsWith("### "))
          return (
            <h3 key={i} className="font-bold text-gray-700 text-sm mt-3 mb-1">
              {line.replace("### ", "")}
            </h3>
          );
        if (line.startsWith("- ") || line.startsWith("• "))
          return (
            <div key={i} className="flex items-start gap-2 my-1">
              <span className="text-lime-500 mt-0.5 flex-shrink-0">✓</span>
              <p className="text-gray-600 text-sm">{line.replace(/^[-•] /, "")}</p>
            </div>
          );
        if (line.match(/^\d+\./))
          return (
            <div key={i} className="flex items-start gap-2 my-1">
              <span className="text-lime-600 font-bold text-sm flex-shrink-0">{line.match(/^\d+/)[0]}.</span>
              <p className="text-gray-600 text-sm">{line.replace(/^\d+\.\s*/, "")}</p>
            </div>
          );
        if (line.startsWith("**") && line.endsWith("**"))
          return <p key={i} className="font-bold text-gray-800 text-sm mt-2">{line.replace(/\*\*/g, "")}</p>;
        if (line.startsWith("---")) return null;
        return <p key={i} className="text-gray-600 text-sm my-1 leading-relaxed">{line.replace(/\*\*/g, "")}</p>;
      })}
    </div>
  );
}

// ── Main Content ──────────────────────────────────────────────
function FertilizerContent() {
  const lang   = useLang();
  const labels = ft[lang];
  const user   = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    crop: "", soil: "", stage: "", problem: "", area: "", budget: "",
  });
  const [result, setResult]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const isValid = form.crop && form.soil && form.stage;

  const handleReset = () => {
    setForm({ crop: "", soil: "", stage: "", problem: "", area: "", budget: "" });
    setResult("");
    setError("");
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    setResult("");
    setError("");

    const prompt = `You are an expert Indian agricultural soil and fertilizer specialist.

Farmer Details:
- Farmer: ${user.name || "Farmer"}
- Crop: ${form.crop}
- Soil Type: ${form.soil}
- Growth Stage: ${form.stage}
- Current Problem: ${form.problem || "None mentioned"}
- Farm Area: ${form.area ? form.area + " acres" : "Not specified"}
- Budget: ${form.budget || "Not specified"}

Please provide detailed fertilizer advice in ${lang === "en" ? "English" : lang === "hi" ? "Hindi" : "Marathi"} covering:

## Nutrient Deficiency Analysis
- Identify likely deficiencies based on soil type and growth stage
- Signs to look for in the crop

## Recommended Fertilizers

### Primary Fertilizers (NPK)
- Specific fertilizer names available in India
- Exact dosage per acre
- Application method (broadcasting, drip, foliar)
- Application timing

### Organic Fertilizer Options
- Cost-effective organic alternatives
- How to prepare farmyard manure or compost
- Benefits over chemical fertilizers

### Micronutrient Supplements
- Which micronutrients are needed for this crop/soil combination
- Product names available in India

## Application Schedule
- Week-by-week or stage-by-stage application plan

## Precautions
- What NOT to mix together
- Safety during application
- Weather conditions to avoid

## Cost Estimate
- Approximate cost per acre for the recommended fertilizers

Keep advice practical and specific to Indian farming. Use simple language.`;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/ai/fertilizer-advice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (data.success && data.text) setResult(data.text);
      else setError(data.message || "No response. Please try again.");
    } catch {
      setError("Failed to connect to server. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-lime-700 to-primary-800 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">🧪</div>
          <div>
            <h2 className="font-display text-xl font-bold">{labels.title}</h2>
            <p className="text-lime-100 text-sm mt-0.5">{labels.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ── Left: Form ── */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-lime-600" />
              {lang === "en" ? "Crop Details" : lang === "hi" ? "फसल विवरण" : "पीक तपशील"}
            </h3>
            <button onClick={handleReset}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors">
              <RotateCcw className="w-3 h-3" />
              {labels.reset}
            </button>
          </div>

          {/* Crop name */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">{labels.crop}</label>
            <input
              value={form.crop}
              onChange={(e) => setForm({ ...form, crop: e.target.value })}
              placeholder={labels.cropPlaceholder}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
          </div>

          <SelectField label={labels.soil}   value={form.soil}   onChange={(v) => setForm({ ...form, soil: v })}   options={labels.soilTypes} />
          <SelectField label={labels.stage}  value={form.stage}  onChange={(v) => setForm({ ...form, stage: v })}  options={labels.stages} />
          <SelectField label={labels.budget} value={form.budget} onChange={(v) => setForm({ ...form, budget: v })} options={labels.budgets} />

          {/* Area */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">{labels.area}</label>
            <input
              type="number"
              min="0"
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
              placeholder="e.g. 2.5"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
          </div>

          {/* Problem */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">{labels.problem}</label>
            <textarea
              value={form.problem}
              onChange={(e) => setForm({ ...form, problem: e.target.value })}
              placeholder={labels.problemPlaceholder}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="w-full bg-lime-600 hover:bg-lime-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <><Loader className="w-4 h-4 animate-spin" />{labels.loading}</>
            ) : (
              <><Leaf className="w-4 h-4" />{labels.getBtn}</>
            )}
          </button>
        </div>

        {/* ── Right: Result ── */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span className="text-lg">🧪</span>
            {labels.result}
          </h3>

          {/* Placeholder */}
          {!result && !loading && !error && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="text-6xl mb-4">🌿</div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{labels.placeholder}</p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-lime-200 border-t-lime-600 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-2xl">🧪</div>
              </div>
              <p className="text-lime-600 text-sm font-semibold animate-pulse">{labels.loading}</p>
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
            <div className="overflow-y-auto max-h-[520px] pr-1">
              <ResultCard content={result} />
            </div>
          )}
        </div>
      </div>

      {/* ── Quick Reference Cards ── */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            emoji: "🌱",
            title: lang === "en" ? "NPK Basics" : lang === "hi" ? "NPK मूल बातें" : "NPK मूलतत्त्वे",
            items: lang === "en"
              ? ["N (Nitrogen) → Leaf & stem growth", "P (Phosphorus) → Root & flower", "K (Potassium) → Fruit quality"]
              : lang === "hi"
              ? ["N (नाइट्रोजन) → पत्ती और तना", "P (फास्फोरस) → जड़ और फूल", "K (पोटेशियम) → फल गुणवत्ता"]
              : ["N (नायट्रोजन) → पान आणि खोड", "P (फॉस्फरस) → मूळ आणि फूल", "K (पोटॅशियम) → फळाची गुणवत्ता"],
            color: "bg-green-50 border-green-200",
          },
          {
            emoji: "⚠️",
            title: lang === "en" ? "Deficiency Signs" : lang === "hi" ? "कमी के लक्षण" : "कमतरतेची चिन्हे",
            items: lang === "en"
              ? ["Yellow leaves → Nitrogen deficiency", "Purple leaves → Phosphorus deficiency", "Brown leaf edges → Potassium deficiency"]
              : lang === "hi"
              ? ["पीली पत्तियां → नाइट्रोजन कमी", "बैंगनी पत्तियां → फास्फोरस कमी", "भूरे किनारे → पोटेशियम कमी"]
              : ["पिवळी पाने → नायट्रोजन कमतरता", "जांभळी पाने → फॉस्फरस कमतरता", "तपकिरी कडा → पोटॅशियम कमतरता"],
            color: "bg-yellow-50 border-yellow-200",
          },
          {
            emoji: "🌿",
            title: lang === "en" ? "Organic Options" : lang === "hi" ? "जैविक विकल्प" : "सेंद्रिय पर्याय",
            items: lang === "en"
              ? ["Vermicompost → All-round nutrients", "Neem cake → Pest resistance too", "Bone meal → Phosphorus rich"]
              : lang === "hi"
              ? ["वर्मीकम्पोस्ट → संपूर्ण पोषण", "नीम केक → कीट प्रतिरोध भी", "हड्डी का चूरा → फास्फोरस युक्त"]
              : ["गांडूळ खत → सर्वांगीण पोषण", "कडुलिंब केक → कीड प्रतिरोध", "हाडांचे पीठ → फॉस्फरस समृद्ध"],
            color: "bg-lime-50 border-lime-200",
          },
        ].map((card, i) => (
          <div key={i} className={`p-5 rounded-2xl border ${card.color}`}>
            <div className="text-3xl mb-3">{card.emoji}</div>
            <p className="font-bold text-gray-800 text-sm mb-3">{card.title}</p>
            <div className="space-y-1.5">
              {card.items.map((item, j) => (
                <div key={j} className="flex items-start gap-2">
                  <span className="text-gray-400 text-xs mt-0.5">→</span>
                  <p className="text-gray-600 text-xs">{item}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FertilizerAdvice() {
  return (
    <FarmerLayout>
      <FertilizerContent />
    </FarmerLayout>
  );
}
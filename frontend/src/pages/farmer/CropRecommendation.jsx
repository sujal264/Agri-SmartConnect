import { useState } from "react";
import FarmerLayout from "./FarmerLayout";
import { useLang } from "./FarmerLayout";
import { Sprout, Loader, ChevronDown, RotateCcw } from "lucide-react";

const cr = {
  en: {
    title:       "Crop Recommendation",
    subtitle:    "Fill in your farm details and get AI-powered crop suggestions",
    soil:        "Soil Type",
    season:      "Season",
    water:       "Water Availability",
    state:       "State / Region",
    area:        "Farm Area (in acres)",
    budget:      "Budget Level",
    getBtn:      "Get Crop Recommendation",
    loading:     "Analyzing your farm conditions...",
    reset:       "Reset",
    result:      "Recommended Crops for Your Farm",
    placeholder: "Fill the form and click 'Get Crop Recommendation' to see AI-powered suggestions here.",
    soilTypes:   ["Black Soil", "Red Soil", "Alluvial Soil", "Sandy Soil", "Loamy Soil", "Clay Soil", "Laterite Soil"],
    seasons:     ["Kharif (Monsoon)", "Rabi (Winter)", "Zaid (Summer)", "Year Round"],
    waterLevels: ["Rain-fed only", "Limited Irrigation", "Full Irrigation", "Drip Irrigation"],
    budgets:     ["Low (< ₹10,000/acre)", "Medium (₹10,000–₹30,000/acre)", "High (> ₹30,000/acre)"],
    states:      ["Maharashtra","Punjab","Uttar Pradesh","Madhya Pradesh","Rajasthan","Gujarat","Karnataka","Andhra Pradesh","Tamil Nadu","Bihar","West Bengal","Haryana","Other"],
  },
  hi: {
    title:       "फसल सिफारिश",
    subtitle:    "अपनी खेत की जानकारी भरें और AI से फसल सुझाव पाएं",
    soil:        "मिट्टी का प्रकार",
    season:      "मौसम",
    water:       "पानी की उपलब्धता",
    state:       "राज्य / क्षेत्र",
    area:        "खेत का क्षेत्रफल (एकड़ में)",
    budget:      "बजट स्तर",
    getBtn:      "फसल सिफारिश पाएं",
    loading:     "आपकी खेत की स्थिति का विश्लेषण हो रहा है...",
    reset:       "रीसेट",
    result:      "आपके खेत के लिए अनुशंसित फसलें",
    placeholder: "फॉर्म भरें और 'फसल सिफारिश पाएं' पर क्लिक करें।",
    soilTypes:   ["काली मिट्टी", "लाल मिट्टी", "जलोढ़ मिट्टी", "रेतीली मिट्टी", "दोमट मिट्टी", "चिकनी मिट्टी", "लेटराइट मिट्टी"],
    seasons:     ["खरीफ (मानसून)", "रबी (सर्दी)", "जायद (गर्मी)", "साल भर"],
    waterLevels: ["केवल वर्षा", "सीमित सिंचाई", "पूर्ण सिंचाई", "ड्रिप सिंचाई"],
    budgets:     ["कम (< ₹10,000/एकड़)", "मध्यम (₹10,000–₹30,000/एकड़)", "अधिक (> ₹30,000/एकड़)"],
    states:      ["महाराष्ट्र","पंजाब","उत्तर प्रदेश","मध्य प्रदेश","राजस्थान","गुजरात","कर्नाटक","आंध्र प्रदेश","तमिलनाडु","बिहार","पश्चिम बंगाल","हरियाणा","अन्य"],
  },
  mr: {
    title:       "पीक शिफारस",
    subtitle:    "तुमच्या शेताची माहिती भरा आणि AI पीक सुचवणी मिळवा",
    soil:        "मातीचा प्रकार",
    season:      "हंगाम",
    water:       "पाण्याची उपलब्धता",
    state:       "राज्य / प्रदेश",
    area:        "शेताचे क्षेत्र (एकर)",
    budget:      "बजेट पातळी",
    getBtn:      "पीक शिफारस मिळवा",
    loading:     "तुमच्या शेताच्या परिस्थितीचे विश्लेषण होत आहे...",
    reset:       "रीसेट",
    result:      "तुमच्या शेतासाठी शिफारस केलेली पिके",
    placeholder: "फॉर्म भरा आणि 'पीक शिफारस मिळवा' वर क्लिक करा.",
    soilTypes:   ["काळी माती", "लाल माती", "गाळाची माती", "वालुकामय माती", "चिकणमाती", "चिकट माती", "लॅटेराइट माती"],
    seasons:     ["खरीप (पावसाळा)", "रब्बी (हिवाळा)", "उन्हाळी", "वर्षभर"],
    waterLevels: ["केवळ पाऊस", "मर्यादित सिंचन", "पूर्ण सिंचन", "ठिबक सिंचन"],
    budgets:     ["कमी (< ₹10,000/एकर)", "मध्यम (₹10,000–₹30,000/एकर)", "जास्त (> ₹30,000/एकर)"],
    states:      ["महाराष्ट्र","पंजाब","उत्तर प्रदेश","मध्य प्रदेश","राजस्थान","गुजरात","कर्नाटक","आंध्र प्रदेश","तामिळनाडू","बिहार","पश्चिम बंगाल","हरियाणा","इतर"],
  },
};

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
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

function ResultCard({ content }) {
  const lines = content.split("\n").filter((l) => l.trim());
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <h2 key={i} className="font-display text-lg font-bold text-primary-800 mt-4 mb-2">
              🌾 {line.replace("## ", "")}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={i} className="font-bold text-gray-700 text-sm mt-3 mb-1">
              {line.replace("### ", "")}
            </h3>
          );
        }
        if (line.startsWith("- ") || line.startsWith("• ")) {
          return (
            <div key={i} className="flex items-start gap-2 my-1">
              <span className="text-primary-500 mt-0.5 flex-shrink-0">✓</span>
              <p className="text-gray-600 text-sm">{line.replace(/^[-•] /, "")}</p>
            </div>
          );
        }
        if (line.match(/^\d+\./)) {
          return (
            <div key={i} className="flex items-start gap-2 my-1">
              <span className="text-primary-600 font-bold text-sm flex-shrink-0">
                {line.match(/^\d+/)[0]}.
              </span>
              <p className="text-gray-600 text-sm">{line.replace(/^\d+\.\s*/, "")}</p>
            </div>
          );
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p key={i} className="font-bold text-gray-800 text-sm mt-2">
              {line.replace(/\*\*/g, "")}
            </p>
          );
        }
        if (line.startsWith("---")) return null;
        return (
          <p key={i} className="text-gray-600 text-sm my-1 leading-relaxed">
            {line.replace(/\*\*/g, "")}
          </p>
        );
      })}
    </div>
  );
}

function CropRecommendationContent() {
  const lang = useLang();
  const labels = cr[lang];
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    soil: "", season: "", water: "", state: "", area: "", budget: "",
  });
  const [result, setResult]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const isFormValid = form.soil && form.season && form.water && form.state && form.budget;

  const handleReset = () => {
    setForm({ soil: "", season: "", water: "", state: "", area: "", budget: "" });
    setResult("");
    setError("");
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setLoading(true);
    setResult("");
    setError("");

    const prompt = `You are an expert Indian agricultural advisor. A farmer needs crop recommendations.

Farm Details:
- Farmer Name: ${user.name || "Farmer"}
- State/Region: ${form.state}
- Soil Type: ${form.soil}
- Season: ${form.season}
- Water Availability: ${form.water}
- Farm Area: ${form.area ? form.area + " acres" : "Not specified"}
- Budget: ${form.budget}

Please provide a detailed crop recommendation in ${lang === "en" ? "English" : lang === "hi" ? "Hindi" : "Marathi"} with:

## Top 3 Recommended Crops

For each crop provide:
### [Crop Name with emoji]
- Why it suits this farmer's conditions
- Expected yield per acre
- Approximate profit potential
- Best sowing time
- Key care tips (2-3 points)
- Water requirement
- Common diseases to watch for

## Quick Tips for ${form.season} Season

## Government Schemes Available for These Crops

Keep it practical, specific to Indian farming conditions, and easy to understand.`;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8000/api/ai/crop-recommendation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.success && data.text) {
        setResult(data.text);
      } else {
        setError(data.message || "No response received. Please try again.");
      }
    } catch (err) {
      setError("Failed to connect to server. Make sure backend is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-green-700 to-primary-800 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
            🌱
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">{labels.title}</h2>
            <p className="text-green-100 text-sm mt-0.5">{labels.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ── Left: Form ── */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-primary-600" />
              {lang === "en" ? "Farm Details" : lang === "hi" ? "खेत की जानकारी" : "शेताची माहिती"}
            </h3>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              {labels.reset}
            </button>
          </div>

          <SelectField
            label={labels.state}
            value={form.state}
            onChange={(v) => setForm({ ...form, state: v })}
            options={labels.states}
          />
          <SelectField
            label={labels.soil}
            value={form.soil}
            onChange={(v) => setForm({ ...form, soil: v })}
            options={labels.soilTypes}
          />
          <SelectField
            label={labels.season}
            value={form.season}
            onChange={(v) => setForm({ ...form, season: v })}
            options={labels.seasons}
          />
          <SelectField
            label={labels.water}
            value={form.water}
            onChange={(v) => setForm({ ...form, water: v })}
            options={labels.waterLevels}
          />
          <SelectField
            label={labels.budget}
            value={form.budget}
            onChange={(v) => setForm({ ...form, budget: v })}
            options={labels.budgets}
          />

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">
              {labels.area}
            </label>
            <input
              type="number"
              min="0"
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
              placeholder="e.g. 2.5"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isFormValid || loading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm mt-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                {labels.loading}
              </>
            ) : (
              <>
                <Sprout className="w-4 h-4" />
                {labels.getBtn}
              </>
            )}
          </button>
        </div>

        {/* ── Right: Result ── */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span className="text-lg">🌾</span>
            {labels.result}
          </h3>

          {/* Placeholder */}
          {!result && !loading && !error && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="text-6xl mb-4">🌱</div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                {labels.placeholder}
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-2xl">
                  🌱
                </div>
              </div>
              <p className="text-primary-600 text-sm font-semibold animate-pulse">
                {labels.loading}
              </p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm font-semibold mb-1">❌ Error</p>
              <p className="text-red-500 text-sm">{error}</p>
              <p className="text-gray-400 text-xs mt-2">
                Check that your backend is running: <code className="bg-gray-100 px-1 rounded">npm run dev</code> in the backend folder
              </p>
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
    </div>
  );
}

export default function CropRecommendation() {
  return (
    <FarmerLayout>
      <CropRecommendationContent />
    </FarmerLayout>
  );
}

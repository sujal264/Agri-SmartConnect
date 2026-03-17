import { useState, useRef } from "react";
import FarmerLayout from "./FarmerLayout";
import { useLang } from "./FarmerLayout";
import { Bug, Loader, RotateCcw, Upload, Camera, X, ChevronDown } from "lucide-react";

// ── Translations ──────────────────────────────────────────────
const dt = {
  en: {
    title:         "Disease Detection",
    subtitle:      "Upload a crop photo for AI-powered disease diagnosis & treatment",
    uploadTitle:   "Upload Crop Photo",
    uploadDesc:    "Take a clear photo of the affected leaf, stem, or fruit",
    dragDrop:      "Drag & drop or click to upload",
    formats:       "Supports JPG, PNG, WEBP (max 5MB)",
    changePhoto:   "Change Photo",
    cropName:      "Crop Name *",
    affectedPart:  "Affected Part *",
    symptoms:      "Describe Symptoms (optional)",
    analyzeBtn:    "Analyze Disease",
    analyzeNoImg:  "Get Advice Without Photo",
    loading:       "Analyzing your crop...",
    reset:         "Reset",
    result:        "Disease Analysis & Treatment",
    placeholder:   "Upload a crop photo and fill details to get AI disease diagnosis.",
    cropPlaceholder: "e.g. Tomato, Wheat, Cotton",
    symptomsPlaceholder: "e.g. Yellow spots on leaves, wilting, black patches",
    parts:         ["Leaves", "Stem", "Root", "Fruit", "Flower", "Whole Plant"],
    noImageNote:   "💡 For best results, upload a clear photo of the affected area.",
  },
  hi: {
    title:         "रोग पहचान",
    subtitle:      "फसल की फोटो अपलोड करें और AI से रोग निदान पाएं",
    uploadTitle:   "फसल की फोटो अपलोड करें",
    uploadDesc:    "प्रभावित पत्ती, तने या फल की स्पष्ट फोटो लें",
    dragDrop:      "खींचें या क्लिक करके अपलोड करें",
    formats:       "JPG, PNG, WEBP समर्थित (अधिकतम 5MB)",
    changePhoto:   "फोटो बदलें",
    cropName:      "फसल का नाम *",
    affectedPart:  "प्रभावित भाग *",
    symptoms:      "लक्षण बताएं (वैकल्पिक)",
    analyzeBtn:    "रोग विश्लेषण करें",
    analyzeNoImg:  "फोटो के बिना सलाह पाएं",
    loading:       "आपकी फसल का विश्लेषण हो रहा है...",
    reset:         "रीसेट",
    result:        "रोग विश्लेषण और उपचार",
    placeholder:   "फसल की फोटो अपलोड करें और AI निदान पाएं।",
    cropPlaceholder: "जैसे टमाटर, गेहूं, कपास",
    symptomsPlaceholder: "जैसे पत्तियों पर पीले धब्बे, मुरझाना",
    parts:         ["पत्तियां", "तना", "जड़", "फल", "फूल", "पूरा पौधा"],
    noImageNote:   "💡 सर्वोत्तम परिणाम के लिए प्रभावित क्षेत्र की स्पष्ट फोटो अपलोड करें।",
  },
  mr: {
    title:         "रोग ओळख",
    subtitle:      "पीकाचा फोटो अपलोड करा आणि AI रोग निदान मिळवा",
    uploadTitle:   "पीकाचा फोटो अपलोड करा",
    uploadDesc:    "प्रभावित पान, खोड किंवा फळाचा स्पष्ट फोटो काढा",
    dragDrop:      "ड्रॅग करा किंवा क्लिक करून अपलोड करा",
    formats:       "JPG, PNG, WEBP समर्थित (कमाल 5MB)",
    changePhoto:   "फोटो बदला",
    cropName:      "पिकाचे नाव *",
    affectedPart:  "प्रभावित भाग *",
    symptoms:      "लक्षणे सांगा (पर्यायी)",
    analyzeBtn:    "रोग विश्लेषण करा",
    analyzeNoImg:  "फोटोशिवाय सल्ला मिळवा",
    loading:       "तुमच्या पिकाचे विश्लेषण होत आहे...",
    reset:         "रीसेट",
    result:        "रोग विश्लेषण आणि उपचार",
    placeholder:   "पीकाचा फोटो अपलोड करा आणि AI निदान मिळवा.",
    cropPlaceholder: "उदा. टोमॅटो, गहू, कापूस",
    symptomsPlaceholder: "उदा. पानांवर पिवळे डाग, कोमेजणे",
    parts:         ["पाने", "खोड", "मूळ", "फळ", "फूल", "संपूर्ण झाड"],
    noImageNote:   "💡 सर्वोत्तम निकालासाठी प्रभावित भागाचा स्पष्ट फोटो अपलोड करा.",
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
          className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-400 pr-10 text-gray-700"
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
            <h2 key={i} className="font-display text-lg font-bold text-red-700 mt-4 mb-2">
              🔬 {line.replace("## ", "")}
            </h2>
          );
        if (line.startsWith("### "))
          return (
            <h3 key={i} className="font-bold text-gray-700 text-sm mt-3 mb-1 flex items-center gap-1">
              {line.replace("### ", "")}
            </h3>
          );
        if (line.startsWith("- ") || line.startsWith("• "))
          return (
            <div key={i} className="flex items-start gap-2 my-1">
              <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>
              <p className="text-gray-600 text-sm">{line.replace(/^[-•] /, "")}</p>
            </div>
          );
        if (line.match(/^\d+\./))
          return (
            <div key={i} className="flex items-start gap-2 my-1">
              <span className="text-red-600 font-bold text-sm flex-shrink-0">{line.match(/^\d+/)[0]}.</span>
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
function DiseaseDetectionContent() {
  const lang   = useLang();
  const labels = dt[lang];
  const fileInputRef = useRef(null);

  const [image, setImage]         = useState(null);  // preview URL
  const [imageBase64, setBase64]  = useState("");     // base64 string
  const [mimeType, setMimeType]   = useState("");
  const [cropName, setCropName]   = useState("");
  const [affectedPart, setPart]   = useState("");
  const [symptoms, setSymptoms]   = useState("");
  const [result, setResult]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [dragOver, setDragOver]   = useState(false);

  const isValid = cropName && affectedPart;

  const handleReset = () => {
    setImage(null);
    setBase64("");
    setMimeType("");
    setCropName("");
    setPart("");
    setSymptoms("");
    setResult("");
    setError("");
  };

  // ── Handle file selection ──
  const handleFile = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image too large. Max size is 5MB.");
      return;
    }
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Use JPG, PNG, or WEBP.");
      return;
    }
    setError("");
    setMimeType(file.type);

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target.result);
    reader.readAsDataURL(file);

    // Base64 for API
    const reader2 = new FileReader();
    reader2.onload = (e) => {
      const base64 = e.target.result.split(",")[1];
      setBase64(base64);
    };
    reader2.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  // ── Submit ──
  const handleSubmit = async (withImage = true) => {
    if (!isValid) return;
    setLoading(true);
    setResult("");
    setError("");

    const langName = lang === "en" ? "English" : lang === "hi" ? "Hindi" : "Marathi";

    const prompt = withImage && imageBase64
      ? `You are an expert Indian plant pathologist and agricultural disease specialist. Analyze this crop image carefully.

Crop Information:
- Crop: ${cropName}
- Affected Part: ${affectedPart}
- Additional Symptoms Described: ${symptoms || "None"}

Please provide a detailed disease diagnosis in ${langName} covering:

## Disease Identification
- Disease name (common + scientific)
- Confidence level (High/Medium/Low)
- Type (Fungal/Bacterial/Viral/Pest/Nutritional deficiency)

## Symptoms Observed
- What you can see in the image
- How severe is the infection (Early/Moderate/Severe)

## Cause & Spread
- What causes this disease
- How it spreads to other plants
- Weather conditions that worsen it

## Treatment Plan
### Immediate Action (Do this today)
- Step by step immediate treatment

### Chemical Treatment
- Specific fungicide/pesticide names available in India
- Dosage and application method
- How many times to spray

### Organic/Natural Treatment
- Natural remedies using locally available materials
- Neem-based solutions, etc.

## Prevention for Future
- Cultural practices to prevent recurrence
- Resistant varieties to consider

## Cost Estimate
- Approximate cost of treatment per acre

Be specific, practical and use product names available in Indian markets.`
      : `You are an expert Indian plant pathologist. A farmer needs help with crop disease.

Crop: ${cropName}
Affected Part: ${affectedPart}
Symptoms: ${symptoms || "Not described"}

Provide detailed disease diagnosis and treatment advice in ${langName}.
Cover: possible diseases, symptoms, chemical and organic treatments, prevention tips, and cost estimate.
Be specific to Indian farming conditions and use product names available in India.`;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/ai/disease-detection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt,
          imageBase64: withImage ? imageBase64 : "",
          mimeType,
        }),
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
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">🔬</div>
          <div>
            <h2 className="font-display text-xl font-bold">{labels.title}</h2>
            <p className="text-red-100 text-sm mt-0.5">{labels.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ── Left: Upload + Form ── */}
        <div className="space-y-4">
          {/* Image Upload */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <Camera className="w-4 h-4 text-red-500" />
                {labels.uploadTitle}
              </h3>
              {image && (
                <button onClick={() => { setImage(null); setBase64(""); }}
                  className="text-gray-400 hover:text-red-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {!image ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  dragOver
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300 hover:border-red-400 hover:bg-red-50"
                }`}
              >
                <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="font-semibold text-gray-500 text-sm">{labels.dragDrop}</p>
                <p className="text-gray-400 text-xs mt-1">{labels.formats}</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </div>
            ) : (
              <div className="relative">
                <img src={image} alt="Crop"
                  className="w-full h-52 object-cover rounded-2xl border border-gray-200" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm hover:bg-white transition-all flex items-center gap-1"
                >
                  <Camera className="w-3 h-3" />
                  {labels.changePhoto}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </div>
            )}
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <Bug className="w-4 h-4 text-red-500" />
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
              <label className="block text-xs font-bold text-gray-600 mb-1.5">{labels.cropName}</label>
              <input
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder={labels.cropPlaceholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <SelectField
              label={labels.affectedPart}
              value={affectedPart}
              onChange={setPart}
              options={labels.parts}
            />

            {/* Symptoms */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">{labels.symptoms}</label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder={labels.symptomsPlaceholder}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              {/* With image */}
              <button
                onClick={() => handleSubmit(true)}
                disabled={!isValid || loading || !imageBase64}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <><Loader className="w-4 h-4 animate-spin" />{labels.loading}</>
                ) : (
                  <><Camera className="w-4 h-4" />{labels.analyzeBtn}</>
                )}
              </button>

              {/* Without image */}
              <button
                onClick={() => handleSubmit(false)}
                disabled={!isValid || loading}
                className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Bug className="w-4 h-4" />
                {labels.analyzeNoImg}
              </button>
            </div>

            {/* Note */}
            {!imageBase64 && (
              <p className="text-gray-400 text-xs text-center">{labels.noImageNote}</p>
            )}
          </div>
        </div>

        {/* ── Right: Result ── */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span className="text-lg">🔬</span>
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
                <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-2xl">🔬</div>
              </div>
              <p className="text-red-600 text-sm font-semibold animate-pulse">{labels.loading}</p>
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

      {/* ── Common Diseases Reference ── */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-display font-bold text-gray-800 mb-4">
          📚 {lang === "en" ? "Common Indian Crop Diseases" : lang === "hi" ? "सामान्य भारतीय फसल रोग" : "सामान्य भारतीय पीक रोग"}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { emoji: "🍅", crop: "Tomato",  disease: lang === "en" ? "Early Blight, Leaf Curl" : lang === "hi" ? "अर्ली ब्लाइट, पर्ण कुंचन" : "अर्ली ब्लाइट, पानगुंडाळणे" },
            { emoji: "🌾", crop: "Wheat",   disease: lang === "en" ? "Rust, Powdery Mildew"    : lang === "hi" ? "रस्ट, पाउडरी मिल्ड्यू"    : "रस्ट, भुकटी बुरशी" },
            { emoji: "🌿", crop: "Cotton",  disease: lang === "en" ? "Bollworm, Leaf Spot"     : lang === "hi" ? "बॉलवर्म, पत्ती धब्बा"     : "बॉलवर्म, पानावरील ठिपके" },
            { emoji: "🌽", crop: "Maize",   disease: lang === "en" ? "Northern Leaf Blight"    : lang === "hi" ? "उत्तरी पत्ती झुलसा"      : "उत्तरी पान करपा" },
            { emoji: "🥔", crop: "Potato",  disease: lang === "en" ? "Late Blight, Scab"       : lang === "hi" ? "लेट ब्लाइट, स्कैब"       : "लेट ब्लाइट, खरुज" },
            { emoji: "🍚", crop: "Rice",    disease: lang === "en" ? "Blast, Brown Spot"       : lang === "hi" ? "ब्लास्ट, भूरा धब्बा"      : "ब्लास्ट, तपकिरी ठिपके" },
            { emoji: "🧅", crop: "Onion",   disease: lang === "en" ? "Purple Blotch, Downy Mildew": lang === "hi" ? "परपल ब्लॉच, डाउनी मिल्ड्यू": "जांभळे ठिपके, केसाळ बुरशी" },
            { emoji: "🫘", crop: "Soybean", disease: lang === "en" ? "Yellow Mosaic, Rust"     : lang === "hi" ? "पीला मोजेक, रस्ट"         : "पिवळे मोझाइक, रस्ट" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => { setCropName(item.crop); }}
              className="p-3 rounded-xl border border-gray-100 hover:border-red-200 hover:bg-red-50 transition-all text-left"
            >
              <span className="text-2xl block mb-1">{item.emoji}</span>
              <p className="font-bold text-gray-700 text-xs">{item.crop}</p>
              <p className="text-gray-400 text-xs mt-0.5 leading-tight">{item.disease}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DiseaseDetection() {
  return (
    <FarmerLayout>
      <DiseaseDetectionContent />
    </FarmerLayout>
  );
}
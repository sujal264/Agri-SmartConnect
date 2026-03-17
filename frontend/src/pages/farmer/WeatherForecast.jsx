import { useState, useEffect } from "react";
import FarmerLayout from "./FarmerLayout";
import { useLang } from "./FarmerLayout";
import {
  MapPin, Wind, Droplets, Thermometer, Eye,
  Loader, AlertCircle, RefreshCw, Gauge
} from "lucide-react";

// ── Translations ──────────────────────────────────────────────
const wt = {
  en: {
    title:        "Weather Forecast",
    subtitle:     "Live weather conditions and 5-day forecast for your farm",
    feelsLike:    "Feels Like",
    humidity:     "Humidity",
    wind:         "Wind Speed",
    visibility:   "Visibility",
    pressure:     "Pressure",
    sunrise:      "Sunrise",
    sunset:       "Sunset",
    minMax:       "Min / Max",
    forecast:     "5-Day Forecast",
    advisory:     "🌾 Farming Advisory",
    refresh:      "Refresh",
    loading:      "Fetching weather for your location...",
    allow:        "Location Access Required",
    allowDesc:    "Please allow location access to see live weather for your farm.",
    howTo:        "Chrome: Click 🔒 in address bar → Site settings → Allow Location",
    error:        "Could not fetch weather data.",
    today:        "Today",
    days:         ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
  },
  hi: {
    title:        "मौसम पूर्वानुमान",
    subtitle:     "आपके खेत के लिए लाइव मौसम और 5 दिन का अनुमान",
    feelsLike:    "महसूस होता है",
    humidity:     "आर्द्रता",
    wind:         "हवा की गति",
    visibility:   "दृश्यता",
    pressure:     "दबाव",
    sunrise:      "सूर्योदय",
    sunset:       "सूर्यास्त",
    minMax:       "न्यूनतम / अधिकतम",
    forecast:     "5 दिन का पूर्वानुमान",
    advisory:     "🌾 खेती सलाह",
    refresh:      "रीफ्रेश",
    loading:      "आपके स्थान का मौसम लोड हो रहा है...",
    allow:        "स्थान अनुमति आवश्यक",
    allowDesc:    "लाइव मौसम देखने के लिए स्थान अनुमति दें।",
    howTo:        "Chrome: एड्रेस बार में 🔒 → साइट सेटिंग्स → स्थान अनुमति दें",
    error:        "मौसम डेटा लोड नहीं हो सका।",
    today:        "आज",
    days:         ["रवि","सोम","मंगल","बुध","गुरु","शुक्र","शनि"],
  },
  mr: {
    title:        "हवामान अंदाज",
    subtitle:     "तुमच्या शेतासाठी थेट हवामान आणि ५ दिवसांचा अंदाज",
    feelsLike:    "जाणवते",
    humidity:     "आर्द्रता",
    wind:         "वाऱ्याचा वेग",
    visibility:   "दृश्यमानता",
    pressure:     "दाब",
    sunrise:      "सूर्योदय",
    sunset:       "सूर्यास्त",
    minMax:       "किमान / कमाल",
    forecast:     "५ दिवसांचा अंदाज",
    advisory:     "🌾 शेती सल्ला",
    refresh:      "रीफ्रेश",
    loading:      "तुमच्या ठिकाणाचे हवामान लोड होत आहे...",
    allow:        "स्थान परवानगी आवश्यक",
    allowDesc:    "थेट हवामान पाहण्यासाठी स्थान परवानगी द्या.",
    howTo:        "Chrome: अड्रेस बारमध्ये 🔒 → साइट सेटिंग्ज → स्थान परवानगी द्या",
    error:        "हवामान डेटा लोड होऊ शकला नाही.",
    today:        "आज",
    days:         ["रवि","सोम","मंगळ","बुध","गुरु","शुक्र","शनि"],
  },
};

// ── Weather Code Helpers ──────────────────────────────────────
function getWeatherStyle(code) {
  if (code >= 200 && code < 300) return { icon: "⛈️", label: "Thunderstorm", bg: "from-gray-700 to-gray-900" };
  if (code >= 300 && code < 400) return { icon: "🌦️", label: "Drizzle",      bg: "from-blue-600 to-blue-900" };
  if (code >= 500 && code < 600) return { icon: "🌧️", label: "Rain",         bg: "from-blue-500 to-blue-800" };
  if (code >= 600 && code < 700) return { icon: "❄️", label: "Snow",         bg: "from-blue-200 to-blue-400" };
  if (code >= 700 && code < 800) return { icon: "🌫️", label: "Foggy",        bg: "from-gray-400 to-gray-600" };
  if (code === 800)               return { icon: "☀️", label: "Clear Sky",    bg: "from-yellow-400 to-orange-500" };
  if (code > 800)                 return { icon: "⛅", label: "Cloudy",       bg: "from-gray-400 to-blue-500" };
  return                                 { icon: "🌤️", label: "Weather",      bg: "from-primary-600 to-primary-900" };
}

function getFarmingAdvisory(code, temp, humidity, lang) {
  const advisories = {
    en: {
      thunder:  "⚡ Thunderstorm expected — keep livestock sheltered, avoid open fields and tall trees.",
      rain:     "🌧️ Rain today — skip pesticide/fertilizer spraying. Good time for transplanting seedlings.",
      drizzle:  "🌦️ Light drizzle — moderate conditions for most farm work. Watch for fungal diseases.",
      snow:     "❄️ Frost/snow risk — protect sensitive crops with covers. Avoid irrigation today.",
      fog:      "🌫️ Low visibility — delay spraying operations. Watch for moisture-related diseases.",
      hotClear: "🔥 Very hot & sunny — water crops early morning (before 8am) or evening (after 6pm).",
      clear:    "☀️ Clear sunny day — ideal for harvesting, grain drying, and pesticide application.",
      cloudy:   "⛅ Cloudy conditions — good for field work and transplanting. Monitor for rain.",
      humid:    "💧 High humidity — watch for fungal infections. Ensure good air circulation in crops.",
    },
    hi: {
      thunder:  "⚡ तूफान की संभावना — पशुओं को आश्रय दें, खुले मैदान से बचें।",
      rain:     "🌧️ आज बारिश — कीटनाशक/उर्वरक न डालें। पौध रोपण के लिए अच्छा समय।",
      drizzle:  "🌦️ हल्की बूंदाबांदी — अधिकतर कृषि कार्य के लिए उचित। फफूंद रोगों पर ध्यान दें।",
      snow:     "❄️ पाले का खतरा — संवेदनशील फसलों को ढकें। सिंचाई न करें।",
      fog:      "🌫️ कम दृश्यता — छिड़काव कार्य टालें। नमी से होने वाले रोगों पर ध्यान दें।",
      hotClear: "🔥 बहुत गर्म — सुबह 8 बजे से पहले या शाम 6 बजे के बाद सिंचाई करें।",
      clear:    "☀️ साफ धूप — कटाई, अनाज सुखाने और कीटनाशक के लिए उत्तम दिन।",
      cloudy:   "⛅ बादल छाए — खेत कार्य और रोपण के लिए अच्छा। बारिश की निगरानी करें।",
      humid:    "💧 अधिक आर्द्रता — फफूंद संक्रमण पर ध्यान दें। वायु संचार सुनिश्चित करें।",
    },
    mr: {
      thunder:  "⚡ वादळाची शक्यता — जनावरांना आश्रय द्या, उघड्या शेतात जाऊ नका।",
      rain:     "🌧️ आज पाऊस — कीटकनाशक/खत फवारणी करू नका. रोपण करण्यासाठी चांगला वेळ.",
      drizzle:  "🌦️ हलका पाऊस — बहुतेक शेती कामांसाठी योग्य. बुरशीजन्य रोगांवर लक्ष ठेवा.",
      snow:     "❄️ दंव/हिमाचा धोका — संवेदनशील पिकांना आच्छादन करा. सिंचन करू नका.",
      fog:      "🌫️ कमी दृश्यमानता — फवारणी पुढे ढकला. ओलाव्यामुळे होणाऱ्या रोगांवर लक्ष ठेवा.",
      hotClear: "🔥 खूप उष्ण — सकाळी ८ पूर्वी किंवा संध्याकाळी ६ नंतर पाणी द्या.",
      clear:    "☀️ स्वच्छ ऊन — कापणी, धान्य वाळवणे आणि कीटकनाशक फवारणीसाठी उत्तम दिवस.",
      cloudy:   "⛅ ढगाळ वातावरण — शेती कामे आणि लागवडीसाठी चांगले. पावसावर लक्ष ठेवा.",
      humid:    "💧 जास्त आर्द्रता — बुरशीजन्य संसर्गावर लक्ष ठेवा. हवा खेळती असल्याची खात्री करा.",
    },
  };

  const a = advisories[lang] || advisories.en;
  if (code >= 200 && code < 300) return a.thunder;
  if (code >= 300 && code < 400) return a.drizzle;
  if (code >= 500 && code < 600) return a.rain;
  if (code >= 600 && code < 700) return a.snow;
  if (code >= 700 && code < 800) return a.fog;
  if (code === 800 && temp > 35)  return a.hotClear;
  if (code === 800)               return a.clear;
  if (humidity > 80)              return a.humid;
  return a.cloudy;
}

// ── Stat Card ─────────────────────────────────────────────────
function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white/15 rounded-2xl p-4 backdrop-blur-sm text-center">
      <div className="flex justify-center mb-2 text-white/70">{icon}</div>
      <p className="text-white font-bold text-lg">{value}</p>
      <p className="text-white/60 text-xs mt-0.5">{label}</p>
    </div>
  );
}

// ── Forecast Card ─────────────────────────────────────────────
function ForecastCard({ day, icon, tempMin, tempMax, desc, isToday, todayLabel }) {
  return (
    <div className={`flex flex-col items-center p-4 rounded-2xl border transition-all ${
      isToday
        ? "bg-primary-600 border-primary-500 text-white"
        : "bg-white border-gray-100 text-gray-700 hover:shadow-sm"
    }`}>
      <p className={`text-xs font-bold mb-2 ${isToday ? "text-primary-100" : "text-gray-400"}`}>
        {isToday ? todayLabel : day}
      </p>
      <span className="text-3xl mb-2">{icon}</span>
      <p className={`text-xs text-center mb-2 leading-tight ${isToday ? "text-primary-100" : "text-gray-400"}`}>
        {desc}
      </p>
      <p className="font-bold text-sm">{tempMax}°</p>
      <p className={`text-xs ${isToday ? "text-primary-200" : "text-gray-400"}`}>{tempMin}°</p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
function WeatherContent() {
  const lang = useLang();
  const labels = wt[lang];
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const [current, setCurrent]   = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [permDenied, setPermDenied] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchWeather = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude: lat, longitude: lon } = position.coords;

          // Fetch current weather + 5-day forecast in parallel
          const [currRes, foreRes] = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`),
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&cnt=40`),
          ]);

          if (!currRes.ok) throw new Error("Weather API failed");
          const currData = await currRes.json();
          const foreData = await foreRes.json();

          setCurrent(currData);

          // Get one forecast per day (noon reading)
          const dailyMap = {};
          foreData.list?.forEach((item) => {
            const date = new Date(item.dt * 1000);
            const dateKey = date.toDateString();
            const hour = date.getHours();
            if (!dailyMap[dateKey] || Math.abs(hour - 12) < Math.abs(new Date(dailyMap[dateKey].dt * 1000).getHours() - 12)) {
              dailyMap[dateKey] = item;
            }
          });

          const dailyArr = Object.values(dailyMap).slice(0, 5);
          setForecast(dailyArr);
          setLastUpdated(new Date().toLocaleTimeString());
        } catch (err) {
          setError(labels.error);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) setPermDenied(true);
        else setError(labels.error);
        setLoading(false);
      }
    );
  };

  useEffect(() => { fetchWeather(); }, []);

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-3xl">🌤️</div>
        </div>
        <p className="text-primary-600 font-semibold animate-pulse">{labels.loading}</p>
      </div>
    );
  }

  // ── Permission Denied ──
  if (permDenied) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <div className="text-5xl mb-4">📍</div>
          <h3 className="font-bold text-yellow-800 text-lg mb-2">{labels.allow}</h3>
          <p className="text-yellow-700 text-sm mb-4">{labels.allowDesc}</p>
          <p className="text-yellow-600 text-xs bg-yellow-100 rounded-xl p-3">{labels.howTo}</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="max-w-md mx-auto mt-12">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-red-600 font-semibold">{error}</p>
          <button onClick={fetchWeather}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!current) return null;

  const style    = getWeatherStyle(current.weather[0].id);
  const advisory = getFarmingAdvisory(current.weather[0].id, current.main.temp, current.main.humidity, lang);
  const sunrise  = new Date(current.sys.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const sunset   = new Date(current.sys.sunset  * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="bg-gradient-to-r from-blue-700 to-primary-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">🌤️</div>
            <div>
              <h2 className="font-display text-xl font-bold">{labels.title}</h2>
              <p className="text-blue-100 text-sm mt-0.5">{labels.subtitle}</p>
            </div>
          </div>
          <button onClick={fetchWeather}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
            <RefreshCw className="w-4 h-4" />
            {labels.refresh}
          </button>
        </div>
      </div>

      {/* ── Current Weather Card ── */}
      <div className={`bg-gradient-to-br ${style.bg} rounded-3xl p-6 text-white shadow-xl`}>
        {/* Location + Last Updated */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-white/70" />
            <span className="text-white/70 text-sm font-semibold">
              {current.name}, {current.sys.country}
            </span>
          </div>
          {lastUpdated && (
            <span className="text-white/50 text-xs">Updated {lastUpdated}</span>
          )}
        </div>

        {/* Temp + Icon */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-7xl font-bold font-display leading-none">
              {Math.round(current.main.temp)}°C
            </p>
            <p className="text-white/80 text-lg mt-2 capitalize">
              {current.weather[0].description}
            </p>
          </div>
          <div className="text-8xl">{style.icon}</div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-5">
          <StatCard icon={<Thermometer className="w-5 h-5" />} label={labels.feelsLike} value={`${Math.round(current.main.feels_like)}°C`} />
          <StatCard icon={<Droplets    className="w-5 h-5" />} label={labels.humidity}  value={`${current.main.humidity}%`} />
          <StatCard icon={<Wind        className="w-5 h-5" />} label={labels.wind}       value={`${Math.round(current.wind.speed)} m/s`} />
          <StatCard icon={<Eye         className="w-5 h-5" />} label={labels.visibility} value={`${(current.visibility / 1000).toFixed(1)} km`} />
          <StatCard icon={<Gauge       className="w-5 h-5" />} label={labels.pressure}   value={`${current.main.pressure} hPa`} />
          <StatCard icon={<span className="text-lg">💧</span>} label={labels.minMax}     value={`${Math.round(current.main.temp_min)}°/${Math.round(current.main.temp_max)}°`} />
        </div>

        {/* Sunrise / Sunset */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-sm">
            <span className="text-3xl">🌅</span>
            <div>
              <p className="text-white/60 text-xs">{labels.sunrise}</p>
              <p className="text-white font-bold text-lg">{sunrise}</p>
            </div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-sm">
            <span className="text-3xl">🌇</span>
            <div>
              <p className="text-white/60 text-xs">{labels.sunset}</p>
              <p className="text-white font-bold text-lg">{sunset}</p>
            </div>
          </div>
        </div>

        {/* Farming Advisory */}
        <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm">
          <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-2">
            {labels.advisory}
          </p>
          <p className="text-white text-sm leading-relaxed">{advisory}</p>
        </div>
      </div>

      {/* ── 5-Day Forecast ── */}
      {forecast.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-display font-bold text-gray-800 text-lg mb-4">
            📅 {labels.forecast}
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {forecast.map((item, i) => {
              const date    = new Date(item.dt * 1000);
              const dayName = labels.days[date.getDay()];
              const wStyle  = getWeatherStyle(item.weather[0].id);
              const isToday = i === 0;
              return (
                <ForecastCard
                  key={i}
                  day={dayName}
                  icon={wStyle.icon}
                  tempMin={Math.round(item.main.temp_min)}
                  tempMax={Math.round(item.main.temp_max)}
                  desc={item.weather[0].description}
                  isToday={isToday}
                  todayLabel={labels.today}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ── Extra Farming Tips ── */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            emoji: "💨",
            title: lang === "en" ? "Wind Advisory" : lang === "hi" ? "हवा सलाह" : "वारा सल्ला",
            desc: current.wind.speed > 10
              ? (lang === "en" ? "High winds — avoid spraying pesticides today"
               : lang === "hi" ? "तेज हवा — आज कीटनाशक न डालें"
               : "वेगाचा वारा — आज कीटकनाशक फवारणी करू नका")
              : (lang === "en" ? "Calm winds — good conditions for spraying"
               : lang === "hi" ? "शांत हवा — छिड़काव के लिए अच्छी स्थिति"
               : "शांत वारा — फवारणीसाठी चांगली परिस्थिती"),
            color: "bg-blue-50 border-blue-200",
          },
          {
            emoji: "💧",
            title: lang === "en" ? "Irrigation Tip" : lang === "hi" ? "सिंचाई सुझाव" : "सिंचन सल्ला",
            desc: current.main.humidity > 70
              ? (lang === "en" ? "High humidity — reduce irrigation to prevent root rot"
               : lang === "hi" ? "अधिक आर्द्रता — जड़ सड़न से बचने के लिए सिंचाई कम करें"
               : "जास्त आर्द्रता — मूळ कुजणे टाळण्यासाठी सिंचन कमी करा")
              : (lang === "en" ? "Low humidity — ensure adequate watering of crops"
               : lang === "hi" ? "कम आर्द्रता — पर्याप्त सिंचाई सुनिश्चित करें"
               : "कमी आर्द्रता — पिकांना पुरेसे पाणी द्या"),
            color: "bg-cyan-50 border-cyan-200",
          },
          {
            emoji: "🌡️",
            title: lang === "en" ? "Temperature Alert" : lang === "hi" ? "तापमान चेतावनी" : "तापमान सतर्कता",
            desc: current.main.temp > 38
              ? (lang === "en" ? "Extreme heat — protect crops from heat stress"
               : lang === "hi" ? "अत्यधिक गर्मी — फसलों को गर्मी से बचाएं"
               : "अत्यंत उष्णता — पिकांना उष्णतेपासून वाचवा")
              : current.main.temp < 10
              ? (lang === "en" ? "Cold weather — protect sensitive crops from frost"
               : lang === "hi" ? "ठंडा मौसम — संवेदनशील फसलों को पाले से बचाएं"
               : "थंड हवामान — संवेदनशील पिकांना दंवापासून वाचवा")
              : (lang === "en" ? "Optimal temperature for most crops today"
               : lang === "hi" ? "आज अधिकतर फसलों के लिए उपयुक्त तापमान"
               : "आज बहुतेक पिकांसाठी योग्य तापमान"),
            color: "bg-orange-50 border-orange-200",
          },
        ].map((tip, i) => (
          <div key={i} className={`p-5 rounded-2xl border ${tip.color}`}>
            <div className="text-3xl mb-3">{tip.emoji}</div>
            <p className="font-bold text-gray-800 text-sm mb-1">{tip.title}</p>
            <p className="text-gray-500 text-xs leading-relaxed">{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WeatherForecast() {
  return (
    <FarmerLayout>
      <WeatherContent />
    </FarmerLayout>
  );
}
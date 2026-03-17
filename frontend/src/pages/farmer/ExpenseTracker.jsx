import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import FarmerLayout from "./FarmerLayout";
import { useLang } from "./FarmerLayout";
import {
  Wallet, Plus, Trash2, X, Loader,
  TrendingUp, TrendingDown, ChevronDown,
  ArrowUpCircle, ArrowDownCircle, Calendar
} from "lucide-react";

const API = "http://localhost:8000";

// ── Translations ──────────────────────────────────────────────
const et = {
  en: {
    title:       "Expense Tracker",
    subtitle:    "Track your farm income and expenses",
    addNew:      "Add Entry",
    income:      "Income",
    expense:     "Expense",
    balance:     "Net Balance",
    totalIn:     "Total Income",
    totalOut:    "Total Expense",
    noData:      "No entries yet. Add your first income or expense!",
    entryTitle:  "Title *",
    amount:      "Amount (₹) *",
    type:        "Type *",
    category:    "Category *",
    date:        "Date *",
    note:        "Note (optional)",
    addBtn:      "Add Entry",
    cancel:      "Cancel",
    delete:      "Delete",
    allTime:     "All Time",
    thisMonth:   "This Month",
    filter:      "Filter",
    categories: {
      seeds:       "🌱 Seeds",
      fertilizer:  "🧪 Fertilizer",
      pesticide:   "🐛 Pesticide",
      labour:      "👷 Labour",
      equipment:   "🚜 Equipment",
      irrigation:  "💧 Irrigation",
      transport:   "🚛 Transport",
      harvest:     "🌾 Harvest",
      sale:        "💰 Crop Sale",
      subsidy:     "🏛️ Subsidy",
      loan:        "🏦 Loan",
      other:       "📦 Other",
    },
    months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
  },
  hi: {
    title:       "खर्च ट्रैकर",
    subtitle:    "अपनी खेती की आय और खर्च ट्रैक करें",
    addNew:      "एंट्री जोड़ें",
    income:      "आय",
    expense:     "खर्च",
    balance:     "शुद्ध शेष",
    totalIn:     "कुल आय",
    totalOut:    "कुल खर्च",
    noData:      "कोई एंट्री नहीं। अपनी पहली आय या खर्च जोड़ें!",
    entryTitle:  "शीर्षक *",
    amount:      "राशि (₹) *",
    type:        "प्रकार *",
    category:    "श्रेणी *",
    date:        "दिनांक *",
    note:        "नोट (वैकल्पिक)",
    addBtn:      "एंट्री जोड़ें",
    cancel:      "रद्द करें",
    delete:      "हटाएं",
    allTime:     "सभी समय",
    thisMonth:   "इस महीने",
    filter:      "फ़िल्टर",
    categories: {
      seeds:       "🌱 बीज",
      fertilizer:  "🧪 उर्वरक",
      pesticide:   "🐛 कीटनाशक",
      labour:      "👷 मजदूरी",
      equipment:   "🚜 उपकरण",
      irrigation:  "💧 सिंचाई",
      transport:   "🚛 परिवहन",
      harvest:     "🌾 कटाई",
      sale:        "💰 फसल बिक्री",
      subsidy:     "🏛️ सब्सिडी",
      loan:        "🏦 ऋण",
      other:       "📦 अन्य",
    },
    months: ["जन","फर","मार","अप्र","मई","जून","जुल","अग","सित","अक्त","नव","दिस"],
  },
  mr: {
    title:       "खर्च ट्रॅकर",
    subtitle:    "तुमच्या शेतीचे उत्पन्न आणि खर्च ट्रॅक करा",
    addNew:      "नोंद जोडा",
    income:      "उत्पन्न",
    expense:     "खर्च",
    balance:     "निव्वळ शिल्लक",
    totalIn:     "एकूण उत्पन्न",
    totalOut:    "एकूण खर्च",
    noData:      "कोणतीही नोंद नाही. पहिले उत्पन्न किंवा खर्च जोडा!",
    entryTitle:  "शीर्षक *",
    amount:      "रक्कम (₹) *",
    type:        "प्रकार *",
    category:    "श्रेणी *",
    date:        "दिनांक *",
    note:        "नोंद (पर्यायी)",
    addBtn:      "नोंद जोडा",
    cancel:      "रद्द करा",
    delete:      "हटवा",
    allTime:     "सर्व वेळ",
    thisMonth:   "या महिन्यात",
    filter:      "फिल्टर",
    categories: {
      seeds:       "🌱 बियाणे",
      fertilizer:  "🧪 खत",
      pesticide:   "🐛 कीटकनाशक",
      labour:      "👷 मजुरी",
      equipment:   "🚜 उपकरणे",
      irrigation:  "💧 सिंचन",
      transport:   "🚛 वाहतूक",
      harvest:     "🌾 कापणी",
      sale:        "💰 पीक विक्री",
      subsidy:     "🏛️ अनुदान",
      loan:        "🏦 कर्ज",
      other:       "📦 इतर",
    },
    months: ["जान","फेब","मार","एप्र","मे","जून","जुल","ऑग","सप्ट","ऑक्ट","नोव","डिस"],
  },
};

const CATEGORY_KEYS = ["seeds","fertilizer","pesticide","labour","equipment","irrigation","transport","harvest","sale","subsidy","loan","other"];

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
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

function AddEntryModal({ labels, onClose, onSave }) {
  const [form, setForm] = useState({
    title: "", amount: "", type: "expense",
    category: "", date: new Date().toISOString().split("T")[0], note: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.category) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API}/api/expenses`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Entry added! ✅");
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="font-display font-bold text-gray-800 text-lg">
            {labels.addNew}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Toggle */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">{labels.type}</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, type: "income" })}
                className={`py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  form.type === "income"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <ArrowUpCircle className="w-4 h-4" />
                {labels.income}
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: "expense" })}
                className={`py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  form.type === "expense"
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <ArrowDownCircle className="w-4 h-4" />
                {labels.expense}
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">{labels.entryTitle}</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder={
                form.type === "income"
                  ? "e.g. Sold 200kg Tomatoes"
                  : "e.g. Bought Urea Fertilizer"
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          {/* Amount + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">{labels.amount}</label>
              <input
                name="amount"
                type="number"
                min="0"
                value={form.amount}
                onChange={handleChange}
                placeholder="e.g. 5000"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">{labels.date}</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
          </div>

          {/* Category */}
          <SelectField
            label={labels.category}
            value={form.category}
            onChange={(v) => setForm({ ...form, category: v })}
            options={CATEGORY_KEYS.map((k) => ({ value: k, label: labels.categories[k] }))}
          />

          {/* Note */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">{labels.note}</label>
            <input
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Optional note..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 transition-all text-sm"
            >
              {labels.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 text-white font-bold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-60 ${
                form.type === "income" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {labels.addBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ExpenseContent() {
  const lang   = useLang();
  const labels = et[lang];

  const now = new Date();
  const [expenses,   setExpenses]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [selMonth,   setSelMonth]   = useState(now.getMonth() + 1);
  const [selYear,    setSelYear]    = useState(now.getFullYear());
  const [useMonth,   setUseMonth]   = useState(false);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = useMonth ? `?month=${selMonth}&year=${selYear}` : "";
      const { data } = await axios.get(`${API}/api/expenses${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(data.expenses || []);
    } catch {
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpenses(); }, [useMonth, selMonth, selYear]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Entry deleted");
      fetchExpenses();
    } catch {
      toast.error("Failed to delete");
    }
  };

  // Calculations
  const filtered = filterType === "all"
    ? expenses
    : expenses.filter((e) => e.type === filterType);

  const totalIncome  = expenses.filter((e) => e.type === "income").reduce((s, e) => s + e.amount, 0);
  const totalExpense = expenses.filter((e) => e.type === "expense").reduce((s, e) => s + e.amount, 0);
  const balance      = totalIncome - totalExpense;

  // Category totals for chart
  const catTotals = {};
  expenses.filter((e) => e.type === "expense").forEach((e) => {
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
  });
  const topCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-700 to-pink-900 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">💰</div>
            <div>
              <h2 className="font-display text-xl font-bold">{labels.title}</h2>
              <p className="text-pink-100 text-sm mt-0.5">{labels.subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-white text-pink-700 font-bold px-5 py-2.5 rounded-xl hover:bg-pink-50 transition-all text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {labels.addNew}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
          <ArrowUpCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="font-display font-bold text-2xl text-green-700">₹{totalIncome.toLocaleString()}</p>
          <p className="text-green-600 text-xs mt-1 font-semibold">{labels.totalIn}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
          <ArrowDownCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="font-display font-bold text-2xl text-red-600">₹{totalExpense.toLocaleString()}</p>
          <p className="text-red-500 text-xs mt-1 font-semibold">{labels.totalOut}</p>
        </div>
        <div className={`${balance >= 0 ? "bg-primary-50 border-primary-200" : "bg-orange-50 border-orange-200"} border rounded-2xl p-5 text-center`}>
          {balance >= 0
            ? <TrendingUp className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            : <TrendingDown className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          }
          <p className={`font-display font-bold text-2xl ${balance >= 0 ? "text-primary-700" : "text-orange-600"}`}>
            ₹{Math.abs(balance).toLocaleString()}
          </p>
          <p className={`text-xs mt-1 font-semibold ${balance >= 0 ? "text-primary-600" : "text-orange-500"}`}>
            {labels.balance} {balance >= 0 ? "✅" : "⚠️"}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: Entries List */}
        <div className="md:col-span-2 space-y-4">
          {/* Filters Row */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-wrap gap-3 items-center">
            {/* Type filter */}
            <div className="flex gap-2">
              {[
                { key: "all",     label: lang === "en" ? "All" : lang === "hi" ? "सभी" : "सर्व" },
                { key: "income",  label: labels.income },
                { key: "expense", label: labels.expense },
              ].map((f) => (
                <button key={f.key} onClick={() => setFilterType(f.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filterType === f.key
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Month filter */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setUseMonth(!useMonth)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  useMonth ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                <Calendar className="w-3 h-3" />
                {useMonth ? labels.thisMonth : labels.allTime}
              </button>
              {useMonth && (
                <div className="relative">
                  <select
                    value={selMonth}
                    onChange={(e) => setSelMonth(Number(e.target.value))}
                    className="appearance-none border border-gray-200 rounded-xl px-3 py-1.5 text-xs bg-white focus:outline-none pr-7"
                  >
                    {labels.months.map((m, i) => (
                      <option key={i} value={i + 1}>{m}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                </div>
              )}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center h-40">
              <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
          )}

          {/* No data */}
          {!loading && filtered.length === 0 && (
            <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center">
              <div className="text-6xl mb-3">💸</div>
              <p className="text-gray-500 text-sm">{labels.noData}</p>
              <button onClick={() => setShowModal(true)}
                className="mt-4 bg-primary-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-primary-700 transition-all flex items-center gap-2 mx-auto">
                <Plus className="w-4 h-4" />
                {labels.addNew}
              </button>
            </div>
          )}

          {/* Entry List */}
          {!loading && filtered.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-50">
                {filtered.map((entry) => (
                  <div key={entry._id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      entry.type === "income" ? "bg-green-100" : "bg-red-100"
                    }`}>
                      {entry.type === "income"
                        ? <ArrowUpCircle className="w-5 h-5 text-green-600" />
                        : <ArrowDownCircle className="w-5 h-5 text-red-500" />
                      }
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 text-sm truncate">{entry.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                          {labels.categories[entry.category] || entry.category}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {new Date(entry.date).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                      {entry.note && (
                        <p className="text-gray-400 text-xs mt-0.5 truncate">{entry.note}</p>
                      )}
                    </div>

                    {/* Amount */}
                    <div className="text-right flex-shrink-0">
                      <p className={`font-display font-bold text-lg ${
                        entry.type === "income" ? "text-green-600" : "text-red-500"
                      }`}>
                        {entry.type === "income" ? "+" : "-"}₹{entry.amount.toLocaleString()}
                      </p>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(entry._id)}
                      className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Category Breakdown */}
        <div className="space-y-4">
          {/* Top expense categories */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-700 text-sm mb-4 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-pink-500" />
              {lang === "en" ? "Top Expense Categories" : lang === "hi" ? "शीर्ष खर्च श्रेणियां" : "शीर्ष खर्च श्रेणी"}
            </h3>

            {topCats.length === 0 ? (
              <p className="text-gray-400 text-xs text-center py-4">
                {lang === "en" ? "No expenses yet" : lang === "hi" ? "कोई खर्च नहीं" : "कोणताही खर्च नाही"}
              </p>
            ) : (
              <div className="space-y-3">
                {topCats.map(([cat, amt]) => {
                  const pct = totalExpense > 0 ? Math.round((amt / totalExpense) * 100) : 0;
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-600">
                          {labels.categories[cat] || cat}
                        </span>
                        <span className="text-xs font-bold text-gray-700">
                          ₹{amt.toLocaleString()} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* All categories quick add */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-700 text-sm mb-3">
              {lang === "en" ? "Quick Add by Category" : lang === "hi" ? "श्रेणी के अनुसार जोड़ें" : "श्रेणीनुसार जोडा"}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORY_KEYS.slice(0, 9).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setShowModal(true)}
                  className="p-2 rounded-xl bg-gray-50 hover:bg-pink-50 transition-colors text-center"
                >
                  <span className="text-lg block">{labels.categories[cat].split(" ")[0]}</span>
                  <span className="text-gray-500 text-xs capitalize">{cat}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <AddEntryModal
          labels={labels}
          onClose={() => setShowModal(false)}
          onSave={() => { setShowModal(false); fetchExpenses(); }}
        />
      )}
    </div>
  );
}

export default function ExpenseTracker() {
  return (
    <FarmerLayout>
      <ExpenseContent />
    </FarmerLayout>
  );
}
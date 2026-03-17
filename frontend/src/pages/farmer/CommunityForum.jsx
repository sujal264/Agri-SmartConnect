import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import FarmerLayout from "./FarmerLayout";
import { useLang } from "./FarmerLayout";
import {
  Users, Plus, X, Loader, Search,
  ThumbsUp, MessageCircle, Trash2,
  ChevronDown, ArrowLeft, Send, Bot
} from "lucide-react";

const API = "http://localhost:8000";

// ── Translations ──────────────────────────────────────────────
const ft = {
  en: {
    title:        "Community Forum",
    subtitle:     "Ask questions, share knowledge with fellow farmers",
    newPost:      "New Post",
    search:       "Search posts...",
    allCats:      "All Topics",
    noPost:       "No posts yet. Be the first to ask a question!",
    postTitle:    "Post Title *",
    postContent:  "Your Question or Post *",
    category:     "Topic Category *",
    postBtn:      "Post to Forum",
    cancel:       "Cancel",
    reply:        "Reply",
    replies:      "Replies",
    replyPlaceholder: "Write your reply...",
    aiReply:      "Get AI Answer",
    aiLoading:    "AI is thinking...",
    likes:        "Likes",
    delete:       "Delete",
    back:         "Back to Forum",
    posted:       "Posted by",
    on:           "on",
    noReplies:    "No replies yet. Be the first to help!",
    categories: {
      all:        "All Topics",
      crop:       "🌾 Crop Issues",
      pest:       "🐛 Pest & Disease",
      weather:    "🌤️ Weather",
      market:     "📈 Market Prices",
      equipment:  "🚜 Equipment",
      government: "🏛️ Government Schemes",
      general:    "💬 General",
    },
  },
  hi: {
    title:        "समुदाय मंच",
    subtitle:     "प्रश्न पूछें, साथी किसानों के साथ ज्ञान साझा करें",
    newPost:      "नई पोस्ट",
    search:       "पोस्ट खोजें...",
    allCats:      "सभी विषय",
    noPost:       "कोई पोस्ट नहीं। पहला प्रश्न पूछें!",
    postTitle:    "पोस्ट शीर्षक *",
    postContent:  "आपका प्रश्न या पोस्ट *",
    category:     "विषय श्रेणी *",
    postBtn:      "फोरम पर पोस्ट करें",
    cancel:       "रद्द करें",
    reply:        "उत्तर दें",
    replies:      "उत्तर",
    replyPlaceholder: "अपना उत्तर लिखें...",
    aiReply:      "AI उत्तर पाएं",
    aiLoading:    "AI सोच रहा है...",
    likes:        "लाइक",
    delete:       "हटाएं",
    back:         "फोरम पर वापस",
    posted:       "पोस्ट किया",
    on:           "को",
    noReplies:    "कोई उत्तर नहीं। पहले मदद करें!",
    categories: {
      all:        "सभी विषय",
      crop:       "🌾 फसल समस्याएं",
      pest:       "🐛 कीट और रोग",
      weather:    "🌤️ मौसम",
      market:     "📈 बाज़ार भाव",
      equipment:  "🚜 उपकरण",
      government: "🏛️ सरकारी योजनाएं",
      general:    "💬 सामान्य",
    },
  },
  mr: {
    title:        "समुदाय मंच",
    subtitle:     "प्रश्न विचारा, साथी शेतकऱ्यांसोबत ज्ञान शेअर करा",
    newPost:      "नवीन पोस्ट",
    search:       "पोस्ट शोधा...",
    allCats:      "सर्व विषय",
    noPost:       "कोणतीही पोस्ट नाही. पहिला प्रश्न विचारा!",
    postTitle:    "पोस्टचे शीर्षक *",
    postContent:  "तुमचा प्रश्न किंवा पोस्ट *",
    category:     "विषय श्रेणी *",
    postBtn:      "फोरमवर पोस्ट करा",
    cancel:       "रद्द करा",
    reply:        "उत्तर द्या",
    replies:      "उत्तरे",
    replyPlaceholder: "तुमचे उत्तर लिहा...",
    aiReply:      "AI उत्तर मिळवा",
    aiLoading:    "AI विचार करत आहे...",
    likes:        "लाइक",
    delete:       "हटवा",
    back:         "फोरमवर परत",
    posted:       "पोस्ट केले",
    on:           "रोजी",
    noReplies:    "कोणतेही उत्तर नाही. प्रथम मदत करा!",
    categories: {
      all:        "सर्व विषय",
      crop:       "🌾 पीक समस्या",
      pest:       "🐛 कीड आणि रोग",
      weather:    "🌤️ हवामान",
      market:     "📈 बाजार भाव",
      equipment:  "🚜 उपकरणे",
      government: "🏛️ सरकारी योजना",
      general:    "💬 सामान्य",
    },
  },
};

const CAT_KEYS = ["crop", "pest", "weather", "market", "equipment", "government", "general"];

// ── Category color map ────────────────────────────────────────
const catColors = {
  crop:       "bg-green-100 text-green-700",
  pest:       "bg-red-100 text-red-700",
  weather:    "bg-blue-100 text-blue-700",
  market:     "bg-yellow-100 text-yellow-700",
  equipment:  "bg-gray-100 text-gray-700",
  government: "bg-purple-100 text-purple-700",
  general:    "bg-indigo-100 text-indigo-700",
};

// ── New Post Modal ────────────────────────────────────────────
function NewPostModal({ labels, onClose, onSave }) {
  const [form, setForm] = useState({ title: "", content: "", category: "general" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content || !form.category) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API}/api/forum`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Post created! 🎉");
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="font-display font-bold text-gray-800 text-lg">
            {labels.newPost}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">{labels.postTitle}</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Why are my tomato leaves turning yellow?"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">{labels.postContent}</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Describe your issue or question in detail..."
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">{labels.category}</label>
            <div className="relative">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
              >
                {CAT_KEYS.map((k) => (
                  <option key={k} value={k}>{labels.categories[k]}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
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
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {labels.postBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Post Card ─────────────────────────────────────────────────
function PostCard({ post, labels, onOpen, onLike, onDelete, currentUserId }) {
  return (
    <div
      onClick={() => onOpen(post)}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${catColors[post.category] || "bg-gray-100 text-gray-600"}`}>
              {labels.categories[post.category] || post.category}
            </span>
            {post.author?.role === "admin" && (
              <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">Admin</span>
            )}
          </div>
          <h3 className="font-bold text-gray-800 text-base leading-tight">{post.title}</h3>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">{post.content}</p>
        </div>
        {post.author?._id === currentUserId && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(post._id); }}
            className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center text-sm">
            👨‍🌾
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700">{post.author?.name || "Farmer"}</p>
            <p className="text-xs text-gray-400">
              {new Date(post.createdAt).toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={(e) => { e.stopPropagation(); onLike(post._id); }}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-500 transition-colors"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            {post.likes || 0}
          </button>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <MessageCircle className="w-3.5 h-3.5" />
            {post.replies?.length || 0} {labels.replies}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Post Detail View ──────────────────────────────────────────
function PostDetail({ post, labels, onBack, onRefresh, lang }) {
  const [replyText, setReplyText]   = useState("");
  const [loading,   setLoading]     = useState(false);
  const [aiLoading, setAiLoading]   = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API}/api/forum/${post._id}/reply`,
        { content: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyText("");
      toast.success("Reply posted!");
      onRefresh();
    } catch {
      toast.error("Failed to post reply");
    } finally {
      setLoading(false);
    }
  };

  const handleAIReply = async () => {
    setAiLoading(true);
    try {
      const token = localStorage.getItem("token");
      const langName = lang === "en" ? "English" : lang === "hi" ? "Hindi" : "Marathi";

      const prompt = `You are an expert Indian agricultural advisor helping farmers in an online community forum.

A farmer has posted this question:
Title: ${post.title}
Content: ${post.content}
Category: ${post.category}

Please provide a helpful, practical answer in ${langName}. 
- Be specific and actionable
- Include practical steps
- Keep it concise but complete
- Use simple language that farmers can understand
- If it's about disease/pest, mention specific remedies available in India`;

      const res = await fetch(`${API}/api/ai/community-reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      if (data.success && data.text) {
        await axios.post(
          `${API}/api/forum/${post._id}/reply`,
          { content: data.text, isAI: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("AI answer added! 🤖");
        onRefresh();
      }
    } catch {
      toast.error("Failed to get AI answer");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {labels.back}
      </button>

      {/* Post */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${catColors[post.category] || "bg-gray-100"}`}>
            {labels.categories[post.category]}
          </span>
        </div>
        <h2 className="font-display text-xl font-bold text-gray-800 mb-3">{post.title}</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{post.content}</p>
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">👨‍🌾</div>
          <div>
            <p className="text-sm font-semibold text-gray-700">{post.author?.name}</p>
            <p className="text-xs text-gray-400">
              {post.author?.farmName && `${post.author.farmName} • `}
              {new Date(post.createdAt).toLocaleDateString("en-IN")}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1 text-gray-400 text-sm">
            <ThumbsUp className="w-4 h-4" />
            {post.likes}
          </div>
        </div>
      </div>

      {/* Replies */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-indigo-500" />
            {post.replies?.length || 0} {labels.replies}
          </h3>
          <button
            onClick={handleAIReply}
            disabled={aiLoading}
            className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-4 py-2 rounded-xl text-xs transition-all disabled:opacity-60"
          >
            {aiLoading
              ? <><Loader className="w-3 h-3 animate-spin" />{labels.aiLoading}</>
              : <><Bot className="w-3 h-3" />{labels.aiReply}</>
            }
          </button>
        </div>

        {/* No replies */}
        {(!post.replies || post.replies.length === 0) && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="text-4xl mb-2">💬</div>
            <p className="text-gray-400 text-sm">{labels.noReplies}</p>
          </div>
        )}

        {/* Reply list */}
        {post.replies && post.replies.length > 0 && (
          <div className="divide-y divide-gray-50">
            {post.replies.map((reply, i) => (
              <div key={i} className={`px-6 py-4 ${reply.isAI ? "bg-indigo-50" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${
                    reply.isAI ? "bg-indigo-200" : "bg-primary-100"
                  }`}>
                    {reply.isAI ? "🤖" : "👨‍🌾"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-sm font-bold text-gray-700">
                        {reply.isAI ? "AI Assistant" : reply.author?.name || "Farmer"}
                      </p>
                      {reply.isAI && (
                        <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full font-semibold">
                          AI Answer
                        </span>
                      )}
                      {reply.author?.role === "admin" && !reply.isAI && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                          Admin
                        </span>
                      )}
                      <p className="text-xs text-gray-400">
                        {new Date(reply.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                      {reply.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reply input */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 text-sm">
              👨‍🌾
            </div>
            <div className="flex-1 flex gap-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleReply(); } }}
                placeholder={labels.replyPlaceholder}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              />
              <button
                onClick={handleReply}
                disabled={loading || !replyText.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all"
              >
                {loading
                  ? <Loader className="w-4 h-4 animate-spin" />
                  : <Send className="w-4 h-4" />
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
function ForumContent() {
  const lang   = useLang();
  const labels = ft[lang];
  const user   = JSON.parse(localStorage.getItem("user") || "{}");

  const [posts,      setPosts]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [activePost, setActivePost] = useState(null);
  const [search,     setSearch]     = useState("");
  const [selCat,     setSelCat]     = useState("all");

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token  = localStorage.getItem("token");
      const params = [];
      if (selCat !== "all") params.push(`category=${selCat}`);
      if (search)           params.push(`search=${search}`);
      const query  = params.length ? `?${params.join("&")}` : "";
      const { data } = await axios.get(`${API}/api/forum${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(data.posts || []);
    } catch {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchSinglePost = async (postId) => {
    try {
      const token   = localStorage.getItem("token");
      const { data } = await axios.get(`${API}/api/forum`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = data.posts?.find((p) => p._id === postId);
      if (updated) setActivePost(updated);
    } catch {
      toast.error("Failed to refresh post");
    }
  };

  useEffect(() => { fetchPosts(); }, [selCat]);

  const handleSearch = (e) => {
    if (e.key === "Enter") fetchPosts();
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API}/api/forum/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
    } catch {
      toast.error("Failed to like post");
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/forum/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Post deleted");
      fetchPosts();
    } catch {
      toast.error("Failed to delete post");
    }
  };

  // If viewing a specific post
  if (activePost) {
    return (
      <PostDetail
        post={activePost}
        labels={labels}
        lang={lang}
        onBack={() => { setActivePost(null); fetchPosts(); }}
        onRefresh={() => fetchSinglePost(activePost._id)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">👥</div>
            <div>
              <h2 className="font-display text-xl font-bold">{labels.title}</h2>
              <p className="text-indigo-100 text-sm mt-0.5">{labels.subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-white text-indigo-700 font-bold px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition-all text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {labels.newPost}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { emoji: "📝", label: lang === "en" ? "Total Posts"   : lang === "hi" ? "कुल पोस्ट"    : "एकूण पोस्ट",    value: posts.length },
          { emoji: "💬", label: lang === "en" ? "Total Replies" : lang === "hi" ? "कुल उत्तर"    : "एकूण उत्तरे",   value: posts.reduce((s, p) => s + (p.replies?.length || 0), 0) },
          { emoji: "👍", label: lang === "en" ? "Total Likes"   : lang === "hi" ? "कुल लाइक्स"   : "एकूण लाइक्स",  value: posts.reduce((s, p) => s + (p.likes || 0), 0) },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <div className="text-3xl mb-1">{s.emoji}</div>
            <p className="font-display font-bold text-2xl text-gray-800">{s.value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Category Filter */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            placeholder={labels.search}
            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelCat("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selCat === "all"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-indigo-50"
            }`}
          >
            {labels.allCats}
          </button>
          {CAT_KEYS.map((k) => (
            <button
              key={k}
              onClick={() => setSelCat(k)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selCat === k
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-indigo-50"
              }`}
            >
              {labels.categories[k]}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-48">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      )}

      {/* No posts */}
      {!loading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 text-center bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-3">💬</div>
          <p className="text-gray-500 text-sm mb-4">{labels.noPost}</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 hover:bg-indigo-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            {labels.newPost}
          </button>
        </div>
      )}

      {/* Posts Grid */}
      {!loading && posts.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              labels={labels}
              onOpen={setActivePost}
              onLike={handleLike}
              onDelete={handleDelete}
              currentUserId={user.id}
            />
          ))}
        </div>
      )}

      {/* New Post Modal */}
      {showModal && (
        <NewPostModal
          labels={labels}
          onClose={() => setShowModal(false)}
          onSave={() => { setShowModal(false); fetchPosts(); }}
        />
      )}
    </div>
  );
}

export default function CommunityForum() {
  return (
    <FarmerLayout>
      <ForumContent />
    </FarmerLayout>
  );
}
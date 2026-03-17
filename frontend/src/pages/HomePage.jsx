import { Link } from "react-router-dom";
import WeatherWidget from "../components/WeatherWidget";
import { Leaf, ShoppingBag, ShieldCheck, ArrowRight, Star, Users, Package, TrendingUp } from "lucide-react";

// ── Navbar ────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-primary-900 text-lg leading-tight">Agri-Smart</span>
            <span className="text-xs text-gray-400 block -mt-1">Connect</span>
          </div>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
          <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-primary-600 transition-colors">How It Works</a>
          <a href="#stats" className="hover:text-primary-600 transition-colors">Stats</a>
          <a href="#testimonials" className="hover:text-primary-600 transition-colors">Testimonials</a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/signin"
            className="text-sm font-bold text-primary-700 hover:text-primary-900 transition-colors px-4 py-2">
            Sign In
          </Link>
          <Link to="/signup"
            className="text-sm font-bold bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ── Hero Section ──────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-earth-700 flex items-center overflow-hidden">
      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      {/* Decorative circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-500 rounded-full opacity-20 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-earth-500 rounded-full opacity-20 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div>
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="text-xs">🌱</span>
            <span className="text-white text-xs font-semibold">India's Smartest Agri Platform</span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            From Farm
            <span className="text-earth-400"> Directly </span>
            to Your Table
          </h1>

          <p className="text-primary-100 text-lg leading-relaxed mb-8 max-w-md">
            Agri-Smart Connect bridges the gap between farmers and buyers. 
            Sell fresh produce directly, get fair prices, and grow together.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/signup"
              className="inline-flex items-center gap-2 bg-white text-primary-800 font-bold px-7 py-3.5 rounded-xl hover:bg-primary-50 transition-all duration-200 shadow-lg text-sm">
              Join as Farmer
              <Leaf className="w-4 h-4" />
            </Link>
            <Link to="/signup"
              className="inline-flex items-center gap-2 bg-earth-500 hover:bg-earth-700 text-white font-bold px-7 py-3.5 rounded-xl transition-all duration-200 shadow-lg text-sm">
              Join as Buyer
              <ShoppingBag className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-6 mt-10">
            <div className="text-center">
              <p className="text-white font-bold text-2xl">10K+</p>
              <p className="text-primary-200 text-xs">Farmers</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-white font-bold text-2xl">5K+</p>
              <p className="text-primary-200 text-xs">Buyers</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-white font-bold text-2xl">₹2Cr+</p>
              <p className="text-primary-200 text-xs">Transactions</p>
            </div>
          </div>
        </div>

        {/* Right — floating card UI */}
        <div className="hidden md:flex flex-col gap-4">
          {/* Product card */}
          <div className="bg-white rounded-2xl p-5 shadow-2xl ml-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">🥦</div>
              <div>
                <p className="font-bold text-gray-800">Fresh Broccoli</p>
                <p className="text-xs text-gray-400">Green Valley Farm, Nashik</p>
              </div>
              <div className="ml-auto text-right">
                <p className="font-bold text-primary-700 text-lg">₹45/kg</p>
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-semibold">Available</span>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Vegetables</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">500 kg stock</span>
            </div>
          </div>

          {/* Order card */}
          <div className="bg-white rounded-2xl p-5 shadow-2xl mr-8">
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-gray-800 text-sm">New Order Received! 🎉</p>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Confirmed</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-earth-100 rounded-full flex items-center justify-center text-lg">🛒</div>
              <div>
                <p className="text-sm font-semibold text-gray-700">FreshMart Pvt. Ltd.</p>
                <p className="text-xs text-gray-400">100kg Tomatoes • ₹3,200</p>
              </div>
            </div>
          </div>

          {/* Earnings card */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-5 shadow-2xl ml-8">
            <p className="text-primary-100 text-xs font-semibold mb-1">This Month's Earnings</p>
            <p className="text-white font-bold text-3xl mb-1">₹48,200</p>
            <p className="text-primary-200 text-xs flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +23% from last month
            </p>
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,80 C360,0 1080,0 1440,80 L1440,80 L0,80 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}

{/* Weather Section */}
<section className="py-16 bg-white">
  <div className="max-w-6xl mx-auto px-6">
    <div className="text-center mb-10">
      <span className="text-primary-600 font-bold text-sm uppercase tracking-widest">Live Weather</span>
      <h2 className="font-display text-3xl font-bold text-gray-900 mt-2 mb-2">
        Your Local Farm Weather
      </h2>
      <p className="text-gray-500 text-sm max-w-md mx-auto">
        Real-time weather conditions and farming advisories based on your location.
      </p>
    </div>
    <div className="max-w-2xl mx-auto">
      <WeatherWidget />
    </div>
  </div>
</section>

// ── Features Section ──────────────────────────────────────────
function Features() {
  const features = [
    {
      icon: "🌾",
      title: "Direct Farm Sales",
      desc: "Farmers list their produce directly with real-time pricing. No middlemen, maximum profit.",
      color: "bg-primary-50 border-primary-200",
      iconBg: "bg-primary-100",
    },
    {
      icon: "🛒",
      title: "Smart Buyer Marketplace",
      desc: "Buyers browse verified farm products, compare prices, and place orders with one click.",
      color: "bg-earth-50 border-earth-200",
      iconBg: "bg-earth-100",
    },
    {
      icon: "📦",
      title: "Order Tracking",
      desc: "Real-time order status from confirmation to delivery. Full transparency for both parties.",
      color: "bg-blue-50 border-blue-200",
      iconBg: "bg-blue-100",
    },
    {
      icon: "💰",
      title: "Fair Pricing",
      desc: "Market-rate pricing tools help farmers set competitive prices and earn what they deserve.",
      color: "bg-purple-50 border-purple-200",
      iconBg: "bg-purple-100",
    },
    {
      icon: "🔒",
      title: "Verified Accounts",
      desc: "All farmers and buyers go through a verification process ensuring trust and safety.",
      color: "bg-red-50 border-red-200",
      iconBg: "bg-red-100",
    },
    {
      icon: "📱",
      title: "Easy to Use",
      desc: "Designed for farmers of all tech levels. Simple, fast, and available on any device.",
      color: "bg-yellow-50 border-yellow-200",
      iconBg: "bg-yellow-100",
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary-600 font-bold text-sm uppercase tracking-widest">Why Choose Us</span>
          <h2 className="font-display text-4xl font-bold text-gray-900 mt-2 mb-4">
            Everything You Need to Grow
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            A complete platform built for Indian agriculture — connecting farmers, buyers, and administrators seamlessly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className={`p-6 rounded-2xl border ${f.color} hover:shadow-md transition-shadow duration-200`}>
              <div className={`w-12 h-12 ${f.iconBg} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How It Works ──────────────────────────────────────────────
function HowItWorks() {
  const farmerSteps = [
    { step: "01", title: "Sign Up as Farmer", desc: "Create your account with farm details in under 2 minutes." },
    { step: "02", title: "List Your Produce", desc: "Add products with photos, price, and available quantity." },
    { step: "03", title: "Receive Orders", desc: "Get notified when buyers place orders for your products." },
    { step: "04", title: "Earn & Grow", desc: "Confirm, ship, and get paid directly. Track all earnings." },
  ];

  const buyerSteps = [
    { step: "01", title: "Sign Up as Buyer", desc: "Register your business and get verified quickly." },
    { step: "02", title: "Browse Products", desc: "Explore fresh produce from verified farms across India." },
    { step: "03", title: "Place Orders", desc: "Select quantity, add delivery address and place your order." },
    { step: "04", title: "Receive Fresh Produce", desc: "Track your order and receive farm-fresh products." },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary-600 font-bold text-sm uppercase tracking-widest">Simple Process</span>
          <h2 className="font-display text-4xl font-bold text-gray-900 mt-2 mb-4">How It Works</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Get started in minutes whether you're a farmer or a buyer.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Farmer Flow */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-primary-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-primary-900">For Farmers</h3>
            </div>
            <div className="space-y-6">
              {farmerSteps.map((s, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 text-primary-700 font-bold text-sm rounded-xl flex items-center justify-center">
                    {s.step}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{s.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/signup"
              className="mt-8 w-full inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-all text-sm">
              Join as Farmer <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Buyer Flow */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-earth-200">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-earth-500 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-earth-700">For Buyers</h3>
            </div>
            <div className="space-y-6">
              {buyerSteps.map((s, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-earth-100 text-earth-700 font-bold text-sm rounded-xl flex items-center justify-center">
                    {s.step}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{s.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/signup"
              className="mt-8 w-full inline-flex items-center justify-center gap-2 bg-earth-500 hover:bg-earth-700 text-white font-bold py-3 rounded-xl transition-all text-sm">
              Join as Buyer <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Stats Section ─────────────────────────────────────────────
function Stats() {
  const stats = [
    { icon: <Users className="w-6 h-6" />, value: "10,000+", label: "Registered Farmers", color: "text-primary-600" },
    { icon: <ShoppingBag className="w-6 h-6" />, value: "5,000+", label: "Active Buyers", color: "text-earth-600" },
    { icon: <Package className="w-6 h-6" />, value: "50,000+", label: "Orders Fulfilled", color: "text-blue-600" },
    { icon: <TrendingUp className="w-6 h-6" />, value: "₹2 Cr+", label: "Total Transactions", color: "text-purple-600" },
  ];

  return (
    <section id="stats" className="py-20 bg-gradient-to-br from-primary-900 to-primary-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-2xl mb-4 ${s.color}`}>
                {s.icon}
              </div>
              <p className="text-white font-bold text-3xl font-display">{s.value}</p>
              <p className="text-primary-200 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────
function Testimonials() {
  const testimonials = [
    {
      name: "Rajesh Patil",
      role: "Farmer, Nashik",
      emoji: "👨‍🌾",
      text: "Agri-Smart Connect changed my life. I now sell directly to buyers and earn 40% more than before. No more middlemen taking my profits!",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Buyer, FreshMart Pvt. Ltd.",
      emoji: "👩‍💼",
      text: "We source all our vegetables directly from farmers now. The quality is excellent and the prices are much better than the wholesale market.",
      rating: 5,
    },
    {
      name: "Suresh Yadav",
      role: "Farmer, Pune",
      emoji: "👨‍🌾",
      text: "The platform is very easy to use. I listed my tomatoes and got my first order within 2 days. The payment was fast and transparent.",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary-600 font-bold text-sm uppercase tracking-widest">Testimonials</span>
          <h2 className="font-display text-4xl font-bold text-gray-900 mt-2 mb-4">What Our Users Say</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-earth-400 fill-earth-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-xl">
                  {t.emoji}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA Section ───────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="text-5xl mb-6">🌾</div>
        <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">
          Ready to Transform Your Agricultural Business?
        </h2>
        <p className="text-gray-500 text-lg mb-8">
          Join thousands of farmers and buyers already growing with Agri-Smart Connect.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/signup"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/signin"
            className="inline-flex items-center gap-2 border-2 border-primary-600 text-primary-700 font-bold px-8 py-4 rounded-xl hover:bg-primary-50 transition-all">
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-primary-900 text-primary-200 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-white">Agri-Smart Connect</span>
        </div>
        <p className="text-sm text-primary-400">© 2024 Agri-Smart Connect. All rights reserved.</p>
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}

// ── Main HomePage ─────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="font-sans">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
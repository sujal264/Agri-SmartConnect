import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// ── Public Pages ──────────────────────────────────────────────
import HomePage from "./pages/HomePage";
import SignUp   from "./pages/SignUp";
import SignIn   from "./pages/SignIn";

// ── Farmer Pages ──────────────────────────────────────────────
import FarmerDashboardPage from "./pages/farmer/FarmerDashboard";
import CropRecommendation  from "./pages/farmer/CropRecommendation";
import WeatherForecast     from "./pages/farmer/WeatherForecast";
import MarketPrices        from "./pages/farmer/MarketPrices";
import SellCrops           from "./pages/farmer/SellCrops";
import FertilizerAdvice    from "./pages/farmer/FertilizerAdvice";
import DiseaseDetection    from "./pages/farmer/DiseaseDetection";
import GovernmentSchemes   from "./pages/farmer/GovernmentSchemes";
import ExpenseTracker      from "./pages/farmer/ExpenseTracker";
import CommunityForum      from "./pages/farmer/CommunityForum";

// ── Buyer Pages ───────────────────────────────────────────────
import BuyerDashboard       from "./pages/buyer/BuyerDashboard";
import BrowseProducts       from "./pages/buyer/BrowseProducts";
import MyOrders             from "./pages/buyer/MyOrders";
import BuyerMarketPrices    from "./pages/buyer/BuyerMarketPrices";
import BuyerCommunityForum  from "./pages/buyer/BuyerCommunityForum";



// ── Admin Placeholder (built later) ──────────────────────────
const AdminDashboard = () => (
  <div className="min-h-screen bg-blue-50 flex items-center justify-center">
    <div className="text-center">
      <div className="text-6xl mb-4">🛡️</div>
      <h1 className="text-3xl font-display font-bold text-blue-800">Admin Dashboard</h1>
      <p className="text-blue-600 mt-2 font-sans">Coming soon!</p>
    </div>
  </div>
);

// ── Protected Route ───────────────────────────────────────────
function PrivateRoute({ children, allowedRole }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return <Navigate to="/signin" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/signin" />;
  return children;
}

// ── App ───────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>

        {/* ── Public Routes ── */}
        <Route path="/"       element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        {/* ── Farmer Routes ── */}
        <Route path="/farmer/dashboard"
          element={<PrivateRoute allowedRole="farmer"><FarmerDashboardPage /></PrivateRoute>} />

        <Route path="/farmer/crop-recommendation"
          element={<PrivateRoute allowedRole="farmer"><CropRecommendation /></PrivateRoute>} />

        <Route path="/farmer/weather"
          element={<PrivateRoute allowedRole="farmer"><WeatherForecast /></PrivateRoute>} />

        <Route path="/farmer/market-prices"
          element={<PrivateRoute allowedRole="farmer"><MarketPrices /></PrivateRoute>} />

        <Route path="/farmer/sell-crops"
          element={<PrivateRoute allowedRole="farmer"><SellCrops /></PrivateRoute>} />

        <Route path="/farmer/fertilizer"
          element={<PrivateRoute allowedRole="farmer"><FertilizerAdvice /></PrivateRoute>} />

        <Route path="/farmer/disease-detection"
          element={<PrivateRoute allowedRole="farmer"><DiseaseDetection /></PrivateRoute>} />

        <Route path="/farmer/schemes"
          element={<PrivateRoute allowedRole="farmer"><GovernmentSchemes /></PrivateRoute>} />

        <Route path="/farmer/expenses"
          element={<PrivateRoute allowedRole="farmer"><ExpenseTracker /></PrivateRoute>} />

        <Route path="/farmer/community"
          element={<PrivateRoute allowedRole="farmer"><CommunityForum /></PrivateRoute>} />

        {/* ── Buyer Routes ── */}
        <Route path="/buyer/dashboard"
          element={<PrivateRoute allowedRole="buyer"><BuyerDashboard /></PrivateRoute>} />

        <Route path="/buyer/browse"
          element={<PrivateRoute allowedRole="buyer"><BrowseProducts /></PrivateRoute>} />

        <Route path="/buyer/orders"
          element={<PrivateRoute allowedRole="buyer"><MyOrders /></PrivateRoute>} />

        <Route path="/buyer/market-prices"
          element={<PrivateRoute allowedRole="buyer"><BuyerMarketPrices /></PrivateRoute>} />

        <Route path="/buyer/community"
          element={<PrivateRoute allowedRole="buyer"><BuyerCommunityForum /></PrivateRoute>} />

        {/* ── Admin Routes ── */}
        <Route path="/admin/dashboard"
          element={<PrivateRoute allowedRole="admin"><AdminDashboard /></PrivateRoute>} />

        {/* ── Catch All ── */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}
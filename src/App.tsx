import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import DashboardPage from "./pages/DashboardPage";
import AuthPage from "./pages/AuthPage";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CatExpertPage from "./pages/CatExpertPage";
import CatMusiciansPage from "./pages/CatMusiciansPage";
import CatQuizPage from "./pages/CatQuizPage";
import CatRescuePage from "./pages/CatRescuePage";
import { AuthProvider } from "./context/AuthContext";

function NotFoundPage() {
  return (
    <section className="card">
      <h1>Page Not Found</h1>
      <p>This route does not exist. Use the top navigation.</p>
    </section>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="app-shell">
        <NavBar />
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/expert" element={<CatExpertPage />} />
            <Route path="/rescue" element={<CatRescuePage />} />
            <Route path="/musicians" element={<CatMusiciansPage />} />
            <Route path="/quiz" element={<CatQuizPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<ProtectedRoute role="seller"><DashboardPage /></ProtectedRoute>} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

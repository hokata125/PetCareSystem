import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import SiteLayout from "./layouts/SiteLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AdoptionCreatePage from "./pages/adoption/AdoptionCreatePage";
import AdoptionDetailPage from "./pages/adoption/AdoptionDetailPage";
import AdoptionHistoryPage from "./pages/adoption/AdoptionHistoryPage";
import BookingCreatePage from "./pages/booking/BookingCreatePage";
import BookingDetailPage from "./pages/booking/BookingDetailPage";
import BookingHistoryPage from "./pages/booking/BookingHistoryPage";
import ChangePasswordPage from "./pages/profile/ChangePasswordPage";
import HomePage from "./pages/home/HomePage";
import AbandonedPetDetailPage from "./pages/abandoned-pet/AbandonedPetDetailPage";
import AbandonedPetListPage from "./pages/abandoned-pet/AbandonedPetListPage";
import OrderCreatePage from "./pages/order/OrderCreatePage";
import OrderDetailPage from "./pages/order/OrderDetailPage";
import OrderHistoryPage from "./pages/order/OrderHistoryPage";
import PaymentPage from "./pages/payment/PaymentPage";
import ProfilePage from "./pages/profile/ProfilePage";
import ProductDetailPage from "./pages/product/ProductDetailPage";
import ProductListPage from "./pages/product/ProductListPage";
import ServiceDetailPage from "./pages/service/ServiceDetailPage";
import ServiceListPage from "./pages/service/ServiceListPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { getCurrentUser, logout } from "./services/auth";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingCurrentUser, setIsCheckingCurrentUser] = useState(
    Boolean(localStorage.getItem("accessToken")),
  );

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) return;

    const loadCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch {
        localStorage.removeItem("accessToken");
      } finally {
        setIsCheckingCurrentUser(false);
      }
    };

    loadCurrentUser();
  }, []);

  const clearSession = () => {
    localStorage.removeItem("accessToken");
    setCurrentUser(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearSession();
    }
  };

  return (
    <SiteLayout currentUser={currentUser} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/abandoned-pets" element={<AbandonedPetListPage />} />
        <Route
          path="/abandoned-pets/:abandonedPetId"
          element={<AbandonedPetDetailPage />}
        />
        <Route
          path="/abandoned-pets/:abandonedPetId/adopt"
          element={
            <ProtectedRoute
              currentUser={currentUser}
              isCheckingCurrentUser={isCheckingCurrentUser}
            >
              <AdoptionCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adoptions/history"
          element={
            <ProtectedRoute
              currentUser={currentUser}
              isCheckingCurrentUser={isCheckingCurrentUser}
            >
              <AdoptionHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adoptions/:adoptionId"
          element={
            <ProtectedRoute
              currentUser={currentUser}
              isCheckingCurrentUser={isCheckingCurrentUser}
            >
              <AdoptionDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="/services" element={<ServiceListPage />} />
        <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
        <Route
          path="/services/:serviceId/book"
          element={
            <ProtectedRoute
              currentUser={currentUser}
              isCheckingCurrentUser={isCheckingCurrentUser}
            >
              <BookingCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings/:bookingId/payment"
          element={
            <ProtectedRoute
              currentUser={currentUser}
              isCheckingCurrentUser={isCheckingCurrentUser}
            >
              <PaymentPage paymentType="booking" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings/history"
          element={
            <ProtectedRoute
              currentUser={currentUser}
              isCheckingCurrentUser={isCheckingCurrentUser}
            >
              <BookingHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings/:bookingId"
          element={
            <ProtectedRoute
              currentUser={currentUser}
              isCheckingCurrentUser={isCheckingCurrentUser}
            >
              <BookingDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
        <Route
          path="/products/:productId/order"
          element={
            <ProtectedRoute
              currentUser={currentUser}
              isCheckingCurrentUser={isCheckingCurrentUser}
            >
              <OrderCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:orderId/payment"
          element={
            <ProtectedRoute
              currentUser={currentUser}
              isCheckingCurrentUser={isCheckingCurrentUser}
            >
              <PaymentPage paymentType="order" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/history"
          element={
            <ProtectedRoute
              currentUser={currentUser}
              isCheckingCurrentUser={isCheckingCurrentUser}
            >
              <OrderHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:orderId"
          element={
            <ProtectedRoute
              currentUser={currentUser}
              isCheckingCurrentUser={isCheckingCurrentUser}
            >
              <OrderDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            currentUser ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage onLoginSuccess={setCurrentUser} />
            )
          }
        />
        <Route
          path="/register"
          element={currentUser ? <Navigate to="/" replace /> : <RegisterPage />}
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              currentUser={currentUser}
              isCheckingCurrentUser={isCheckingCurrentUser}
            >
              <ProfilePage
                currentUser={currentUser}
                onProfileUpdate={setCurrentUser}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute
              currentUser={currentUser}
              isCheckingCurrentUser={isCheckingCurrentUser}
            >
              <ChangePasswordPage onClearSession={clearSession} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteLayout>
  );
};

export default App;

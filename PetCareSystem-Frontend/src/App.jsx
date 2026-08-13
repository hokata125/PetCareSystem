import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import SiteLayout from "./layouts/SiteLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ChangePasswordPage from "./pages/change-password/ChangePasswordPage";
import HomePage from "./pages/home/HomePage";
import ProfilePage from "./pages/profile/ProfilePage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { getCurrentUser } from "./services/auth";

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

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setCurrentUser(null);
  };

  return (
    <SiteLayout currentUser={currentUser} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={setCurrentUser} />}
        />
        <Route path="/register" element={<RegisterPage />} />
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
              <ChangePasswordPage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteLayout>
  );
};

export default App;

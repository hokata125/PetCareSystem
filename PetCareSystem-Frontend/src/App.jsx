import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import SiteLayout from "./layouts/SiteLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/home/HomePage";
import ProfilePage from "./pages/profile/ProfilePage";
import { getCurrentUser } from "./services/auth";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      return;
    }

    const loadCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch {
        localStorage.removeItem("accessToken");
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
          element={<ProfilePage currentUser={currentUser} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteLayout>
  );
};

export default App;

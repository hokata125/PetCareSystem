import { Navigate } from "react-router";

const ProtectedRoute = ({ currentUser, isCheckingCurrentUser, children }) => {
  if (isCheckingCurrentUser) return null;

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

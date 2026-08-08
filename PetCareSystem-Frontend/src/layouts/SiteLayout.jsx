import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";

const SiteLayout = ({ children, currentUser, onLogout }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header currentUser={currentUser} onLogout={onLogout} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default SiteLayout;

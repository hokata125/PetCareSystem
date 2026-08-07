import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";

const SiteLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default SiteLayout;

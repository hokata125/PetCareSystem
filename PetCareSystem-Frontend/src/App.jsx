import SiteLayout from "./layouts/SiteLayout";
import RegisterPage from "./pages/auth/RegisterPage";

const App = () => {
  return (
    <SiteLayout>
      <RegisterPage />
    </SiteLayout>
  );
};

export default App;

import { NavLink } from "react-router";
import petCareLogo from "../../assets/images/pet-care-logo.png";

const Header = () => {
  return (
    <header className="flex h-32 items-center bg-white px-10 font-sans xl:h-36 xl:px-12 2xl:h-40 2xl:px-14 3xl:h-48 3xl:px-16">
      <img
        src={petCareLogo}
        alt="OU-Pet Center"
        className="block h-auto w-52 shrink-0 xl:w-56 2xl:w-64 3xl:w-72"
      />

      <nav
        aria-label="Điều hướng chính"
        className="ml-12 flex flex-1 items-center xl:ml-14 2xl:ml-16 3xl:ml-20"
      >
        <div className="mr-6 grid flex-1 grid-cols-5 items-center xl:mr-7 2xl:mr-8 3xl:mr-10">
          <NavLink
            to="/"
            className="text-navigation w-full cursor-pointer whitespace-nowrap px-2 py-3 text-center leading-none font-extrabold text-brand-primary no-underline decoration-2 underline-offset-8 transition-colors duration-200 hover:text-brand-secondary-hover hover:underline"
          >
            TRANG CHỦ
          </NavLink>
          <span className="text-navigation w-full cursor-pointer whitespace-nowrap px-2 py-3 text-center leading-none font-extrabold text-brand-primary decoration-2 underline-offset-8 transition-colors duration-200 hover:text-brand-secondary-hover hover:underline">
            DỊCH VỤ
          </span>
          <span className="text-navigation w-full cursor-pointer whitespace-nowrap px-2 py-3 text-center leading-none font-extrabold text-brand-primary decoration-2 underline-offset-8 transition-colors duration-200 hover:text-brand-secondary-hover hover:underline">
            SẢN PHẨM
          </span>
          <span className="text-navigation w-full cursor-pointer whitespace-nowrap px-2 py-3 text-center leading-none font-extrabold text-brand-primary decoration-2 underline-offset-8 transition-colors duration-200 hover:text-brand-secondary-hover hover:underline">
            NHẬN NUÔI
          </span>
          <span className="text-navigation w-full cursor-pointer whitespace-nowrap px-2 py-3 text-center leading-none font-extrabold text-brand-primary decoration-2 underline-offset-8 transition-colors duration-200 hover:text-brand-secondary-hover hover:underline">
            GIỚI THIỆU
          </span>
        </div>

        <div className="flex gap-5 xl:gap-6 3xl:gap-7">
          <NavLink
            to="/login"
            className={`${authButtonClasses} bg-brand-primary text-white hover:bg-brand-primary-hover`}
          >
            <span className="font-bold">ĐĂNG NHẬP</span>
          </NavLink>
          <NavLink
            to="/register"
            className={`${authButtonClasses} bg-brand-secondary text-brand-primary hover:bg-brand-secondary-hover`}
          >
            <span className="font-bold">ĐĂNG KÝ</span>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

const authButtonClasses =
  "text-navigation inline-flex h-12 w-36 shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg no-underline transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary xl:h-14 xl:w-40 3xl:h-16 3xl:w-48";

export default Header;

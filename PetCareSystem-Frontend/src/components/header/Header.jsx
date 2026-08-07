import petCareLogo from "../../assets/images/pet-care-logo.png";

const navigationItems = [
  "TRANG CHỦ",
  "DỊCH VỤ",
  "SẢN PHẨM",
  "NHẬN NUÔI",
  "GIỚI THIỆU",
];

const Header = () => {
  return (
    <header className="flex h-[clamp(126px,10.42vw,200px)] items-center bg-white px-[clamp(40px,3.65vw,70px)]">
      <img
        src={petCareLogo}
        alt="OU-Pet Center"
        className="block h-auto w-[clamp(205px,16vw,307px)] shrink-0"
      />

      <nav
        aria-label="Điều hướng chính"
        className="ml-[clamp(48px,4vw,77px)] flex flex-1 items-center"
      >
        <div className="mr-[clamp(24px,2vw,38px)] grid flex-1 grid-cols-5 items-center">
          {navigationItems.map((item) => (
            <button
              key={item}
              type="button"
              className="w-full cursor-pointer whitespace-nowrap p-0 text-center text-[clamp(16px,1.25vw,24px)] leading-none font-[900] text-[#155383] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#155383]"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex gap-[clamp(20px,1.5vw,29px)]">
          <button
            type="button"
            aria-current="page"
            className={`${authButtonClasses} bg-[#155383] text-white`}
          >
            ĐĂNG NHẬP
          </button>
          <button
            type="button"
            className={`${authButtonClasses} bg-[#91d0df] text-[#155383]`}
          >
            ĐĂNG KÝ
          </button>
        </div>
      </nav>
    </header>
  );
};

const authButtonClasses =
  "h-[clamp(50px,3.65vw,70px)] w-[clamp(136px,10.42vw,200px)] shrink-0 cursor-pointer whitespace-nowrap rounded-[10px] text-[clamp(16px,1.25vw,24px)] font-[900] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#155383]";

export default Header;

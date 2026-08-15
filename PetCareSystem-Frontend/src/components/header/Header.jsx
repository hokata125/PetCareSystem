import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { NavLink } from "react-router";
import petCareLogo from "../../assets/images/pet-care-logo.png";

const Header = ({ currentUser, onLogout }) => {
  return (
    <header className="sticky top-0 z-50 flex h-20 items-center bg-white px-10 font-sans xl:h-24 xl:px-12 2xl:h-28 2xl:px-14 3xl:h-36 3xl:px-16">
      <img
        src={petCareLogo}
        alt="OU-Pet Center"
        className="block h-auto w-52 shrink-0 xl:w-56 2xl:w-64 3xl:w-72"
      />

      <nav className="ml-12 flex flex-1 items-center xl:ml-14 2xl:ml-16 3xl:ml-20">
        <div className="mr-6 grid flex-1 grid-cols-5 items-center xl:mr-7 2xl:mr-8 3xl:mr-10">
          <NavLink
            to="/"
            className="text-navigation w-full cursor-pointer whitespace-nowrap px-2 py-3 text-center leading-none font-extrabold text-brand-primary no-underline decoration-2 underline-offset-8 transition-colors duration-200 hover:text-brand-secondary-hover hover:underline"
          >
            TRANG CHỦ
          </NavLink>
          <NavLink
            to="/services"
            className="text-navigation w-full cursor-pointer whitespace-nowrap px-2 py-3 text-center leading-none font-extrabold text-brand-primary no-underline decoration-2 underline-offset-8 transition-colors duration-200 hover:text-brand-secondary-hover hover:underline"
          >
            DỊCH VỤ
          </NavLink>
          <NavLink
            to="/products"
            className="text-navigation w-full cursor-pointer whitespace-nowrap px-2 py-3 text-center leading-none font-extrabold text-brand-primary no-underline decoration-2 underline-offset-8 transition-colors duration-200 hover:text-brand-secondary-hover hover:underline"
          >
            SẢN PHẨM
          </NavLink>
          <NavLink
            to="/abandoned-pets"
            className="text-navigation w-full cursor-pointer whitespace-nowrap px-2 py-3 text-center leading-none font-extrabold text-brand-primary no-underline decoration-2 underline-offset-8 transition-colors duration-200 hover:text-brand-secondary-hover hover:underline"
          >
            NHẬN NUÔI
          </NavLink>
          <span className="text-navigation w-full cursor-pointer whitespace-nowrap px-2 py-3 text-center leading-none font-extrabold text-brand-primary decoration-2 underline-offset-8 transition-colors duration-200 hover:text-brand-secondary-hover hover:underline">
            GIỚI THIỆU
          </span>
        </div>

        <div className="flex gap-5 xl:gap-6 3xl:gap-7">
          {currentUser ? (
            <Menu>
              <MenuButton className="inline-flex h-12 w-72 cursor-pointer items-center justify-between rounded-lg border-0 bg-brand-primary px-4 text-base font-extrabold text-white outline-none transition-colors duration-200 hover:bg-brand-secondary hover:text-brand-primary data-active:rounded-b-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary xl:h-14 xl:w-80 xl:text-lg 3xl:h-16 3xl:w-96 3xl:text-xl">
                <span className="truncate">
                  Xin chào, {currentUser.username}!
                </span>
                <span>▼</span>
              </MenuButton>

              <MenuItems
                anchor="bottom end"
                className="z-50 w-(--button-width) overflow-hidden rounded-b-lg bg-brand-primary py-1 text-base font-extrabold text-white shadow-lg outline-none [--anchor-gap:0px] xl:text-lg 3xl:text-xl"
              >
                <MenuItem>
                  <NavLink
                    to="/profile"
                    className={`${userMenuItemClasses} no-underline`}
                  >
                    Hồ sơ
                  </NavLink>
                </MenuItem>
                <MenuItem>
                  <button type="button" className={userMenuItemClasses}>
                    Lịch sử đặt lịch
                  </button>
                </MenuItem>
                <MenuItem>
                  <button type="button" className={userMenuItemClasses}>
                    Lịch sử đặt hàng
                  </button>
                </MenuItem>
                <MenuItem>
                  <button type="button" className={userMenuItemClasses}>
                    Lịch sử nhận nuôi
                  </button>
                </MenuItem>
                <MenuItem>
                  <NavLink
                    to="/change-password"
                    className={`${userMenuItemClasses} no-underline`}
                  >
                    Thay đổi mật khẩu
                  </NavLink>
                </MenuItem>
                <MenuItem>
                  <button
                    type="button"
                    onClick={onLogout}
                    className={userMenuItemClasses}
                  >
                    Đăng xuất
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          ) : (
            <>
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
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

const authButtonClasses =
  "inline-flex h-12 w-36 shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg text-lg no-underline transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary xl:h-14 xl:w-40 3xl:h-16 3xl:w-48 3xl:text-xl";

const userMenuItemClasses =
  "block w-full cursor-pointer border-0 bg-brand-primary px-4 py-3 text-left text-white outline-none data-focus:bg-brand-secondary data-focus:text-brand-primary";

export default Header;

import petCareLogo from "../../assets/images/pet-care-logo.webp";

const Footer = () => {
  return (
    <footer className="flex min-h-64 items-center justify-center bg-[#eeeeee] px-10 xl:min-h-72 2xl:min-h-80 3xl:min-h-96">
      <div className="flex w-full max-w-screen-2xl items-center justify-center gap-14 xl:gap-16 3xl:gap-20">
        <div className="w-2/5 max-w-2xl shrink-0 overflow-hidden rounded-xl border-4 border-neutral-950">
          <img
            src={petCareLogo}
            alt="OU-Pet Center"
            className="block h-auto w-full"
          />
        </div>

        <address className="text-ui leading-tight whitespace-nowrap text-brand-primary not-italic">
          <span className="font-bold">Địa chỉ:</span>
          <br />
          CS1: 123 Đường ABC, Phường DEF, TP. HCM
          <br />
          CS2: 456 Đường DEF, Phường GHI, TP. HCM
          <br />
          <span className="font-bold">Hotline liên hệ:</span>
          <br />
          0123456789&nbsp;&nbsp; - &nbsp;&nbsp;0987654321&nbsp;&nbsp; -
          &nbsp;&nbsp;0135791113
          <br />
          <span className="font-bold">Email liên hệ: </span>
          ou-petcenter@ou.edu.vn
          <br />
          <span className="font-black">
            &copy; 2026 OU-PET CENTER. All rights reserved.
          </span>
        </address>
      </div>
    </footer>
  );
};

export default Footer;

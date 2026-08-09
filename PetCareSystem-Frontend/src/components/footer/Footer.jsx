import petCareLogo from "../../assets/images/pet-care-logo.png";

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

        <address className="text-ui leading-tight font-semibold whitespace-nowrap text-brand-primary not-italic">
          <span className="font-extrabold">Địa chỉ:</span>
          <br />
          CS1: ABC
          <br />
          CS2: DEF
          <br />
          <span className="font-extrabold">Hotline liên hệ:</span>
          <br />
          0123456789&nbsp;&nbsp; - &nbsp;&nbsp;0987654321&nbsp;&nbsp; -
          &nbsp;&nbsp;0135791113
        </address>
      </div>
    </footer>
  );
};

export default Footer;

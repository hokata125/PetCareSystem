import petCareLogo from "../../assets/images/pet-care-logo.png";

const Footer = () => {
  return (
    <footer className="flex min-h-[clamp(250px,19.27vw,370px)] items-center justify-center bg-white px-10">
      <div className="flex w-[min(76vw,1450px)] items-center justify-center gap-[clamp(55px,4vw,77px)]">
        <div className="w-[clamp(430px,33.85vw,650px)] shrink-0 rounded-[14px] border-4 border-[#111111] px-[clamp(18px,1.45vw,28px)] py-[clamp(16px,1.25vw,24px)]">
          <img
            src={petCareLogo}
            alt="OU-Pet Center"
            className="block h-auto w-full"
          />
        </div>

        <address className="text-[clamp(18px,1.45vw,28px)] leading-[1.22] font-[600] whitespace-nowrap text-[#155383] not-italic">
          <span className="font-[800]">Địa chỉ:</span>
          <br />
          CS1: ABC
          <br />
          CS2: DEF
          <br />
          <span className="font-[800]">Hotline liên hệ:</span>
          <br />
          0123456789&nbsp;&nbsp; - &nbsp;&nbsp;0987654321&nbsp;&nbsp; -
          &nbsp;&nbsp;0135791113
        </address>
      </div>
    </footer>
  );
};

export default Footer;

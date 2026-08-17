import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import pawsBackground from "../../assets/images/paws-bg.jpg";

const PaymentPage = ({ paymentType = "order" }) => {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const isOrderPayment = paymentType === "order";
  const transactionId = 1;
  const referenceId = 1;
  const transactionCode = isOrderPayment ? "ORDER1" : "BOOKING1";
  const amount = 100000;

  return (
    <section
      className="flex min-h-screen items-center justify-center bg-cover bg-center px-16 py-20"
      style={{ backgroundImage: `url(${pawsBackground})` }}
    >
      <div className="w-full max-w-4xl rounded-3xl border-4 border-neutral-950 bg-brand-primary px-12 py-12 text-white 2xl:max-w-5xl">
        <h1 className="m-0 text-center text-4xl leading-none font-extrabold 2xl:text-5xl">
          THÔNG TIN GIAO DỊCH
        </h1>

        <p className="mt-7 mb-0 text-xl leading-snug 2xl:text-2xl">
          *Vui lòng quét mã QR được hiển thị dưới đây để thanh toán.
          <br />
          (Giao dịch sẽ hết hạn sau 10 phút kể từ thời điểm xác nhận{" "}
          {isOrderPayment ? "đặt hàng" : "đặt lịch"})
        </p>

        <p className="mt-5 mb-0 text-center text-2xl font-extrabold text-yellow-300 2xl:text-3xl">
          Thời gian thanh toán còn lại: 10:00
        </p>

        <div className="mx-auto mt-6 flex size-80 items-center justify-center rounded-xl border-4 border-white bg-white 2xl:size-96">
          <span className="text-2xl font-bold text-brand-primary">
            MÃ QR THANH TOÁN
          </span>
        </div>

        <div className="mt-7 text-xl leading-relaxed 2xl:text-2xl">
          <p className="m-0">
            <span className="font-extrabold">Mã giao dịch:</span>{" "}
            {transactionId}
          </p>

          <p className="m-0">
            <span className="font-extrabold">
              {isOrderPayment ? "Mã đơn hàng:" : "Mã lịch đặt:"}
            </span>{" "}
            {referenceId}
          </p>

          <p className="m-0">
            <span className="font-extrabold">Mô tả:</span> {transactionCode}
          </p>

          <p className="m-0">
            <span className="font-extrabold">Số tiền:</span>{" "}
            {Number(amount).toLocaleString("en-US")} VNĐ
          </p>
        </div>

        <button
          type="button"
          className="mt-6 h-12 w-full cursor-pointer rounded-lg border-0 bg-brand-secondary text-xl font-extrabold text-brand-primary hover:bg-brand-secondary-hover 2xl:h-14 2xl:text-2xl"
        >
          TÔI XÁC NHẬN ĐÃ CHUYỂN KHOẢN
        </button>

        <button
          type="button"
          onClick={() => setIsCancelDialogOpen(true)}
          className="mt-5 h-12 w-full cursor-pointer rounded-lg border-0 bg-red-400 text-xl font-extrabold text-red-950 hover:bg-red-500 2xl:h-14 2xl:text-2xl"
        >
          {isOrderPayment ? "HỦY ĐẶT HÀNG" : "HỦY ĐẶT LỊCH"}
        </button>

        <div className="min-h-20 pt-5" />
      </div>

      <Dialog
        open={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/60" />

        <div className="fixed inset-0 flex items-center justify-center px-16 py-12">
          <DialogPanel className="w-full max-w-2xl rounded-3xl border-4 border-brand-primary bg-[#f9f9f9] px-12 py-10">
            <DialogTitle className="m-0 text-center text-3xl font-extrabold text-brand-primary 2xl:text-4xl">
              XÁC NHẬN HỦY
            </DialogTitle>

            <p className="mt-6 mb-0 text-center text-xl leading-relaxed font-medium text-neutral-900 2xl:text-2xl">
              Bạn chỉ nên hủy nếu chưa thực hiện chuyển khoản. Nếu đã chuyển
              khoản, thao tác này sẽ hủy{" "}
              {isOrderPayment ? "đơn hàng" : "lịch đặt"}, giao dịch thanh toán
              và sẽ không được hoàn tiền!
            </p>

            <button
              type="button"
              className="mt-8 h-12 w-full cursor-pointer rounded-lg border-0 bg-red-500 text-xl font-extrabold text-white hover:bg-red-600 2xl:h-14 2xl:text-2xl"
            >
              {isOrderPayment
                ? "TÔI XÁC NHẬN HỦY ĐƠN HÀNG"
                : "TÔI XÁC NHẬN HỦY LỊCH ĐẶT"}
            </button>

            <button
              type="button"
              onClick={() => setIsCancelDialogOpen(false)}
              className="mt-4 h-12 w-full cursor-pointer rounded-lg border-0 bg-brand-secondary text-xl font-extrabold text-brand-primary hover:bg-brand-secondary-hover 2xl:h-14 2xl:text-2xl"
            >
              QUAY LẠI
            </button>
          </DialogPanel>
        </div>
      </Dialog>
    </section>
  );
};

export default PaymentPage;

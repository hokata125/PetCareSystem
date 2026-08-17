import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import pawsBackground from "../../assets/images/paws-bg.jpg";
import {
  expireBookingPayment,
  expireOrderPayment,
  getBookingPayment,
  getOrderPayment,
} from "../../services/payments";

const PaymentPage = ({ paymentType = "order" }) => {
  const { orderId, bookingId } = useParams();
  const [paymentData, setPaymentData] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isOrderPayment = paymentType === "order";

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadPayment = async () => {
      setPaymentData(null);
      setErrorMessage("");

      try {
        const paymentResponse = isOrderPayment
          ? await getOrderPayment(orderId)
          : await getBookingPayment(bookingId);

        setPaymentData(paymentResponse);
      } catch (error) {
        const detail = error.response?.data?.detail;
        setErrorMessage(
          typeof detail === "string"
            ? detail
            : `Không thể tải thông tin thanh toán ${isOrderPayment ? "đơn hàng" : "lịch đặt"}.`,
        );
      }
    };

    loadPayment();
  }, [bookingId, isOrderPayment, orderId]);

  useEffect(() => {
    if (
      !paymentData ||
      paymentData.transaction.status !== "ĐANG CHỜ THANH TOÁN"
    ) {
      return;
    }

    const expiresAt = new Date(paymentData.transaction.expires_at).getTime();

    const updateRemainingTime = () => {
      const countdownSeconds = Math.max(
        0,
        Math.ceil((expiresAt - Date.now()) / 1000),
      );

      setRemainingSeconds(countdownSeconds);
    };

    updateRemainingTime();
    const countdownTimer = window.setInterval(updateRemainingTime, 1000);

    return () => window.clearInterval(countdownTimer);
  }, [paymentData]);

  useEffect(() => {
    if (
      remainingSeconds !== 0 ||
      paymentData?.transaction.status !== "ĐANG CHỜ THANH TOÁN"
    ) {
      return;
    }

    const expirePayment = async () => {
      try {
        const expiredTransaction = isOrderPayment
          ? await expireOrderPayment(orderId)
          : await expireBookingPayment(bookingId);

        setPaymentData({
          ...paymentData,
          transaction: expiredTransaction,
          qr_url: null,
        });
      } catch (error) {
        const detail = error.response?.data?.detail;
        setErrorMessage(
          typeof detail === "string"
            ? detail
            : "Không thể cập nhật trạng thái giao dịch đã hết hạn.",
        );
      }
    };

    expirePayment();
  }, [bookingId, isOrderPayment, orderId, paymentData, remainingSeconds]);

  if (errorMessage) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#f9f9f9] px-16 py-16">
        <div className="flex flex-col items-center gap-6 text-red-700">
          <CircleX size={96} />
          <span className="text-center text-4xl font-extrabold">
            {errorMessage}
          </span>
        </div>
      </section>
    );
  }

  if (!paymentData) return null;

  const transaction = paymentData.transaction;
  const qrUrl = paymentData.qr_url;
  const isPendingPayment = transaction.status === "ĐANG CHỜ THANH TOÁN";

  const minutes = Math.trunc((remainingSeconds ?? 0) / 60);
  const seconds = (remainingSeconds ?? 0) % 60;
  const formattedRemainingTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

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

        {isPendingPayment && (
          <p className="mt-5 mb-0 text-center text-2xl font-extrabold text-yellow-300 2xl:text-3xl">
            Thời gian thanh toán còn lại: {formattedRemainingTime}
          </p>
        )}

        <div className="mx-auto mt-6 flex size-80 items-center justify-center rounded-xl border-4 border-white bg-white 2xl:size-96">
          {qrUrl ? (
            <img
              src={qrUrl}
              alt="Mã QR thanh toán"
              className="size-full rounded-lg object-contain"
            />
          ) : (
            <span className="px-6 text-center text-2xl font-extrabold text-brand-primary">
              {transaction.status}
            </span>
          )}
        </div>

        <div className="mt-7 text-xl leading-relaxed 2xl:text-2xl">
          <p className="m-0">
            <span className="font-extrabold">Mã giao dịch:</span>{" "}
            {transaction.id}
          </p>

          <p className="m-0">
            <span className="font-extrabold">
              {isOrderPayment ? "Mã đơn hàng:" : "Mã lịch đặt:"}
            </span>{" "}
            {isOrderPayment ? transaction.order_id : transaction.booking_id}
          </p>

          <p className="m-0">
            <span className="font-extrabold">Mô tả:</span>{" "}
            {transaction.transaction_code}
          </p>

          <p className="m-0">
            <span className="font-extrabold">Số tiền:</span>{" "}
            {Number(transaction.amount).toLocaleString("en-US")} VNĐ
          </p>
        </div>

        {isPendingPayment && (
          <>
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
          </>
        )}

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
              {isOrderPayment ? "đơn hàng" : "lịch đặt"}, hủy giao dịch thanh
              toán và sẽ không được hoàn tiền!
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

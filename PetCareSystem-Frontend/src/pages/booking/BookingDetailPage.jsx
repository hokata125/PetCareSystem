import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router";
import pawsBackground from "../../assets/images/paws-background.webp";
import { cancelBooking, getMyBookingDetail } from "../../services/bookings";

const bookingStatusClasses = {
  "ĐANG CHỜ XÁC NHẬN": "text-amber-600",
  "ĐÃ XÁC NHẬN": "text-blue-600",
  "ĐANG SỬ DỤNG DỊCH VỤ": "text-purple-600",
  "ĐÃ HOÀN THÀNH": "text-green-600",
  "ĐÃ HỦY": "text-red-600",
};

const BookingDetailPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [bookingErrorMessage, setBookingErrorMessage] = useState("");
  const [bookingSuccessMessage, setBookingSuccessMessage] = useState("");

  useEffect(() => {
    const loadBookingDetail = async () => {
      setBooking(null);
      setErrorMessage("");

      try {
        const bookingDetailData = await getMyBookingDetail(bookingId);
        setBooking(bookingDetailData);
      } catch (error) {
        const detail = error.response?.data?.detail;
        setErrorMessage(
          typeof detail === "string"
            ? detail
            : "Không thể tải thông tin lịch đặt.",
        );
      }
    };

    loadBookingDetail();
  }, [bookingId]);

  const handleCancelBooking = async () => {
    setBookingErrorMessage("");
    setBookingSuccessMessage("");
    setIsSubmitting(true);

    try {
      const cancelledBooking = await cancelBooking(bookingId);
      setBooking(cancelledBooking);
      setIsCancelDialogOpen(false);
      setBookingSuccessMessage("Đã hủy lịch đặt thành công!");
    } catch (error) {
      const detail = error.response?.data?.detail;
      setIsCancelDialogOpen(false);
      setBookingErrorMessage(
        typeof detail === "string"
          ? detail
          : "Không thể hủy lịch đặt. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (!booking) return null;

  return (
    <section
      className="min-h-screen bg-cover bg-center px-16 py-20"
      style={{ backgroundImage: `url(${pawsBackground})` }}
    >
      <div className="mx-auto w-full max-w-screen-2xl overflow-hidden rounded-3xl border border-neutral-950 bg-[#f9f9f9] shadow-2xl">
        <div className="flex items-center justify-between gap-8 px-10 py-8">
          <h1 className="m-0 text-4xl leading-none font-extrabold text-brand-primary 2xl:text-5xl">
            CHI TIẾT LỊCH ĐẶT #{booking.id}
          </h1>

          {booking.booking_status === "ĐANG CHỜ XÁC NHẬN" &&
            (booking.payment_method === "ONLINE" ? (
              <NavLink
                to={`/bookings/${booking.id}/payment`}
                className="flex h-16 w-1/2 items-center justify-center rounded-2xl border border-neutral-950 bg-brand-secondary px-6 text-center text-2xl font-extrabold text-red-600 no-underline hover:bg-brand-secondary-hover 2xl:text-3xl"
              >
                XÁC NHẬN THANH TOÁN / HỦY LỊCH ĐẶT
              </NavLink>
            ) : (
              <button
                type="button"
                onClick={() => setIsCancelDialogOpen(true)}
                disabled={isSubmitting}
                className="flex h-16 w-1/2 cursor-pointer items-center justify-center rounded-2xl border border-neutral-950 bg-red-400 px-6 text-center text-2xl font-extrabold text-red-800 enabled:hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70 2xl:text-3xl"
              >
                HỦY LỊCH ĐẶT
              </button>
            ))}
        </div>

        {bookingErrorMessage && (
          <div className="mx-10 mb-10 rounded-xl bg-red-100 px-4 py-3 text-xl font-medium text-red-700">
            {bookingErrorMessage}
          </div>
        )}

        {bookingSuccessMessage && (
          <div className="mx-10 mb-10 rounded-xl bg-green-100 px-4 py-3 text-xl font-medium text-green-700">
            {bookingSuccessMessage}
          </div>
        )}

        <table className="w-full table-fixed border-collapse text-xl text-neutral-950 2xl:text-2xl">
          <thead>
            <tr className="h-20 border-y border-neutral-950">
              <th className="bg-brand-primary text-center font-extrabold text-white">
                DANH MỤC
              </th>
              <th className="bg-neutral-200 text-center font-extrabold text-brand-primary">
                THÔNG TIN
              </th>
            </tr>
          </thead>

          <tbody>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Mã lịch đặt
              </td>
              <td className="px-8">{booking.id}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Mã khách hàng
              </td>
              <td className="px-8">{booking.user_id}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Tên khách hàng
              </td>
              <td className="px-8">{booking.customer_full_name}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                SĐT khách hàng
              </td>
              <td className="px-8">{booking.customer_phone_number}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Địa chỉ khách hàng
              </td>
              <td className="px-8">{booking.customer_address}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Mã dịch vụ
              </td>
              <td className="px-8">{booking.service_id}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Tên dịch vụ
              </td>
              <td className="px-8">{booking.service_name}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Tên thú cưng
              </td>
              <td className="px-8">{booking.pet_name}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Loại thú cưng
              </td>
              <td className="px-8">{booking.pet_type}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Cân nặng thú cưng
              </td>
              <td className="px-8">
                {Number(booking.pet_weight).toLocaleString("vi-VN")} kg
              </td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Ghi chú
              </td>
              <td className="px-8 whitespace-pre-line">{booking.note || ""}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Thời gian bắt đầu
              </td>
              <td className="px-8">
                {new Date(booking.start_at).toLocaleString("vi-VN")}
              </td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Thời gian kết thúc
              </td>
              <td className="px-8">
                {new Date(booking.end_at).toLocaleString("vi-VN")}
              </td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Giá dịch vụ
              </td>
              <td className="px-8">
                {Number(booking.base_price).toLocaleString("vi-VN")} VNĐ
              </td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Thành tiền
              </td>
              <td className="px-8 font-bold">
                {Number(booking.final_price).toLocaleString("vi-VN")} VNĐ
              </td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Phương thức thanh toán
              </td>
              <td className="px-8">{booking.payment_method}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Trạng thái lịch đặt
              </td>
              <td
                className={`px-8 font-extrabold ${bookingStatusClasses[booking.booking_status]}`}
              >
                {booking.booking_status}
              </td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Ngày tạo lịch đặt
              </td>
              <td className="px-8">
                {new Date(booking.created_at).toLocaleString("vi-VN")}
              </td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Ngày cập nhật lịch đặt
              </td>
              <td className="px-8">
                {new Date(booking.updated_at).toLocaleString("vi-VN")}
              </td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Ngày hủy lịch đặt
              </td>
              <td className="px-8">
                {booking.cancelled_at
                  ? new Date(booking.cancelled_at).toLocaleString("vi-VN")
                  : ""}
              </td>
            </tr>
            <tr className="h-20">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Bị hủy bởi
              </td>
              <td className="px-8">{booking.cancelled_by || ""}</td>
            </tr>
          </tbody>
        </table>
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
              Bạn có chắc chắn muốn hủy lịch đặt này không? Thao tác này sẽ
              không thể hoàn tác và không được hoàn tiền.
            </p>

            <button
              type="button"
              onClick={handleCancelBooking}
              disabled={isSubmitting}
              className="mt-8 flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border-0 bg-red-400 text-xl font-extrabold text-red-800 enabled:hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70 2xl:h-14 2xl:text-2xl"
            >
              {isSubmitting ? (
                <span className="size-6 animate-spin rounded-full border-4 border-red-800/40 border-t-red-800 2xl:size-7" />
              ) : (
                "TÔI XÁC NHẬN HỦY LỊCH ĐẶT"
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsCancelDialogOpen(false)}
              disabled={isSubmitting}
              className="mt-4 h-12 w-full cursor-pointer rounded-lg border-0 bg-brand-secondary text-xl font-extrabold text-brand-primary enabled:hover:bg-brand-secondary-hover disabled:cursor-not-allowed disabled:opacity-70 2xl:h-14 2xl:text-2xl"
            >
              QUAY LẠI
            </button>
          </DialogPanel>
        </div>
      </Dialog>
    </section>
  );
};

export default BookingDetailPage;

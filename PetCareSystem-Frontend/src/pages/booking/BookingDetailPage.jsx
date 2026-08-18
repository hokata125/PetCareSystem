import { CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router";
import pawsBackground from "../../assets/images/paws-bg.jpg";
import { getMyBookingDetail } from "../../services/bookings";

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
  const [errorMessage, setErrorMessage] = useState("");

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

          {booking.booking_status === "ĐANG CHỜ XÁC NHẬN" && (
            <NavLink
              to={`/bookings/${booking.id}/payment`}
              className="flex h-16 w-1/2 items-center justify-center rounded-2xl border border-neutral-950 bg-brand-secondary px-6 text-center text-2xl font-extrabold text-red-600 no-underline hover:bg-brand-secondary-hover 2xl:text-3xl"
            >
              XÁC NHẬN THANH TOÁN / HỦY LỊCH ĐẶT
            </NavLink>
          )}
        </div>

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
    </section>
  );
};

export default BookingDetailPage;

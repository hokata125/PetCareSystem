import { useEffect, useState } from "react";
import pawsBackground from "../../assets/images/paws-bg.jpg";
import { getMyBookings } from "../../services/bookings";

const PAGE_SIZE = 5;

const bookingStatusClasses = {
  "ĐANG CHỜ XÁC NHẬN": "text-amber-600",
  "ĐÃ XÁC NHẬN": "text-blue-600",
  "ĐANG SỬ DỤNG DỊCH VỤ": "text-purple-600",
  "ĐÃ HOÀN THÀNH": "text-green-600",
  "ĐÃ HỦY": "text-red-600",
};

const BookingHistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const bookingData = await getMyBookings({
          skip: currentPage * PAGE_SIZE,
          limit: PAGE_SIZE + 1,
        });

        setBookings(bookingData.slice(0, PAGE_SIZE));
        setHasNextPage(bookingData.length > PAGE_SIZE);
      } catch {
        setBookings([]);
        setHasNextPage(false);
        setErrorMessage("Không thể tải lịch sử đặt lịch.");
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, [currentPage]);

  return (
    <section
      className="min-h-screen bg-cover bg-center px-16 py-20"
      style={{ backgroundImage: `url(${pawsBackground})` }}
    >
      <div className="mx-auto w-full max-w-screen-2xl overflow-hidden rounded-3xl border border-neutral-950 bg-[#f9f9f9] shadow-2xl">
        <h1 className="m-0 bg-brand-primary px-5 py-6 text-2xl leading-none font-extrabold text-white 2xl:text-3xl">
          LỊCH SỬ ĐẶT LỊCH
        </h1>

        {isLoading && (
          <div className="mx-6 my-6 rounded-xl bg-blue-100 px-4 py-3 text-xl font-medium text-blue-700">
            Đang tải lịch sử đặt lịch...
          </div>
        )}

        {errorMessage && (
          <div className="mx-6 my-6 rounded-xl bg-red-100 px-4 py-3 text-xl font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && (
          <>
            <table className="w-full table-fixed border-collapse text-xs text-neutral-950 2xl:text-sm">
              <thead className="bg-neutral-200">
                <tr className="h-16 border-b border-neutral-950">
                  <th className="px-2 text-center font-extrabold">
                    Mã lịch đặt
                  </th>
                  <th className="px-2 text-center font-extrabold">
                    Ngày đặt lịch
                  </th>
                  <th className="px-2 text-center font-extrabold">
                    Tên dịch vụ
                  </th>
                  <th className="px-2 text-center font-extrabold">
                    Tên thú cưng
                  </th>
                  <th className="px-2 text-center font-extrabold">
                    Loại thú cưng
                  </th>
                  <th className="px-2 text-center font-extrabold">Cân nặng</th>
                  <th className="px-2 text-center font-extrabold">Bắt đầu</th>
                  <th className="px-2 text-center font-extrabold">Kết thúc</th>
                  <th className="px-2 text-center font-extrabold">
                    Giá dịch vụ
                  </th>
                  <th className="px-2 text-center font-extrabold">
                    Thành tiền
                  </th>
                  <th className="px-2 text-center font-extrabold">
                    Thanh toán
                  </th>
                  <th className="px-2 text-center font-extrabold">
                    Trạng thái
                  </th>
                </tr>
              </thead>

              <tbody>
                {bookings.length === 0 ? (
                  <tr className="h-120 border-b border-neutral-950">
                    <td
                      colSpan={12}
                      className="text-center text-xl font-bold text-neutral-700"
                    >
                      Bạn chưa có lịch đặt nào.
                    </td>
                  </tr>
                ) : (
                  <>
                    {bookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="h-24 border-b border-neutral-950"
                      >
                        <td className="px-2 text-center font-bold">
                          #{booking.id}
                        </td>
                        <td className="px-2 text-center">
                          {new Date(booking.created_at).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-2 text-center">
                          <span className="line-clamp-2">
                            {booking.service_name}
                          </span>
                        </td>
                        <td className="px-2 text-center">
                          <span className="line-clamp-2">
                            {booking.pet_name}
                          </span>
                        </td>
                        <td className="px-2 text-center">
                          <span className="line-clamp-2">
                            {booking.pet_type}
                          </span>
                        </td>
                        <td className="px-2 text-center">
                          {Number(booking.pet_weight).toLocaleString("vi-VN")}{" "}
                          kg
                        </td>
                        <td className="px-2 text-center">
                          {new Date(booking.start_at).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-2 text-center">
                          {new Date(booking.end_at).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-2 text-center">
                          {Number(booking.base_price).toLocaleString("vi-VN")}{" "}
                          VNĐ
                        </td>
                        <td className="px-2 text-center font-bold">
                          {Number(booking.final_price).toLocaleString("vi-VN")}{" "}
                          VNĐ
                        </td>
                        <td className="px-2 text-center">
                          {booking.payment_method}
                        </td>
                        <td
                          className={`px-2 text-center font-extrabold ${bookingStatusClasses[booking.booking_status]}`}
                        >
                          <span className="line-clamp-2">
                            {booking.booking_status}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {Array.from({ length: PAGE_SIZE - bookings.length }).map(
                      (_, emptyRowIndex) => (
                        <tr
                          key={emptyRowIndex}
                          className="h-24 border-b border-neutral-950"
                        >
                          <td colSpan={12} />
                        </tr>
                      ),
                    )}
                  </>
                )}
              </tbody>
            </table>

            <div className="flex justify-end gap-4 px-6 py-8">
              <button
                type="button"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="h-14 w-48 cursor-pointer rounded-xl border-0 bg-brand-secondary text-xl font-extrabold text-brand-primary enabled:hover:bg-brand-secondary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                &lt; Trang trước
              </button>
              <button
                type="button"
                disabled={!hasNextPage}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="h-14 w-48 cursor-pointer rounded-xl border-0 bg-brand-secondary text-xl font-extrabold text-brand-primary enabled:hover:bg-brand-secondary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                Trang sau &gt;
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default BookingHistoryPage;

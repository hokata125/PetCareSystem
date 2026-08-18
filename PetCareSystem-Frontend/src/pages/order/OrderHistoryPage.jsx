import { useEffect, useState } from "react";
import pawsBackground from "../../assets/images/paws-bg.jpg";
import { getMyOrders } from "../../services/orders";

const PAGE_SIZE = 5;

const orderStatusClasses = {
  "ĐANG CHỜ XÁC NHẬN": "text-amber-600",
  "ĐÃ XÁC NHẬN": "text-blue-600",
  "ĐANG GIAO HÀNG": "text-purple-600",
  "ĐÃ HOÀN THÀNH": "text-green-600",
  "ĐÃ HỦY": "text-red-600",
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const orderData = await getMyOrders({
          skip: currentPage * PAGE_SIZE,
          limit: PAGE_SIZE + 1,
        });

        setOrders(orderData.slice(0, PAGE_SIZE));
        setHasNextPage(orderData.length > PAGE_SIZE);
      } catch {
        setOrders([]);
        setHasNextPage(false);
        setErrorMessage("Không thể tải lịch sử đặt hàng.");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [currentPage]);

  return (
    <section
      className="min-h-screen bg-cover bg-center px-16 py-20"
      style={{ backgroundImage: `url(${pawsBackground})` }}
    >
      <div className="mx-auto w-full max-w-screen-2xl overflow-hidden rounded-3xl border border-neutral-950 bg-[#f9f9f9] shadow-xl">
        <h1 className="m-0 bg-brand-primary px-5 py-6 text-2xl leading-none font-extrabold text-white 2xl:text-3xl">
          LỊCH SỬ ĐẶT HÀNG
        </h1>

        {isLoading && (
          <div className="mx-6 my-6 rounded-xl bg-blue-100 px-4 py-3 text-xl font-medium text-blue-700">
            Đang tải lịch sử đặt hàng...
          </div>
        )}

        {errorMessage && (
          <div className="mx-6 my-6 rounded-xl bg-red-100 px-4 py-3 text-xl font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && (
          <>
            <table className="w-full table-fixed border-collapse text-left text-sm text-neutral-950 2xl:text-base">
              <thead className="bg-neutral-200">
                <tr className="h-16 border-b border-neutral-950">
                  <th className="px-4 text-center font-extrabold">
                    Mã đơn hàng
                  </th>
                  <th className="px-4 text-center font-extrabold">
                    Ngày đặt hàng
                  </th>
                  <th className="px-4 text-center font-extrabold">
                    Tên sản phẩm
                  </th>
                  <th className="px-4 text-center font-extrabold">Số lượng</th>
                  <th className="px-4 text-center font-extrabold">Đơn giá</th>
                  <th className="px-4 text-center font-extrabold">Tổng tiền</th>
                  <th className="px-4 text-center font-extrabold">Địa chỉ</th>
                  <th className="px-4 text-center font-extrabold">
                    Thanh toán
                  </th>
                  <th className="px-4 text-center font-extrabold">
                    Trạng thái
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.length === 0 ? (
                  <tr className="h-120 border-b border-neutral-950">
                    <td
                      colSpan={9}
                      className="text-center text-xl font-bold text-neutral-700"
                    >
                      Bạn chưa có đơn hàng nào.
                    </td>
                  </tr>
                ) : (
                  <>
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="h-24 border-b border-neutral-950"
                      >
                        <td className="px-4 text-center font-bold">
                          #{order.id}
                        </td>
                        <td className="px-4 text-center">
                          {new Date(order.created_at).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-4 text-center">
                          <span className="line-clamp-2">
                            {order.product_name}
                          </span>
                        </td>
                        <td className="px-4 text-center">{order.quantity}</td>
                        <td className="px-4 text-center">
                          {Number(order.unit_price).toLocaleString("vi-VN")} VNĐ
                        </td>
                        <td className="px-4 text-center font-bold">
                          {Number(order.total_price).toLocaleString("vi-VN")}{" "}
                          VNĐ
                        </td>
                        <td className="px-4 text-center">
                          <span className="line-clamp-2">
                            {order.receiver_address}
                          </span>
                        </td>
                        <td className="px-4 text-center">
                          {order.payment_method}
                        </td>
                        <td
                          className={`px-4 text-center font-extrabold ${orderStatusClasses[order.order_status]}`}
                        >
                          <span className="line-clamp-2">
                            {order.order_status}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {Array.from({ length: PAGE_SIZE - orders.length }).map(
                      (_, emptyRowIndex) => (
                        <tr
                          key={emptyRowIndex}
                          className="h-24 border-b border-neutral-950"
                        >
                          <td colSpan={9} />
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

export default OrderHistoryPage;

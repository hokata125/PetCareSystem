import { CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router";
import pawsBackground from "../../assets/images/paws-background.webp";
import { getMyOrderDetail } from "../../services/orders";

const orderStatusClasses = {
  "ĐANG CHỜ XÁC NHẬN": "text-amber-600",
  "ĐÃ XÁC NHẬN": "text-blue-600",
  "ĐANG GIAO HÀNG": "text-purple-600",
  "ĐÃ HOÀN THÀNH": "text-green-600",
  "ĐÃ HỦY": "text-red-600",
};

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadOrderDetail = async () => {
      setOrder(null);
      setErrorMessage("");

      try {
        const orderDetailData = await getMyOrderDetail(orderId);
        setOrder(orderDetailData);
      } catch (error) {
        const detail = error.response?.data?.detail;
        setErrorMessage(
          typeof detail === "string"
            ? detail
            : "Không thể tải thông tin đơn hàng.",
        );
      }
    };

    loadOrderDetail();
  }, [orderId]);

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

  if (!order) return null;

  return (
    <section
      className="min-h-screen bg-cover bg-center px-16 py-20"
      style={{ backgroundImage: `url(${pawsBackground})` }}
    >
      <div className="mx-auto w-full max-w-screen-2xl overflow-hidden rounded-3xl border border-neutral-950 bg-[#f9f9f9] shadow-2xl">
        <div className="flex items-center justify-between gap-8 px-10 py-8">
          <h1 className="m-0 text-4xl leading-none font-extrabold text-brand-primary 2xl:text-5xl">
            CHI TIẾT ĐƠN ĐẶT HÀNG #{order.id}
          </h1>

          {order.order_status === "ĐANG CHỜ XÁC NHẬN" && (
            <NavLink
              to={`/orders/${order.id}/payment`}
              className="flex h-16 w-1/2 items-center justify-center rounded-2xl border border-neutral-950 bg-brand-secondary px-6 text-center text-2xl font-extrabold text-red-600 no-underline hover:bg-brand-secondary-hover 2xl:text-3xl"
            >
              XÁC NHẬN THANH TOÁN / HỦY ĐƠN HÀNG
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
                Mã đơn hàng
              </td>
              <td className="px-8">{order.id}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Mã khách hàng
              </td>
              <td className="px-8">{order.user_id}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Tên người nhận
              </td>
              <td className="px-8">{order.receiver_full_name}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                SĐT người nhận
              </td>
              <td className="px-8">{order.receiver_phone_number}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Địa chỉ người nhận
              </td>
              <td className="px-8">{order.receiver_address}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Mã sản phẩm
              </td>
              <td className="px-8">{order.product_id}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Tên sản phẩm
              </td>
              <td className="px-8">{order.product_name}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Ghi chú
              </td>
              <td className="px-8 whitespace-pre-line">{order.note || ""}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Số lượng mua
              </td>
              <td className="px-8">{order.quantity}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Đơn giá sản phẩm
              </td>
              <td className="px-8">
                {Number(order.unit_price).toLocaleString("vi-VN")} VNĐ
              </td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Tổng tiền trả
              </td>
              <td className="px-8 font-bold">
                {Number(order.total_price).toLocaleString("vi-VN")} VNĐ
              </td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Phương thức thanh toán
              </td>
              <td className="px-8">{order.payment_method}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Trạng thái đơn hàng
              </td>
              <td
                className={`px-8 font-extrabold ${orderStatusClasses[order.order_status]}`}
              >
                {order.order_status}
              </td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Ngày tạo đơn hàng
              </td>
              <td className="px-8">
                {new Date(order.created_at).toLocaleString("vi-VN")}
              </td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Ngày cập nhật đơn hàng
              </td>
              <td className="px-8">
                {new Date(order.updated_at).toLocaleString("vi-VN")}
              </td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Ngày hủy đơn hàng
              </td>
              <td className="px-8">
                {order.cancelled_at
                  ? new Date(order.cancelled_at).toLocaleString("vi-VN")
                  : ""}
              </td>
            </tr>
            <tr className="h-20">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Bị hủy bởi
              </td>
              <td className="px-8">{order.cancelled_by || ""}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default OrderDetailPage;

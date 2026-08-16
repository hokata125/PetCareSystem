import { CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import pawsBackground from "../../assets/images/paws-bg.jpg";
import { getProductDetail } from "../../services/products";

const OrderCreatePage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadProductDetail = async () => {
      setProduct(null);
      setQuantity(1);
      setErrorMessage("");

      try {
        const productDetailData = await getProductDetail(productId);
        setProduct(productDetailData);
      } catch (error) {
        const detail = error.response?.data?.detail;
        setErrorMessage(
          typeof detail === "string"
            ? detail
            : "Không thể tải thông tin sản phẩm.",
        );
      }
    };

    loadProductDetail();
  }, [productId]);

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

  if (!product) return null;

  return (
    <section
      className="flex min-h-screen items-center justify-center bg-cover bg-center px-16 py-20"
      style={{ backgroundImage: `url(${pawsBackground})` }}
    >
      <form className="w-full max-w-4xl rounded-3xl border-4 border-brand-primary bg-[#f9f9f9] px-16 py-14 2xl:max-w-5xl">
        <h1 className="m-0 text-center text-4xl leading-none font-extrabold text-brand-primary 2xl:text-5xl">
          THÔNG TIN ĐƠN ĐẶT HÀNG
        </h1>

        <h2 className="mt-5 mb-0 text-center text-3xl leading-none font-extrabold text-emerald-700 2xl:text-4xl">
          MÃ SẢN PHẨM: #{product.id}
        </h2>

        <div className="mt-10 text-xl text-neutral-950 2xl:text-2xl">
          <p className="m-0">
            <span className="font-bold">Tên sản phẩm:</span> {product.name}
          </p>

          <p className="mt-5 mb-0">
            <span className="font-bold">Đơn giá:</span>{" "}
            {Number(product.price).toLocaleString("en-US")} VNĐ
          </p>
        </div>

        <div className="mt-8 grid grid-cols-5 gap-5">
          <div className="col-span-4 flex flex-col gap-2">
            <label
              htmlFor="receiver_address"
              className="text-xl font-bold text-neutral-950 2xl:text-2xl"
            >
              Địa chỉ nhận hàng (để trống nếu lấy địa chỉ mặc định)
            </label>

            <input
              id="receiver_address"
              name="receiver_address"
              type="text"
              placeholder="Nhập địa chỉ nhận hàng..."
              className="h-14 w-full rounded-xl border border-neutral-700 bg-white px-4 text-xl text-neutral-700 outline-none placeholder:text-neutral-500 2xl:text-2xl"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="order_quantity"
              className="text-xl font-bold text-neutral-950 2xl:text-2xl"
            >
              Số lượng
            </label>

            <input
              id="order_quantity"
              name="order_quantity"
              type="number"
              min="1"
              max={product.stock_quantity}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="h-14 w-full rounded-xl border border-neutral-700 bg-white px-4 text-xl text-neutral-700 outline-none 2xl:text-2xl"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <label
            htmlFor="order_note"
            className="text-xl font-bold text-neutral-950 2xl:text-2xl"
          >
            Ghi chú (nếu có)
          </label>

          <textarea
            id="order_note"
            name="order_note"
            placeholder="Nhập ghi chú của bạn..."
            className="h-28 w-full resize-none rounded-xl border border-neutral-700 bg-white px-4 py-3 text-xl text-neutral-700 outline-none placeholder:text-neutral-500 2xl:text-2xl"
          />
        </div>

        <p className="mt-6 mb-0 text-3xl font-extrabold text-emerald-700 2xl:text-4xl">
          Tổng tiền: {Number(product.price * quantity).toLocaleString("en-US")}{" "}
          VNĐ
        </p>

        <button
          type="button"
          className="mt-6 flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border-0 bg-brand-primary text-xl font-extrabold text-white hover:bg-brand-primary-hover 2xl:h-14 2xl:text-2xl"
        >
          XÁC NHẬN ĐẶT HÀNG
        </button>

        <div className="min-h-20" />
      </form>
    </section>
  );
};

export default OrderCreatePage;

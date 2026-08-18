import pawsBackground from "../../assets/images/paws-bg.jpg";

const OrderHistoryPage = () => {
  return (
    <section
      className="min-h-screen bg-cover bg-center px-16 py-20"
      style={{ backgroundImage: `url(${pawsBackground})` }}
    >
      <div className="mx-auto w-full max-w-screen-2xl overflow-hidden rounded-3xl border border-neutral-950 bg-[#f9f9f9] shadow-xl">
        <h1 className="m-0 px-12 py-12 text-4xl leading-none font-extrabold text-brand-primary 2xl:text-5xl">
          LỊCH SỬ ĐẶT HÀNG
        </h1>

        <table className="w-full border-collapse text-left text-base text-neutral-950 2xl:text-lg">
          <thead className="bg-neutral-200">
            <tr className="h-20 border-y border-neutral-950">
              <th className="px-4 font-extrabold whitespace-nowrap">
                Mã đơn hàng
              </th>
              <th className="px-4 font-extrabold whitespace-nowrap">
                Ngày đặt hàng
              </th>
              <th className="px-4 font-extrabold whitespace-nowrap">
                Tên sản phẩm
              </th>
              <th className="px-4 font-extrabold whitespace-nowrap">SL</th>
              <th className="px-4 font-extrabold whitespace-nowrap">
                Đơn giá
              </th>
              <th className="px-4 font-extrabold whitespace-nowrap">
                Tổng tiền
              </th>
              <th className="px-4 font-extrabold whitespace-nowrap">
                Địa chỉ nhận hàng
              </th>
              <th className="px-4 font-extrabold whitespace-nowrap">
                Thanh toán
              </th>
              <th className="px-4 font-extrabold whitespace-nowrap">
                Trạng thái
              </th>
            </tr>
          </thead>

          <tbody>
            <tr className="h-24 border-b border-neutral-950">
              <td colSpan={9} />
            </tr>
            <tr className="h-24 border-b border-neutral-950">
              <td colSpan={9} />
            </tr>
            <tr className="h-24 border-b border-neutral-950">
              <td colSpan={9} />
            </tr>
            <tr className="h-24 border-b border-neutral-950">
              <td colSpan={9} />
            </tr>
            <tr className="h-24 border-b border-neutral-950">
              <td colSpan={9} />
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end gap-4 px-6 py-8">
          <button
            type="button"
            className="h-14 w-48 cursor-pointer rounded-xl border-0 bg-brand-secondary text-xl font-extrabold text-brand-primary hover:bg-brand-secondary-hover"
          >
            &lt; Trang trước
          </button>
          <button
            type="button"
            className="h-14 w-48 cursor-pointer rounded-xl border-0 bg-brand-secondary text-xl font-extrabold text-brand-primary hover:bg-brand-secondary-hover"
          >
            Trang sau &gt;
          </button>
        </div>
      </div>
    </section>
  );
};

export default OrderHistoryPage;

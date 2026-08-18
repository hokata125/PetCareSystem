import { CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import pawsBackground from "../../assets/images/paws-bg.jpg";
import { cancelAdoption, getMyAdoptionDetail } from "../../services/adoptions";

const adoptionStatusClasses = {
  "ĐANG CHỜ DUYỆT": "text-amber-600",
  "ĐÃ DUYỆT": "text-blue-600",
  "ĐANG CHỜ CHỦ ĐẾN ĐÓN": "text-purple-600",
  "ĐÃ HOÀN THÀNH": "text-green-600",
  "BỊ TỪ CHỐI": "text-pink-600",
  "ĐÃ HỦY": "text-red-600",
};

const AdoptionDetailPage = () => {
  const { adoptionId } = useParams();
  const [adoption, setAdoption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [adoptionErrorMessage, setAdoptionErrorMessage] = useState("");
  const [adoptionSuccessMessage, setAdoptionSuccessMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadAdoptionDetail = async () => {
      setAdoption(null);
      setErrorMessage("");

      try {
        const adoptionDetailData = await getMyAdoptionDetail(adoptionId);
        setAdoption(adoptionDetailData);
      } catch (error) {
        const detail = error.response?.data?.detail;
        setErrorMessage(
          typeof detail === "string"
            ? detail
            : "Không thể tải thông tin đơn nhận nuôi.",
        );
      }
    };

    loadAdoptionDetail();
  }, [adoptionId]);

  const handleCancelAdoption = async () => {
    setAdoptionErrorMessage("");
    setAdoptionSuccessMessage("");
    setIsSubmitting(true);

    try {
      const cancelledAdoption = await cancelAdoption(adoptionId);
      setAdoption(cancelledAdoption);
      setAdoptionSuccessMessage("Đã hủy đơn nhận nuôi thành công!");
    } catch (error) {
      const detail = error.response?.data?.detail;
      setAdoptionErrorMessage(
        typeof detail === "string"
          ? detail
          : "Không thể hủy đơn nhận nuôi. Vui lòng thử lại.",
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

  if (!adoption) return null;

  return (
    <section
      className="min-h-screen bg-cover bg-center px-16 py-20"
      style={{ backgroundImage: `url(${pawsBackground})` }}
    >
      <div className="mx-auto w-full max-w-screen-2xl overflow-hidden rounded-3xl border border-neutral-950 bg-[#f9f9f9] shadow-2xl">
        <div className="flex items-center justify-between gap-8 px-10 py-8">
          <h1 className="m-0 text-4xl leading-none font-extrabold text-brand-primary 2xl:text-5xl">
            CHI TIẾT ĐƠN NHẬN NUÔI #{adoption.id}
          </h1>

          {adoption.adoption_status === "ĐANG CHỜ DUYỆT" && (
            <button
              type="button"
              onClick={handleCancelAdoption}
              disabled={isSubmitting}
              className="flex h-16 w-1/2 cursor-pointer items-center justify-center rounded-2xl border border-neutral-950 bg-red-400 px-6 text-center text-2xl font-extrabold text-red-800 enabled:hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70 2xl:text-3xl"
            >
              {isSubmitting ? (
                <span className="size-7 animate-spin rounded-full border-4 border-red-800/40 border-t-red-800" />
              ) : (
                "HỦY ĐƠN NHẬN NUÔI"
              )}
            </button>
          )}
        </div>

        {adoptionErrorMessage && (
          <div className="mx-10 mb-10 rounded-xl bg-red-100 px-4 py-3 text-xl font-medium text-red-700">
            {adoptionErrorMessage}
          </div>
        )}

        {adoptionSuccessMessage && (
          <div className="mx-10 mb-10 rounded-xl bg-green-100 px-4 py-3 text-xl font-medium text-green-700">
            {adoptionSuccessMessage}
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
                Mã đơn nhận nuôi
              </td>
              <td className="px-8">{adoption.id}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Mã khách hàng
              </td>
              <td className="px-8">{adoption.user_id}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Tên người nhận nuôi
              </td>
              <td className="px-8">{adoption.owner_full_name}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                SĐT người nhận nuôi
              </td>
              <td className="px-8">{adoption.owner_phone_number}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Địa chỉ người nhận nuôi
              </td>
              <td className="px-8">{adoption.owner_address}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Mã thú cưng
              </td>
              <td className="px-8">{adoption.abandoned_pet_id}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Tên thú cưng
              </td>
              <td className="px-8">{adoption.pet_name}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Loại thú cưng
              </td>
              <td className="px-8">{adoption.pet_type}</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Tuổi thú cưng
              </td>
              <td className="px-8">{adoption.pet_age} tháng</td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Cân nặng thú cưng
              </td>
              <td className="px-8">
                {Number(adoption.pet_weight).toLocaleString("vi-VN")} kg
              </td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Tình trạng sức khỏe
              </td>
              <td className="px-8 whitespace-pre-line">
                {adoption.pet_health_status}
              </td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Ghi chú
              </td>
              <td className="px-8 whitespace-pre-line">
                {adoption.note || ""}
              </td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Trạng thái đơn nhận nuôi
              </td>
              <td
                className={`px-8 font-extrabold ${adoptionStatusClasses[adoption.adoption_status]}`}
              >
                {adoption.adoption_status}
              </td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Ngày tạo đơn nhận nuôi
              </td>
              <td className="px-8">
                {new Date(adoption.created_at).toLocaleString("vi-VN")}
              </td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Ngày cập nhật đơn nhận nuôi
              </td>
              <td className="px-8">
                {new Date(adoption.updated_at).toLocaleString("vi-VN")}
              </td>
            </tr>
            <tr className="h-20 border-b border-neutral-950">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Ngày hủy đơn nhận nuôi
              </td>
              <td className="px-8">
                {adoption.cancelled_at
                  ? new Date(adoption.cancelled_at).toLocaleString("vi-VN")
                  : ""}
              </td>
            </tr>
            <tr className="h-20">
              <td className="border-r border-neutral-950 px-8 font-bold">
                Bị hủy bởi
              </td>
              <td className="px-8">{adoption.cancelled_by || ""}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdoptionDetailPage;

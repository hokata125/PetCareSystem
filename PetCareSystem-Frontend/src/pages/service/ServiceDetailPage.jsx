import { CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getServiceDetail } from "../../services/services";

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadServiceDetail = async () => {
      setService(null);
      setErrorMessage("");

      try {
        const serviceData = await getServiceDetail(serviceId);
        setService(serviceData);
      } catch (error) {
        const detail = error.response?.data?.detail;
        setErrorMessage(
          typeof detail === "string"
            ? detail
            : "Không thể tải thông tin dịch vụ.",
        );
      }
    };

    loadServiceDetail();
  }, [serviceId]);

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

  if (!service) return null;

  return (
    <section className="min-h-screen bg-[#f9f9f9] px-16 py-16">
      <div className="mx-auto w-full max-w-screen-2xl">
        <h1 className="m-0 text-center text-5xl leading-none font-extrabold text-brand-primary 2xl:text-6xl">
          DỊCH VỤ {service.name} #{service.id}
        </h1>

        <div className="mt-16 text-3xl text-brand-primary 2xl:text-4xl">
          <p className="m-0">
            <span className="font-extrabold">Giá dịch vụ:</span>{" "}
            {Number(service.price).toLocaleString("en-US")} VNĐ
            {service.service_type === "TRÔNG HỘ" ? " / giờ" : " / buổi"}
          </p>

          <p className="mt-8 mb-0">
            <span className="font-extrabold">Loại dịch vụ:</span>{" "}
            {service.service_type}
          </p>

          <div className="mt-8">
            <p className="m-0 font-extrabold">Mô tả dịch vụ:</p>
            <p className="m-0 whitespace-pre-line">
              {service.description || "Dịch vụ này hiện chưa có mô tả"}
            </p>
          </div>
        </div>

        <div className="mt-16 aspect-video w-full"></div>

        <button
          type="button"
          className="mt-12 h-16 w-full cursor-pointer rounded-lg border-0 bg-brand-primary text-white hover:bg-brand-primary-hover"
        >
          <span className="font-bold text-2xl">ĐẶT LỊCH DỊCH VỤ</span>
        </button>
      </div>
    </section>
  );
};

export default ServiceDetailPage;

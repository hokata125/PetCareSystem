import { CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router";
import { getServiceDetail } from "../../services/services";

const serviceDetailImages = {
  SPA: [
    "https://res.cloudinary.com/vgvqzopy/image/upload/v1786812531/pet-spa-detail-1_i235hi.jpg",
    "https://res.cloudinary.com/vgvqzopy/image/upload/v1786812530/pet-spa-detail-2_zkxyz9.jpg",
    "https://res.cloudinary.com/vgvqzopy/image/upload/v1786812531/pet-spa-detail-3_aj7fua.jpg",
  ],
  "KHÁM BỆNH": [
    "https://res.cloudinary.com/vgvqzopy/image/upload/v1786812565/pet-clinic-detail-1_dpsf1x.jpg",
    "https://res.cloudinary.com/vgvqzopy/image/upload/v1787063781/pet-clinic-detail-2_wqc6kq.png",
    "https://res.cloudinary.com/vgvqzopy/image/upload/v1786812564/pet-clinic-detail-3_xq7sfn.jpg",
  ],
  "TRÔNG HỘ": [
    "https://res.cloudinary.com/vgvqzopy/image/upload/v1786813207/pet-boarding-detail-1_r3iijb.jpg",
    "https://res.cloudinary.com/vgvqzopy/image/upload/v1786812593/pet-boarding-detail-2_c6xpis.jpg",
    "https://res.cloudinary.com/vgvqzopy/image/upload/v1786812593/pet-boarding-detail-3_bmyain.jpg",
  ],
  "HUẤN LUYỆN": [
    "https://res.cloudinary.com/vgvqzopy/image/upload/v1786810171/pet-training-detail-1_k68cxn.jpg",
    "https://res.cloudinary.com/vgvqzopy/image/upload/v1786812617/pet-training-detail-2_bdzrk9.jpg",
    "https://res.cloudinary.com/vgvqzopy/image/upload/v1786812615/pet-training-detail-3_zfkpda.jpg",
  ],
};

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadServiceDetail = async () => {
      setService(null);
      setErrorMessage("");

      try {
        const serviceDetailData = await getServiceDetail(serviceId);
        setService(serviceDetailData);
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

        <div className="mt-16 flex flex-col gap-8">
          {serviceDetailImages[service.service_type].map((imageUrl) => (
            <img
              key={imageUrl}
              src={imageUrl}
              alt={service.name}
              className="block h-auto w-full border"
            />
          ))}
        </div>

        <NavLink
          to={`/services/${service.id}/book`}
          className="mt-12 flex h-16 w-full cursor-pointer items-center justify-center rounded-lg bg-brand-primary text-2xl font-bold text-white no-underline hover:bg-brand-primary-hover"
        >
          ĐẶT LỊCH DỊCH VỤ
        </NavLink>
      </div>
    </section>
  );
};

export default ServiceDetailPage;

import { useEffect, useState } from "react";
import ServiceCard from "../../components/service-card/ServiceCard";
import { getServices } from "../../services/services";

const ServiceListPage = () => {
  const [services, setServices] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadServices = async () => {
      try {
        const serviceData = await getServices({
          skip: 0,
          limit: 4,
        });

        setServices(serviceData);
      } catch {
        setErrorMessage("Không thể tải danh sách dịch vụ.");
      }
    };

    loadServices();
  }, []);

  return (
    <section className="min-h-screen bg-[#f9f9f9] px-16 py-16">
      <div className="mx-auto w-full max-w-screen-2xl">
        <h1 className="m-0 text-center text-5xl leading-none font-extrabold text-brand-primary 2xl:text-6xl">
          CÁC DỊCH VỤ DÀNH CHO THÚ CƯNG
        </h1>

        {errorMessage && (
          <div className="mt-8 rounded-xl bg-red-100 px-4 py-3 text-xl font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="mt-16 grid grid-cols-2 gap-16 2xl:gap-20">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              image={service.image}
              name={service.name}
              variant="list"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceListPage;

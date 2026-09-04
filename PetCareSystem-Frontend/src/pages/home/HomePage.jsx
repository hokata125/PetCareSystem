import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import heroBanner1 from "../../assets/images/hero-banner1.webp";
import heroBanner2 from "../../assets/images/hero-banner2.webp";
import heroBanner3 from "../../assets/images/hero-banner3.webp";
import ProductCard from "../../components/product-card/ProductCard";
import ServiceCard from "../../components/service-card/ServiceCard";
import { getProducts } from "../../services/products";
import { getServices } from "../../services/services";

const heroBanners = [
  {
    image: heroBanner1,
    path: "/abandoned-pets",
    alt: "Nhận nuôi thú cưng tại OU-Pet Center",
  },
  {
    image: heroBanner2,
    path: "/products",
    alt: "Sản phẩm dành cho thú cưng tại OU-Pet Center",
  },
  {
    image: heroBanner3,
    path: "/services",
    alt: "Dịch vụ chăm sóc thú cưng tại OU-Pet Center",
  },
];

const HomePage = () => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [services, setServices] = useState([]);
  const [serviceError, setServiceError] = useState("");
  const [products, setProducts] = useState([]);
  const [productError, setProductError] = useState("");

  useEffect(() => {
    const loadServices = async () => {
      try {
        const serviceData = await getServices({
          skip: 0,
          limit: 4,
        });
        setServices(serviceData);
      } catch {
        setServiceError("Không thể tải danh sách dịch vụ.");
      }
    };

    const loadProducts = async () => {
      try {
        const productData = await getProducts({
          skip: 0,
          limit: 4,
        });
        setProducts(productData);
      } catch {
        setProductError("Không thể tải danh sách sản phẩm.");
      }
    };

    loadServices();
    loadProducts();
  }, []);

  useEffect(() => {
    const bannerInterval = window.setInterval(() => {
      setCurrentBannerIndex(
        (currentIndex) => (currentIndex + 1) % heroBanners.length,
      );
    }, 7000);

    return () => window.clearInterval(bannerInterval);
  }, []);

  const handlePreviousBanner = () => {
    setCurrentBannerIndex(
      (currentIndex) =>
        (currentIndex - 1 + heroBanners.length) % heroBanners.length,
    );
  };

  const handleNextBanner = () => {
    setCurrentBannerIndex(
      (currentIndex) => (currentIndex + 1) % heroBanners.length,
    );
  };

  return (
    <>
      <section className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentBannerIndex * 100}%)`,
          }}
        >
          {heroBanners.map((banner) => (
            <NavLink
              key={banner.path}
              to={banner.path}
              className="block w-full shrink-0"
            >
              <img
                src={banner.image}
                alt={banner.alt}
                className="block h-auto w-full"
              />
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          onClick={handlePreviousBanner}
          className="absolute top-1/2 left-4 -translate-y-1/2 cursor-pointer rounded-full border-0 bg-brand-primary p-2 text-white shadow-lg hover:bg-brand-secondary-hover"
        >
          <ChevronLeft size={32} />
        </button>

        <button
          type="button"
          onClick={handleNextBanner}
          className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer rounded-full border-0 bg-brand-primary p-2 text-white shadow-lg hover:bg-brand-secondary-hover"
        >
          <ChevronRight size={32} />
        </button>
      </section>

      <section className="bg-white mt-10 px-8 py-6 xl:px-10 2xl:px-12 3xl:px-16">
        <h2 className="m-0 mb-6 text-3xl leading-none font-extrabold text-brand-primary 2xl:text-4xl">
          CÁC LOẠI DỊCH VỤ
        </h2>

        <div className="grid grid-cols-4 gap-12 xl:gap-14 2xl:gap-16 3xl:gap-20">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              serviceId={service.id}
              image={service.image}
              name={service.name}
            />
          ))}

          {serviceError && (
            <p className="col-span-4 m-0 text-xl font-semibold text-red-700">
              {serviceError}
            </p>
          )}
        </div>
      </section>

      <section className="bg-white my-10 px-8 pb-10 xl:px-10 2xl:px-12 3xl:px-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="m-0 text-3xl leading-none font-extrabold text-brand-primary 2xl:text-4xl">
            CÁC SẢN PHẨM NỔI BẬT
          </h2>

          <NavLink
            to="/products"
            className="cursor-pointer border-0 bg-transparent text-xl font-extrabold text-brand-primary no-underline underline-offset-4 hover:text-brand-secondary-hover hover:underline 2xl:text-2xl"
          >
            <span className="font-semibold">XEM THÊM &gt;&gt;&gt;</span>
          </NavLink>
        </div>

        <div className="grid grid-cols-4 gap-12 xl:gap-14 2xl:gap-16 3xl:gap-20">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              productId={product.id}
              image={product.image}
              name={product.name}
              price={product.price}
            />
          ))}

          {productError && (
            <p className="col-span-4 m-0 text-xl font-semibold text-red-700">
              {productError}
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default HomePage;

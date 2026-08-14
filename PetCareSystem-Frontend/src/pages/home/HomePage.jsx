import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import heroBanner from "../../assets/images/hero-banner.png";
import ProductCard from "../../components/product-card/ProductCard";
import { getProducts } from "../../services/products";
import { getServices } from "../../services/services";

const HomePage = () => {
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

  return (
    <>
      <section className="w-full">
        <img
          src={heroBanner}
          alt="OU-Pet Center"
          className="block h-auto w-full"
        />
      </section>

      <section className="bg-white px-8 py-6 xl:px-10 2xl:px-12 3xl:px-16">
        <h2 className="m-0 mb-6 text-3xl leading-none font-extrabold text-brand-primary 2xl:text-4xl">
          CÁC LOẠI DỊCH VỤ
        </h2>

        <div className="grid grid-cols-4 gap-12 xl:gap-14 2xl:gap-16 3xl:gap-20">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
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

      <section className="bg-white px-8 pb-10 xl:px-10 2xl:px-12 3xl:px-16">
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

const ServiceCard = ({ image, name }) => {
  return (
    <div className="flex h-52 cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border-4 border-brand-primary bg-white transition-transform duration-200 hover:scale-105 xl:h-56 2xl:h-64 3xl:h-72">
      <img
        src={image}
        alt={name}
        className="size-28 object-contain xl:size-32 2xl:size-36 3xl:size-40"
      />
      <span className="text-ui leading-none font-extrabold whitespace-nowrap text-brand-primary">
        {name}
      </span>
    </div>
  );
};

export default HomePage;

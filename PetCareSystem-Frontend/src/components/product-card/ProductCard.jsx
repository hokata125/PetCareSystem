import { NavLink } from "react-router";

const ProductCard = ({ productId, image, name, price }) => {
  return (
    <NavLink
      to={`/products/${productId}`}
      className="flex h-80 cursor-pointer flex-col rounded-3xl border-4 border-brand-primary bg-white p-4 no-underline transition-transform duration-200 hover:scale-105 xl:h-88 2xl:h-96 3xl:h-104"
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        {image && (
          <img
            src={image}
            alt={name}
            className="max-h-full w-full object-contain"
          />
        )}
      </div>

      <span className="block w-full truncate text-xl leading-tight font-semibold text-brand-primary 2xl:text-2xl">
        {name}
      </span>

      <span className="mb-3 text-xl leading-tight text-brand-primary 2xl:text-2xl">
        {Number(price).toLocaleString("en-US")} VNĐ
      </span>

      <div className="flex h-12 items-center justify-center rounded-lg bg-brand-primary text-lg leading-none text-white hover:bg-brand-primary-hover 2xl:h-14 2xl:text-xl">
        <span className="font-bold">Xem chi tiết</span>
      </div>
    </NavLink>
  );
};

export default ProductCard;

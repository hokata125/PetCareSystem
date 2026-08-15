import { NavLink } from "react-router";

const PetCard = ({ abandonedPetId, image, name, petType, age, weight }) => {
  return (
    <div className="flex h-80 cursor-pointer flex-col rounded-3xl border-4 border-brand-primary bg-white p-4 transition-transform duration-200 hover:scale-105 xl:h-88 2xl:h-96 3xl:h-104">
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

      <span className="mb-3 block w-full truncate text-xl leading-tight text-brand-primary 2xl:text-2xl">
        {petType} | {age} tháng | {weight} kg
      </span>

      <NavLink
        to={`/abandoned-pets/${abandonedPetId}`}
        className="flex h-12 cursor-pointer items-center justify-center rounded-lg bg-brand-primary text-lg leading-none text-white no-underline hover:bg-brand-primary-hover 2xl:h-14 2xl:text-xl"
      >
        <span className="font-bold">Xem chi tiết</span>
      </NavLink>
    </div>
  );
};

export default PetCard;

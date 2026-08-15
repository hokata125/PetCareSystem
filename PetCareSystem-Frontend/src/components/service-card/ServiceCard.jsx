const serviceCardStyles = {
  home: {
    card: "flex h-52 cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border-4 border-brand-primary bg-white transition-transform duration-200 hover:scale-105 xl:h-56 2xl:h-64 3xl:h-72",
    image: "size-28 object-contain xl:size-32 2xl:size-36 3xl:size-40",
    name: "text-ui leading-none font-extrabold whitespace-nowrap text-brand-primary",
  },
  list: {
    card: "relative flex h-96 cursor-pointer flex-col items-center justify-center gap-8 overflow-hidden rounded-3xl border-8 border-brand-primary bg-white transition-all duration-300 before:absolute before:inset-0 before:origin-bottom before:scale-y-0 before:bg-service-card-hover before:transition-transform before:duration-300 hover:-translate-y-10 hover:shadow-2xl hover:before:scale-y-100 xl:h-112 2xl:h-128 3xl:h-144",
    image:
      "relative z-10 size-64 object-contain xl:size-72 2xl:size-80 3xl:size-96",
    name: "relative z-10 text-4xl leading-none font-extrabold whitespace-nowrap text-brand-primary 2xl:text-5xl",
  },
};

const ServiceCard = ({ image, name, variant = "home" }) => {
  const styles = serviceCardStyles[variant];

  return (
    <div className={styles.card}>
      <img src={image} alt={name} className={styles.image} />
      <span className={styles.name}>{name}</span>
    </div>
  );
};

export default ServiceCard;

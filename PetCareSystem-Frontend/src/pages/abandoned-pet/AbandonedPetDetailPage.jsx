import { CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import PetCard from "../../components/pet-card/PetCard";
import {
  getAbandonedPetDetail,
  getAbandonedPets,
} from "../../services/abandonedPets";

const AbandonedPetDetailPage = () => {
  const { abandonedPetId } = useParams();
  const [pet, setPet] = useState(null);
  const [otherPets, setOtherPets] = useState([]);
  const [otherPetsErrorMessage, setOtherPetsErrorMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadAbandonedPetDetail = async () => {
      setPet(null);
      setOtherPets([]);
      setOtherPetsErrorMessage("");
      setErrorMessage("");

      try {
        const petDetailData = await getAbandonedPetDetail(abandonedPetId);
        setPet(petDetailData);

        try {
          const petData = await getAbandonedPets({ limit: 100 });
          const randomPets = petData
            .filter((item) => item.id !== petDetailData.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);

          setOtherPets(randomPets);
        } catch {
          setOtherPetsErrorMessage(
            "Không thể tải danh sách thú cưng khác. Vui lòng thử lại.",
          );
        }
      } catch (error) {
        const detail = error.response?.data?.detail;
        setErrorMessage(
          typeof detail === "string"
            ? detail
            : "Không thể tải thông tin thú cưng.",
        );
      }
    };

    loadAbandonedPetDetail();
  }, [abandonedPetId]);

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

  if (!pet) return null;

  return (
    <section className="min-h-screen bg-[#f9f9f9] px-16 py-16">
      <div className="mx-auto w-full max-w-screen-2xl">
        <h1 className="m-0 text-center text-5xl leading-none font-extrabold text-brand-primary 2xl:text-6xl">
          THÔNG TIN THÚ CƯNG #{pet.id}
        </h1>

        <div className="mt-14 grid grid-cols-3 gap-12 rounded-3xl border-4 border-brand-primary bg-white px-14 py-12 2xl:gap-16">
          <div>
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border-2 border-neutral-500 bg-white">
              {pet.image && (
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="max-h-full w-full object-contain"
                />
              )}
            </div>

            <button
              type="button"
              className="mt-8 h-16 w-full cursor-pointer rounded-lg border-0 bg-brand-primary text-2xl font-bold text-white hover:bg-brand-primary-hover"
            >
              ĐĂNG KÝ NHẬN NUÔI
            </button>
          </div>

          <div className="col-span-2 pt-2 text-neutral-950">
            <h2 className="m-0 text-4xl leading-tight font-extrabold text-brand-primary 2xl:text-5xl">
              {pet.name}
            </h2>

            <p className="mt-6 mb-0 text-2xl 2xl:text-3xl">
              Loại: {pet.pet_type} | Tuổi: {pet.age} (tháng) | Cân nặng:{" "}
              {pet.weight} (kg)
            </p>

            <p className="mt-6 mb-0 text-3xl font-extrabold text-emerald-700 2xl:text-4xl">
              {pet.pet_status}
            </p>

            <div className="mt-6 text-2xl leading-relaxed 2xl:text-3xl">
              <p className="m-0 font-semibold">Tình trạng sức khỏe:</p>
              <p className="m-0 whitespace-pre-line">{pet.health_status}</p>
            </div>
          </div>
        </div>

        <h2 className="mt-12 mb-0 text-3xl font-extrabold text-brand-primary 2xl:text-4xl">
          CÁC THÚ CƯNG KHÁC
        </h2>

        {otherPetsErrorMessage ? (
          <div className="mt-8 text-center text-xl font-semibold text-red-700">
            {otherPetsErrorMessage}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-4 gap-8 2xl:gap-10">
            {otherPets.map((otherPet) => (
              <PetCard
                key={otherPet.id}
                abandonedPetId={otherPet.id}
                image={otherPet.image}
                name={otherPet.name}
                petType={otherPet.pet_type}
                age={otherPet.age}
                weight={otherPet.weight}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AbandonedPetDetailPage;

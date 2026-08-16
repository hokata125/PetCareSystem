import { CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import pawsBackground from "../../assets/images/paws-bg.jpg";
import { getAbandonedPetDetail } from "../../services/abandonedPets";
import { createAdoption } from "../../services/adoptions";

const AdoptionCreatePage = () => {
  const { abandonedPetId } = useParams();
  const [pet, setPet] = useState(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdoptionCreated, setIsAdoptionCreated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [adoptionErrorMessage, setAdoptionErrorMessage] = useState("");
  const [adoptionSuccessMessage, setAdoptionSuccessMessage] = useState("");

  useEffect(() => {
    const loadAbandonedPetDetail = async () => {
      setPet(null);
      setErrorMessage("");

      try {
        const petDetailData = await getAbandonedPetDetail(abandonedPetId);
        setPet(petDetailData);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAdoptionErrorMessage("");
    setAdoptionSuccessMessage("");
    setIsSubmitting(true);

    try {
      const adoptionData = {
        abandoned_pet_id: pet.id,
        note: note,
      };

      await createAdoption(adoptionData);
      setAdoptionSuccessMessage("Đăng ký nhận nuôi thú cưng thành công!");
      setIsAdoptionCreated(true);
    } catch (error) {
      const detail = error.response?.data?.detail;
      setAdoptionErrorMessage(
        typeof detail === "string"
          ? detail
          : "Không thể đăng ký nhận nuôi. Vui lòng thử lại.",
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

  if (!pet) return null;

  return (
    <section
      className="flex min-h-screen items-center justify-center bg-cover bg-center px-16 py-20"
      style={{ backgroundImage: `url(${pawsBackground})` }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl rounded-3xl border-4 border-brand-primary bg-[#f9f9f9] px-14 py-12 shadow-xl 2xl:max-w-6xl 2xl:px-16"
      >
        <h1 className="m-0 text-center text-4xl leading-none font-extrabold text-brand-primary 2xl:text-5xl">
          THÔNG TIN ĐƠN NHẬN NUÔI
        </h1>

        <h2 className="mt-5 mb-0 text-center text-3xl leading-none font-extrabold text-emerald-700 2xl:text-4xl">
          MÃ THÚ CƯNG: #{pet.id}
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-12">
          <div className="text-xl leading-relaxed text-neutral-950 2xl:text-2xl">
            <p className="m-0">
              <span className="font-bold">Tên thú cưng:</span> {pet.name}
            </p>

            <p className="mt-2 mb-0">
              <span className="font-bold">Loại thú cưng:</span> {pet.pet_type}
            </p>

            <p className="mt-2 mb-0">
              <span className="font-bold">Tuổi:</span> {pet.age} tháng |{" "}
              <span className="font-bold">Cân nặng:</span> {pet.weight} kg
            </p>

            <div className="mt-2">
              <p className="m-0 font-bold">Tình trạng sức khỏe:</p>
              <p className="m-0 whitespace-pre-line">{pet.health_status}</p>
            </div>
          </div>

          <div className="flex aspect-square w-4/5 items-center justify-center justify-self-end overflow-hidden border border-neutral-700 bg-white">
            {pet.image && (
              <img
                src={pet.image}
                alt={pet.name}
                className="max-h-full w-full object-contain"
              />
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2">
          <label
            htmlFor="adoption_note"
            className="text-xl font-bold text-neutral-950 2xl:text-2xl"
          >
            Ghi chú (nếu có)
          </label>

          <textarea
            id="adoption_note"
            name="adoption_note"
            placeholder="Nhập ghi chú của bạn..."
            value={note}
            onChange={(event) => setNote(event.target.value)}
            disabled={isSubmitting || isAdoptionCreated}
            className="h-40 w-full resize-none rounded-xl border border-neutral-700 bg-white px-4 py-3 text-xl text-neutral-700 outline-none placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:bg-neutral-200 2xl:text-2xl"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isAdoptionCreated}
          className="mt-5 flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border-0 bg-brand-primary text-xl font-extrabold text-white enabled:hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-70 2xl:h-14 2xl:text-2xl"
        >
          {isSubmitting ? (
            <span className="size-6 animate-spin rounded-full border-4 border-white/40 border-t-white 2xl:size-7" />
          ) : (
            "XÁC NHẬN ĐĂNG KÝ"
          )}
        </button>

        <div className="min-h-20 pt-5">
          {adoptionErrorMessage && (
            <div className="rounded-xl bg-red-100 px-4 py-3 text-lg font-medium text-red-700 2xl:text-xl">
              {adoptionErrorMessage}
            </div>
          )}

          {adoptionSuccessMessage && (
            <div className="rounded-xl bg-green-100 px-4 py-3 text-lg font-medium text-green-700 2xl:text-xl">
              {adoptionSuccessMessage}
            </div>
          )}
        </div>
      </form>
    </section>
  );
};

export default AdoptionCreatePage;

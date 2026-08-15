const AbandonedPetDetailPage = () => {
  return (
    <section className="min-h-screen bg-[#f9f9f9] px-16 py-16">
      <div className="mx-auto w-full max-w-screen-2xl">
        <h1 className="m-0 text-center text-5xl leading-none font-extrabold text-brand-primary 2xl:text-6xl">
          THÔNG TIN THÚ CƯNG #Pet.id
        </h1>

        <div className="mt-14 grid grid-cols-3 gap-12 rounded-3xl border-4 border-brand-primary bg-white px-14 py-12 2xl:gap-16">
          <div>
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border-2 border-neutral-500 bg-white"></div>

            <button
              type="button"
              className="mt-8 h-16 w-full cursor-pointer rounded-lg border-0 bg-brand-primary text-2xl text-white hover:bg-brand-primary-hover 2xl:text-3xl"
            >
              <span className="font-bold">ĐĂNG KÝ NHẬN NUÔI</span>
            </button>
          </div>

          <div className="col-span-2 pt-2 text-neutral-950">
            <h2 className="m-0 text-4xl leading-tight font-extrabold text-brand-primary 2xl:text-5xl">
              PET.NAME
            </h2>

            <p className="mt-6 mb-0 text-2xl 2xl:text-3xl">
              Loại: pet.pet_type | Tuổi: pet.age (tháng) | Cân nặng: pet.weight
              (kg)
            </p>

            <p className="mt-6 mb-0 text-3xl font-extrabold text-emerald-700 2xl:text-4xl">
              pet.pet_status
            </p>

            <div className="mt-6 text-2xl leading-relaxed 2xl:text-3xl">
              <p className="m-0 font-semibold">Tình trạng sức khỏe:</p>
              <p className="m-0">pet.health_status</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AbandonedPetDetailPage;

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import PetCard from "../../components/pet-card/PetCard";
import { getAbandonedPets } from "../../services/abandonedPets";

const PAGE_SIZE = 12;

const AbandonedPetListPage = () => {
  const [pets, setPets] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [petType, setPetType] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [appliedSearchName, setAppliedSearchName] = useState("");
  const [appliedPetType, setAppliedPetType] = useState("");
  const [appliedSortBy, setAppliedSortBy] = useState("");
  const [appliedSortOrder, setAppliedSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadAbandonedPets = async () => {
      setErrorMessage("");

      try {
        const petData = await getAbandonedPets({
          search_name: appliedSearchName,
          pet_type: appliedPetType,
          sort_by: appliedSortBy || undefined,
          sort_order: appliedSortOrder || undefined,
          skip: currentPage * PAGE_SIZE,
          limit: PAGE_SIZE + 1,
        });

        setPets(petData.slice(0, PAGE_SIZE));
        setHasNextPage(petData.length > PAGE_SIZE);
      } catch {
        setPets([]);
        setHasNextPage(false);
        setErrorMessage("Không thể tải danh sách thú cưng.");
      }
    };

    loadAbandonedPets();
  }, [
    appliedSearchName,
    appliedPetType,
    appliedSortBy,
    appliedSortOrder,
    currentPage,
  ]);

  const handleSearch = (event) => {
    event.preventDefault();
    setCurrentPage(0);
    setAppliedSearchName(searchName);
    setAppliedPetType(petType);
    setAppliedSortBy(sortBy);
    setAppliedSortOrder(sortOrder);
  };

  return (
    <section className="min-h-screen bg-[#f9f9f9] px-16 py-16">
      <div className="mx-auto w-full max-w-screen-2xl">
        <h1 className="m-0 text-center text-5xl leading-none font-extrabold text-brand-primary 2xl:text-6xl">
          DANH SÁCH CÁC THÚ CƯNG BỊ BỎ RƠI
        </h1>

        <form
          onSubmit={handleSearch}
          className="mx-auto mt-10 flex w-4/5 gap-3"
        >
          <input
            type="text"
            value={searchName}
            onChange={(event) => setSearchName(event.target.value)}
            placeholder="Nhập tên thú cưng cần tìm..."
            className="h-12 min-w-0 flex-1 rounded-lg border border-neutral-500 bg-white px-4 text-lg text-neutral-700 outline-none placeholder:text-neutral-500 2xl:h-14 2xl:text-xl"
          />

          <input
            type="text"
            value={petType}
            onChange={(event) => setPetType(event.target.value)}
            placeholder="Nhập loại thú cưng cần tìm..."
            className="h-12 min-w-0 flex-1 rounded-lg border border-neutral-500 bg-white px-4 text-lg text-neutral-700 outline-none placeholder:text-neutral-500 2xl:h-14 2xl:text-xl"
          />

          <div className="relative w-52 2xl:w-56">
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="h-12 w-full cursor-pointer rounded-lg border border-neutral-500 bg-white px-4 pr-16 text-base text-neutral-700 outline-none 2xl:h-14 2xl:text-lg"
            >
              <option value="" disabled>
                Sắp xếp theo
              </option>
              <option value="age">Tuổi</option>
              <option value="weight">Cân nặng</option>
            </select>

            {sortBy && (
              <button
                type="button"
                onClick={() => {
                  setSortBy("");
                  setSortOrder("");
                }}
                className="absolute top-1/2 right-9 flex -translate-y-1/2 cursor-pointer border-0 bg-transparent p-0 text-neutral-500 hover:text-brand-primary"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <div className="relative w-56 2xl:w-60">
            <select
              value={sortOrder}
              disabled={!sortBy}
              onChange={(event) => setSortOrder(event.target.value)}
              className="h-12 w-full cursor-pointer rounded-lg border border-neutral-500 bg-white px-4 pr-16 text-base text-neutral-700 outline-none disabled:cursor-not-allowed disabled:bg-neutral-200 2xl:h-14 2xl:text-lg"
            >
              <option value="" disabled>
                Thứ tự sắp xếp
              </option>
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </select>

            {sortOrder && (
              <button
                type="button"
                onClick={() => setSortOrder("")}
                className="absolute top-1/2 right-9 flex -translate-y-1/2 cursor-pointer border-0 bg-transparent p-0 text-neutral-500 hover:text-brand-primary"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-brand-primary text-white hover:bg-brand-primary-hover 2xl:size-14"
          >
            <Search size={28} />
          </button>
        </form>

        {errorMessage && (
          <div className="mt-8 rounded-xl bg-red-100 px-4 py-3 text-xl font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="mt-8 grid grid-cols-4 gap-8 2xl:gap-10">
          {pets.map((pet) => (
            <PetCard
              key={pet.id}
              abandonedPetId={pet.id}
              image={pet.image}
              name={pet.name}
              petType={pet.pet_type}
              age={pet.age}
              weight={pet.weight}
            />
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6">
          <button
            type="button"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="h-14 cursor-pointer rounded-xl border-0 bg-brand-secondary text-xl font-extrabold text-brand-primary enabled:hover:bg-brand-secondary-hover disabled:cursor-not-allowed disabled:opacity-60 2xl:text-2xl"
          >
            &lt; Trang trước
          </button>

          <button
            type="button"
            disabled={!hasNextPage}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="h-14 cursor-pointer rounded-xl border-0 bg-brand-secondary text-xl font-extrabold text-brand-primary enabled:hover:bg-brand-secondary-hover disabled:cursor-not-allowed disabled:opacity-60 2xl:text-2xl"
          >
            Trang sau &gt;
          </button>
        </div>
      </div>
    </section>
  );
};

export default AbandonedPetListPage;

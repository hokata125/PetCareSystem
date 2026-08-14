import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import ProductCard from "../../components/product-card/ProductCard";
import { getProducts } from "../../services/products";

const PAGE_SIZE = 12;

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [priceSort, setPriceSort] = useState("");
  const [appliedSearchName, setAppliedSearchName] = useState("");
  const [appliedPriceSort, setAppliedPriceSort] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      setErrorMessage("");

      try {
        const productData = await getProducts({
          search_name: appliedSearchName,
          price_sort: appliedPriceSort || undefined,
          skip: currentPage * PAGE_SIZE,
          limit: PAGE_SIZE + 1,
        });

        setProducts(productData.slice(0, PAGE_SIZE));
        setHasNextPage(productData.length > PAGE_SIZE);
      } catch {
        setProducts([]);
        setHasNextPage(false);
        setErrorMessage("Không thể tải danh sách sản phẩm.");
      }
    };

    loadProducts();
  }, [appliedSearchName, appliedPriceSort, currentPage]);

  const handleSearch = (event) => {
    event.preventDefault();
    setCurrentPage(0);
    setAppliedSearchName(searchName);
    setAppliedPriceSort(priceSort);
  };

  return (
    <section className="min-h-screen bg-[#f9f9f9] px-16 py-16">
      <div className="mx-auto w-full max-w-screen-2xl">
        <h1 className="m-0 text-center text-5xl leading-none font-extrabold text-brand-primary 2xl:text-6xl">
          CÁC SẢN PHẨM DÀNH CHO THÚ CƯNG
        </h1>

        <form
          onSubmit={handleSearch}
          className="mx-auto mt-10 flex w-3/4 gap-5"
        >
          <input
            type="text"
            value={searchName}
            onChange={(event) => setSearchName(event.target.value)}
            placeholder="Nhập tên sản phẩm cần tìm..."
            className="h-12 min-w-0 flex-1 rounded-lg border border-neutral-500 bg-white px-4 text-xl text-neutral-700 outline-none placeholder:text-neutral-500 2xl:h-14 2xl:text-2xl"
          />

          <div className="relative w-72 2xl:w-80">
            <select
              value={priceSort}
              onChange={(event) => setPriceSort(event.target.value)}
              className="h-12 w-full cursor-pointer rounded-lg border border-neutral-500 bg-white px-4 pr-16 text-base text-neutral-700 outline-none 2xl:h-14 2xl:text-lg"
            >
              <option value="" disabled>
                Sắp xếp theo giá tiền
              </option>
              <option value="asc">Giá tăng dần</option>
              <option value="desc">Giá giảm dần</option>
            </select>

            {priceSort && (
              <button
                type="button"
                onClick={() => setPriceSort("")}
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
          {products.map((product) => (
            <ProductCard
              key={product.id}
              productId={product.id}
              image={product.image}
              name={product.name}
              price={product.price}
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
            <span className="font-extrabold">&lt; Trang trước</span>
          </button>

          <button
            type="button"
            disabled={!hasNextPage}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="h-14 cursor-pointer rounded-xl border-0 bg-brand-secondary text-xl font-extrabold text-brand-primary enabled:hover:bg-brand-secondary-hover disabled:cursor-not-allowed disabled:opacity-60 2xl:text-2xl"
          >
            <span className="font-extrabold">Trang sau &gt;</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductListPage;

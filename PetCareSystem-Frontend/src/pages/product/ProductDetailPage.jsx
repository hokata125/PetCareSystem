import { CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ProductCard from "../../components/product-card/ProductCard";
import { getProductDetail, getProducts } from "../../services/products";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [suggestedErrorMessage, setSuggestedErrorMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadProductDetail = async () => {
      setProduct(null);
      setSuggestedProducts([]);
      setSuggestedErrorMessage("");
      setErrorMessage("");

      try {
        const productDetailData = await getProductDetail(productId);
        setProduct(productDetailData);

        try {
          const productData = await getProducts({ limit: 100 });
          const randomProducts = productData
            .filter((item) => item.id !== productDetailData.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);

          setSuggestedProducts(randomProducts);
        } catch {
          setSuggestedErrorMessage(
            "Không thể tải danh sách sản phẩm gợi ý. Vui lòng thử lại.",
          );
        }
      } catch (error) {
        const detail = error.response?.data?.detail;
        setErrorMessage(
          typeof detail === "string"
            ? detail
            : "Không thể tải thông tin sản phẩm.",
        );
      }
    };

    loadProductDetail();
  }, [productId]);

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

  if (!product) return null;

  return (
    <section className="min-h-screen bg-[#f9f9f9] px-16 py-16">
      <div className="mx-auto w-full max-w-screen-2xl">
        <h1 className="m-0 text-center text-5xl leading-none font-extrabold text-brand-primary 2xl:text-6xl">
          CHI TIẾT SẢN PHẨM #{product.id}
        </h1>

        <div className="mt-14 grid grid-cols-3 gap-12 rounded-3xl border-4 border-brand-primary bg-white px-14 py-12 2xl:gap-16">
          <div>
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border-2 border-neutral-500 bg-white">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full w-full object-contain"
                />
              )}
            </div>

            <button
              type="button"
              className="mt-8 h-16 w-full cursor-pointer rounded-lg border-0 bg-brand-primary font-bold text-2xl text-white hover:bg-brand-primary-hover 2xl:text-3xl"
            >
              MUA NGAY
            </button>
          </div>

          <div className="col-span-2 pt-2 text-neutral-950">
            <h2 className="m-0 text-4xl leading-tight font-extrabold text-brand-primary 2xl:text-5xl">
              {product.name}
            </h2>

            <p className="mt-6 mb-0 text-2xl 2xl:text-3xl">
              Số lượng còn: {product.stock_quantity}
            </p>

            <p className="mt-6 mb-0 text-3xl font-extrabold text-emerald-700 2xl:text-4xl">
              {Number(product.price).toLocaleString("en-US")} VNĐ
            </p>

            <div className="mt-6 text-2xl leading-relaxed 2xl:text-3xl">
              <p className="m-0 font-semibold">Mô tả sản phẩm:</p>
              <p className="m-0 whitespace-pre-line">
                {product.description || "Sản phẩm này hiện chưa có mô tả"}
              </p>
            </div>
          </div>
        </div>

        <h2 className="mt-12 mb-0 text-3xl font-extrabold text-brand-primary 2xl:text-4xl">
          SẢN PHẨM BẠN CŨNG CÓ THỂ THÍCH
        </h2>

        {suggestedErrorMessage ? (
          <div className="mt-8 text-center text-xl font-semibold text-red-700">
            {suggestedErrorMessage}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-4 gap-8 2xl:gap-10">
            {suggestedProducts.map((suggestedProduct) => (
              <ProductCard
                key={suggestedProduct.id}
                productId={suggestedProduct.id}
                image={suggestedProduct.image}
                name={suggestedProduct.name}
                price={suggestedProduct.price}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductDetailPage;

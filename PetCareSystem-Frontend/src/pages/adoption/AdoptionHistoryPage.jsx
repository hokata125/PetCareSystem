import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import pawsBackground from "../../assets/images/paws-bg.jpg";
import { getMyAdoptions } from "../../services/adoptions";

const PAGE_SIZE = 5;

const adoptionStatusClasses = {
  "ĐANG CHỜ DUYỆT": "text-amber-600",
  "ĐÃ DUYỆT": "text-blue-600",
  "ĐANG CHỜ CHỦ ĐẾN ĐÓN": "text-purple-600",
  "ĐÃ HOÀN THÀNH": "text-green-600",
  "BỊ TỪ CHỐI": "text-pink-600",
  "ĐÃ HỦY": "text-red-600",
};

const AdoptionHistoryPage = () => {
  const navigate = useNavigate();
  const [adoptions, setAdoptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadAdoptions = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const adoptionData = await getMyAdoptions({
          skip: currentPage * PAGE_SIZE,
          limit: PAGE_SIZE + 1,
        });

        setAdoptions(adoptionData.slice(0, PAGE_SIZE));
        setHasNextPage(adoptionData.length > PAGE_SIZE);
      } catch {
        setAdoptions([]);
        setHasNextPage(false);
        setErrorMessage("Không thể tải lịch sử nhận nuôi.");
      } finally {
        setIsLoading(false);
      }
    };

    loadAdoptions();
  }, [currentPage]);

  return (
    <section
      className="min-h-screen bg-cover bg-center px-16 py-20"
      style={{ backgroundImage: `url(${pawsBackground})` }}
    >
      <div className="mx-auto w-full max-w-screen-2xl overflow-hidden rounded-3xl border border-neutral-950 bg-[#f9f9f9] shadow-2xl">
        <h1 className="m-0 bg-brand-primary px-5 py-6 text-2xl leading-none font-extrabold text-white 2xl:text-3xl">
          LỊCH SỬ NHẬN NUÔI
        </h1>

        {isLoading && (
          <div className="mx-6 my-6 rounded-xl bg-blue-100 px-4 py-3 text-xl font-medium text-blue-700">
            Đang tải lịch sử nhận nuôi...
          </div>
        )}

        {errorMessage && (
          <div className="mx-6 my-6 rounded-xl bg-red-100 px-4 py-3 text-xl font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && (
          <>
            <table className="w-full table-fixed border-collapse text-sm text-neutral-950 2xl:text-base">
              <thead className="bg-neutral-200">
                <tr className="h-16 border-b border-neutral-950">
                  <th className="px-4 text-center font-extrabold">
                    Mã đơn nhận nuôi
                  </th>
                  <th className="px-4 text-center font-extrabold">
                    Ngày tạo đơn
                  </th>
                  <th className="px-4 text-center font-extrabold">
                    Tên thú cưng
                  </th>
                  <th className="px-4 text-center font-extrabold">
                    Loại thú cưng
                  </th>
                  <th className="px-4 text-center font-extrabold">
                    Tuổi thú cưng
                  </th>
                  <th className="px-4 text-center font-extrabold">Cân nặng</th>
                  <th className="px-4 text-center font-extrabold">
                    Tình trạng sức khỏe
                  </th>
                  <th className="px-4 text-center font-extrabold">
                    Trạng thái
                  </th>
                </tr>
              </thead>

              <tbody>
                {adoptions.length === 0 ? (
                  <tr className="h-120 border-b border-neutral-950">
                    <td
                      colSpan={8}
                      className="text-center text-xl font-bold text-neutral-700"
                    >
                      Bạn chưa có đơn nhận nuôi nào.
                    </td>
                  </tr>
                ) : (
                  <>
                    {adoptions.map((adoption) => (
                      <tr
                        key={adoption.id}
                        onClick={() => navigate(`/adoptions/${adoption.id}`)}
                        className="h-24 cursor-pointer border-b border-neutral-950 hover:bg-blue-100"
                      >
                        <td className="px-4 text-center font-bold">
                          #{adoption.id}
                        </td>
                        <td className="px-4 text-center">
                          {new Date(adoption.created_at).toLocaleString(
                            "vi-VN",
                          )}
                        </td>
                        <td className="px-4 text-center">
                          <span className="line-clamp-2">
                            {adoption.pet_name}
                          </span>
                        </td>
                        <td className="px-4 text-center">
                          <span className="line-clamp-2">
                            {adoption.pet_type}
                          </span>
                        </td>
                        <td className="px-4 text-center">
                          {adoption.pet_age} tháng
                        </td>
                        <td className="px-4 text-center">
                          {Number(adoption.pet_weight).toLocaleString("vi-VN")}{" "}
                          kg
                        </td>
                        <td className="px-4 text-center">
                          <span className="line-clamp-2 whitespace-pre-line">
                            {adoption.pet_health_status}
                          </span>
                        </td>
                        <td
                          className={`px-4 text-center font-extrabold ${adoptionStatusClasses[adoption.adoption_status]}`}
                        >
                          <span className="line-clamp-2">
                            {adoption.adoption_status}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {Array.from({ length: PAGE_SIZE - adoptions.length }).map(
                      (_, emptyRowIndex) => (
                        <tr
                          key={emptyRowIndex}
                          className="h-24 border-b border-neutral-950"
                        >
                          <td colSpan={8} />
                        </tr>
                      ),
                    )}
                  </>
                )}
              </tbody>
            </table>

            <div className="flex justify-end gap-4 px-6 py-8">
              <button
                type="button"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="h-14 w-48 cursor-pointer rounded-xl border-0 bg-brand-secondary text-xl font-extrabold text-brand-primary enabled:hover:bg-brand-secondary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                &lt; Trang trước
              </button>
              <button
                type="button"
                disabled={!hasNextPage}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="h-14 w-48 cursor-pointer rounded-xl border-0 bg-brand-secondary text-xl font-extrabold text-brand-primary enabled:hover:bg-brand-secondary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                Trang sau &gt;
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default AdoptionHistoryPage;

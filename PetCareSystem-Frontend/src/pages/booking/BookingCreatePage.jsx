import { CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import pawsBackground from "../../assets/images/paws-bg.jpg";
import { createBooking } from "../../services/bookings";
import { getServiceDetail } from "../../services/services";

const BookingCreatePage = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [petWeight, setPetWeight] = useState(1);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookingCreated, setIsBookingCreated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [bookingErrorMessage, setBookingErrorMessage] = useState("");
  const [bookingSuccessMessage, setBookingSuccessMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadServiceDetail = async () => {
      setService(null);
      setErrorMessage("");

      try {
        const serviceDetailData = await getServiceDetail(serviceId);
        setService(serviceDetailData);
      } catch (error) {
        const detail = error.response?.data?.detail;
        setErrorMessage(
          typeof detail === "string"
            ? detail
            : "Không thể tải thông tin dịch vụ.",
        );
      }
    };

    loadServiceDetail();
  }, [serviceId]);

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

  if (!service) return null;

  const isBoardingService = service.service_type === "TRÔNG HỘ";

  const handleStartAtChange = (event) => {
    const selectedStartAt = event.target.value;
    setStartAt(selectedStartAt);

    if (!selectedStartAt) {
      setEndAt("");
      return;
    }

    if (isBoardingService) return;

    const resultEndAt = new Date(selectedStartAt);
    resultEndAt.setHours(resultEndAt.getHours() + 2);

    const yearEndAt = resultEndAt.getFullYear();
    const monthEndAt = String(resultEndAt.getMonth() + 1).padStart(2, "0");
    const dayEndAt = String(resultEndAt.getDate()).padStart(2, "0");
    const hoursEndAt = String(resultEndAt.getHours()).padStart(2, "0");
    const minutesEndAt = String(resultEndAt.getMinutes()).padStart(2, "0");

    setEndAt(
      `${yearEndAt}-${monthEndAt}-${dayEndAt}T${hoursEndAt}:${minutesEndAt}`,
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBookingErrorMessage("");
    setBookingSuccessMessage("");
    setIsSubmitting(true);

    try {
      const bookingData = {
        service_id: service.id,
        pet_name: petName,
        pet_type: petType,
        pet_weight: petWeight,
        note: note,
        start_at: startAt,
        end_at: endAt || null,
      };

      await createBooking(bookingData);
      setBookingSuccessMessage("Đặt lịch dịch vụ thành công!");
      setIsBookingCreated(true);
    } catch (error) {
      const detail = error.response?.data?.detail;
      const validationMessage = Array.isArray(detail)
        ? detail
            .map((validationError) =>
              validationError.msg.replace(/^Value error,\s*/, ""),
            )
            .join(" ")
        : "Không thể tạo lịch đặt. Vui lòng thử lại.";

      setBookingErrorMessage(
        typeof detail === "string" ? detail : validationMessage,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  let totalPrice;

  if (isBoardingService) {
    const durationInHours =
      (new Date(endAt) - new Date(startAt)) / (1000 * 60 * 60);
    totalPrice = durationInHours > 0 ? service.price * durationInHours : 0;
  } else if (petWeight < 10) {
    totalPrice = service.price;
  } else if (petWeight < 20) {
    totalPrice = service.price * 1.1;
  } else {
    totalPrice = service.price * 1.3;
  }

  return (
    <section
      className="flex min-h-screen items-center justify-center bg-cover bg-center px-16 py-20"
      style={{ backgroundImage: `url(${pawsBackground})` }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl rounded-3xl border-4 border-brand-primary bg-[#f9f9f9] px-16 py-14 2xl:max-w-5xl"
      >
        <h1 className="m-0 text-center text-4xl leading-none font-extrabold text-brand-primary 2xl:text-5xl">
          THÔNG TIN ĐƠN ĐẶT LỊCH
        </h1>

        <h2 className="mt-5 mb-0 text-center text-3xl leading-none font-extrabold text-emerald-700 2xl:text-4xl">
          MÃ DỊCH VỤ: #{service.id}
        </h2>

        <div className="mt-10 text-xl text-neutral-950 2xl:text-2xl">
          <p className="m-0">
            <span className="font-bold">Tên dịch vụ:</span> {service.name}
          </p>

          <p className="mt-5 mb-0">
            <span className="font-bold">Loại dịch vụ:</span>{" "}
            {service.service_type}
          </p>

          <p className="mt-5 mb-0">
            <span className="font-bold">Giá dịch vụ:</span>{" "}
            {Number(service.price).toLocaleString("en-US")} VNĐ
            {isBoardingService ? " / giờ" : " / buổi"}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <label
            htmlFor="booking_pet_name"
            className="text-xl font-bold text-neutral-950 2xl:text-2xl"
          >
            Tên thú cưng của bạn
          </label>

          <input
            id="booking_pet_name"
            name="booking_pet_name"
            type="text"
            placeholder="Nhập tên thú cưng của bạn..."
            value={petName}
            onChange={(event) => setPetName(event.target.value)}
            disabled={isSubmitting || isBookingCreated}
            className="h-14 w-full rounded-xl border border-neutral-700 bg-white px-4 text-xl text-neutral-700 outline-none placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:bg-neutral-200 2xl:text-2xl"
          />
        </div>

        <div className="mt-5 grid grid-cols-4 gap-5">
          <div className="col-span-3 flex flex-col gap-2">
            <label
              htmlFor="booking_pet_type"
              className="text-xl font-bold text-neutral-950 2xl:text-2xl"
            >
              Loại thú cưng của bạn
            </label>

            <input
              id="booking_pet_type"
              name="booking_pet_type"
              type="text"
              placeholder="Nhập loại thú cưng của bạn..."
              value={petType}
              onChange={(event) => setPetType(event.target.value)}
              disabled={isSubmitting || isBookingCreated}
              className="h-14 w-full rounded-xl border border-neutral-700 bg-white px-4 text-xl text-neutral-700 outline-none placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:bg-neutral-200 2xl:text-2xl"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="booking_pet_weight"
              className="text-xl font-bold text-neutral-950 2xl:text-2xl"
            >
              Cân nặng (kg)
            </label>

            <input
              id="booking_pet_weight"
              name="booking_pet_weight"
              type="number"
              min="1"
              max="50"
              value={petWeight}
              onChange={(event) => setPetWeight(Number(event.target.value))}
              disabled={isSubmitting || isBookingCreated}
              className="h-14 w-full rounded-xl border border-neutral-700 bg-white px-4 text-xl text-neutral-700 outline-none disabled:cursor-not-allowed disabled:bg-neutral-200 2xl:text-2xl"
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="booking_start_at"
              className="text-xl font-bold text-neutral-950 2xl:text-2xl"
            >
              Thời gian bắt đầu
            </label>

            <input
              id="booking_start_at"
              name="booking_start_at"
              type="datetime-local"
              value={startAt}
              onChange={handleStartAtChange}
              onKeyDown={(event) => event.preventDefault()}
              onPaste={(event) => event.preventDefault()}
              disabled={isSubmitting || isBookingCreated}
              className="h-14 w-full rounded-xl border border-neutral-700 bg-white px-4 text-xl text-neutral-700 outline-none disabled:cursor-not-allowed disabled:bg-neutral-200 2xl:text-2xl"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="booking_end_at"
              className="text-xl font-bold text-neutral-950 2xl:text-2xl"
            >
              Thời gian kết thúc
            </label>

            <input
              id="booking_end_at"
              name="booking_end_at"
              type="datetime-local"
              value={endAt}
              onChange={(event) => setEndAt(event.target.value)}
              onKeyDown={(event) => event.preventDefault()}
              onPaste={(event) => event.preventDefault()}
              disabled={isSubmitting || isBookingCreated || !isBoardingService}
              className="h-14 w-full rounded-xl border border-neutral-700 bg-white px-4 text-xl text-neutral-700 outline-none disabled:cursor-not-allowed disabled:bg-neutral-200 2xl:text-2xl"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <label
            htmlFor="booking_note"
            className="text-xl font-bold text-neutral-950 2xl:text-2xl"
          >
            Ghi chú (nếu có)
          </label>

          <textarea
            id="booking_note"
            name="booking_note"
            placeholder="Nhập ghi chú của bạn..."
            value={note}
            onChange={(event) => setNote(event.target.value)}
            disabled={isSubmitting || isBookingCreated}
            className="h-28 w-full resize-none rounded-xl border border-neutral-700 bg-white px-4 py-3 text-xl text-neutral-700 outline-none placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:bg-neutral-200 2xl:text-2xl"
          />
        </div>

        <p className="mt-6 mb-0 text-3xl font-extrabold text-emerald-700 2xl:text-4xl">
          Tổng tiền: {Number(totalPrice).toLocaleString("en-US")} VNĐ
        </p>

        <button
          type="submit"
          disabled={isSubmitting || isBookingCreated}
          className="mt-6 flex h-12 w-full cursor-pointer items-center justify-center rounded-lg border-0 bg-brand-primary text-xl font-extrabold text-white enabled:hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-70 2xl:h-14 2xl:text-2xl"
        >
          {isSubmitting ? (
            <span className="size-6 animate-spin rounded-full border-4 border-white/40 border-t-white 2xl:size-7" />
          ) : (
            "XÁC NHẬN ĐẶT LỊCH"
          )}
        </button>

        <div className="min-h-20 pt-5">
          {bookingErrorMessage && (
            <div className="rounded-xl bg-red-100 px-4 py-3 text-lg font-medium text-red-700 2xl:text-xl">
              {bookingErrorMessage}
            </div>
          )}

          {bookingSuccessMessage && (
            <div className="rounded-xl bg-green-100 px-4 py-3 text-lg font-medium text-green-700 2xl:text-xl">
              {bookingSuccessMessage}
            </div>
          )}
        </div>
      </form>
    </section>
  );
};

export default BookingCreatePage;

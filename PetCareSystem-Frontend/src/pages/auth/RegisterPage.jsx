import { useState } from "react";
import authBackground from "../../assets/images/auth-background.png";
import { registerUser } from "../../services/auth";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      await registerUser({
        username,
        full_name: fullName,
        gender,
        email,
        dob,
        phone_number: phoneNumber,
        address,
        password,
      });
      setSuccessMessage("Đăng ký tài khoản thành công!");
    } catch (error) {
      const detail = error.response?.data?.detail;
      const validationMessage = Array.isArray(detail)
        ? detail
            .map((validationError) =>
              validationError.msg?.replace(/^Value error,\s*/, ""),
            )
            .filter(Boolean)
            .join(" ")
        : "";

      setErrorMessage(
        typeof detail === "string"
          ? detail
          : validationMessage || "Không thể đăng ký. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="relative aspect-32/33 w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${authBackground})` }}
    >
      <form
        onSubmit={handleSubmit}
        className="absolute top-[20.9%] left-1/2 flex h-[58%] w-[57.2%] -translate-x-1/2 flex-col overflow-hidden rounded-3xl border-4 border-neutral-950 bg-white"
      >
        <div className="flex h-1/6 items-center justify-center bg-white">
          <h1 className="text-auth-title m-0 leading-none font-extrabold text-brand-primary">
            ĐĂNG KÝ TÀI KHOẢN
          </h1>
        </div>

        <div className="flex flex-1 justify-center bg-brand-secondary">
          <div className="grid h-fit w-3/4 grid-cols-3 gap-x-5 gap-y-3 pt-6 xl:gap-x-6 xl:gap-y-4 xl:pt-7 2xl:gap-y-5 2xl:pt-8 3xl:gap-x-8 3xl:gap-y-6 3xl:pt-10">
            <RegisterInput
              id="full_name"
              label="Họ và tên"
              placeholder="Nhập vào họ và tên của bạn..."
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              disabled={isSubmitting}
              className="col-span-2"
            />

            <RegisterSelect
              id="gender"
              label="Giới tính"
              value={gender}
              onChange={(event) => setGender(event.target.value)}
              disabled={isSubmitting}
            />

            <RegisterInput
              id="phone_number"
              label="Số điện thoại"
              placeholder="Nhập vào số điện thoại của bạn..."
              type="tel"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              disabled={isSubmitting}
              className="col-span-2"
            />

            <RegisterInput
              id="dob"
              label="Ngày sinh"
              type="date"
              value={dob}
              onChange={(event) => setDob(event.target.value)}
              disabled={isSubmitting}
            />

            <RegisterInput
              id="email"
              label="Email"
              placeholder="Nhập vào địa chỉ email của bạn..."
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
              className="col-span-3"
            />

            <RegisterInput
              id="address"
              label="Địa chỉ"
              placeholder="Nhập vào địa chỉ của bạn..."
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              disabled={isSubmitting}
              className="col-span-3"
            />

            <RegisterInput
              id="username"
              label="Tên đăng nhập"
              placeholder="Nhập vào tên đăng nhập của bạn..."
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              disabled={isSubmitting}
              className="col-span-3"
            />

            <RegisterInput
              id="password"
              label="Mật khẩu"
              placeholder="Nhập vào mật khẩu của bạn..."
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
              className="col-span-3"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="text-action col-span-3 flex h-12 cursor-pointer items-center justify-center rounded-lg bg-brand-primary leading-none text-white enabled:hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-70 xl:h-14 2xl:rounded-xl 3xl:h-16"
            >
              {isSubmitting ? (
                <span className="size-6 animate-spin rounded-full border-4 border-white/40 border-t-white 3xl:size-8" />
              ) : (
                <span className="font-bold">ĐĂNG KÝ</span>
              )}
            </button>

            {errorMessage && (
              <div className="text-feedback col-span-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 leading-snug font-semibold text-red-800">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="text-feedback col-span-3 rounded-lg border border-green-300 bg-green-50 px-4 py-3 leading-snug font-semibold text-green-800">
                {successMessage}
              </div>
            )}
          </div>
        </div>
      </form>
    </section>
  );
};

const RegisterInput = ({
  id,
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  disabled,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-ui leading-none font-bold text-white">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required
        className="h-10 w-full rounded-lg border-0 bg-white px-3 text-base text-neutral-700 outline-none placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-70 xl:h-11 xl:text-lg 2xl:h-12 3xl:h-14 3xl:px-4 3xl:text-xl"
      />
    </div>
  );
};

const RegisterSelect = ({ id, label, value, onChange, disabled }) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-ui leading-none font-bold text-white">
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required
        className="h-10 w-full cursor-pointer rounded-lg border-0 bg-white px-3 text-base text-neutral-700 outline-none disabled:cursor-not-allowed disabled:opacity-70 xl:h-11 xl:text-lg 2xl:h-12 3xl:h-14 3xl:px-4 3xl:text-xl"
      >
        <option value="" disabled>
          Chọn giới tính
        </option>
        <option value="NAM">NAM</option>
        <option value="NỮ">NỮ</option>
      </select>
    </div>
  );
};

export default RegisterPage;

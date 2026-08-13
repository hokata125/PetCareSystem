import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import authBackground from "../../assets/images/auth-background.png";
import { getCurrentUser, login } from "../../services/auth";

const LoginPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
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
      const loginResponse = await login({ username, password });

      localStorage.setItem("accessToken", loginResponse.access_token);

      const user = await getCurrentUser();
      onLoginSuccess(user);

      setSuccessMessage("Đăng nhập thành công!");

      await new Promise((resolve) => window.setTimeout(resolve, 1000));
      navigate("/", { replace: true });
    } catch (error) {
      localStorage.removeItem("accessToken");

      const detail = error.response?.data?.detail;
      const validationMessage = Array.isArray(detail)
        ? detail
            .map((validationError) =>
              validationError.msg?.replace(/^Value error,\s*/, ""),
            )
            .filter(Boolean)
            .join(" ")
        : "Không thể đăng nhập. Vui lòng thử lại.";

      setErrorMessage(typeof detail === "string" ? detail : validationMessage);
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
            ĐĂNG NHẬP TÀI KHOẢN
          </h1>
        </div>

        <div className="flex flex-1 justify-center bg-brand-secondary">
          <div className="flex w-3/4 flex-col gap-6 pt-12 xl:gap-8 xl:pt-14 2xl:gap-9 2xl:pt-16 3xl:gap-12 3xl:pt-20">
            <LoginInput
              id="username"
              label="Tên đăng nhập"
              placeholder="Nhập vào tài khoản của bạn..."
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              disabled={isSubmitting}
            />

            <LoginInput
              id="password"
              label="Mật khẩu"
              placeholder="Nhập vào mật khẩu của bạn..."
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
            />

            <NavLink
              to="/register"
              className="text-ui block cursor-pointer leading-tight font-bold text-white no-underline transition-colors duration-200 hover:text-brand-primary"
            >
              Bạn chưa có tài khoản? Hãy đăng ký ngay!
            </NavLink>

            <button
              type="submit"
              disabled={isSubmitting}
              className="text-action flex h-12 cursor-pointer items-center justify-center rounded-lg bg-brand-primary leading-none font-extrabold text-white enabled:hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-70 xl:h-14 2xl:rounded-xl 3xl:h-16"
            >
              {isSubmitting ? (
                <span className="size-6 animate-spin rounded-full border-4 border-white/40 border-t-white 3xl:size-8" />
              ) : (
                <span className="font-bold">ĐĂNG NHẬP</span>
              )}
            </button>

            {errorMessage && (
              <div className="text-feedback rounded-lg border border-red-300 bg-red-50 px-4 py-3 leading-snug font-semibold text-red-800">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="text-feedback rounded-lg border border-green-300 bg-green-50 px-4 py-3 leading-snug font-semibold text-green-800">
                {successMessage}
              </div>
            )}
          </div>
        </div>
      </form>
    </section>
  );
};

const LoginInput = ({
  id,
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  disabled,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div
      className={`flex min-h-24 flex-col justify-center rounded-lg px-4 py-3 xl:min-h-28 2xl:min-h-32 2xl:px-5 2xl:py-4 3xl:min-h-36 ${disabled ? "bg-neutral-200" : "bg-white"}`}
    >
      <label
        htmlFor={id}
        className="text-ui leading-tight font-extrabold text-brand-primary"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          name={id}
          type={type === "password" && isPasswordVisible ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required
          className={`text-ui mt-1.5 w-full border-0 bg-transparent p-0 leading-tight text-neutral-700 outline-none placeholder:text-neutral-600 placeholder:opacity-100 disabled:cursor-not-allowed 2xl:mt-2 ${type === "password" ? "hide-native-eye pr-12" : ""}`}
        />

        {type === "password" && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="absolute top-1/2 right-2 flex -translate-y-1/2 cursor-pointer border-0 bg-transparent p-0 text-neutral-600 enabled:hover:text-brand-primary disabled:cursor-not-allowed"
          >
            {isPasswordVisible ? <EyeClosed size={26} /> : <Eye size={26} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginPage;

import { useState } from "react";
import authBackground from "../../assets/images/auth-background.png";
import { login } from "../../services/authService";

const LoginPage = () => {
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
      await login({ username, password });
      setSuccessMessage("Đăng nhập thành công!");
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
          : validationMessage || "Không thể đăng nhập. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      aria-labelledby="login-title"
      className="relative aspect-[2048/2112] w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${authBackground})` }}
    >
      <form
        onSubmit={handleSubmit}
        className="absolute top-[20.9%] left-1/2 h-[58%] w-[57.2%] -translate-x-1/2 overflow-hidden rounded-[clamp(20px,1.56vw,30px)] border-4 border-[#111111] bg-white"
      >
        <div className="flex h-[17.45%] items-center justify-center bg-white">
          <h1
            id="login-title"
            className="m-0 text-[clamp(36px,3.02vw,58px)] leading-none font-[800] text-[#155383]"
          >
            ĐĂNG NHẬP TÀI KHOẢN
          </h1>
        </div>

        <div className="flex h-[82.55%] justify-center bg-[#91d0df]">
          <div className="flex w-[73%] flex-col gap-[clamp(24px,2.34vw,45px)] pt-[8.2%]">
            <LoginInput
              id="username"
              label="Tên đăng nhập"
              placeholder="Nhập vào tài khoản của bạn..."
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              disabled={isSubmitting}
            />

            <LoginInput
              id="password"
              label="Mật khẩu"
              placeholder="Nhập vào mật khẩu của bạn..."
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              disabled={isSubmitting}
            />

            <p className="m-0 text-[clamp(18px,1.45vw,28px)] leading-[1.2] font-[700] text-white">
              Bạn chưa có tài khoản? Hãy{" "}
              <span className="font-[800] text-[#155383]">đăng ký ngay!</span>
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="flex h-[clamp(48px,3.65vw,70px)] cursor-pointer items-center justify-center rounded-[clamp(8px,0.73vw,14px)] bg-[#155383] text-[clamp(20px,1.56vw,30px)] leading-none font-[800] text-white enabled:hover:bg-[#10466f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#155383] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <span
                    aria-hidden="true"
                    className="size-[1.1em] animate-spin rounded-full border-[0.13em] border-white/40 border-t-white"
                  />
                  <span className="sr-only">Đang đăng nhập...</span>
                </>
              ) : (
                "ĐĂNG NHẬP"
              )}
            </button>

            {errorMessage && (
              <div
                role="alert"
                className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-[clamp(14px,1vw,18px)] leading-snug font-[600] text-red-800"
              >
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div
                role="status"
                className="rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-[clamp(14px,1vw,18px)] leading-snug font-[600] text-green-800"
              >
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
  autoComplete,
  disabled,
}) => {
  return (
    <div className="flex min-h-[clamp(96px,7.81vw,150px)] flex-col justify-center rounded-[clamp(8px,0.52vw,10px)] bg-white px-[clamp(14px,1.04vw,20px)] py-[clamp(12px,0.83vw,16px)]">
      <label
        htmlFor={id}
        className="text-[clamp(18px,1.45vw,28px)] leading-[1.15] font-[800] text-[#155383]"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        required
        className="mt-[clamp(5px,0.47vw,9px)] w-full border-0 bg-transparent p-0 text-[clamp(18px,1.45vw,28px)] leading-[1.2] text-[#4a4a4a] outline-none placeholder:text-[#555555] placeholder:opacity-100 disabled:cursor-not-allowed disabled:opacity-70"
      />
    </div>
  );
};

export default LoginPage;

import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import profileBackground from "../../assets/images/profile-bg.jpg";
import { changePassword } from "../../services/profile";

const ChangePasswordPage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const passwordData = {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_new_password: confirmNewPassword,
      };

      await changePassword(passwordData);
      setSuccessMessage("Đổi mật khẩu thành công!");

      await new Promise((resolve) => window.setTimeout(resolve, 1000));
      onLogout();
      navigate("/login", { replace: true });
    } catch (error) {
      const detail = error.response?.data?.detail;
      const validationMessage = Array.isArray(detail)
        ? detail
            .map((validationError) =>
              validationError.msg.replace(/^Value error,\s*/, ""),
            )
            .join(" ")
        : "Không thể đổi mật khẩu. Vui lòng thử lại.";

      setErrorMessage(typeof detail === "string" ? detail : validationMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="flex min-h-screen items-center justify-center bg-cover bg-center px-16 py-20"
      style={{ backgroundImage: `url(${profileBackground})` }}
    >
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-5xl flex-col rounded-2xl border-4 border-brand-primary bg-[#f9f9f9] px-12 py-16 2xl:max-w-6xl 2xl:px-16 2xl:py-20"
      >
        <h1 className="m-0 text-center text-6xl leading-none font-extrabold text-brand-primary 2xl:text-7xl">
          ĐỔI MẬT KHẨU
        </h1>

        <div className="mt-14 flex flex-col gap-7 2xl:mt-16 2xl:gap-9">
          <PasswordInput
            id="current_password"
            label="Mật khẩu hiện tại"
            placeholder="Nhập mật khẩu hiện tại..."
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            disabled={isSubmitting}
          />

          <PasswordInput
            id="new_password"
            label="Mật khẩu mới"
            placeholder="Nhập mật khẩu mới..."
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            disabled={isSubmitting}
          />

          <PasswordInput
            id="confirm_new_password"
            label="Xác nhận mật khẩu"
            placeholder="Xác nhận mật khẩu mới..."
            value={confirmNewPassword}
            onChange={(event) => setConfirmNewPassword(event.target.value)}
            disabled={isSubmitting}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-12 cursor-pointer items-center justify-center rounded-xl border-0 bg-brand-primary text-xl font-extrabold text-white enabled:hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-70 2xl:h-14 2xl:text-2xl"
          >
            {isSubmitting ? (
              <span className="size-6 animate-spin rounded-full border-4 border-white/40 border-t-white 2xl:size-7" />
            ) : (
              <span className="font-extrabold">LƯU THÔNG TIN</span>
            )}
          </button>

          <div className="min-h-24">
            {errorMessage && (
              <div className="rounded-xl bg-red-100 px-4 py-3 text-lg font-medium text-red-700 2xl:text-xl">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="rounded-xl bg-green-100 px-4 py-3 text-lg font-medium text-green-700 2xl:text-xl">
                {successMessage}
              </div>
            )}
          </div>
        </div>
      </form>
    </section>
  );
};

const PasswordInput = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  disabled,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xl font-medium text-neutral-950">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          name={id}
          type={isPasswordVisible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required
          className="hide-native-eye h-12 w-full rounded-xl border border-neutral-700 bg-white px-4 pr-14 text-xl text-neutral-700 outline-none placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:bg-neutral-200 2xl:h-14 2xl:text-2xl"
        />

        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          className="absolute top-1/2 right-4 flex -translate-y-1/2 cursor-pointer border-0 bg-transparent p-0 text-neutral-600 enabled:hover:text-brand-primary disabled:cursor-not-allowed"
        >
          {isPasswordVisible ? <EyeClosed size={26} /> : <Eye size={26} />}
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordPage;

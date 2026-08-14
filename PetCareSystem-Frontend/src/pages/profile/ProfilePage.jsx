import { useState } from "react";
import pawsBackground from "../../assets/images/paws-bg.jpg";
import { updateAvatar, updateProfile } from "../../services/profile";

const ProfilePage = ({ currentUser, onProfileUpdate }) => {
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isSubmittingAvatar, setIsSubmittingAvatar] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarErrorMessage, setAvatarErrorMessage] = useState("");
  const [avatarSuccessMessage, setAvatarSuccessMessage] = useState("");

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [profileErrorMessage, setProfileErrorMessage] = useState("");
  const [profileSuccessMessage, setProfileSuccessMessage] = useState("");

  const handleEditAvatar = () => {
    if (!currentUser || isEditingAvatar) return;

    setAvatarSuccessMessage("");
    setIsEditingAvatar(true);
  };

  const handleAvatarChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    setAvatarFile(selectedFile);

    const fileReader = new FileReader();
    fileReader.onload = () => setAvatarPreview(fileReader.result);
    fileReader.readAsDataURL(selectedFile);
  };

  const handleSaveAvatar = async (event) => {
    event.preventDefault();

    if (!avatarFile || isSubmittingAvatar) return;

    setAvatarErrorMessage("");
    setIsSubmittingAvatar(true);

    try {
      const updatedUser = await updateAvatar(avatarFile);

      onProfileUpdate(updatedUser);
      setAvatarSuccessMessage("Cập nhật ảnh đại diện thành công!");
      setAvatarFile(null);
      setAvatarPreview("");
      setIsEditingAvatar(false);
    } catch (error) {
      const detail = error.response?.data?.detail;
      setAvatarErrorMessage(
        typeof detail === "string"
          ? detail
          : "Không thể cập nhật ảnh đại diện. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmittingAvatar(false);
    }
  };

  const handleCancelAvatar = () => {
    if (isSubmittingAvatar) return;

    setAvatarFile(null);
    setAvatarPreview("");
    setAvatarErrorMessage("");
    setIsEditingAvatar(false);
  };

  const handleEditProfile = () => {
    if (!currentUser || isEditingProfile) return;

    setFullName(currentUser.full_name);
    setGender(currentUser.gender);
    setPhoneNumber(currentUser.phone_number);
    setDob(currentUser.dob);
    setEmail(currentUser.email);
    setAddress(currentUser.address);

    setProfileSuccessMessage("");
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    setProfileErrorMessage("");
    setIsSubmittingProfile(true);

    try {
      const profileData = {
        full_name: fullName,
        gender: gender,
        phone_number: phoneNumber,
        dob: dob,
        email: email,
        address: address,
      };

      const updatedUser = await updateProfile(profileData);

      onProfileUpdate(updatedUser);
      setProfileSuccessMessage("Cập nhật thông tin cá nhân thành công!");
      setIsEditingProfile(false);
    } catch (error) {
      const detail = error.response?.data?.detail;
      const validationMessage = Array.isArray(detail)
        ? detail
            .map((validationError) =>
              validationError.msg.replace(/^Value error,\s*/, ""),
            )
            .join(" ")
        : "Không thể cập nhật thông tin. Vui lòng thử lại.";

      setProfileErrorMessage(
        typeof detail === "string" ? detail : validationMessage,
      );
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handleCancelProfile = () => {
    if (!currentUser || isSubmittingProfile) return;

    setFullName(currentUser.full_name);
    setGender(currentUser.gender);
    setPhoneNumber(currentUser.phone_number);
    setDob(currentUser.dob);
    setEmail(currentUser.email);
    setAddress(currentUser.address);

    setProfileErrorMessage("");
    setIsEditingProfile(false);
  };

  return (
    <section
      className="flex min-h-screen items-center justify-center bg-cover bg-center px-16 py-20"
      style={{ backgroundImage: `url(${pawsBackground})` }}
    >
      <div className="grid w-full max-w-screen-2xl grid-cols-3 gap-12">
        <form
          onSubmit={handleSaveAvatar}
          className="relative flex aspect-3/4 flex-col items-center rounded-2xl border-4 border-brand-primary bg-[#f9f9f9] px-8"
        >
          <h1 className="absolute top-7 left-8 m-0 text-2xl leading-none font-extrabold text-neutral-950 2xl:text-3xl">
            ẢNH ĐẠI DIỆN
          </h1>

          <div className="absolute top-4 right-4 flex gap-3">
            {!isEditingAvatar && (
              <button
                type="button"
                disabled={!currentUser}
                onClick={handleEditAvatar}
                className={editButtonClasses}
              >
                <span className="font-bold">SỬA</span>
              </button>
            )}

            {isEditingAvatar && (
              <>
                <button
                  type="button"
                  disabled={isSubmittingAvatar}
                  onClick={handleCancelAvatar}
                  className={cancelButtonClasses}
                >
                  <span className="font-bold">HỦY</span>
                </button>

                <button
                  type="submit"
                  disabled={!currentUser || isSubmittingAvatar || !avatarFile}
                  className={editButtonClasses}
                >
                  {isSubmittingAvatar ? (
                    <span className="size-6 animate-spin rounded-full border-4 border-white/40 border-t-white 3xl:size-8" />
                  ) : (
                    <span className="font-bold">LƯU</span>
                  )}
                </button>
              </>
            )}
          </div>

          <div className="mt-20 aspect-square w-3/4 overflow-hidden rounded-full border-4 border-neutral-950 bg-neutral-100">
            {(avatarPreview || currentUser?.avatar) && (
              <img
                src={avatarPreview || currentUser.avatar}
                alt={`${currentUser.full_name}-avatar`}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          {isEditingAvatar && (
            <input
              type="file"
              accept="image/jpeg, image/png, image/webp"
              disabled={isSubmittingAvatar}
              onChange={handleAvatarChange}
              className="mt-5 w-3/4 cursor-pointer text-base text-neutral-700 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand-primary file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
            />
          )}

          {!isEditingAvatar && (
            <>
              <span className="mt-5 text-3xl leading-tight font-extrabold text-neutral-950 uppercase 2xl:text-4xl">
                {currentUser?.full_name}
              </span>

              <span className="mt-2 text-2xl leading-tight text-neutral-950 2xl:text-3xl">
                {currentUser?.role}
              </span>
            </>
          )}

          {avatarErrorMessage && (
            <span className="mt-5 w-full rounded-xl bg-red-100 px-4 py-3 text-center text-base font-medium text-red-700 2xl:text-lg">
              {avatarErrorMessage}
            </span>
          )}

          {avatarSuccessMessage && (
            <span className="mt-5 w-full rounded-xl bg-green-100 px-4 py-3 text-center text-base font-medium text-green-700 2xl:text-lg">
              {avatarSuccessMessage}
            </span>
          )}
        </form>

        <form
          onSubmit={handleSaveProfile}
          className="relative col-span-2 rounded-2xl border-4 border-brand-primary bg-[#f9f9f9] px-10 pt-8"
        >
          <div>
            <h1 className="m-0 text-2xl leading-none font-extrabold text-neutral-950 2xl:text-3xl">
              THÔNG TIN CÁ NHÂN
            </h1>

            <div className="absolute top-4 right-4 flex gap-3">
              {!isEditingProfile && (
                <button
                  type="button"
                  disabled={!currentUser}
                  onClick={handleEditProfile}
                  className={editButtonClasses}
                >
                  <span className="font-bold">SỬA</span>
                </button>
              )}

              {isEditingProfile && (
                <>
                  <button
                    type="button"
                    disabled={isSubmittingProfile}
                    onClick={handleCancelProfile}
                    className={cancelButtonClasses}
                  >
                    <span className="font-bold">HỦY</span>
                  </button>

                  <button
                    type="submit"
                    disabled={!currentUser || isSubmittingProfile}
                    className={editButtonClasses}
                  >
                    {isSubmittingProfile ? (
                      <span className="size-6 animate-spin rounded-full border-4 border-white/40 border-t-white 3xl:size-8" />
                    ) : (
                      <span className="font-bold">LƯU</span>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-x-10 gap-y-7">
            <ProfileInput
              id="profile_full_name"
              label="Họ tên"
              value={isEditingProfile ? fullName : currentUser?.full_name}
              disabled={!isEditingProfile || isSubmittingProfile}
              onChange={(event) => setFullName(event.target.value)}
            />

            <ProfileSelect
              id="profile_gender"
              label="Giới tính"
              value={isEditingProfile ? gender : currentUser?.gender}
              disabled={!isEditingProfile || isSubmittingProfile}
              onChange={(event) => setGender(event.target.value)}
            />

            <ProfileInput
              id="profile_phone_number"
              label="Số điện thoại"
              value={isEditingProfile ? phoneNumber : currentUser?.phone_number}
              disabled={!isEditingProfile || isSubmittingProfile}
              onChange={(event) => setPhoneNumber(event.target.value)}
            />

            <ProfileInput
              id="profile_dob"
              label="Ngày sinh"
              type="date"
              value={isEditingProfile ? dob : currentUser?.dob}
              disabled={!isEditingProfile || isSubmittingProfile}
              onChange={(event) => setDob(event.target.value)}
            />

            <ProfileInput
              id="profile_email"
              label="Email"
              type="email"
              value={isEditingProfile ? email : currentUser?.email}
              disabled={!isEditingProfile || isSubmittingProfile}
              onChange={(event) => setEmail(event.target.value)}
            />

            <ProfileInput
              id="profile_address"
              label="Địa chỉ"
              value={isEditingProfile ? address : currentUser?.address}
              disabled={!isEditingProfile || isSubmittingProfile}
              onChange={(event) => setAddress(event.target.value)}
            />

            {profileErrorMessage && (
              <span className="col-span-2 rounded-xl bg-red-100 px-4 py-3 text-lg font-medium text-red-700 2xl:text-xl">
                {profileErrorMessage}
              </span>
            )}

            {profileSuccessMessage && (
              <span className="col-span-2 rounded-xl bg-green-100 px-4 py-3 text-lg font-medium text-green-700 2xl:text-xl">
                {profileSuccessMessage}
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

const ProfileInput = ({
  id,
  label,
  type = "text",
  value,
  disabled,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xl font-medium text-neutral-950">
        {label}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        value={value || ""}
        disabled={disabled}
        onChange={onChange}
        className="h-12 w-full rounded-xl border border-neutral-700 bg-white px-4 text-xl text-neutral-700 outline-none disabled:bg-neutral-200 2xl:h-14 2xl:text-2xl"
      />
    </div>
  );
};

const ProfileSelect = ({ id, label, value, disabled, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xl font-medium text-neutral-950">
        {label}
      </label>

      <select
        id={id}
        name={id}
        value={value || ""}
        disabled={disabled}
        onChange={onChange}
        className="h-12 w-full rounded-xl border border-neutral-700 bg-white px-4 text-lg text-neutral-700 outline-none disabled:bg-neutral-200 2xl:h-14 2xl:text-xl"
      >
        <option value="NAM">NAM</option>
        <option value="NỮ">NỮ</option>
      </select>
    </div>
  );
};

const editButtonClasses =
  "flex h-12 cursor-pointer items-center justify-center rounded-xl border-0 bg-brand-primary px-7 text-xl font-bold text-white enabled:hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-70 2xl:h-14 2xl:px-9 2xl:text-2xl";

const cancelButtonClasses =
  "flex h-12 cursor-pointer items-center justify-center rounded-xl border-0 bg-neutral-500 px-7 text-xl font-bold text-white enabled:hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-70 2xl:h-14 2xl:px-9 2xl:text-2xl";

export default ProfilePage;

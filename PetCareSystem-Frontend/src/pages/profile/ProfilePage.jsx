import profileBackground from "../../assets/images/profile-bg.jpg";

const ProfilePage = ({ currentUser }) => {
  return (
    <section
      className="flex min-h-screen items-center justify-center bg-cover bg-center px-16 py-20"
      style={{ backgroundImage: `url(${profileBackground})` }}
    >
      <div className="grid w-full max-w-screen-2xl grid-cols-3 gap-12">
        <form className="relative flex aspect-3/4 flex-col items-center rounded-2xl border-4 border-brand-primary bg-white px-8">
          <h1 className="absolute top-7 left-8 m-0 text-2xl leading-none font-extrabold text-neutral-950 2xl:text-3xl">
            ẢNH ĐẠI DIỆN
          </h1>

          <button
            type="button"
            className={`${editButtonClasses} absolute top-4 right-4`}
          >
            <span className="font-bold">SỬA</span>
          </button>

          <div className="mt-20 aspect-square w-3/4 overflow-hidden rounded-full border-4 border-neutral-950 bg-neutral-100">
            {currentUser?.avatar && (
              <img
                src={currentUser.avatar}
                alt={`${currentUser.full_name}-avatar`}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <span className="mt-10 text-3xl leading-tight font-extrabold text-neutral-950 uppercase 2xl:text-4xl">
            {currentUser?.full_name}
          </span>

          <span className="mt-2 text-2xl leading-tight text-neutral-950 2xl:text-3xl">
            {currentUser?.role}
          </span>
        </form>

        <form className="relative col-span-2 rounded-2xl border-4 border-brand-primary bg-white px-10 pt-8">
          <div>
            <h1 className="m-0 text-2xl leading-none font-extrabold text-neutral-950 2xl:text-3xl">
              THÔNG TIN CÁ NHÂN
            </h1>

            <button
              type="button"
              className={`${editButtonClasses} absolute top-4 right-4`}
            >
              <span className="font-bold">SỬA</span>
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-x-10 gap-y-7">
            <ProfileInput
              id="profile_full_name"
              label="Họ tên"
              value={currentUser?.full_name}
            />

            <ProfileSelect
              id="profile_gender"
              label="Giới tính"
              value={currentUser?.gender}
            />

            <ProfileInput
              id="profile_phone_number"
              label="Số điện thoại"
              value={currentUser?.phone_number}
            />

            <ProfileInput
              id="profile_dob"
              label="Ngày sinh"
              type="date"
              value={currentUser?.dob}
            />

            <ProfileInput
              id="profile_email"
              label="Email"
              type="email"
              value={currentUser?.email}
            />

            <ProfileInput
              id="profile_address"
              label="Địa chỉ"
              value={currentUser?.address}
            />
          </div>
        </form>
      </div>
    </section>
  );
};

const ProfileInput = ({ id, label, type = "text", value }) => {
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
        disabled
        className="h-12 w-full rounded-xl border border-neutral-700 bg-neutral-100 px-4 text-xl text-neutral-700 outline-none disabled:opacity-100 2xl:h-14 2xl:text-2xl"
      />
    </div>
  );
};

const ProfileSelect = ({ id, label, value }) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xl font-medium text-neutral-950">
        {label}
      </label>

      <select
        id={id}
        name={id}
        value={value || ""}
        disabled
        className="h-12 w-full rounded-xl border border-neutral-700 bg-neutral-100 px-4 text-lg text-neutral-700 outline-none disabled:opacity-100 2xl:h-14 2xl:text-xl"
      >
        <option value="NAM">NAM</option>
        <option value="NỮ">NỮ</option>
      </select>
    </div>
  );
};

const editButtonClasses =
  "h-12 cursor-pointer rounded-xl border-0 bg-brand-primary px-7 text-xl font-bold text-white hover:bg-brand-primary-hover 2xl:h-14 2xl:px-9 2xl:text-2xl";

export default ProfilePage;

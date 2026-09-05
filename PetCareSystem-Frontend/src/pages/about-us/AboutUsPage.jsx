import { NavLink } from "react-router";
import aboutUsImage from "../../assets/images/about-us.webp";

const AboutUsPage = () => {
  return (
    <section
      aria-labelledby="about-us-title"
      className="grid grid-cols-2 gap-12 bg-white px-12 py-14 xl:gap-14 xl:px-14 xl:py-16 2xl:gap-16 2xl:px-16 3xl:gap-20 3xl:px-20 3xl:py-20"
    >
      <div className="flex min-w-0 flex-col">
        <div className="flex items-center justify-between gap-8">
          <h1
            id="about-us-title"
            className="m-0 text-5xl leading-none font-extrabold text-brand-primary"
          >
            VỀ CHÚNG TÔI
          </h1>

          <NavLink
            to="/"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#d3d3d3] px-8 py-4 text-xl font-extrabold text-brand-primary no-underline transition-colors duration-200 hover:bg-brand-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary 2xl:px-10 2xl:py-5 2xl:text-2xl"
          >
            KHÁM PHÁ NGAY
          </NavLink>
        </div>

        <p className="mt-10 mb-0 w-full text-xl leading-relaxed text-neutral-800 2xl:text-2xl 3xl:mt-12">
          OU-Pet Center là trung tâm chăm sóc thú cưng toàn diện, nơi mỗi người
          bạn nhỏ đều được quan tâm bằng sự tận tâm và trách nhiệm. Chúng tôi
          kết nối các dịch vụ chăm sóc, sản phẩm thiết yếu và hoạt động nhận
          nuôi trong một không gian thuận tiện. Với mong muốn trở thành người
          bạn đồng hành đáng tin cậy, OU-Pet Center giúp hành trình chăm sóc thú
          cưng của bạn trở nên nhẹ nhàng và trọn vẹn hơn.
        </p>

        <div className="mt-14 grid flex-1 grid-cols-2 content-end gap-x-12 gap-y-12 2xl:mt-16 2xl:gap-x-14 2xl:gap-y-14 3xl:gap-x-16 3xl:gap-y-16">
          <article>
            <h2 className="m-0 text-2xl leading-tight font-extrabold text-brand-primary 2xl:text-3xl">
              1. CHÚNG TÔI LÀ AI
            </h2>
            <p className="mt-4 mb-0 text-lg leading-relaxed text-neutral-800 2xl:text-xl">
              OU-Pet Center là đội ngũ những người yêu động vật, cùng chung mong
              muốn xây dựng một môi trường chăm sóc thân thiện và đáng tin cậy
              dành cho thú cưng. Chúng tôi luôn đặt sức khỏe, niềm vui của thú
              cưng và đặc biệt là sự an tâm của khách hàng lên hàng đầu.
            </p>
          </article>

          <article>
            <h2 className="m-0 text-2xl leading-tight font-extrabold text-brand-primary 2xl:text-3xl">
              2. CHÚNG TÔI LÀM GÌ
            </h2>
            <p className="mt-4 mb-0 text-lg leading-relaxed text-neutral-800 2xl:text-xl">
              Chúng tôi cung cấp các sản phẩm dành cho thú cưng cùng các dịch vụ
              như spa, khám bệnh, trông hộ và huấn luyện. Bên cạnh đó, OU-Pet
              Center còn hỗ trợ kết nối những thú cưng bị bỏ rơi với các gia
              đình phù hợp, giúp các em có cơ hội tìm được một mái ấm mới.
            </p>
          </article>

          <article>
            <h2 className="m-0 text-2xl leading-tight font-extrabold text-brand-primary 2xl:text-3xl">
              3. CHÚNG TÔI MANG LẠI NHỮNG GÌ
            </h2>
            <p className="mt-4 mb-0 text-lg leading-relaxed text-neutral-800 2xl:text-xl">
              OU-Pet Center mang đến những sản phẩm thiết yếu, dịch vụ chăm sóc
              đa dạng và sự hỗ trợ tận tâm dành cho thú cưng. Chúng tôi hướng
              đến trải nghiệm an toàn, thuận tiện và đáng tin cậy, giúp mỗi thú
              cưng luôn được yêu thương và chăm sóc một cách tốt nhất.
            </p>
          </article>

          <article>
            <h2 className="m-0 text-2xl leading-tight font-extrabold text-brand-primary 2xl:text-3xl">
              4. VÌ SAO LẠI CẦN ĐẾN CHÚNG TÔI
            </h2>
            <p className="mt-4 mb-0 text-lg leading-relaxed text-neutral-800 2xl:text-xl">
              Giữa nhịp sống bận rộn và hối hã, việc chăm sóc thú cưng chu đáo
              không phải lúc nào cũng dễ dàng. OU-Pet Center sẽ giúp cho bạn có
              thể tiếp cận sản phẩm, dịch vụ và thông tin cần thiết tại một nơi
              để thú cưng luôn nhận được sự quan tâm đúng lúc.
            </p>
          </article>
        </div>
      </div>

      <div className="min-h-[44rem] overflow-hidden rounded-[3rem] border shadow-2xl 2xl:min-h-[50rem] 3xl:min-h-[52rem]">
        <img
          src={aboutUsImage}
          alt="Đội ngũ OU-Pet Center"
          className="block h-full w-full object-cover object-center"
        />
      </div>
    </section>
  );
};

export default AboutUsPage;

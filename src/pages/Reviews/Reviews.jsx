import React from "react";
import { use } from "react";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ReviewCard from "./ReviewCard";

const Reviews = ({ reviewsPromise }) => {
  const reviews = use(reviewsPromise);
  console.log(reviews);

  return (
    <div>
      <h3 className="text-3xl text-center">Customer Review</h3>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab veritatis
        eaque deleniti reprehenderit nostrum modi possimus excepturi quo?
        Possimus distinctio totam consequuntur porro eaque dignissimos corrupti
        obcaecati sint labore repudiandae?
      </p>
      <Swiper
        effect="coverflow"
        grabCursor={true}
        loop={true}
        autoplay={{
          delay: 1500,
          disableOnInteraction: false,
        }}
        modules={[EffectCoverflow, Autoplay, Pagination]}
        centeredSlides={true}
        slidesPerView={3}
        spaceBetween={30} // ✅ GAP BETWEEN SLIDES
        coverflowEffect={{
          rotate: 50,
          stretch: "50%",
          scale: 0.8,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={true}
        className="mySwiper mt-24" // spacing from top
      >
        <div className="mt-24">
          {reviews.map((review) => (
            <SwiperSlide key={review.id} className="mb-5">
              <ReviewCard review={review}></ReviewCard>
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </div>
  );
};

export default Reviews;

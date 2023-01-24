import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import React from "react";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import House1 from "../house-images/exterior_1.jpeg";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/a11y";

import { db } from "../utils/firebase.config";
export const Slider = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchListings() {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);

      let listings = [];
      querySnap.forEach((doc) => listings.push({ ...doc.data(), id: doc.id }));

      console.log(listings);

      setListings(listings);
      setLoading(false);
    }

    fetchListings();
  }, []);
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={1}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
      className=" h-96"
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      pagination={{ clickable: true }}
      navigation
    >
      {[
        "../house-images/exterior_1.jpeg",
        "../house-images/exterior_2.jpeg",
        "../house-images/exterior_3.jpeg",
      ].map((url, index) => (
        <SwiperSlide key={index}>
          <img src={House1} className="w-full h-full object-cover" />
        </SwiperSlide>
      ))}
      )
    </Swiper>
  );
};

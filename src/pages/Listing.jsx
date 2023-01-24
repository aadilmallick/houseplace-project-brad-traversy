import React from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../utils/firebase.config";
import { getDoc, addDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/a11y";

export const Listing = () => {
  const { categoryName, listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    }

    fetchListing();
  }, [listingId]);

  if (loading) {
    return <h1>Loading</h1>;
  }

  console.log(listing);

  return (
    <>
      <div>
        Listing
        {listing.userRef && (
          <button
            className="block w-48 px-8 py-2 bg-primary rounded text-center"
            onClick={() => navigate(`/contact/${listingId}`)}
          >
            Contact landlord
          </button>
        )}
      </div>
      <div className="h-96">
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[51.505, -0.09]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
        className="border-4 border-black h-96"
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        pagination={{ clickable: true }}
        navigation
      >
        {listing?.imgUrls.map((url, index) => {
          return (
            <SwiperSlide key={index}>
              <div className="bg-zinc-400 h-full">
                <img src={url} className="w-full h-full object-cover" />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};

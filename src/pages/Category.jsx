import React from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../utils/firebase.config";
import { toast } from "react-toastify";
import { useState } from "react";
import { useEffect } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { showError } from "../utils/error";

export const Category = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchlistings = async () => {
      try {
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(10)
        );

        const querySnap = await getDocs(q);

        let fetchedListings = [];
        querySnap.forEach((doc) => {
          fetchedListings.push({ ...doc.data(), id: doc.id });
        });

        console.log(fetchedListings);
        setListings(fetchedListings);
        setLoading(false);
      } catch (e) {
        showError(e);
      }
    };

    fetchlistings();
  }, []);

  if (loading) {
    return <h1>Loading..</h1>;
  }

  return (
    <section className="max-w-5xl mx-auto">
      <h1>Places for {params.categoryName}</h1>
      <div className="grid grid-cols-3 border gap-4">
        {listings.map((listing) => (
          <ListingComponent key={listing.id} {...listing} />
        ))}
      </div>
    </section>
  );
};

function ListingComponent(props) {
  return (
    <div className="p-4 bg-white flex-col justify-center items-center shadow-lg rounded-lg">
      <h1>{props.name}</h1>
      {props.imageUrls && (
        <img src={props.imageUrls[0]} className="h-24 w-24" />
      )}
      <Link to={`/category/${props.type}/${props.id}`}>Go</Link>
    </div>
  );
}

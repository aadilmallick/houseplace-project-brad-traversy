import React from "react";
import { useState } from "react";
import { useAuthStatus } from "../hooks/useAuthStatus";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../utils/firebase.config";
const API_KEY = import.meta.env.VITE_API_KEY;

export const CreateListing = () => {
  const [formData, setFormData] = useState({
    bathrooms: 1,
    bedrooms: 1,
    discountedPrice: 0,
    furnished: false,
    lat: 0,
    lng: 0,
    parking: false,
    type: "rent",
    name: "",
    offer: false,
    regularPrice: 0,
    images: {},
    address: "",
  });
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);

  const { loggedIn, loading, theUser } = useAuthStatus();
  const navigate = useNavigate();

  if (loading) {
    return <h1>Loading..</h1>;
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    let geolocation = {};
    let location;

    console.log("images", formData.images);

    if (geolocationEnabled) {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${formData.address}&key=${API_KEY}`
      );
      const data = response.data;
      location =
        data.status === "ZERO_RESULTS"
          ? undefined
          : data.results[0]?.formatted_address;
      if (!location) {
        toast.error("invalid address");
        return;
      }

      geolocation.lat = data.results[0]?.geometry.location.lat;
      geolocation.lng = data.results[0]?.geometry.location.lng;
    } else {
      geolocation.lat = Number(formData.lat);
      geolocation.lng = Number(formData.lng);
      location = formData.address;
    }

    const imgUrls = await Promise.all(
      [...formData.images].map((image) => uploadImage(image))
    ).catch((e) => console.log(e));

    const formDataCopy = {
      ...formData,
      geolocation,
      imgUrls,
      timestamp: serverTimestamp(),
      userRef: theUser.uid,
      lat: geolocation.lat,
      lng: geolocation.lng,
    };

    delete formDataCopy.images;
    delete formDataCopy.address;
    location = formData.address;
    formDataCopy.location = location;

    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    toast.success("listing made!");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  async function uploadImage(image) {
    const storage = getStorage();
    const filename = `${theUser.uid}-${image.name}-${uuidv4()}`;
    const storageRef = ref(storage, `images/${filename}`);
    const uploadTask = uploadBytesResumable(storageRef, image);
    return new Promise((res, rej) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          rej(error);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            res(downloadURL);
          });
        }
      );
    });
  }

  const onMutate = (e) => {
    console.dir(e.target);

    if (e.target.files) {
      setFormData((prev) => ({ ...prev, images: e.target.files }));
    } else {
      let value = e.target.value;
      if (e.target.value === "true" || e.target.value === "false") {
        value = e.target.value === "true" ? true : false;
      }
      setFormData((prev) => ({ ...prev, [e.target.id]: value }));
    }
  };

  return (
    <div>
      {/* sell or rent , boolean buttons, each field takes in onMutate*/}
      {/* name */}
      {/* bedrooms, bathrooms */}
      {/* parking spot boolean buttons*/}
      {/* furnished boolean buttons */}
      {/* address */}
      {/* offer boolean buttons*/}
      {/* regular price */}
      {/* discounted price only if offer is true */}
      {/* images */}
      {/* submit button */}
      <form onSubmit={onSubmit} className="p-8">
        <div>
          <h3>sell / rent</h3>
          <BooleanButton
            id="type"
            isActive={formData.type === "sell"}
            onMutate={onMutate}
            value={"sell"}
          >
            Sell
          </BooleanButton>
          <BooleanButton
            id="type"
            isActive={formData.type === "rent"}
            onMutate={onMutate}
            value={"rent"}
          >
            Rent
          </BooleanButton>
        </div>
        <div>
          <input
            type="text"
            id="name"
            value={formData.name}
            className="border border-primary p-2 rounded mt-4"
            placeholder="name"
            onChange={onMutate}
          />
        </div>
        <div>
          <input
            type="number"
            id="bedrooms"
            value={formData.bedrooms}
            className="border border-primary p-2 rounded mt-4"
            onChange={onMutate}
          />
          <input
            type="number"
            id="bathrooms"
            value={formData.bathrooms}
            className="border border-primary p-2 rounded mt-4"
            onChange={onMutate}
          />
        </div>
        <div>
          <h3>Parking spot</h3>
          <BooleanButton
            id="parking"
            isActive={formData.parking === true}
            onMutate={onMutate}
            value={true}
          >
            yes
          </BooleanButton>
          <BooleanButton
            id="parking"
            isActive={formData.parking === false}
            onMutate={onMutate}
            value={false}
          >
            No
          </BooleanButton>
        </div>
        <div>
          <h3>furnished</h3>
          <BooleanButton
            id="furnished"
            isActive={formData.furnished === true}
            onMutate={onMutate}
            value={true}
          >
            yes
          </BooleanButton>
          <BooleanButton
            id="furnished"
            isActive={formData.furnished === false}
            onMutate={onMutate}
            value={false}
          >
            No
          </BooleanButton>
        </div>
        <div>
          <input
            type="text"
            id="address"
            value={formData.address}
            className="border border-primary p-2 rounded mt-4"
            placeholder="address"
            onChange={onMutate}
          />
          {!geolocationEnabled && (
            <input
              type="number"
              id="lat"
              value={formData.lat}
              className="border border-primary p-2 rounded mt-4"
              onChange={onMutate}
            />
          )}
          {!geolocationEnabled && (
            <input
              type="number"
              id="lng"
              value={formData.lng}
              className="border border-primary p-2 rounded mt-4"
              onChange={onMutate}
            />
          )}
        </div>
        <div>
          <h3>offer</h3>
          <BooleanButton
            id="offer"
            isActive={formData.offer === true}
            onMutate={onMutate}
            value={true}
          >
            yes
          </BooleanButton>
          <BooleanButton
            id="offer"
            isActive={formData.offer === false}
            onMutate={onMutate}
            value={false}
          >
            No
          </BooleanButton>
        </div>
        <div>
          {/* <input
            type="number"
            id="regularPrice"
            value={formData.regularPrice}
            className="border border-primary p-2 rounded mt-4"
            onChange={onMutate}
          /> */}
          <SmartInput
            type="number"
            id={"regularPrice"}
            value={formData.regularPrice}
            onChange={onMutate}
          />
          {formData.offer && (
            <input
              type="number"
              id="discountedPrice"
              value={formData.discountedPrice}
              className="border border-primary p-2 rounded mt-4"
              onChange={onMutate}
            />
          )}
        </div>
        <div>
          <input
            type="file"
            id="images"
            className="border border-primary p-2 rounded mt-4"
            onChange={onMutate}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
          />
        </div>
        <button type="submit" className="bg-primary p-5">
          create listing
        </button>
      </form>
    </div>
  );
};

function BooleanButton({ children, isActive, id, onMutate, value }) {
  return (
    <button
      type="button"
      id={id}
      className={`px-10 py-2 rounded-lg border-primary font-bold border ${
        isActive && "bg-primary text-white"
      }`}
      onClick={onMutate}
      value={value}
    >
      {children}
    </button>
  );
}

function SmartInput({ type, id, value = "", onMutate, ...rest }) {
  return (
    <input
      type={type}
      id={id}
      value={value}
      className="border border-primary p-2 rounded mt-4"
      onChange={onMutate}
      {...rest}
    />
  );
}

import React from "react";
import { useState } from "react";
import { useAuthStatus } from "../hooks/useAuthStatus";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../utils/firebase.config";
export const DummyRoute = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchPhotos() {
      setLoading(true);
      const response = await listAll(ref(storage, "images/"));
      const urls = await Promise.all(
        response.items.map((reference) => getDownloadURL(reference))
      );
      setImages(urls);
    }

    fetchPhotos().then(() => setLoading(false));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!files) return;

    const imageRef = ref(storage, `images/${uuidv4()}`);
    await uploadBytes(imageRef, files);
    setLoading(false);
    const url = await getDownloadURL(imageRef);
  };

  if (loading) {
    return <h1>loading</h1>;
  }
  return (
    <form onSubmit={onSubmit}>
      <input
        type="file"
        name="file"
        id=""
        onChange={(e) => setFiles(e.target.files[0])}
      />
      <button>submt</button>
      {images.map((image) => (
        <img
          src={image}
          style={{
            width: 200,
            objectFit: "cover",
            marginBottom: 24,
            border: "1px solid black",
          }}
          key={image}
        />
      ))}
    </form>
  );
};

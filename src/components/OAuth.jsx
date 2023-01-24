import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { AiOutlineGoogle } from "react-icons/ai";
import { showError } from "../utils/error";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase.config";
import { toast } from "react-toastify";

export const OAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const onGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      toast.success("Thanks for signing in!");
      navigate("/");
    } catch (e) {
      console.error(e);
      showError(e);
    }
  };

  return (
    <div
      className="px-8 py-4 bg-white border shadow-2xl flex items-center w-36 justify-between mx-auto mt-4 cursor-pointer hover:opacity-75 transition-opacity animate-bounce"
      onClick={onGoogleClick}
    >
      <AiOutlineGoogle className="text-primary -ml-2 inline" size={20} />
      <p className="text-lg">
        Sign {location.pathname === "/sign-up" ? "up" : "in"}
      </p>
    </div>
  );
};

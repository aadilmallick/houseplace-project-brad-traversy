import React from "react";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Loading from "../../src/assets/loadinggif.gif";
import { useChangeDetails } from "../custom-hooks/useChangeDetails";
import { showError } from "../utils/error";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase.config";
import { toast } from "react-toastify";
export const Profile = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { changeDetails, setChangeDetails, toggleChange } = useChangeDetails();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const navigate = useNavigate();

  const onLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(user, {
        displayName: formData.name,
      });
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        name: formData.name,
      });
      toast.success("Details changed!");
      toggleChange();
    } catch (error) {
      showError(error);
    }
  };

  React.useEffect(() => {
    setLoading(true);
    if (auth.currentUser) {
      setUser(auth.currentUser);
      setFormData({
        ...formData,
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
      });
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <img src={Loading} className="" />;
  }

  if (!user) {
    return "Not logged in";
  }

  return (
    <section className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-primary font-semibold text-4xl relative top-2">
          My profile
        </h1>
        <button
          className="bg-primary text-zinc-50 text-lg rounded-full py-2 px-4"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
      <div className="flex justify-between items-center mt-12">
        <p className="relative top-2">Personal details</p>
        <button
          className="bg-primary text-zinc-50 rounded-full py-2 px-4"
          onClick={toggleChange}
        >
          {changeDetails ? "Done" : "Change"}
        </button>
      </div>
      <form
        className="max-w-4xl mx-auto flex-col justify-center items-center"
        onSubmit={onSubmit}
      >
        <div className="form-control mt-8">
          <label className="label">
            <span className="label-text">Your Username</span>
          </label>
          <label className="input-group">
            <span className="bg-secondary">Username</span>
            <input
              type="text"
              placeholder="info@site.com"
              className="input input-bordered w-full"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              disabled={!changeDetails}
            />
          </label>
        </div>
        <div className="form-control mt-8">
          <label className="label">
            <span className="label-text">Your Email</span>
          </label>
          <label className="input-group">
            <span className="bg-secondary">Email</span>
            <input
              type="text"
              placeholder="info@site.com"
              className="input input-bordered w-full"
              value={formData.email}
              disabled
              required
            />
          </label>
        </div>
        <button className="bg-primary w-full py-2 rounded-md mt-8 text-zinc-50 font-bold text-lg">
          Submit
        </button>
      </form>
      <Link to="/create-listing" className="underline text-lg">
        go to listing
      </Link>
    </section>
  );
};

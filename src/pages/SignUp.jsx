import React from "react";
import { useState } from "react";
import {
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlineArrowRight,
} from "react-icons/ai";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebase.config";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { showError } from "../utils/error";
import { OAuth } from "../components/OAuth";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const onToggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("Im here!1");
    try {
      const auth = getAuth();
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(user);
      updateProfile(auth.currentUser, {
        displayName: name,
      });

      const formData = {
        email,
        name,
        timestamp: serverTimestamp(),
      };

      await setDoc(doc(db, "users", user.uid), formData);
      navigate("/");
    } catch (e) {
      showError(e);
    }
  };

  return (
    <form
      className="max-w-4xl mx-auto flex-col justify-center items-center"
      onSubmit={onSubmit}
    >
      <p className="text-primary font-semibold text-4xl mb-12 mt-8">Sign up</p>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Your Username</span>
        </label>
        <label className="input-group">
          <span className="bg-secondary">Username</span>
          <input
            type="text"
            placeholder="info@site.com"
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Your Email</span>
        </label>
        <label className="input-group">
          <span className="bg-secondary">Email</span>
          <input
            type="email"
            placeholder="info@site.com"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Your Password</span>
        </label>
        <label className="input-group">
          <span
            className="hover:opacity-75 bg-secondary"
            onClick={onToggleShowPassword}
          >
            {showPassword && <AiFillEye size={24} />}
            {showPassword || <AiFillEyeInvisible size={24} />}
          </span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="password"
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="flex space-x-4 py-8 items-center">
        <h2 className="text-2xl">Sign up</h2>
        <button type="submit">
          <AiOutlineArrowRight
            className="text-primary hover:text-secondary"
            size={36}
            strokeWidth={10}
          />
        </button>
      </div>
      <div className="flex-column text-center my-8 p-4">
        <p className="text-gray-400">Or?</p>
        <OAuth />
      </div>
      <Link to="/sign-in" className="my-4 inline-block">
        Sign in instead
      </Link>
    </form>
  );
};

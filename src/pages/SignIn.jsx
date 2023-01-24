import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { useState } from "react";
import {
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlineArrowRight,
} from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showError } from "../utils/error";
import { OAuth } from "../components/OAuth";

export const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const onToggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      if (user) navigate("/");
    } catch (e) {
      showError(e);
    }
  };

  return (
    <form
      className="max-w-4xl mx-auto flex-col justify-center items-center"
      onSubmit={onSubmit}
    >
      <p className="text-primary font-semibold text-4xl mb-12 mt-8">
        Welcome back
      </p>
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
          />
        </label>
      </div>
      <div className="flex-column text-center my-8 p-4">
        <p className="text-gray-400">Or?</p>
        <OAuth />
      </div>
      <Link to="/forgot-password" className="my-4 inline-block">
        Forgot Password?
      </Link>
      <div className="flex space-x-4 py-8 items-center">
        <h2 className="text-2xl">Sign in</h2>
        <button type="submit">
          <AiOutlineArrowRight
            className="text-primary hover:text-secondary"
            size={36}
            strokeWidth={10}
          />
        </button>
      </div>
      <Link to="/sign-up" className="my-4 inline-block">
        Sign up instead
      </Link>
    </form>
  );
};

import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { showError } from "../utils/error";
export const ForgotPassword = () => {
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Email was sent");
    } catch (e) {
      showError(e);
    }
  };

  const [email, setEmail] = useState("");
  return (
    <form
      className="max-w-4xl mx-auto flex-col justify-center items-center p-2"
      onSubmit={onSubmit}
    >
      <h1 className="text-4xl font-semibold mb-8">Forgot Password?</h1>
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
      <Link to="/sign-in" className="my-4 inline-block text-primary">
        Sign in instead
      </Link>
      <div className="flex justify-between py-8 items-center">
        <h2 className="text-2xl">Send reset link</h2>
        <button type="submit">
          <AiOutlineArrowRight
            className="text-white bg-primary p-2 rounded-full"
            size={50}
            strokeWidth={10}
          />
        </button>
      </div>
    </form>
  );
};

import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
export const Contact = () => {
  const { listingId } = useParams();
  const { loading, theUser } = useAuthStatus();

  const [message, setMessage] = useState("");

  if (loading) {
    return <h1>loading</h1>;
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-8">
      <textarea
        name=""
        id=""
        cols="30"
        rows="10"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border bg-zinc-100"
      ></textarea>
      <a
        className="block w-48 px-8 py-2 bg-primary rounded text-center"
        href={`mailto:waadlingaadil@gmail.com?Subject=${listingId}&bod=${message}`}
      >
        send email
      </a>
    </div>
  );
};

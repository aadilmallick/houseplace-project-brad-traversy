import React from "react";
import { Link } from "react-router-dom";
import { Slider } from "../components/Slider";

export const Explore = () => {
  return (
    <div>
      <h1>Explore</h1>
      <div>
        <Link to="/category/rent">Rent</Link>
      </div>
      <div>
        <Link to="/category/sell">Sell</Link>
      </div>
      <Slider />
    </div>
  );
};

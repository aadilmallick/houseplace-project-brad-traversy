import React, { useState } from "react";

export const useChangeDetails = () => {
  const [changeDetails, setChangeDetails] = useState(false);

  const toggleChange = () => {
    setChangeDetails((prev) => !prev);
  };

  return { changeDetails, setChangeDetails, toggleChange };
};

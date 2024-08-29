import React from "react";

const Formlabel = ({text,forLabel}) => {
  return (
    <label htmlFor={forLabel} className="text-base inline-block font-medium mb-3 text-text-color">
      {text}
    </label>
  );
};

export default Formlabel;

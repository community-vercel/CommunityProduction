"use client";
import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";

const InputField = ({
  inputType,
  inputName,
  inputId,
  required,
  register,
  error,
  valueAsNumber,
  children,
  disabled
}) => {
  const [showPassword, setShowPassWord] = useState(false);
  let eye;
  if (inputType === "password" && showPassword) {
    eye = <EyeSlashIcon />;
    inputType = "text";
  } else if (!showPassword && inputType === "password") {
    eye = <EyeIcon />;
    inputType = "password";
  }
  return (
    <div className="mb-5">
      <div className="relative">
        {inputType === "textarea" ? (
          <>
            <textarea
              name={inputName}
              id={inputId}
              className={`rounded-full resize-none h-20  outline-none shadow-formFeilds text-text-gray text-sm py-4 ${
                children ? "pl-10" : "pl-5"
              } pr-5 border-2 border-[#E4E4E4] w-full`}
              {...register(inputName, { valueAsNumber })}
            ></textarea>
          </>
        ) : (
          <>
            {children && (
              <div className="absolute top-[50%] translate-y-[-55%] left-4 w-5 h-5">
                {children}
              </div>
            )}

            <input
              type={inputType}
              name={inputName}
              id={inputId}
              required={required}
              className={`rounded-full  outline-none shadow-formFeilds text-text-gray text-sm py-4 bg-white ${
                children ? "pl-10" : "pl-5"
              } pr-5 border-2 border-[#E4E4E4] w-full`}
              {...register(inputName, { valueAsNumber })}
              disabled={disabled}
            />

            {eye && (
              <div
                className="absolute cursor-pointer top-[50%] translate-y-[-55%] right-4 w-5 h-5"
                onClick={() => setShowPassWord(!showPassword)}
              >
                {eye}
              </div>
            )}
          </>
        )}
      </div>

      {error && (
        <span className="text-red-400 text-sm pl-1">{error.message}</span>
      )}
    </div>
  );
};

export default InputField;

"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  UsaFlag,
  SpainFlag,
  FranceFlag,
  JapanFlag,
  PortugalFlag,
  EgyptFlag,
} from "@/assets";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
const LanguageSelector = () => {
  const availableLanguages = [
    {
      language: "English",
      flag: UsaFlag,
    },
    {
      language: "العربية",
      flag: EgyptFlag,
    },
    {
      language: "Français",
      flag: FranceFlag,
    },
    {
      language: "日本語",
      flag: JapanFlag,
    },
    {
      language: "Português",
      flag: PortugalFlag,
    },
    {
      language: "Español",
      flag: SpainFlag,
    },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState(
    availableLanguages[0]
  );
  const [showLanguages, setShowLanguages] = useState(false);
  return (
    <div className="dropdown relative max-w-40 min-w-10 w-full">
      <button
        className="flex justify-between items-center py-1 px-2 rounded-lg w-full group hover:bg-primary"
        onClick={() => {
          setShowLanguages(!showLanguages);
        }}
      >
        <div className="flex gap-1 items-center">
          <Image src={selectedLanguage.flag} className="w-6 h-6" alt="" />
          <span className="hidden md:inline-block font-semibold text-xs uppercase  group-hover:text-white">
            {selectedLanguage.language}
          </span>
        </div>
        <ChevronDownIcon
          className={`h-5 w-5 ml-2 md:ml-8 text-black  group-hover:text-white ${
            showLanguages && "rotate-[-180deg]"
          }`}
        />
      </button>
      <ul
        className={` ${
          showLanguages ? "block" : "hidden"
        } absolute bg-white rounded-md w-[150px] -left-[95px] md:left-0 md:w-full mt-2`}
      >
        {availableLanguages.map((lang) => {
          return (
            selectedLanguage.language !== lang.language && (
              <li
                key={lang.language}
                className="py-1 px-3 flex gap-1 items-center cursor-pointer hover:bg-primary hover:text-white"
                onClick={() => {
                  setSelectedLanguage({ ...lang });
                  setShowLanguages(!showLanguages);
                }}
              >
                <Image src={lang.flag} className="w-5 h-5" alt="" />
                <span className="text-xs uppercase text-balance">
                  {lang.language}
                </span>
              </li>
            )
          );
        })}
      </ul>
    </div>
  );
};

export default LanguageSelector;

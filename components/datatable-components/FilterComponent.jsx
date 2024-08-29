import { XMarkIcon } from "@heroicons/react/16/solid";
import React from "react";

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <div className="border flex items-center border-gray-300 p-2 my-4">
    <input
      id="search"
      type="text"
      placeholder="Search"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
      className="outline-none text-sm"
    />
    <button type="button" onClick={onClear}>
      <XMarkIcon className="w-4 h-4" />
    </button>
  </div>
);

export default FilterComponent;

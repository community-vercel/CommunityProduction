import React from "react";

const Checkbox = ({checkboxId,checkboxLable,chkd,handleChange}) => {
  return (
    <div className="flex gap-2 items-center">
      <input
        type="checkbox"
        id={checkboxId}
        className="appearance-none w-4 h-4 rounded-sm cursor-pointer outline-1 outline outline-gray-200 border-[3px] border-transparent bg-white mt-1 shrink-0 checked:border-white checked:bg-primary  "
        checked={chkd}
        onChange={e => handleChange(e)}
      />
      <label htmlFor={checkboxId} className="cursor-pointer mt-[5px] text-sm text-text-gray">
        {checkboxLable}
      </label>
    </div>
  );
};

export default Checkbox;

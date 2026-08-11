import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex gap-2 items-center mb-3">
      <p className="text-gray-500 whitespace-nowrap">
        {text1}
        <span className="text-gray-700 font-medium">{text2}</span>
      </p>

      <p className="w-6 sm:w-1/2 h-px sm:h-0.5 bg-gray-700 shrink-0"></p>
    </div>
  );
};

export default Title;

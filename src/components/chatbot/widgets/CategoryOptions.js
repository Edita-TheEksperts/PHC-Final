import React from "react";

const CategoryOptions = ({ actionProvider }) => {
const options = [
  { label: "❓ FAQ", value: "FAQ - Frequently asked questions" }, 
  { label: "👤 Mein Konto", value: "MEIN KONTO" },
  { label: "⚡ Dringende Fragen", value: "DRINGENDE FRAGEN" },
  { label: "💳 Meine Zahlungen", value: "MEINE ZAHLUNGEN" },
];



  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map((option, i) => (
        <button
          key={i}
          onClick={() => actionProvider.handleCategory(option.value)}
          className="px-3 py-1 bg-[#B99B5F] text-white text-sm rounded-lg hover:bg-[#8C7545]"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryOptions;

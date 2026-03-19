import React from "react";

const YesNoOptions = ({ actionProvider }) => {
  const options = [
    {
      text: "Ja",
      handler: () => actionProvider.handleMoreQuestions(),
      id: 1,
    },
    {
      text: "Nein",
      handler: () => actionProvider.handleGoodbye(),
      id: 2,
    },
  ];

  return (
    <div className="yesno-container">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={option.handler}
          className="yesno-button"
        >
          {option.text}
        </button>
      ))}
    </div>
  );
};

export default YesNoOptions;

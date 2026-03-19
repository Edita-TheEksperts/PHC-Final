import React from "react";
import faqData from "../../../data/faqData";


const QuestionOptions = ({ payload, actionProvider }) => {
  const categoryName = payload?.category;
  const section = faqData.find(s => s.category === categoryName);

  if (!section) {
    return <p>Keine Fragen gefunden.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {section.questions.map((q, i) => (
        <button
          key={i}
          onClick={() => actionProvider.handleQuestion(categoryName, q.question, q.answer)}
          className="px-3 py-1 bg-[#B99B5F] text-white text-sm rounded-lg hover:bg-[#8C7545]"
        >
          {q.question}
        </button>
      ))}

      <button
        onClick={() => actionProvider.handleCategorySelection()}
        className="px-3 py-1 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600"
      >
        ⬅️ Zurück zu Kategorien
      </button>
    </div>
  );
};

export default QuestionOptions;

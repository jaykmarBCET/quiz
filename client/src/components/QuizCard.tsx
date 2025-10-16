import React, { useState } from "react";
import type { QuizResponse } from "../store/quiz.store";

function QuizCard({
  question,
  selected,
}: {
  question: QuizResponse;
  selected: (
    question: QuizResponse,
    optionKey: "option1" | "option2" | "option3" | "option4"
  ) => void;
}) {
  const [chosen, setChosen] = useState<null | "option1" | "option2" | "option3" | "option4">(null);

  const handleSelect = (option: "option1" | "option2" | "option3" | "option4") => {
    if (chosen) return; // Prevent changing the answer
    setChosen(option);
    selected(question, option);
  };

  const getOptionClasses = (option: "option1" | "option2" | "option3" | "option4") => {
    // Base classes for all options
    const baseClasses = "px-4 py-3 text-base border rounded-lg cursor-pointer transition-all duration-300 ease-in-out flex items-center justify-between";

    if (!chosen) {
      // Classes for the initial state before any option is selected
      return `${baseClasses} bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400`;
    }

    const isCorrect = question[option] === question.correctOption;
    const isChosen = option === chosen;

    if (isCorrect) {
      // Style for the correct answer (always green after selection)
      return `${baseClasses} bg-emerald-500 border-emerald-600 text-white font-semibold`;
    }

    if (isChosen && !isCorrect) {
      // Style for a chosen, but incorrect answer (red)
      return `${baseClasses} bg-rose-500 border-rose-600 text-white font-semibold`;
    }

    // Style for other non-selected, incorrect options (disabled look)
    return `${baseClasses} bg-gray-100 border-gray-200 text-gray-500 opacity-80 cursor-not-allowed`;
  };

  return (
    // Card container with a modern shadow and layout
    <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Question text with improved typography */}
      <h1 className="text-xl font-bold text-gray-800 leading-tight">
        {question.question}
      </h1>

      {/* Options container */}
      <div className="flex flex-col gap-4">
        {(["option1", "option2", "option3", "option4"] as const).map((opt) => (
          <div
            key={opt}
            onClick={() => handleSelect(opt)}
            className={getOptionClasses(opt)}
          >
            <span>{question[opt]}</span>
            {/* Optional: Add icons for feedback */}
            {chosen && question[opt] === question.correctOption && <span>✔️</span>}
            {chosen && opt === chosen && question[opt] !== question.correctOption && <span>❌</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export { QuizCard };
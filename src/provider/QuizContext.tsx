import React, { createContext, useContext, useState } from "react";

interface Distribution {
  position: number;
  percentage: number;
}

interface Question {
  questionNumber?: number;
  question: string;
  type: "text" | "image" | "video";
  options: string[];
  answer: string;
  points: number;
  duration: number;
  description?: string | undefined;
}

interface QuizContextProps {
  quizTitleGlobal: string;
  setQuizTitleGlobal: React.Dispatch<React.SetStateAction<string>>;
  questionsGlobal: Question[];
  setQuestionsGlobal: React.Dispatch<React.SetStateAction<Question[]>>;
  distributionGlobal: Distribution[];
  setDistributionGlobal: React.Dispatch<React.SetStateAction<Distribution[]>>;
  amountGlobal: string;
  setAmountGlobal: React.Dispatch<React.SetStateAction<string>>;
}

const QuizContext = createContext<QuizContextProps | undefined>(undefined);

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuizContext must be used within a QuizProvider");
  }
  return context;
};

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [quizTitleGlobal, setQuizTitleGlobal] = useState<string>("");
  const [questionsGlobal, setQuestionsGlobal] = useState<Question[]>([
    {
      questionNumber: 1,
      question: "",
      type: "text",
      options: [""],
      answer: "",
      points: 0,
      duration: 0,
    },
  ]);

  const [distributionGlobal, setDistributionGlobal] = useState<Distribution[]>([
    { position: 1, percentage: 0 },
    { position: 2, percentage: 0 },
    { position: 3, percentage: 0 },
  ]);
  const [amountGlobal, setAmountGlobal] = useState<string>("");

  return (
    <QuizContext.Provider
      value={{
        quizTitleGlobal,
        setQuizTitleGlobal,
        questionsGlobal,
        setQuestionsGlobal,
        distributionGlobal,
        setDistributionGlobal,
        amountGlobal,
        setAmountGlobal,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

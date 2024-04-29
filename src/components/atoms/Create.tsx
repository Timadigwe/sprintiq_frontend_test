import ButtonPrimary from "@src/components/button-primary";
import FrameComponent7 from "@src/components/frame-component7";
import { useQuizContext } from "@src/provider/QuizContext";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
// import { RiAddLine } from "react-icons/ri";
import { toast, Toaster } from "sonner";

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

const CreateGame: NextPage = () => {
  const router = useRouter();
  const { setQuizTitleGlobal, setQuestionsGlobal } = useQuizContext();
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      questionNumber: 1,
      question: "",
      type: "text",
      options: [""],
      answer: "",
      points: 1,
      duration: 0,
    },
  ]);

  const handleQuizTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuizTitle(e.target.value);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  const handleImageOrVideoChange = (
    questionIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const updatedQuestions = [...questions];
    const value = e.target.value.toLowerCase(); // Convert the input value to lowercase
    if (value === "text" || value === "image" || value === "video") {
      updatedQuestions[questionIndex].type = value;
      setQuestions(updatedQuestions);
    } else {
      // Handle invalid input (optional)
      console.error("Invalid input for question type");
    }
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string,
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectOptionChange = (questionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answer = value;
    setQuestions(updatedQuestions);
  };

  const handleTimerChange = (questionIndex: number, value: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].duration = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    const questionNumber = questions.length + 1;
    setQuestions(prevQuestions => [
      ...prevQuestions,
      {
        questionNumber,
        question: "",
        type: "text", // Assuming the default type is text
        options: [""],
        answer: "",
        points: 1, // Assuming the default points is 0
        duration: 0,
      },
    ]);
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push("");
    setQuestions(updatedQuestions);
  };

  const onBackPress = useCallback(() => {
    void router.push("/dashboard/home");
  }, [router]);

  const onContinue = useCallback(() => {
    if (
      quizTitle.trim() === "" ||
      questions.some(q => q.question.trim() === "")
    ) {
      // Show an alert error if either quizTitle or any question is empty
      toast(
        "Please enter a quiz title and fill in all questions before continuing.",
      );
    } else {
      // Proceed to the next page if quizTitle and questions are not empty
      setQuizTitleGlobal(quizTitle);
      setQuestionsGlobal(questions);
      void router.push("/dashboard/add-reward");
    }
  }, [quizTitle, questions, setQuizTitleGlobal, setQuestionsGlobal, router]);

  //console.log("This are the questions:", questions);
  return (
    <div className="p-4 sm:p-[2rem] lg:p-[3.75rem]  ">
      <Toaster />
      <div className="  relative flex w-full flex-col items-start justify-start overflow-hidden rounded-[1.25rem] border border-[#373737] px-2  pt-[1.25rem] tracking-[normal] [background:linear-gradient(180deg,_#0e2615,_#0f0f0f)] lg:gap-[30px] lg:pl-[57px] lg:pr-[57px]  ">
        <section className="  lg:text-41xl font-inter flex max-w-full flex-col items-end justify-start text-center  text-white lg:w-[1456px]  ">
          <header className="font-inter flex flex-row items-center justify-between self-stretch  text-center text-[#1FC04D] lg:h-[100px]">
            <div className="flex h-[20px] w-full flex-row items-center justify-start gap-2 sm:w-[314px] lg:gap-[30px]">
              <div className="flex flex-col items-center justify-start  px-0 pb-0 lg:pt-[3px]">
                <div className="relative h-[0.9375rem] w-[0.9375rem] cursor-pointer object-contain lg:h-[1.875rem] lg:w-[1.875rem]">
                  <Image
                    fill
                    loading="lazy"
                    alt=""
                    src="/polygon-4.svg"
                    onClick={onBackPress}
                    className="hidden lg:block"
                  />
                </div>
              </div>
              <div className="flex h-[40.1px] flex-1 flex-row items-center justify-start ">
                <div className="relative h-[22px] w-[22px] object-contain lg:h-[40.1px] lg:w-[40.6px]">
                  <Image fill loading="lazy" alt="" src="/group-1124@2x.png" />
                </div>
                <div className="box-border flex h-[20px] flex-1 flex-col items-center px-0 pt-0 lg:h-[31.1px] lg:justify-end lg:pb-[1.1px]">
                  <div className="relative -ml-5 h-[20px] max-w-full shrink-0 self-stretch overflow-hidden sm:-ml-12 lg:ml-0 lg:h-[30px] ">
                    <Image fill loading="lazy" alt="" src="/sprint-iq.svg" />
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="box-border flex w-full max-w-full flex-col items-start justify-center px-5 py-0 lg:w-[1415px] lg:flex-row">
            <div className=" flex w-full max-w-full flex-col items-start justify-start gap-[10px] lg:w-[1089px]">
              <div className="box-border flex max-w-full flex-row items-start justify-center self-stretch py-0 pl-5 lg:pr-[21px]">
                <QuizTitleInput
                  value={quizTitle}
                  onChange={handleQuizTitleChange}
                />
              </div>
              <div className="relative box-border h-px self-stretch border-t-[1px] border-solid border-[#373737]" />
            </div>
          </div>
        </section>
        <section className="font-inter box-border flex w-full max-w-full flex-row items-start  px-0  pt-0 text-center text-white">
          <div className="flex w-full max-w-full flex-col justify-start">
            {questions.map((question, questionIndex) => (
              <div key={questionIndex}>
                <div className="mt-7 flex w-full max-w-full flex-wrap items-start justify-start gap-[29px] self-stretch lg:flex-row">
                  <p className="relative self-stretch text-[2rem] leading-[23px]">
                    {question.questionNumber}
                  </p>

                  <div className="box-border flex w-full max-w-full flex-1 flex-col items-start justify-start gap-y-[20px] px-0 pb-0 lg:flex-row lg:gap-x-5 lg:gap-y-0">
                    <QuestionInput
                      value={question.question}
                      onChange={e =>
                        handleQuestionChange(questionIndex, e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-y-[20px] lg:flex-row lg:items-center">
                  <div className="mr-6">
                    {question.options.map((option, optionIndex) => (
                      <OptionInput
                        key={optionIndex}
                        value={option}
                        onChange={e =>
                          handleOptionChange(
                            questionIndex,
                            optionIndex,
                            e.target.value,
                          )
                        }
                      />
                    ))}
                  </div>
                  <div className="z-[1] box-border flex  w-fit flex-1 flex-col  justify-between rounded-[1.25rem] border-[1px] border-solid border-[#373737] px-[33px] pb-[26px] pt-[23px] text-[20px] text-[#373737] lg:flex-row lg:items-center lg:gap-[34.8px]">
                    <div className=" flex flex-row items-center justify-start hover:text-[#1FC04D] ">
                      <button onClick={() => addOption(questionIndex)}>
                        Add More Options
                      </button>
                      {/* <RiAddLine className=" h-[30px] w-[30px] font-bold " /> */}
                    </div>

                    <CorrectOptionInput
                      value={question.answer}
                      onChange={e =>
                        handleCorrectOptionChange(questionIndex, e.target.value)
                      }
                    />

                    <TimerInput
                      value={question.duration}
                      onChange={e =>
                        handleTimerChange(
                          questionIndex,
                          parseInt(e.target.value),
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <ButtonPrimary
          addQuestion="Add Question"
          onButtonPrimaryClick={addQuestion}
          onButtonPrimary1Click={onContinue}
        />
      </div>
    </div>
  );
};

export default CreateGame;

// Component for the Quiz Title input field
const QuizTitleInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, onChange }) => (
  <input
    type="text"
    placeholder="Input Game Title"
    value={value}
    onChange={onChange}
    className="font-inherit relative m-0 flex h-[76px] w-full  max-w-full shrink-0 items-center justify-center bg-transparent text-center text-2xl font-normal leading-[22.53px] text-[#FFFFFF] text-inherit placeholder-[#FFFFFF] outline-none placeholder:opacity-50 md:text-[2.5rem]"
  />
);

// Component for an individual question
const QuestionInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, onChange }) => (
  <input
    type="text"
    placeholder="Question"
    value={value}
    onChange={onChange}
    className="relative box-border w-full border-b-[1px] border-solid border-[#373737] bg-transparent text-[20px] outline-none"
  />
);

// Component for selecting an image or video
const ImageOrVideoInput: React.FC<{
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ onChange }) => (
  <div className="text-darkgray box-border flex h-11 w-[236px] flex-col items-start justify-start px-0 pb-0  text-xl">
    <label
      htmlFor="fileId"
      className="flex flex-1 flex-row items-start justify-start self-stretch"
    >
      <div className="relative z-[1] h-7 min-h-[28px] w-7">
        <Image fill alt="" src="/vector-11.svg" />
      </div>
      <div className="relative flex flex-1 cursor-pointer flex-col items-start justify-start self-stretch px-0 pb-0 pl-4 pt-0.5 leading-[23px] ">
        Upload image/video
      </div>
    </label>
    <input
      id="fileId"
      type="file"
      accept="image/*, video/*"
      onChange={onChange}
      className=" hidden "
    />
  </div>
);

// Component for an individual option
const OptionInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, onChange }) => (
  <div className="mb-2 flex w-[204px] flex-col items-start justify-start px-0 pb-0 pt-0.5">
    <div className="flex flex-col items-start justify-start gap-[26px] self-stretch">
      <div className="flex flex-row items-center justify-start self-stretch">
        <div className="relative z-[1] h-[33px] w-[33px] rounded-[50%] bg-[#28FF15]" />
        <div className="ml-[1.25rem] flex w-[9.375rem] flex-1 flex-col items-start justify-end px-0 pb-1 pt-0">
          <input
            type="text"
            placeholder="Option"
            value={value}
            onChange={onChange}
            className="relative self-stretch bg-transparent text-[1.25rem] leading-[22.53px] placeholder-[#FFFFFF] outline-none"
          />
        </div>
      </div>
    </div>
  </div>
  // <input type="text" placeholder="Option" value={value} onChange={onChange} />
);

// Component for setting the correct option
const CorrectOptionInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, onChange }) => (
  <input
    type="text"
    className="relative flex w-[180px]  items-center justify-center bg-transparent text-[1.25rem] leading-[22.53px] text-[#373737] placeholder-[#373737] outline-none hover:text-[#1FC04D] hover:placeholder-[#1FC04D] "
    placeholder="Set Correct Option"
    value={value}
    onChange={onChange}
  />
);

// Component for setting the timer
const TimerInput: React.FC<{
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, onChange }) => {
  const [showTimerOverlay, setShowTimerOverlay] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<string>("00:00:00");

  // Function to convert time string (HH:MM:SS) to seconds
  const timeStringToSeconds = (timeString: string): number => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  // Function to handle overlay done click
  const handleOverlayDoneClick = () => {
    const syntheticEvent = {
      target: { value: timeStringToSeconds(selectedTime) },
    };

    onChange(syntheticEvent as unknown as React.ChangeEvent<HTMLInputElement>); // Update the timer value in the parent component
    setShowTimerOverlay(false); // Hide the timer overlay
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Set Timer"
        value={value.toString()} // Convert number to string for input value
        onChange={onChange}
        onFocus={() => setShowTimerOverlay(true)} // Show the timer overlay when input is focused
        className="relative flex w-[100px] items-center justify-center bg-transparent text-[1.25rem] leading-[22.53px] text-[#373737] placeholder-[#373737] outline-none hover:text-[#1FC04D] hover:placeholder-[#1FC04D]"
      />
      {showTimerOverlay && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="w-full max-w-md rounded p-8 shadow-lg [background:linear-gradient(180deg,_#0e2615,_#0f0f0f)]">
            <div className="flex justify-end">
              <button
                onClick={() => setShowTimerOverlay(false)}
                className="text-gray-500 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="mb-4 text-center text-[16px] text-[#D9D9D9] ">
              Set up a timer duration for each question
            </p>
            <div className="box-border flex flex-col items-center justify-center rounded-[1.25rem] border-[1px] border-solid border-[#373737] px-[33px] pb-[26px] pt-[23px] ">
              <div className="flex justify-center">
                <input
                  type="text"
                  value={selectedTime}
                  onChange={e => setSelectedTime(e.target.value)}
                  className="mr-2 bg-transparent px-2 py-1 text-center text-[70px] font-bold text-[#1FC04D] outline-none "
                />
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleOverlayDoneClick}
                  className="rounded-[12px] bg-green-500 px-6 py-2 text-white hover:bg-green-600"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

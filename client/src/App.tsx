import React, { useState, useEffect } from "react";
import {
  useQuizStore,
  type Questions,
  type QuizRequest,
  type QuizResponse,
} from "./store/quiz.store";
import { QuizCard } from "./components/QuizCard";
import { motion } from "framer-motion";
import { ClockLoader } from "react-spinners";
import Markdown from "react-markdown";
import "./assets/mark.css"

function App() {
  const { quiz, createQuestion, isLoading, feedBack, getFeedBack, clearQuiz, clearFeedBack } = useQuizStore();
  const [right, setRight] = useState<Questions[]>([]);
  const [wrong, setWrong] = useState<Questions[]>([]);
  const [isfeedBack, setIsFeedback] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per question

  const [data, setData] = useState<QuizRequest>({
    level: "",
    count: "",
    type: "",
    examName: "",
    description: "",
  });

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  useEffect(() => {
    if (quiz.length === 0 || currentIndex >= quiz.length) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          setCurrentIndex((prevIndex) => prevIndex + 1);
          return 120;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, quiz.length]);

  const selected = (
    question: QuizResponse,
    selected: "option1" | "option2" | "option3" | "option4"
  ) => {
    const select = question[selected];
    let temp: Questions = {
      question: question.question,
      option1: question.option1,
      option2: question.option2,
      option3: question.option3,
      option4: question.option4,
      correctOption: question.correctOption,
      selectedOption: selected
    }
    if (select === question.correctOption) {
      setRight((prev) => [...prev, temp]);
    } else {
      setWrong((prev) => [...prev, temp]);
    }

    if (currentIndex < quiz.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimeLeft(120);
    } else {
      setCurrentIndex(currentIndex + 1); // To trigger completion screen
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentIndex(0);
    setRight([]);
    setWrong([]);
    clearFeedBack()
    clearQuiz()
    createQuestion(data);
  };
  const handelFeedBack = async () => {

    try {
      setIsFeedback(true)
      if (right.length == 0 && wrong.length == 0) return;
      await getFeedBack({ right, wrong })
      
    } catch (error) {
      console.log(error)
    }finally{
      setIsFeedback(false)
    }

  }

  const examNames = [
    "TCS NQT", "Wipro Elite NTH", "Infosys InfyTQ", "Cognizant GenC", "Accenture ASE",
    "Tech Mahindra", "Capgemini", "Mindtree", "HCL TechBee", "IBM CodeKnack",
    "Amazon WOW", "Google Kickstart", "CodeVita", "Flipkart GRiD", "L&T Infotech",
    "Deloitte", "Virtusa", "Tata Elxsi", "Zensar", "DXC Technology",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100 p-6 flex justify-center items-center">
      <div className="max-w-7xl flex flex-row">

        {/* ==== FORM ==== */}
        {quiz.length === 0 && isLoading === false && (
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-2xl p-8 space-y-6 border border-white/40"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              🧠 Create Your Quiz
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600">Type</label>
                <select
                  name="type"
                  value={data.type}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value="">Select Type</option>
                  <option value="competition">Competition</option>
                  <option value="university">University</option>
                  <option value="technical">Technical</option>
                  <option value="aptitude">Aptitude</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600">Level</label>
                <select
                  name="level"
                  value={data.level}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value="">Select Level</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600">Exam Name</label>
              <select
                name="examName"
                value={data.examName}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="">Select Exam</option>
                {examNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600">Description</label>
              <textarea
                name="description"
                value={data.description}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="E.g., DSA, DBMS, Aptitude..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600">Number of Questions</label>
              <input
                type="number"
                name="count"
                value={data.count}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="e.g., 10"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white font-semibold text-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition-transform transform hover:scale-105"
            >
              🚀 Generate Quiz
            </button>
          </motion.form>
        )}

        {/* ==== LOADING ==== */}
        {isLoading && (
          <div className="flex justify-center items-center h-32">
            <ClockLoader size={40} color="#4f46e5" />
          </div>
        )}

        {/* ==== QUIZ & TIMER ==== */}
        {quiz.length > 0 && (
          <div className="space-y-4 overflow-y-auto max-h-[80vh] pr-2">
            <div className="flex justify-between items-center">
              <h1 className="bg-green-500 w-40 px-2 py-2 rounded-2xl text-center italic">
                Right: {right.length}
              </h1>
              <h1 className="bg-red-500 w-40 px-2 py-2 rounded-2xl text-center italic">
                Wrong: {wrong.length}
              </h1>
              <span className="font-mono text-xl text-indigo-700">
                ⏱ {formatTime(timeLeft)}
              </span>
            </div>

            {currentIndex < quiz.length ? (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <QuizCard
                  question={quiz[currentIndex]}
                  selected={selected}
                />
                
              </motion.div>
            ) : (
              <>
                <div className="text-center mt-10">
                  <h2 className="text-2xl font-bold text-green-600 mb-2">🎉 Quiz Completed!</h2>
                  <p className="text-lg text-gray-700">
                    ✅ Correct: {right.length} | ❌ Wrong: {wrong.length}
                  </p>
                  <div className="mark">
                    <p>{isfeedBack&&"Wait for feedback"}</p>
                    <Markdown >{feedBack}</Markdown>

                  </div>
                  <div className="flex gap-4 justify-center items-center">

                  <button className="bg-green-500 px-2 py-1 rounded cursor-pointer" onClick={() => {

                    if (feedBack.length <= 0) {
                      handelFeedBack()
                    }

                  }}>FeedBack</button>
                  <button onClick={()=>{
                    clearQuiz()
                    clearFeedBack()

                  }} className="bg-green-500 px-2 py-1 rounded cursor-pointer">Try Again</button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

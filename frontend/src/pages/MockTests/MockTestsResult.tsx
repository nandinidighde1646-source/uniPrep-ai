
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

interface ResultQuestion {
  id: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: "A" | "B" | "C" | "D";
  explanation: string | null;
  marks: number;
}

interface SubmittedAnswer {
  questionId: number;
  selectedOption: "A" | "B" | "C" | "D";
  isCorrect: boolean;
}

interface TestResult {
  id: number;
  score: number;
  totalMarks: number;
  percentage: number;
  submittedAt: string | null;
  test: {
    title: string;
    subject: string;
    questions: ResultQuestion[];
  };
  answers: SubmittedAnswer[];
}

function MockTestResult() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        if (
          !attemptId ||
          !/^\d+$/.test(attemptId) ||
          Number(attemptId) <= 0
        ) {
          toast.error("Invalid result ID.");
          return;
        }

        const response = await api.get(
          `/api/mock-tests/attempts/${attemptId}/result`
        );

        setResult(response.data.data);
      } catch {
        toast.error("Unable to load your test result.");
      } finally {
        setLoading(false);
      }
    };

    void fetchResult();
  }, [attemptId]);

  if (loading) {
    return <div className="p-10 text-center">Loading your result...</div>;
  }

  if (!result) {
    return (
      <div className="p-10 text-center">
        <p className="mb-4 text-gray-700">
          Your result could not be loaded.
        </p>
        <Link
          to="/mock-tests"
          className="font-medium text-blue-600 hover:underline"
        >
          Back to Mock Tests
        </Link>
      </div>
    );
  }

  const answerMap = new Map(
    result.answers.map((answer) => [answer.questionId, answer])
  );

  const getOptionText = (
    question: ResultQuestion,
    option: "A" | "B" | "C" | "D"
  ) => {
    const optionMap = {
      A: question.optionA,
      B: question.optionB,
      C: question.optionC,
      D: question.optionD,
    };

    return optionMap[option];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <section className="mb-8 rounded-2xl bg-white p-6 text-center shadow-sm md:p-10">
          <div className="mb-3 text-5xl">
            {result.percentage >= 60 ? "🎉" : "📚"}
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Test Completed!
          </h1>

          <p className="mt-2 text-gray-600">{result.test.title}</p>
          <p className="text-sm text-gray-500">{result.test.subject}</p>

          <div className="my-8">
            <p className="text-sm font-medium text-gray-500">Your Score</p>
            <p className="mt-1 text-5xl font-bold text-blue-600">
              {result.score}
              <span className="text-2xl text-gray-400">
                {" "}/ {result.totalMarks}
              </span>
            </p>
            <p className="mt-2 text-xl font-semibold text-gray-800">
              {result.percentage}%
            </p>
          </div>

          <div className="mx-auto grid max-w-md grid-cols-2 gap-4">
            <div className="rounded-xl bg-green-50 p-4">
              <p className="text-2xl font-bold text-green-700">
                {result.answers.filter((answer) => answer.isCorrect).length}
              </p>
              <p className="text-sm text-green-800">Correct answers</p>
            </div>

            <div className="rounded-xl bg-red-50 p-4">
              <p className="text-2xl font-bold text-red-700">
                {result.test.questions.length -
                  result.answers.filter((answer) => answer.isCorrect).length}
              </p>
              <p className="text-sm text-red-800">Incorrect / unanswered</p>
            </div>
          </div>
        </section>

        <h2 className="mb-5 text-2xl font-bold text-gray-900">
          Answer Review
        </h2>

        <div className="space-y-5">
          {result.test.questions.map((question, index) => {
            const answer = answerMap.get(question.id);

            return (
              <article
                key={question.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-6"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-gray-900">
                    Q{index + 1}. {question.questionText}
                  </h3>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      answer?.isCorrect
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {answer?.isCorrect ? "Correct" : "Incorrect"}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  {(
                    ["A", "B", "C", "D"] as const
                  ).map((option) => {
                    const isCorrect = question.correctOption === option;
                    const isSelected = answer?.selectedOption === option;

                    return (
                      <div
                        key={option}
                        className={`rounded-lg border p-3 ${
                          isCorrect
                            ? "border-green-300 bg-green-50 text-green-900"
                            : isSelected
                              ? "border-red-300 bg-red-50 text-red-900"
                              : "border-gray-200 text-gray-700"
                        }`}
                      >
                        <strong>{option}.</strong>{" "}
                        {getOptionText(question, option)}
                        {isCorrect && " — Correct answer"}
                        {!isCorrect && isSelected && " — Your answer"}
                      </div>
                    );
                  })}
                </div>

                {!answer && (
                  <p className="mt-3 text-sm text-gray-600">
                    You did not answer this question.
                  </p>
                )}

                {question.explanation && (
                  <div className="mt-4 rounded-lg bg-blue-50 p-4">
                    <p className="mb-1 text-sm font-semibold text-blue-900">
                      Explanation
                    </p>
                    <p className="text-sm text-blue-800">
                      {question.explanation}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/mock-tests"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to Mock Tests
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MockTestResult;

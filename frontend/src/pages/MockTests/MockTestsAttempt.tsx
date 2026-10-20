
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

interface Question {
  id: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  marks: number;
}

interface MockTest {
  id: number;
  title: string;
  description: string | null;
  subject: string;
  semester: number;
  branch: string;
  duration: number;
  totalMarks: number;
  questions: Question[];
}

interface Attempt {
  id: number;
  mockTestId: number;
  totalMarks: number;
  startedAt: string;
}

type Option = "A" | "B" | "C" | "D";

function MockTestAttempt() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [test, setTest] = useState<MockTest | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [answers, setAnswers] = useState<Record<number, Option>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const submitTest = useCallback(async () => {
    if (!attempt || submitting) return;

    setSubmitting(true);

    try {
      const response = await api.post(
        `/api/mock-tests/attempts/${attempt.id}/submit`,
        {
          answers: Object.entries(answers).map(
            ([questionId, selectedOption]) => ({
              questionId: Number(questionId),
              selectedOption,
            })
          ),
        }
      );

      toast.success("Test submitted successfully!");
      navigate(`/mock-tests/results/${response.data.data.id}`, {
        replace: true,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Submission failed.";

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }, [attempt, answers, navigate, submitting]);

  useEffect(() => {
    const loadTest = async () => {
      try {
        if (!id || !/^\d+$/.test(id) || Number(id) <= 0) {
          toast.error("Invalid mock test ID.");
          navigate("/mock-tests", { replace: true });
          return;
        }

        const testResponse = await api.get(`/api/mock-tests/${id}`);
        const testData: MockTest = testResponse.data.data;

        if (!testData || !testData.questions?.length) {
          toast.error("This test has no questions.");
          navigate("/mock-tests", { replace: true });
          return;
        }

        const attemptResponse = await api.post(
          `/api/mock-tests/${id}/attempts`
        );

        setTest(testData);
        setAttempt(attemptResponse.data.data);
      } catch {
        toast.error("Unable to start this test.");
        navigate("/mock-tests", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    void loadTest();
  }, [id, navigate]);

  useEffect(() => {
    if (!attempt || !test) return;

    const deadline =
      new Date(attempt.startedAt).getTime() + test.duration * 60_000;

    const updateTimer = () => {
      const remaining = Math.max(
        0,
        Math.ceil((deadline - Date.now()) / 1000)
      );

      setSecondsLeft(remaining);

      if (remaining === 0) {
        void submitTest();
      }
    };

    updateTimer();
    const timer = window.setInterval(updateTimer, 1000);

    return () => window.clearInterval(timer);
  }, [attempt, test, submitTest]);

  if (loading) {
    return <div className="p-10 text-center">Preparing your test...</div>;
  }

  if (!test || !attempt) {
    return null;
  }

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-5 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {test.title}
            </h1>
            <p className="mt-1 text-gray-600">
              {test.subject} · Semester {test.semester}
            </p>
          </div>

          <div className="rounded-lg bg-blue-50 px-4 py-3 text-center">
            <p className="text-sm text-blue-700">Time remaining</p>
            <p
              className={`text-2xl font-bold tabular-nums ${
                secondsLeft <= 60 ? "text-red-600" : "text-blue-900"
              }`}
            >
              {formatTime(secondsLeft)}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {test.questions.map((question, index) => {
            const options: { key: Option; text: string }[] = [
              { key: "A", text: question.optionA },
              { key: "B", text: question.optionB },
              { key: "C", text: question.optionC },
              { key: "D", text: question.optionD },
            ];

            return (
              <article
                key={question.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-6"
              >
                <div className="mb-4 flex justify-between gap-3">
                  <h2 className="font-semibold text-gray-900">
                    Q{index + 1}. {question.questionText}
                  </h2>
                  <span className="shrink-0 text-sm text-gray-500">
                    {question.marks} mark(s)
                  </span>
                </div>

                <div className="space-y-3">
                  {options.map((option) => (
                    <label
                      key={option.key}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${
                        answers[question.id] === option.key
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.key}
                        checked={answers[question.id] === option.key}
                        onChange={() =>
                          setAnswers((previous) => ({
                            ...previous,
                            [question.id]: option.key,
                          }))
                        }
                        disabled={submitting}
                        className="mt-1"
                      />
                      <span className="text-gray-800">
                        <strong>{option.key}.</strong> {option.text}
                      </span>
                    </label>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-600">
            Answered {Object.keys(answers).length} of {test.questions.length}
            {" "}questions
          </p>

          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to submit your test?"
                )
              ) {
                void submitTest();
              }
            }}
            disabled={submitting || secondsLeft === 0}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Test"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MockTestAttempt;

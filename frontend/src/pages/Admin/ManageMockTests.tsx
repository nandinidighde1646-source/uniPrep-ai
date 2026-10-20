
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ClipboardList,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  LoaderCircle,
} from "lucide-react";
import api from "../../services/api";

type Option = "A" | "B" | "C" | "D";

interface QuestionForm {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: Option;
  explanation: string;
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
  isPublished: boolean;
  _count: {
    questions: number;
  };
}

interface TestForm {
  title: string;
  description: string;
  subject: string;
  semester: number;
  branch: string;
  duration: number;
}

const emptyQuestion = (): QuestionForm => ({
  questionText: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctOption: "A",
  explanation: "",
  marks: 1,
});

const initialForm: TestForm = {
  title: "",
  description: "",
  subject: "",
  semester: 4,
  branch: "CSE-CY",
  duration: 30,
};


interface ParsedQuestionResult {
  questions: QuestionForm[];
  errors: string[];
}

const parseBulkQuestions = (input: string): ParsedQuestionResult => {
  const questions: QuestionForm[] = [];
  const errors: string[] = [];

  const blocks = input
    .trim()
    .split(/(?=^\s*Q\s*:)/im)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length === 0) {
    return {
      questions: [],
      errors: ["Paste at least one question starting with Q:."],
    };
  }

  blocks.forEach((block, index) => {
    const questionNumber = index + 1;
    const fields: Record<string, string> = {};
    let currentField = "";

    for (const line of block.split(/\r?\n/)) {
      const match = line.match(
        /^\s*(Q|A|B|C|D|Answer|Explanation|Marks)\s*:\s*(.*)$/i
      );

      if (match) {
        currentField = match[1].toLowerCase();
        fields[currentField] = match[2].trim();
      } else if (currentField && line.trim()) {
        fields[currentField] +=
          `${fields[currentField] ? "\n" : ""}${line.trim()}`;
      }
    }

    const missing = ["q", "a", "b", "c", "d", "answer"].filter(
      (field) => !fields[field]?.trim()
    );

    const answer = fields.answer?.trim().toUpperCase();

    if (missing.length > 0) {
      errors.push(
        `Question ${questionNumber}: missing ${missing
          .map((field) => field === "q" ? "question text" : field === "answer" ? "Answer" : `option ${field.toUpperCase()}`)
          .join(", ")}.`
      );
      return;
    }

    if (!["A", "B", "C", "D"].includes(answer)) {
      errors.push(
        `Question ${questionNumber}: Answer must be A, B, C, or D.`
      );
      return;
    }

    const marksText = fields.marks?.trim();
    const marks = marksText ? Number(marksText) : 1;

    if (!Number.isInteger(marks) || marks < 1 || marks > 100) {
      errors.push(`Question ${questionNumber}: Marks must be 1–100.`);
      return;
    }

    questions.push({
      questionText: fields.q.trim(),
      optionA: fields.a.trim(),
      optionB: fields.b.trim(),
      optionC: fields.c.trim(),
      optionD: fields.d.trim(),
      correctOption: answer as Option,
      explanation: fields.explanation?.trim() ?? "",
      marks,
    });
  });

  return { questions, errors };
};


function ManageMockTests() {
  const [tests, setTests] = useState<MockTest[]>([]);
  const [form, setForm] = useState<TestForm>(initialForm);
  const [questions, setQuestions] = useState<QuestionForm[]>([
    emptyQuestion(),
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyTestId, setBusyTestId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

const [bulkText, setBulkText] = useState("");
const [bulkPreview, setBulkPreview] = useState<QuestionForm[]>([]);
const [bulkErrors, setBulkErrors] = useState<string[]>([]);

  const fetchTests = useCallback(async () => {
    try {
      const response = await api.get("/api/mock-tests/admin/all");
      setTests(response.data.data);
    } catch {
      toast.error("Failed to load mock tests. Check your admin access.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTests();
  }, [fetchTests]);

  
  const handlePreviewBulkQuestions = () => {
    const result = parseBulkQuestions(bulkText);

    setBulkPreview(result.questions);
    setBulkErrors(result.errors);

    if (result.questions.length > 0) {
      toast.success(`${result.questions.length} question(s) parsed.`);
    } else {
      toast.error("No valid questions found. Check the format.");
    }
  };

  const handleImportBulkQuestions = () => {
    if (bulkPreview.length === 0 || bulkErrors.length > 0) {
      toast.error("Fix the errors and preview the questions first.");
      return;
    }

    setQuestions((previous) => {
      const existingQuestions = previous.filter(
        (question) =>
          question.questionText.trim() ||
          question.optionA.trim() ||
          question.optionB.trim() ||
          question.optionC.trim() ||
          question.optionD.trim()
      );

      return [...existingQuestions, ...bulkPreview];
    });

    setBulkText("");
    setBulkPreview([]);
    setBulkErrors([]);
    toast.success(`${bulkPreview.length} question(s) added to the test form.`);
  };


  const updateQuestion = (
    index: number,
    field: keyof QuestionForm,
    value: string | number
  ) => {
    setQuestions((previous) =>
      previous.map((question, questionIndex) =>
        questionIndex === index
          ? { ...question, [field]: value }
          : question
      )
    );
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (questions.length === 0) {
      toast.error("Add at least one question.");
      return;
    }

    const incomplete = questions.some(
      (question) =>
        !question.questionText.trim() ||
        !question.optionA.trim() ||
        !question.optionB.trim() ||
        !question.optionC.trim() ||
        !question.optionD.trim()
    );

    if (incomplete) {
      toast.error("Complete the question and all four options.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        description: form.description.trim() || undefined,
        questions: questions.map((question) => ({
          ...question,
          questionText: question.questionText.trim(),
          optionA: question.optionA.trim(),
          optionB: question.optionB.trim(),
          optionC: question.optionC.trim(),
          optionD: question.optionD.trim(),
          explanation: question.explanation.trim() || undefined,
          marks: Number(question.marks),
        })),
      };

      await api.post("/api/mock-tests", payload);

      toast.success("Mock test created as a draft!");
      setForm(initialForm);
      setQuestions([emptyQuestion()]);
      setShowForm(false);
      await fetchTests();
    } catch {
      toast.error("Could not create the test. Check the entered details.");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (test: MockTest) => {
    setBusyTestId(test.id);

    try {
      await api.patch(`/api/mock-tests/${test.id}/publish`, {
        isPublished: !test.isPublished,
      });

      toast.success(
        test.isPublished ? "Test unpublished." : "Test published!"
      );

      await fetchTests();
    } catch {
      toast.error(
        "Could not update publication status. Ensure the test has questions."
      );
    } finally {
      setBusyTestId(null);
    }
  };

  const handleDelete = async (test: MockTest) => {
    const confirmed = window.confirm(
      `Delete "${test.title}"? This may also remove its questions and attempt history.`
    );

    if (!confirmed) return;

    setBusyTestId(test.id);

    try {
      await api.delete(`/api/mock-tests/${test.id}`);
      toast.success("Mock test deleted.");
      await fetchTests();
    } catch {
      toast.error("Failed to delete the mock test.");
    } finally {
      setBusyTestId(null);
    }
  };

  const publishedCount = tests.filter((test) => test.isPublished).length;
  const draftCount = tests.length - publishedCount;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <ClipboardList size={30} className="text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Mock Tests
            </h1>
          </div>
          <p className="text-gray-600">
            Create MCQ tests, manage drafts, and publish tests for students.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((previous) => !previous)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
        >
          <Plus size={20} />
          {showForm ? "Close Form" : "Create Mock Test"}
        </button>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total Tests</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {tests.length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Published</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {publishedCount}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Drafts</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">
            {draftCount}
          </p>
        </div>
      </section>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="space-y-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-7"
        >
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Create a New Test
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              The test is saved as a draft until you publish it.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">
                Test Title *
              </span>
              <input
                required
                maxLength={150}
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                placeholder="e.g. Computer Networks — Practice Test 1"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-green-500"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">
                Subject *
              </span>
              <input
                required
                value={form.subject}
                onChange={(event) =>
                  setForm({ ...form, subject: event.target.value })
                }
                placeholder="e.g. Computer Networks"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-green-500"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">
                Semester *
              </span>
              <select
                value={form.semester}
                onChange={(event) =>
                  setForm({ ...form, semester: Number(event.target.value) })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
                  <option key={semester} value={semester}>
                    Semester {semester}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">
                Branch *
              </span>
              <input
                required
                value={form.branch}
                onChange={(event) =>
                  setForm({ ...form, branch: event.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">
                Duration (minutes) *
              </span>
              <input
                type="number"
                min={1}
                max={300}
                required
                value={form.duration}
                onChange={(event) =>
                  setForm({ ...form, duration: Number(event.target.value) })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">
                Description
              </span>
              <input
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                placeholder="Optional test instructions"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
              />
            </label>
          </div>

          <section className="space-y-4 rounded-xl border border-blue-200 bg-blue-50 p-5">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Bulk Import Questions
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Paste multiple MCQs below. Each question must start with Q:.
                Preview the questions before importing them.
              </p>
            </div>

            <textarea
              rows={12}
              value={bulkText}
              onChange={(event) => {
                setBulkText(event.target.value);
                setBulkPreview([]);
                setBulkErrors([]);
              }}
              placeholder={`Q: Which OOP concept supports code reuse?
A: Encapsulation
B: Inheritance
C: Abstraction
D: Polymorphism
Answer: B
Explanation: Inheritance allows a class to reuse features of another class.
Marks: 1

Q: Which keyword refers to the current object in Java?
A: super
B: static
C: this
D: final
Answer: C
Explanation: this refers to the current object.
Marks: 1`}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 font-mono text-sm"
            />

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handlePreviewBulkQuestions}
                className="rounded-lg border border-blue-600 px-4 py-2 font-medium text-blue-700 hover:bg-blue-100"
              >
                Preview Questions
              </button>

              <button
                type="button"
                onClick={handleImportBulkQuestions}
                disabled={bulkPreview.length === 0 || bulkErrors.length > 0}
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Import {bulkPreview.length} Questions
              </button>
            </div>

            {bulkErrors.length > 0 && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="font-semibold text-red-700">
                  Please fix these issues:
                </p>
                <ul className="mt-2 list-inside list-disc text-sm text-red-700">
                  {bulkErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {bulkPreview.length > 0 && (
              <div className="rounded-lg border border-green-200 bg-white p-4">
                <p className="font-semibold text-green-700">
                  {bulkPreview.length} valid question(s) ready to import
                </p>
                <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-gray-700">
                  {bulkPreview.map((question, index) => (
                    <li key={`${index}-${question.questionText}`}>
                      <span className="font-medium">
                        {question.questionText}
                      </span>
                      <span className="block pl-6 text-gray-500">
                        Correct answer: {question.correctOption} · {question.marks} mark(s)
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </section>

          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-gray-900">
                Questions ({questions.length})
              </h3>
              <button
                type="button"
                onClick={() => setQuestions((previous) => [...previous, emptyQuestion()])}
                className="inline-flex items-center gap-2 rounded-lg border border-green-600 px-4 py-2 font-medium text-green-700 hover:bg-green-50"
              >
                <Plus size={18} />
                Add Question
              </button>
            </div>

            {questions.map((question, index) => (
              <section
                key={index}
                className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4 md:p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold text-gray-900">
                    Question {index + 1}
                  </h4>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setQuestions((previous) =>
                          previous.filter((_, i) => i !== index)
                        )
                      }
                      className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  )}
                </div>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-gray-700">
                    Question *
                  </span>
                  <textarea
                    required
                    rows={2}
                    value={question.questionText}
                    onChange={(event) =>
                      updateQuestion(index, "questionText", event.target.value)
                    }
                    placeholder="Enter the question"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                  />
                </label>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {(["A", "B", "C", "D"] as const).map((option) => {
                    const field = `option${option}` as keyof QuestionForm;

                    return (
                      <label key={option} className="space-y-2">
                        <span className="text-sm font-medium text-gray-700">
                          Option {option} *
                        </span>
                        <input
                          required
                          value={question[field] as string}
                          onChange={(event) =>
                            updateQuestion(index, field, event.target.value)
                          }
                          placeholder={`Enter option ${option}`}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                        />
                      </label>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">
                      Correct Answer *
                    </span>
                    <select
                      value={question.correctOption}
                      onChange={(event) =>
                        updateQuestion(index, "correctOption", event.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                    >
                      {(["A", "B", "C", "D"] as const).map((option) => (
                        <option key={option} value={option}>
                          Option {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">
                      Marks *
                    </span>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      required
                      value={question.marks}
                      onChange={(event) =>
                        updateQuestion(index, "marks", Number(event.target.value))
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                    />
                  </label>
                </div>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-gray-700">
                    Explanation (optional)
                  </span>
                  <textarea
                    rows={2}
                    value={question.explanation}
                    onChange={(event) =>
                      updateQuestion(index, "explanation", event.target.value)
                    }
                    placeholder="Explain why the correct answer is right"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                  />
                </label>
              </section>
            ))}
          </div>

          <div className="flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-5">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
            >
              {saving && <LoaderCircle size={18} className="animate-spin" />}
              {saving ? "Creating..." : "Create Draft"}
            </button>
          </div>
        </form>
      )}

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-5">
          <h2 className="text-xl font-bold text-gray-900">All Mock Tests</h2>
        </div>

        {loading ? (
          <p className="p-8 text-center text-gray-500">Loading tests...</p>
        ) : tests.length === 0 ? (
          <div className="p-10 text-center">
            <ClipboardList size={42} className="mx-auto mb-3 text-gray-400" />
            <h3 className="font-semibold text-gray-800">No mock tests yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first test using the button above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {tests.map((test) => (
              <article
                key={test.id}
                className="flex flex-col justify-between gap-4 p-5 md:flex-row md:items-center"
              >
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {test.title}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        test.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {test.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {test.subject} · Semester {test.semester} · {test.branch}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {test._count.questions} questions · {test.duration} min ·{" "}
                    {test.totalMarks} marks
                  </p>
                  {test.description && (
                    <p className="mt-2 text-sm text-gray-500">
                      {test.description}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void handlePublish(test)}
                    disabled={busyTestId === test.id}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-50 ${
                      test.isPublished
                        ? "border border-amber-300 text-amber-700 hover:bg-amber-50"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {test.isPublished ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                    {test.isPublished ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleDelete(test)}
                    disabled={busyTestId === test.id}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ManageMockTests;

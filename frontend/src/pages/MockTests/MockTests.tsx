
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

interface MockTest {
  id: number;
  title: string;
  description: string | null;
  subject: string;
  semester: number;
  branch: string;
  duration: number;
  totalMarks: number;
  _count: {
    questions: number;
  };
}

function MockTests() {
  const [tests, setTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await api.get("/api/mock-tests");
        setTests(response.data.data);
      } catch {
        toast.error("Failed to load mock tests.");
      } finally {
        setLoading(false);
      }
    };

    void fetchTests();
  }, []);

  return (
    <div className="min-h-[70vh] bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Mock Tests
        </h1>

        <p className="mb-8 text-gray-600">
          Practice with timed tests and track your preparation.
        </p>

        {loading ? (
          <p className="text-gray-600">Loading mock tests...</p>
        ) : tests.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <div className="mb-3 text-4xl">📝</div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              No mock tests available yet
            </h2>
            <p className="text-gray-600">
              Published tests will appear here when they are ready.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tests.map((test) => (
              <article
                key={test.id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    Semester {test.semester}
                  </span>
                  <span className="text-sm text-gray-500">
                    {test.branch}
                  </span>
                </div>

                <h2 className="mb-2 text-xl font-semibold text-gray-900">
                  {test.title}
                </h2>

                <p className="mb-4 text-sm text-gray-600">
                  {test.description || test.subject}
                </p>

                <div className="mb-6 grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="font-semibold text-gray-900">
                      {test._count.questions}
                    </p>
                    <p className="text-gray-500">Questions</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="font-semibold text-gray-900">
                      {test.duration} min
                    </p>
                    <p className="text-gray-500">Duration</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="font-semibold text-gray-900">
                      {test.totalMarks}
                    </p>
                    <p className="text-gray-500">Marks</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/mock-tests/${test.id}`)}
                  className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700"
                >
                  Start Test
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MockTests;

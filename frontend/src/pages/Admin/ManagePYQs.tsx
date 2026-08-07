import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getPYQs, deletePYQ } from "../../services/pyqs.service";
import toast from "react-hot-toast";

interface PYQ {
  id: number;
  title: string;
  subject: string;
  semester: number;
  branch: string;
  fileUrl: string;
}

function ManagePYQs() {
  const [pyqs, setPyqs] = useState<PYQ[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this PYQ?")) {
      return;
    }

    try {
      await deletePYQ(id);

      toast.success("PYQ deleted successfully!");

      setPyqs((prevPyqs) =>
        prevPyqs.filter((pyq) => pyq.id !== id)
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete PYQ.");
    }
  };

  useEffect(() => {
    const fetchPYQs = async () => {
      try {
        const data = await getPYQs();
        setPyqs(data);
      } catch (error) {
        console.error("Failed to fetch PYQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPYQs();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Manage PYQs
          </h1>

          <p className="text-gray-500 mt-2">
            View, upload and manage all previous year question papers.
          </p>
        </div>

        <Link
          to="/upload-pyq"
          className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700"
        >
          + Upload PYQ
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <input
          type="text"
          placeholder="Search PYQs..."
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4">Subject</th>
              <th className="text-left p-4">Semester</th>
              <th className="text-left p-4">Branch</th>
              <th className="text-center p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="p-4" colSpan={5}>
                  Loading...
                </td>
              </tr>
            ) : pyqs.length === 0 ? (
              <tr>
                <td className="p-4" colSpan={5}>
                  No PYQs found.
                </td>
              </tr>
            ) : (
              pyqs.map((pyq) => (
                <tr
                  key={pyq.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4">{pyq.title}</td>
                  <td className="p-4">{pyq.subject}</td>
                  <td className="p-4">{pyq.semester}</td>
                  <td className="p-4">{pyq.branch}</td>

                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-4">
                      <a
                        href={pyq.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        View
                      </a>

                      <button
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(pyq.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManagePYQs;
import { useEffect, useState } from "react";
import {
  BookOpen,
  FileText,
  Users,
  FolderOpen,
} from "lucide-react";

import StatCard from "../../components/Admin/StatCard";

import { getNotes } from "../../services/notes.service";
import { getPYQs } from "../../services/pyqs.service";

function AdminDashboard() {
  const [notesCount, setNotesCount] = useState(0);
  const [pyqsCount, setPyqsCount] = useState(0);
  const [subjectsCount, setSubjectsCount] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const notes = await getNotes();
        const pyqs = await getPYQs();

        setNotesCount(notes.length);
        setPyqsCount(pyqs.length);

        const subjects = new Set([
          ...notes.map((note: any) => note.subject),
          ...pyqs.map((pyq: any) => pyq.subject),
        ]);

        setSubjectsCount(subjects.size);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">
        Admin Dashboard
      </h1>

      <p className="text-gray-600 mt-2">
        Welcome to the UniPrep AI Admin Panel.
      </p>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
        <StatCard
          title="Total Notes"
          value={notesCount}
          icon={<BookOpen size={28} />}
          color="bg-blue-500"
        />

        <StatCard
          title="Total PYQs"
          value={pyqsCount}
          icon={<FileText size={28} />}
          color="bg-green-500"
        />

        <StatCard
          title="Total Users"
          value={0}
          icon={<Users size={28} />}
          color="bg-purple-500"
        />

        <StatCard
          title="Subjects"
          value={subjectsCount}
          icon={<FolderOpen size={28} />}
          color="bg-orange-500"
        />
      </div>

      {/* Placeholder Sections */}
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold">
            Recent Notes
          </h2>

          <p className="text-gray-500 mt-3">
            Recent uploaded notes will appear here.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold">
            Recent PYQs
          </h2>

          <p className="text-gray-500 mt-3">
            Recent uploaded question papers will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
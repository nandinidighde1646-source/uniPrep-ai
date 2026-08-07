import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getNotes, deleteNote } from "../../services/notes.service";
import toast from "react-hot-toast";

interface Note {
  id: number;
  title: string;
  subject: string;
  semester: number;
  branch: string;
  fileUrl: string;
}

function ManageNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // Delete Function
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await deleteNote(id);

      toast.success("Note deleted successfully!");

      setNotes((prevNotes) =>
        prevNotes.filter((note) => note.id !== id)
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete note.");
    }
  };

  //fetch Notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getNotes();
        setNotes(data);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Manage Notes
          </h1>

          <p className="text-gray-500 mt-2">
            View, upload and manage all notes.
          </p>
        </div>

        <Link
          to="/add-note"
          className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700"
        >
          + Add Note
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <input
          type="text"
          placeholder="Search notes..."
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
            ) : notes.length === 0 ? (
              <tr>
                <td className="p-4" colSpan={5}>
                  No notes found.
                </td>
              </tr>
            ) : (
              notes.map((note) => (
                <tr
                  key={note.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4">{note.title}</td>
                  <td className="p-4">{note.subject}</td>
                  <td className="p-4">{note.semester}</td>
                  <td className="p-4">{note.branch}</td>
<td className="p-4 text-center">
  <div className="flex justify-center gap-4">
    <a
      href={note.fileUrl}
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
      onClick={() => handleDelete(note.id)}
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

export default ManageNotes;
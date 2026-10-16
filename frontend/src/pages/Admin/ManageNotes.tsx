
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNotes, deleteNote, updateNote } from "../../services/notes.service";
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
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [saving, setSaving] = useState(false);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await deleteNote(id);
      toast.success("Note deleted successfully!");
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete note.");
    }
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingNote) return;

    setSaving(true);

    try {
      const updated = await updateNote(editingNote.id, {
        title: editingNote.title.trim(),
        subject: editingNote.subject.trim(),
        semester: Number(editingNote.semester),
        branch: editingNote.branch.trim(),
        fileUrl: editingNote.fileUrl,
      });

      const savedNote = updated.data ?? editingNote;

      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingNote.id ? savedNote : note
        )
      );

      setEditingNote(null);
      toast.success("Note updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update note.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getNotes();
        setNotes(data);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
        toast.error("Failed to load notes.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Notes</h1>
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

      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <input
          type="text"
          placeholder="Search notes..."
          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
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
                <td className="p-4" colSpan={5}>Loading...</td>
              </tr>
            ) : notes.length === 0 ? (
              <tr>
                <td className="p-4" colSpan={5}>No notes found.</td>
              </tr>
            ) : (
              notes.map((note) => (
                <tr key={note.id} className="border-t hover:bg-gray-50">
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
                        type="button"
                        onClick={() => setEditingNote({ ...note })}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
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

      {editingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleUpdate}
            className="w-full max-w-lg space-y-4 rounded-xl bg-white p-6 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-gray-800">Edit Note</h2>

            <div>
              <label className="mb-1 block text-sm font-medium">Title</label>
              <input
                required
                value={editingNote.title}
                onChange={(e) =>
                  setEditingNote({ ...editingNote, title: e.target.value })
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Subject</label>
              <input
                required
                value={editingNote.subject}
                onChange={(e) =>
                  setEditingNote({ ...editingNote, subject: e.target.value })
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Semester</label>
              <select
                required
                value={editingNote.semester}
                onChange={(e) =>
                  setEditingNote({
                    ...editingNote,
                    semester: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border px-3 py-2"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
                  <option key={semester} value={semester}>
                    Semester {semester}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Branch</label>
              <input
                required
                value={editingNote.branch}
                onChange={(e) =>
                  setEditingNote({ ...editingNote, branch: e.target.value })
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            <p className="text-sm text-gray-500">
              The existing PDF will be kept unchanged.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingNote(null)}
                disabled={saving}
                className="rounded-lg border px-4 py-2 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ManageNotes;

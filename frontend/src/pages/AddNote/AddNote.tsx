import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createNote } from "../../services/notes.service";

function AddNote() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createNote({
        title,
        subject,
        semester: Number(semester),
        branch,
        fileUrl,
      });

      toast.success("Note added successfully!");

      navigate("/notes");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add note");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Add Note
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded p-3"
          required
        />

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border rounded p-3"
          required
        />

        <input
          type="number"
          placeholder="Semester"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="w-full border rounded p-3"
          required
        />

        <input
          type="text"
          placeholder="Branch"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="w-full border rounded p-3"
          required
        />

        <input
          type="text"
          placeholder="File URL"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          className="w-full border rounded p-3"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded p-3 hover:bg-blue-700"
        >
          Add Note
        </button>

      </form>
    </div>
  );
}

export default AddNote;
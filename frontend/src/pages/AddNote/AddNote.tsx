
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
  const [pdf, setPdf] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!pdf) {
      toast.error("Please select a PDF file.");
      return;
    }

    if (pdf.type !== "application/pdf" || !pdf.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Only PDF files are allowed.");
      return;
    }

    if (pdf.size > 10 * 1024 * 1024) {
      toast.error("PDF size must not exceed 10 MB.");
      return;
    }

    try {
      setSubmitting(true);

      await createNote({
        title: title.trim(),
        subject: subject.trim(),
        semester: Number(semester),
        branch: branch.trim(),
        pdf,
      });

      toast.success("Note uploaded successfully!");
      navigate("/notes");
    } catch (error) {
      console.error("Failed to upload note:", error);
      toast.error("Failed to upload note. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Add Note</h1>

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
          placeholder="Semester (1–8)"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="w-full border rounded p-3"
          min="1"
          max="8"
          step="1"
          required
        />

        <input
          type="text"
          placeholder="Branch (e.g. CSE-CY)"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="w-full border rounded p-3"
          required
        />

        <div>
          <label htmlFor="pdf" className="block font-medium mb-2">
            Upload Notes PDF (maximum 10 MB)
          </label>

          <input
            id="pdf"
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => setPdf(e.target.files?.[0] ?? null)}
            className="w-full border rounded p-3"
            required
          />

          {pdf && (
            <p className="text-sm text-gray-600 mt-2">
              Selected: {pdf.name} ({(pdf.size / (1024 * 1024)).toFixed(2)} MB)
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white rounded p-3 hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? "Uploading..." : "Upload Note"}
        </button>
      </form>
    </div>
  );
}

export default AddNote;

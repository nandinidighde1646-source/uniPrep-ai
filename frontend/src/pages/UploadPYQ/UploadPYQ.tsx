
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createPYQ } from "../../services/pyqs.service";

function UploadPYQ() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("2025");
  const [pdf, setPdf] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pdf) {
      toast.error("Please select a PYQ PDF");
      return;
    }

    if (pdf.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    try {
      await createPYQ({
        title,
        subject,
        semester: Number(semester),
        branch,
        year: Number(year),
        pdf,
      });

      toast.success("PYQ uploaded successfully!");
      navigate("/pyqs");
    } catch (error) {
      console.error("PYQ upload error:", error);
      toast.error("Failed to upload PYQ");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Upload PYQ</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
        encType="multipart/form-data"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          type="number"
          placeholder="Semester"
          min="1"
          max="8"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          type="text"
          placeholder="Branch (e.g. CSE-CY)"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          type="number"
          placeholder="Exam Year"
          min="2000"
          max="2100"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full border rounded-lg p-3"
          required
        />

        <div>
          <label className="block mb-2 font-medium">
            Previous-Year Question Paper (PDF, max 10 MB)
          </label>
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => setPdf(e.target.files?.[0] ?? null)}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
        >
          Upload PYQ
        </button>
      </form>
    </div>
  );
}

export default UploadPYQ;

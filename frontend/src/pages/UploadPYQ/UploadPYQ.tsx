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
  const [fileUrl, setFileUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createPYQ({
        title,
        subject,
        semester: Number(semester),
        branch,
        fileUrl,
      });

      toast.success("PYQ uploaded successfully!");

      navigate("/pyqs");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload PYQ");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Upload PYQ
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

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
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          type="text"
          placeholder="Branch"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          type="text"
          placeholder="File URL"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          className="w-full border rounded-lg p-3"
          required
        />

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

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getPYQs,
  deletePYQ,
  updatePYQ,
  bulkUploadPYQs,
} from "../../services/pyqs.service";

interface PYQ {
  id: number;
  title: string;
  subject: string;
  semester: number;
  branch: string;
  year: number;
  fileUrl: string;
}

function ManagePYQs() {
  const [pyqs, setPyqs] = useState<PYQ[]>([]);
  const [loading, setLoading] = useState(true);

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const [editingPYQ, setEditingPYQ] = useState<PYQ | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [search, setSearch] = useState("");

  const csvInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const fetchPYQs = async () => {
    try {
      const data = await getPYQs();
      setPyqs(data);
    } catch (error) {
      console.error("Failed to fetch PYQs:", error);
      toast.error("Failed to load PYQs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPYQs();
  }, []);

  // Open the edit form with the selected PYQ details.
  const handleEdit = (pyq: PYQ) => {
    setEditingPYQ({ ...pyq });
  };

  // Save updated PYQ metadata.
  const handleSaveEdit = async () => {
    if (!editingPYQ || savingEdit) return;

    const title = editingPYQ.title.trim();
    const subject = editingPYQ.subject.trim();
    const branch = editingPYQ.branch.trim();
    const semester = Number(editingPYQ.semester);
    const year = Number(editingPYQ.year);

    if (!title || !subject || !branch) {
      toast.error("Title, subject, and branch are required.");
      return;
    }

    if (
      !Number.isInteger(semester) ||
      semester < 1 ||
      semester > 8
    ) {
      toast.error("Semester must be between 1 and 8.");
      return;
    }

    if (
      !Number.isInteger(year) ||
      year < 1900 ||
      year > 2100
    ) {
      toast.error("Enter a valid year between 1900 and 2100.");
      return;
    }

    setSavingEdit(true);

    try {
      const updated = await updatePYQ(editingPYQ.id, {
        title,
        subject,
        semester,
        branch,
        year,
      });

      setPyqs((previous) =>
        previous.map((pyq) =>
          pyq.id === editingPYQ.id
            ? { ...pyq, ...updated, title, subject, semester, branch, year }
            : pyq
        )
      );

      setEditingPYQ(null);
      toast.success("PYQ updated successfully.");
    } catch (error) {
      console.error("Failed to update PYQ:", error);
      toast.error("Failed to update PYQ. Please try again.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this PYQ?")) {
      return;
    }

    try {
      await deletePYQ(id);

      setPyqs((previous) =>
        previous.filter((pyq) => pyq.id !== id)
      );

      if (editingPYQ?.id === id) {
        setEditingPYQ(null);
      }

      toast.success("PYQ deleted successfully!");
    } catch (error) {
      console.error("Failed to delete PYQ:", error);
      toast.error("Failed to delete PYQ.");
    }
  };

  const handlePDFSelection = (files: FileList | null) => {
    if (!files) return;

    const selected = Array.from(files);

    if (selected.length > 20) {
      setPdfFiles([]);
      if (pdfInputRef.current) pdfInputRef.current.value = "";
      toast.error("Select a maximum of 20 PDFs per batch.");
      return;
    }

    const invalidFile = selected.find(
      (file) =>
        !file.name.toLowerCase().endsWith(".pdf") ||
        file.type !== "application/pdf"
    );

    if (invalidFile) {
      setPdfFiles([]);
      if (pdfInputRef.current) pdfInputRef.current.value = "";
      toast.error("Only PDF files are allowed.");
      return;
    }

    const totalSize = selected.reduce(
      (total, file) => total + file.size,
      0
    );

    if (selected.some((file) => file.size > 10 * 1024 * 1024)) {
      setPdfFiles([]);
      if (pdfInputRef.current) pdfInputRef.current.value = "";
      toast.error("Each PDF must be 10 MB or smaller.");
      return;
    }

    if (totalSize + (csvFile?.size ?? 0) > 50 * 1024 * 1024) {
      setPdfFiles([]);
      if (pdfInputRef.current) pdfInputRef.current.value = "";
      toast.error("The combined upload must be 50 MB or smaller.");
      return;
    }

    const names = selected.map((file) => file.name.toLowerCase());

    if (new Set(names).size !== names.length) {
      setPdfFiles([]);
      if (pdfInputRef.current) pdfInputRef.current.value = "";
      toast.error("PDF filenames must be unique.");
      return;
    }

    setPdfFiles(selected);
  };

  const handleBulkUpload = async () => {
    if (!csvFile) {
      toast.error("Please select a CSV file.");
      return;
    }

    if (pdfFiles.length === 0) {
      toast.error("Please select at least one PDF.");
      return;
    }

    const totalSize =
      csvFile.size +
      pdfFiles.reduce((sum, file) => sum + file.size, 0);

    if (totalSize > 50 * 1024 * 1024) {
      toast.error("The combined upload must be 50 MB or smaller.");
      return;
    }

    setUploading(true);

    try {
      const result = await bulkUploadPYQs(csvFile, pdfFiles);

      toast.success(
        result.message ||
          `${result.count} PYQs uploaded successfully.`
      );

      setCsvFile(null);
      setPdfFiles([]);

      if (csvInputRef.current) csvInputRef.current.value = "";
      if (pdfInputRef.current) pdfInputRef.current.value = "";

      await fetchPYQs();
    } catch (error: unknown) {
      console.error("Bulk PYQ upload failed:", error);

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const response = (
          error as {
            response?: {
              status?: number;
              data?: { message?: string };
            };
          }
        ).response;

        console.error("HTTP status:", response?.status);
        console.error("Server response:", response?.data);

        toast.error(
          response?.data?.message || "Bulk upload failed."
        );
      } else {
        toast.error(
          "Network error. Check whether the backend is running."
        );
      }
    } finally {
      setUploading(false);
    }
  };

  const filteredPYQs = pyqs.filter((pyq) => {
    const query = search.toLowerCase();

    return (
      pyq.title.toLowerCase().includes(query) ||
      pyq.subject.toLowerCase().includes(query) ||
      pyq.branch.toLowerCase().includes(query) ||
      String(pyq.year).includes(query) ||
      String(pyq.semester).includes(query)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Manage PYQs
          </h1>
          <p className="mt-2 text-gray-500">
            View, upload and manage previous-year question papers.
          </p>
        </div>

        <Link
          to="/upload-pyq"
          className="rounded-lg bg-green-600 px-5 py-3 text-white hover:bg-green-700"
        >
          + Upload Single PYQ
        </Link>
      </div>

      {/* Bulk Upload */}
      <section className="rounded-xl bg-white p-6 shadow">
        <h2 className="text-xl font-semibold text-gray-800">
          Bulk Upload PYQs
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Select one CSV metadata file and up to 20 matching PDFs.
          Each PDF must be 10 MB or smaller.
        </p>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              1. CSV metadata file
            </label>

            <input
              ref={csvInputRef}
              type="file"
              accept=".csv,text/csv"
              disabled={uploading}
              className="block w-full rounded-lg border p-3 text-sm"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;

                if (
                  file &&
                  !file.name.toLowerCase().endsWith(".csv")
                ) {
                  setCsvFile(null);
                  event.target.value = "";
                  toast.error("Please select a CSV file.");
                  return;
                }

                if (file && file.size > 1024 * 1024) {
                  setCsvFile(null);
                  event.target.value = "";
                  toast.error("The CSV must be 1 MB or smaller.");
                  return;
                }

                setCsvFile(file);
              }}
            />

            {csvFile && (
              <p className="mt-2 break-all text-sm text-green-700">
                Selected: {csvFile.name}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              2. Select PDF files
            </label>

            <input
              ref={pdfInputRef}
              type="file"
              accept=".pdf,application/pdf"
              multiple
              disabled={uploading}
              className="block w-full rounded-lg border p-3 text-sm"
              onChange={(event) =>
                handlePDFSelection(event.target.files)
              }
            />

            <p className="mt-2 text-sm text-gray-500">
              {pdfFiles.length} of 20 PDFs selected
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-lg bg-gray-50 p-4">
          <h3 className="font-medium text-gray-800">
            Required CSV columns
          </h3>

          <code className="mt-2 block overflow-x-auto text-sm text-gray-700">
            title,subject,semester,branch,year,filename
          </code>

          <p className="mt-3 text-sm text-gray-600">
            Example row:
          </p>

          <code className="mt-1 block overflow-x-auto text-sm text-gray-700">
            CY401 End Sem,Linear Algebra,4,CSE-CY,2025,CY401_2025.pdf
          </code>

          <p className="mt-3 text-sm text-gray-600">
            The filename in each CSV row must match the selected PDF
            filename. Semester must be 1–8, and year must be 1900–2100.
          </p>
        </div>

        {pdfFiles.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium text-gray-800">
              Selected PDFs
            </h3>

            <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto text-sm text-gray-600">
              {pdfFiles.map((file) => (
                <li key={file.name} className="break-all">
                  {file.name} —{" "}
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="button"
          onClick={handleBulkUpload}
          disabled={uploading || !csvFile || pdfFiles.length === 0}
          className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? "Uploading PYQs..." : "Upload All PYQs"}
        </button>
      </section>

      {/* Edit Form */}
      {editingPYQ && (
        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Edit PYQ
          </h2>

          <p className="mb-5 text-sm text-gray-500">
            Update the selected paper's details. The existing PDF
            will not be replaced.
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleSaveEdit();
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="edit-title"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  id="edit-title"
                  required
                  value={editingPYQ.title}
                  onChange={(event) =>
                    setEditingPYQ({
                      ...editingPYQ,
                      title: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-subject"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Subject
                </label>
                <input
                  id="edit-subject"
                  required
                  value={editingPYQ.subject}
                  onChange={(event) =>
                    setEditingPYQ({
                      ...editingPYQ,
                      subject: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-semester"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Semester
                </label>
                <select
                  id="edit-semester"
                  value={editingPYQ.semester}
                  onChange={(event) =>
                    setEditingPYQ({
                      ...editingPYQ,
                      semester: Number(event.target.value),
                    })
                  }
                  className="w-full rounded-lg border p-3"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="edit-branch"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Branch
                </label>
                <input
                  id="edit-branch"
                  required
                  value={editingPYQ.branch}
                  onChange={(event) =>
                    setEditingPYQ({
                      ...editingPYQ,
                      branch: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-year"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Year
                </label>
                <input
                  id="edit-year"
                  type="number"
                  min={1900}
                  max={2100}
                  required
                  value={editingPYQ.year}
                  onChange={(event) =>
                    setEditingPYQ({
                      ...editingPYQ,
                      year: Number(event.target.value),
                    })
                  }
                  className="w-full rounded-lg border p-3"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={savingEdit}
                className="rounded-lg bg-green-600 px-5 py-3 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingEdit ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => setEditingPYQ(null)}
                disabled={savingEdit}
                className="rounded-lg border px-5 py-3 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Existing PYQ List */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Uploaded PYQs ({pyqs.length})
        </h2>

        <div className="mb-6 rounded-xl bg-white p-4 shadow">
          <input
            type="text"
            value={search}
            placeholder="Search by title, subject, branch, semester, or year..."
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="overflow-x-auto rounded-xl bg-white shadow">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Subject</th>
                <th className="p-4 text-left">Semester</th>
                <th className="p-4 text-left">Branch</th>
                <th className="p-4 text-left">Year</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="p-4" colSpan={6}>
                    Loading...
                  </td>
                </tr>
              ) : filteredPYQs.length === 0 ? (
                <tr>
                  <td
                    className="p-4 text-gray-500"
                    colSpan={6}
                  >
                    {pyqs.length === 0
                      ? "No PYQs found."
                      : "No matching PYQs found."}
                  </td>
                </tr>
              ) : (
                filteredPYQs.map((pyq) => (
                  <tr
                    key={pyq.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-4">{pyq.title}</td>
                    <td className="p-4">{pyq.subject}</td>
                    <td className="p-4">{pyq.semester}</td>
                    <td className="p-4">{pyq.branch}</td>
                    <td className="p-4">{pyq.year}</td>

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
                          type="button"
                          onClick={() => handleEdit(pyq)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleDelete(pyq.id)}
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
      </section>
    </div>
  );
}

export default ManagePYQs;

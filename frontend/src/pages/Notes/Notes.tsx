import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import NotesCard from "../../components/NotesCard/NotesCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import FilterBar from "../../components/FilterBar/FilterBar";

import {
  getNotes,
  deleteNote,
} from "../../services/notes.service";

type Note = {
  id: number;
  title: string;
  subject: string;
  semester: number;
  branch: string;
  fileUrl: string;
};

function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [branch, setBranch] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getNotes();
        setNotes(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load notes");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);
   /*
  const handleDelete = async (id: number) => {
    try {
      await deleteNote(id);

      setNotes((prevNotes) =>
        prevNotes.filter((note) => note.id !== id)
      );

      toast.success("Note deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete note");
    }
  };
   */
    const handleDelete = async (id: number) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this note?"
  );

  if (!confirmed) return;

  try {
    await deleteNote(id);

    setNotes((prevNotes) =>
      prevNotes.filter((note) => note.id !== id)
    );

    toast.success("Note deleted successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete note");
  }
};

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) &&
      (semester === "" || note.semester === Number(semester)) &&
      (subject === "" || note.subject === subject) &&
      (branch === "" || note.branch === branch)
  );

  if (loading) {
    return (
      <div className="p-8 text-center">
        Loading notes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">
        University Notes
      </h1>

      <p className="text-gray-600 mb-6">
        Access semester-wise notes for your university subjects.
      </p>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search notes..."
      />

      <FilterBar
        semester={semester}
        subject={subject}
        branch={branch}
        setSemester={setSemester}
        setSubject={setSubject}
        setBranch={setBranch}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <NotesCard
            key={note.id}
            id={note.id}
            title={note.title}
            subject={note.subject}
            semester={note.semester.toString()}
            branch={note.branch}
            fileUrl={note.fileUrl}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <p className="text-gray-600 mt-6">
          No notes found.
        </p>
      )}
    </div>
  );
}

export default Notes;
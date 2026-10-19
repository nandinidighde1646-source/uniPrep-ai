import { useEffect, useState } from "react";

import SearchBar from "../../components/SearchBar/SearchBar";
import FilterBar from "../../components/FilterBar/FilterBar";
import PYQCard from "../../components/PYQCard/PYQCard";

import { getPYQs } from "../../services/pyqs.service";


interface PYQ {
  id: number;
  title: string;
  subject: string;
  semester: number;
  branch: string;
  year: number;
  fileUrl: string;
}

function PYQs() {
  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [branch, setBranch] = useState("");

  const [pyqs, setPYQs] = useState<PYQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const fetchPYQs = async () => {
  try {
    setLoading(true);

   const data = await getPYQs();

console.log("PYQ API data:", data);

setPYQs(data);

    setError("");
  } catch (err) {
    console.error(err);
    setError("Failed to load question papers.");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchPYQs();
}, []);



  const filteredPYQs = pyqs.filter(
    (pyq) =>
      pyq.title.toLowerCase().includes(search.toLowerCase()) &&
      (semester === "" || pyq.semester.toString() === semester) &&
      (subject === "" || pyq.subject === subject) &&
      (branch === "" || pyq.branch === branch)
  );

  if (loading) {
    return (
      <div className="p-8">
        <p>Loading question papers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
  <div>
    <h1 className="text-3xl font-bold">
      Previous Year Question Papers
    </h1>

    <p className="text-gray-600 mt-2">
      Download previous year question papers for exam preparation.
    </p>
  </div>

  
</div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search PYQs..."
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
        {filteredPYQs.map((pyq) => (
          <PYQCard
            key={pyq.id}
            title={pyq.title}
            subject={pyq.subject}
            semester={pyq.semester}
            branch={pyq.branch}
              year={pyq.year}
            fileUrl={pyq.fileUrl}
              
          />
        ))}
      </div>

      {filteredPYQs.length === 0 && (
        <p className="mt-6 text-gray-600">
          No question papers found.
        </p>
      )}
    </div>
  );
}

export default PYQs;
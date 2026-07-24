import { useState } from "react";

import SearchBar from "../../components/SearchBar/SearchBar";
import FilterBar from "../../components/FilterBar/FilterBar";
import PYQCard from "../../components/PYQCard/PYQCard";

import { pyqs } from "../../data/pyqs";

function PYQs() {
  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [branch, setBranch] = useState("");

  const filteredPYQs = pyqs.filter(
    (pyq) =>
      pyq.title.toLowerCase().includes(search.toLowerCase()) &&
      (semester === "" || pyq.semester === semester) &&
      (subject === "" || pyq.subject === subject) &&
      (branch === "" || pyq.branch === branch)
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">
        Previous Year Question Papers
      </h1>

      <p className="text-gray-600 mb-6">
        Download previous year question papers for exam preparation.
      </p>

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
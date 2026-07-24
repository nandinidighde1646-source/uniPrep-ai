type FilterBarProps = {
  semester: string;
  subject: string;
  branch: string;
  setSemester: (value: string) => void;
  setSubject: (value: string) => void;
  setBranch: (value: string) => void;
};

function FilterBar({
  semester,
  subject,
  branch,
  setSemester,
  setSubject,
  setBranch,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-8">

      <select
        value={semester}
        onChange={(e) => setSemester(e.target.value)}
        className="px-4 py-3 border rounded-lg"
      >
        <option value="">All Semesters</option>
        <option value="4th Semester">4th Semester</option>
      </select>

      <select
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="px-4 py-3 border rounded-lg"
      >
        <option value="">All Subjects</option>
        <option value="DBMS">DBMS</option>
        <option value="OS">OS</option>
        <option value="CN">CN</option>
      </select>

      <select
        value={branch}
        onChange={(e) => setBranch(e.target.value)}
        className="px-4 py-3 border rounded-lg"
      >
        <option value="">All Branches</option>
        <option value="Computer Science">
          Computer Science
        </option>
      </select>

    </div>
  );
}

export default FilterBar;
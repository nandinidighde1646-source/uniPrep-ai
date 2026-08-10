type NotesCardProps = {
  id: number;
  title: string;
  subject: string;
  semester: string;
  branch: string;
  fileUrl: string;
  
};

function NotesCard({
  
  title,
  subject,
  semester,
  branch,
  fileUrl,
}: NotesCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 p-6 border">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        📘 {title}
      </h2>

      <div className="space-y-2 text-gray-600">
        <p>
          <span className="font-semibold">📚 Subject:</span> {subject}
        </p>

        <p>
          <span className="font-semibold">🎓 Semester:</span> {semester}
        </p>

        <p>
          <span className="font-semibold">💻 Branch:</span> {branch}
        </p>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          className="px-4 py-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 transition"
        >
          ⭐ Bookmark
        </button>

        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          ⬇ Download
        </a>

      
      </div>
    </div>
  );
}

export default NotesCard;
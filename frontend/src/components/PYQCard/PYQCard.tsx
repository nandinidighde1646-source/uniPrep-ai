type PYQCardProps = {
  title: string;
  subject: string;
  semester: number;
  branch: string;
  fileUrl: string;
};

function PYQCard({
  title,
  subject,
  semester,
  branch,
  fileUrl,
}: PYQCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
      {/* Subject Badge */}
      <span className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm">
        {subject}
      </span>

      {/* Title */}
      <h2 className="text-xl font-semibold mt-4 text-gray-800">
        {title}
      </h2>

      {/* Details */}
      <div className="mt-4 text-gray-600 space-y-1">
        <p>Semester: {semester}</p>
        <p>Branch: {branch}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6 flex-wrap">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          View PYQ
        </a>

        <a
          href={fileUrl}
          download
          className="border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50"
        >
          Download
        </a>
      </div>
    </div>
  );
}

export default PYQCard;
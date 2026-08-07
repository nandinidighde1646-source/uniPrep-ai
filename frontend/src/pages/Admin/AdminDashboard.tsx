import {
  BookOpen,
  FileText,
  Users,
  FolderOpen,
} from "lucide-react";

function AdminDashboard() {
  const stats = [
    {
      title: "Total Notes",
      value: 0,
      icon: <BookOpen size={28} />,
      color: "bg-blue-500",
    },
    {
      title: "Total PYQs",
      value: 0,
      icon: <FileText size={28} />,
      color: "bg-green-500",
    },
    {
      title: "Total Users",
      value: 0,
      icon: <Users size={28} />,
      color: "bg-purple-500",
    },
    {
      title: "Subjects",
      value: 0,
      icon: <FolderOpen size={28} />,
      color: "bg-orange-500",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">
        Admin Dashboard
      </h1>

      <p className="text-gray-600 mt-2">
        Welcome to the UniPrep AI Admin Panel.
      </p>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between"
          >
            <div>
              <p className="text-gray-500">{stat.title}</p>

              <h2 className="text-3xl font-bold mt-2">
                {stat.value}
              </h2>
            </div>

            <div
              className={`${stat.color} text-white p-4 rounded-xl`}
            >
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder Sections */}
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold">
            Recent Notes
          </h2>

          <p className="text-gray-500 mt-3">
            Recent uploaded notes will appear here.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold">
            Recent PYQs
          </h2>

          <p className="text-gray-500 mt-3">
            Recent uploaded question papers will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
import { useNavigate } from "react-router-dom";

type DashboardCardProps = {
  icon: string;
  title: string;
  description: string;
  path: string;
};

function DashboardCard({
  icon,
  title,
  description,
  path,
}: DashboardCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      className="
        bg-white
        rounded-xl
        shadow-md
        p-6
        cursor-pointer
        transition-all
        duration-300
        hover:shadow-xl
        hover:-translate-y-2
        border
        border-gray-200
      "
    >
      <div className="text-4xl mb-4">
        {icon}
      </div>

      <h2 className="text-xl font-semibold mb-2">
        {title}
      </h2>

      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
}

export default DashboardCard;
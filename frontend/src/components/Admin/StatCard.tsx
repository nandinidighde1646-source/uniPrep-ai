import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
      <div>
        <p className="text-gray-500">{title}</p>

        <h2 className="text-3xl font-bold mt-2">
          {value}
        </h2>
      </div>

      <div className={`${color} text-white p-4 rounded-xl`}>
        {icon}
      </div>
    </div>
  );
}

export default StatCard;
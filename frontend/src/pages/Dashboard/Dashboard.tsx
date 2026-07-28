import { dashboardItems } from "../../data/dashboard";
import DashboardCard from "../../components/DashboardCard/DashboardCard";


function Dashboard() {
  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-2">
        Welcome to UniPrep AI 👋
      </h1>

      <p className="text-gray-600 mb-8">
        Track your preparation and access your resources.
      </p>
      
      <h2 className="text-2xl font-semibold mb-6">
        Quick Access
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardItems.map((item) => (
          <DashboardCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            description={item.description}
            path={item.path}
          />
        ))}
      </div>

    </div>
  );
}

export default Dashboard;
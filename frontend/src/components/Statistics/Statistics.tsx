import StatCard from "./StatCard";
import { statistics } from "../../data/statistics";

function Statistics() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Trusted by Thousands of Students
          </h2>

          <p className="text-gray-600 mt-4">
            Helping students prepare smarter with AI-powered learning resources.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statistics.map((stat) => (
            <StatCard
              key={stat.id}
              number={stat.number}
              title={stat.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Statistics;
import ResourceCard from "./ResourceCard";
import { resources } from "../../data/resources";

function Resources() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Explore Our Resources
          </h2>

          <p className="text-gray-600 mt-4">
            Everything you need to prepare smarter and score better in your university exams.
          </p>
        </div>

        {/* Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              icon={resource.icon}
              title={resource.title}
              description={resource.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Resources;
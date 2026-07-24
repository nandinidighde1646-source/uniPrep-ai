type ResourceCardProps = {
  icon: string;
  title: string;
  description: string;
};

function ResourceCard({
  icon,
  title,
  description,
}: ResourceCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition duration-300 text-center">
      <div className="text-5xl mb-4">{icon}</div>

      <h3 className="text-xl font-semibold mb-3">
        {title}
      </h3>

      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
}

export default ResourceCard;
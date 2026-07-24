type StatCardProps = {
  number: string;
  title: string;
};

function StatCard({ number, title }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition duration-300">
      <h2 className="text-4xl font-bold text-blue-600">
        {number}
      </h2>

      <p className="mt-2 text-gray-600 text-lg">
        {title}
      </p>
    </div>
  );
}

export default StatCard;
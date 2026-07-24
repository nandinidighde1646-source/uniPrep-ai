function Dashboard() {
  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-2">
        Welcome to UniPrep AI 👋
      </h1>

      <p className="text-gray-600 mb-8">
        Track your preparation and access your resources.
      </p>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">


        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold">
            📚 Notes
          </h2>

          <p className="text-gray-600 mt-2">
            Access your study material
          </p>
        </div>



        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold">
            📄 PYQs
          </h2>

          <p className="text-gray-600 mt-2">
            Practice previous papers
          </p>
        </div>



        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold">
            🤖 AI Chat
          </h2>

          <p className="text-gray-600 mt-2">
            Clear your doubts
          </p>
        </div>



        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold">
            📝 Mock Tests
          </h2>

          <p className="text-gray-600 mt-2">
            Test your preparation
          </p>
        </div>


      </div>


    </div>
  );
}

export default Dashboard;
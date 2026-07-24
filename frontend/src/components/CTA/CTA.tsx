import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold">
          Ready to Ace Your Exams?
        </h2>

        <p className="mt-6 text-lg md:text-xl text-blue-100">
          Join thousands of students using UniPrep AI to prepare smarter with
          AI-powered learning resources, notes, PYQs, and instant doubt
          solving.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Get Started
          </Link>

          <Link
            to="/"
            className="border border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
          >
            Explore Resources
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTA;
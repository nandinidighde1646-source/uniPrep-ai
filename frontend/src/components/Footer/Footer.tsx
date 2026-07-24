import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            UniPrep AI
          </h2>

          <p className="mt-4 text-gray-400">
            AI-powered university exam preparation platform helping students
            learn smarter with Notes, PYQs, AI Chat, and Mock Tests.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Quick Links
          </h3>

          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
            </li>

            <li>
              <Link to="/login" className="hover:text-white transition">
                Login
              </Link>
            </li>

            <li>
              <Link to="/register" className="hover:text-white transition">
                Register
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Contact
          </h3>

          <p>support@uniprepai.com</p>

          <p className="mt-3">
            Built with React, TypeScript & Spring Boot.
          </p>
          </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
        © 2026 UniPrep AI. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
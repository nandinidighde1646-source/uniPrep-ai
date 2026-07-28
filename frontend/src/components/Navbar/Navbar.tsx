import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";


function Navbar() {

  const [open, setOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
  logout();
  setOpen(false);
  navigate("/");
};
 
 const navLinks = [
  {
    name: "Home",
    path: user ? "/dashboard" : "/",
  },
];

  return (
    <nav className="flex justify-between items-center px-6 md:px-[60px] py-5 bg-[#1e1e2f] border-b border-[#333] relative">


      {/* Logo */}
      <Link
        to="/"
        className="text-white text-3xl font-semibold"
        >
        UniPrep AI
        </Link>



      {/* Mobile Button */}
      <button
        className="md:hidden text-white text-3xl"
        onClick={() => setOpen(!open)}
      >
        {open ? "✕" : "☰"}
      </button>




      {/* Navigation */}
        <div
       className={`
       ${open ? "flex" : "hidden"}
       md:flex
       flex-col md:flex-row
        gap-3 md:gap-6
        absolute md:static
       top-full left-0
       w-full md:w-auto
       bg-[#1e1e2f]
       md:bg-transparent
       p-6 md:p-0
       z-50
      ` }
      >


        {navLinks.map((link) => (

          <Link
            key={link.name}
            to={link.path}
            onClick={() => setOpen(false)}
            className="text-white text-[17px] transition hover:text-[#4f8cff]"
          >
            {link.name}
          </Link>

        ))}

          {user ? (
  <>
    <Link
      to="/dashboard"
      onClick={() => setOpen(false)}
      className="text-white text-[17px] transition hover:text-[#4f8cff]"
    >
      Dashboard
    </Link>

    <Link
      to="/profile"
      onClick={() => setOpen(false)}
      className="text-white text-[17px] transition hover:text-[#4f8cff]"
    >
      Profile
    </Link>

   <button
  onClick={handleLogout}
  className="block w-full md:w-auto text-left text-white text-[17px] py-2 md:py-0 transition hover:text-[#4f8cff]"
>
  Logout
</button>
  </>
) : (

        

          <>

            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="text-white text-[17px] transition hover:text-[#4f8cff]"
            >
              Login
            </Link>


            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="text-white text-[17px] transition hover:text-[#4f8cff]"
            >
              Register
            </Link>

          </>

        )}


      </div>


    </nav>
  );
}

export default Navbar;
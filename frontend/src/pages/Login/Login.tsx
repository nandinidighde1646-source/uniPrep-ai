import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email || !password) {
    toast.error("Please fill all fields");
    return;
  }

  try {
    setLoading(true);

    const response = await loginUser({
      email,
      password,
    });

   

    console.log(response);

     login({
     user: response.data.user,
     token: response.data.token, 
      });
      
    toast.success("Login successful");


    navigate("/dashboard");

  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      "Login failed";

    toast.error(message);

  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          Welcome Back
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
  type="submit"
  disabled={loading}
  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
>
  {loading ? "Logging in..." : "Login"}
</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
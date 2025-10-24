import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import loginImg from "../assets/login.png"; // your image here

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://student-backend-1-48k0.onrender.com/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);

        // save user in context
        setUser(res.data.user);
        setIsLoggedIn(true);

        // redirect based on role
        if (res.data.user.role === "admin") {
          navigate("/admin/users");
        } else {
          navigate("/dashboard");
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Login failed. Try again!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden flex w-full max-w-5xl">
        
        {/* Left Illustration */}
        <div className="hidden md:flex md:w-1/2 bg-gray-100 items-center justify-center p-10">
          <img src={loginImg} alt="login illustration" className="w-96 h-auto" />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome Back 👋</h2>
          <p className="text-gray-500 mb-8">
            Login to your Student Performance Portal to track marks & analysis
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-200"
            >
              Login
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-indigo-600 hover:underline font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Dashboard = () => {
  const { user: contextUser } = useContext(AuthContext);
  const [teacherName, setTeacherName] = useState("Teacher");

  const quotes = [
    "A good teacher can inspire hope, ignite the imagination, and instill a love of learning.",
    "Teaching is the one profession that creates all other professions.",
    "The influence of a good teacher can never be erased.",
    "Teachers plant the seeds of knowledge that grow forever.",
    "Education is not the filling of a pail, but the lighting of a fire.",
  ];

  const [quote, setQuote] = useState("");

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);

    if (contextUser && contextUser.name) {
      setTeacherName(contextUser.name);
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.name) setTeacherName(parsedUser.name);
      }
    }
  }, [contextUser]);

  const cards = [
    { title: "Students", icon: "📚", desc: "Manage and track all student details.", link: "/admin/students", color: "from-yellow-400 to-yellow-500" },
    { title: "Marks", icon: "📝", desc: "Record and monitor student performance.", link: "/admin/marks", color: "from-green-400 to-green-500" },
    { title: "Attendance", icon: "📅", desc: "Track student presence and consistency.", link: "/admin/attendance", color: "from-blue-400 to-blue-500" },
    { title: "Analytics", icon: "📊", desc: "Visualize performance and trends.", link: "/admin/analytics", color: "from-purple-400 to-purple-500" },
  ];

  return (
    <div className="p-6 space-y-8 min-h-screen bg-gray-50">
      {/* Welcome Section */}
      <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 rounded-3xl shadow-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300">
        <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
          Welcome back, {teacherName} 👋
        </h1>
        <p className="mt-3 md:mt-5 italic text-lg md:text-xl drop-shadow-sm">
          “{quote}”
        </p>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/10 rounded-full filter blur-3xl"></div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link key={card.title} to={card.link}>
            <div
              className={`relative bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:-translate-y-2 hover:scale-[1.03]`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-20`}></div>
              <div className="p-6 relative z-10">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span>{card.icon}</span> {card.title}
                </h2>
                <p className="mt-2 text-gray-600">{card.desc}</p>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/20 rounded-full -mb-4 -mr-4"></div>
            </div>
          </Link>
        ))}
      </div>

      {/* Optional Footer Section */}
      <div className="text-center text-gray-500 mt-10">
        Dashboard • Student Performance Portal
      </div>
    </div>
  );
};

export default Dashboard;

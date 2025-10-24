import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get student profile
        const profileRes = await axios.get("http://localhost:4000/api/student/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudent(profileRes.data.student);

        // 2. Get student marks
        const marksRes = await axios.get(
          `http://localhost:4000/api/marks/student/${profileRes.data.student._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMarks(marksRes.data.marks || []);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <p className="text-center">Loading dashboard...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🎓 Student Dashboard</h1>

      {/* Profile Info */}
      {student && (
        <div className="bg-white p-4 shadow rounded mb-6">
          <h2 className="text-xl font-semibold mb-2">Profile Information</h2>
          <p><strong>Name:</strong> {student.user?.name}</p>
          <p><strong>Email:</strong> {student.user?.email}</p>
          <p><strong>Roll No:</strong> {student.rollNo}</p>
          <p><strong>Class:</strong> {student.className}</p>
          <p><strong>Batch:</strong> {student.batch}</p>
          <p><strong>Section:</strong> {student.section}</p>
        </div>
      )}

      {/* Marks Table */}
      <div className="bg-white p-4 shadow rounded mb-6">
        <h2 className="text-xl font-semibold mb-3">📑 Marks</h2>
        {marks.length > 0 ? (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Subject</th>
                <th className="border px-4 py-2">Marks</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((m, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2">{m.subject}</td>
                  <td className="border px-4 py-2">{m.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No marks available yet.</p>
        )}
      </div>

      {/* Analytics Chart */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-xl font-semibold mb-3">📊 Analytics</h2>
        {marks.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={marks}>
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No analytics available.</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;

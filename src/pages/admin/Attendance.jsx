import React, { useEffect, useState } from "react";
import axios from "axios";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [presentDays, setPresentDays] = useState("");
  const [totalDays, setTotalDays] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Fetch both students & attendance data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          "https://student-backend-1-48k0.onrender.com/api/students"
        );
        setStudents(res.data?.students || []);
      } catch (err) {
        console.error("Error fetching students", err);
        setStudents([]);
      }
    };

    const fetchAttendance = async () => {
      try {
        const res = await axios.get(
          "https://student-backend-1-48k0.onrender.com/api/attendance"
        );
        setAttendance(res.data?.attendance || []);
      } catch (err) {
        console.error("Error fetching attendance", err);
        setAttendance([]);
      }
    };

    fetchStudents();
    fetchAttendance();
  }, []);

  // ✅ Handle Save Attendance
  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !presentDays || !totalDays) {
      setMessage("⚠️ Please fill all fields");
      return;
    }

    try {
      await axios.post(
        "https://student-backend-1-48k0.onrender.com/api/attendance",
        {
          studentId: selectedStudent,
          presentDays: Number(presentDays),
          totalDays: Number(totalDays),
        }
      );
      setMessage("✅ Attendance saved successfully!");
      setPresentDays("");
      setTotalDays("");

      // Refresh attendance list
      const res = await axios.get(
        "https://student-backend-1-48k0.onrender.com/api/attendance"
      );
      setAttendance(res.data?.attendance || []);
    } catch (err) {
      setMessage("❌ Error saving attendance");
      console.error(err);
    }
  };

  // ✅ Export Attendance CSV
  const exportCSV = () => {
    if (!attendance.length) return;

    const header = ["Student", "Roll No", "Present Days", "Total Days", "Attendance %"];
    const rows = attendance.map((a) => [
      a.student?.name || "—",
      a.student?.rollNo || "—",
      a.presentDays,
      a.totalDays,
      a.totalDays > 0
        ? ((a.presentDays / a.totalDays) * 100).toFixed(2) + "%"
        : "0%",
    ]);

    const csvContent = [header, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "attendance.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">📋 Mark Attendance</h2>

      {/* Attendance Form */}
      <form
        onSubmit={handleSave}
        className="bg-gray-100 p-6 rounded-2xl shadow-lg space-y-4 w-full max-w-3xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-3">
            <label className="block font-semibold mb-1">Select Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-indigo-400 outline-none"
            >
              <option value="">-- Choose Student --</option>
              {Array.isArray(students) &&
                students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.rollNo})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Present Days</label>
            <input
              type="number"
              value={presentDays}
              onChange={(e) => setPresentDays(e.target.value)}
              className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-indigo-400 outline-none"
              min="0"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Total Days</label>
            <input
              type="number"
              value={totalDays}
              onChange={(e) => setTotalDays(e.target.value)}
              className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-indigo-400 outline-none"
              min="1"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transform transition duration-200 w-full"
            >
              Save Attendance
            </button>
          </div>
        </div>
      </form>

      {message && <p className="text-center text-gray-700">{message}</p>}

      {/* Attendance Summary Table */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">📊 Attendance Summary</h3>
        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow">
        <table className="w-full border-collapse">
          <thead className="bg-indigo-100">
            <tr>
              <th className="border p-3 text-left">Student</th>
              <th className="border p-3 text-left">Roll No</th>
              <th className="border p-3 text-left">Present Days</th>
              <th className="border p-3 text-left">Total Days</th>
              <th className="border p-3 text-left">Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(attendance) && attendance.length ? (
              attendance.map((a) => (
                <tr key={a._id} className="hover:bg-indigo-50 transition">
                  <td className="border p-3">{a.student?.name}</td>
                  <td className="border p-3">{a.student?.rollNo}</td>
                  <td className="border p-3">{a.presentDays}</td>
                  <td className="border p-3">{a.totalDays}</td>
                  <td className="border p-3">
                    {a.totalDays > 0
                      ? ((a.presentDays / a.totalDays) * 100).toFixed(2) + "%"
                      : "0%"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-6 text-center text-gray-400" colSpan={5}>
                  No attendance data yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;

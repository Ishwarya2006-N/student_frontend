import { useContext, useEffect, useState } from "react";
import { AppContent } from "../../context/AppContext";

const Marks = () => {
  const { axios } = useContext(AppContent);

  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    studentId: "",
    subject: "",
    marks: "",
    total: "",
    examType: "midterm",
    examLabel: "",
    examDate: ""
  });

  const fetchMarks = async () => {
    try {
      const res = await axios.get("/admin/marks");
      setMarks(res.data?.items || []);
    } catch (err) {
      console.error("Marks fetch error:", err);
      setMarks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get("/students");
      setStudents(res.data?.students || []);
    } catch (err) {
      console.error("Students fetch error:", err);
      setStudents([]);
    }
  };

  useEffect(() => {
    fetchMarks();
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/admin/marks", formData);
      setFormData({
        studentId: "",
        subject: "",
        marks: "",
        total: "",
        examType: "midterm",
        examLabel: "",
        examDate: ""
      });
      fetchMarks();
    } catch (err) {
      console.error("Add marks error:", err);
      alert("Error adding marks");
    }
  };

  // ✅ Export CSV function
  const exportCSV = () => {
    if (!marks.length) return;
    const header = ["Student", "Subject", "Marks", "Total", "Exam Type", "Exam Label", "Exam Date"];
    const rows = marks.map(m => [
      m.student?.name || "—",
      m.subject,
      m.marks,
      m.total,
      m.examType,
      m.examLabel || "—",
      m.examDate ? new Date(m.examDate).toLocaleDateString() : "—"
    ]);
    const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "marks.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="text-center py-10 text-gray-400">Loading marks...</div>;

  return (
    <section className="p-6 bg-gray-50 min-h-screen space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Add Marks</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-2xl shadow space-y-4">
        <select
          name="studentId"
          value={formData.studentId}
          onChange={handleChange}
          required
          className="border p-3 w-full rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
        >
          <option value="">Select Student</option>
          {students.map(s => (
            <option key={s._id} value={s._id}>{s.name} | {s.rollNo}</option>
          ))}
        </select>

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          className="border p-3 w-full rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
          required
        />
        <input
          type="number"
          name="marks"
          placeholder="Marks Obtained"
          value={formData.marks}
          onChange={handleChange}
          className="border p-3 w-full rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
          required
        />
        <input
          type="number"
          name="total"
          placeholder="Total Marks"
          value={formData.total}
          onChange={handleChange}
          className="border p-3 w-full rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
          required
        />
        <input
          type="text"
          name="examLabel"
          placeholder="Exam Label"
          value={formData.examLabel}
          onChange={handleChange}
          className="border p-3 w-full rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
        />
        <input
          type="date"
          name="examDate"
          value={formData.examDate}
          onChange={handleChange}
          className="border p-3 w-full rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        <select
          name="examType"
          value={formData.examType}
          onChange={handleChange}
          className="border p-3 w-full rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
        >
          <option value="midterm">Midterm</option>
          <option value="final">Final</option>
          <option value="assignment">Assignment</option>
          <option value="quiz">Quiz</option>
          <option value="other">Other</option>
        </select>

        <button
          type="submit"
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transform transition duration-200"
        >
          Add Marks
        </button>
      </form>

      {/* Table & Export */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Marks List</h2>
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
              <th className="border p-3 text-left">Subject</th>
              <th className="border p-3 text-left">Marks</th>
              <th className="border p-3 text-left">Total</th>
              <th className="border p-3 text-left">Exam Type</th>
              <th className="border p-3 text-left">Exam Label</th>
              <th className="border p-3 text-left">Exam Date</th>
            </tr>
          </thead>
          <tbody>
            {marks.length ? (
              marks.map(m => (
                <tr key={m._id} className="hover:bg-indigo-50 transition">
                  <td className="border p-3">{m.student?.name || "—"}</td>
                  <td className="border p-3">{m.subject}</td>
                  <td className="border p-3">{m.marks}</td>
                  <td className="border p-3">{m.total}</td>
                  <td className="border p-3">{m.examType}</td>
                  <td className="border p-3">{m.examLabel || "—"}</td>
                  <td className="border p-3">{m.examDate ? new Date(m.examDate).toLocaleDateString() : "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-6 text-gray-400 text-center" colSpan={7}>No marks found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Marks;

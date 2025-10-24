import { useContext, useEffect, useState } from "react";
import { AppContent } from "../../context/AppContext";

const Students = () => {
  const { axios } = useContext(AppContent);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [className, setClassName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("/students");
      setStudents(res.data?.students || []);
    } catch (e) {
      console.error("Students fetch error", e);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!name || !rollNo || !className) return alert("All fields required");
    try {
      setSubmitting(true);
      const res = await axios.post("/students", { name, rollNo, className });
      if (res.data.success) {
        setStudents(prev => [...prev, res.data.student]);
        setName(""); setRollNo(""); setClassName("");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding student");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) return <div className="text-center py-10 text-gray-400">Loading students...</div>;

  return (
    <section className="space-y-8 p-4 md:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800">Students</h2>

      {/* Add Student Form */}
      <form
        onSubmit={handleAddStudent}
        className="flex flex-col md:flex-row gap-4 p-6 rounded-2xl shadow-lg bg-gray-100"
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="p-3 border rounded-xl shadow-inner focus:ring-2 focus:ring-indigo-400 outline-none flex-1 transition duration-200"
        />
        <input
          type="text"
          placeholder="Roll No"
          value={rollNo}
          onChange={e => setRollNo(e.target.value)}
          className="p-3 border rounded-xl shadow-inner focus:ring-2 focus:ring-indigo-400 outline-none flex-1 transition duration-200"
        />
        <input
          type="text"
          placeholder="Class"
          value={className}
          onChange={e => setClassName(e.target.value)}
          className="p-3 border rounded-xl shadow-inner focus:ring-2 focus:ring-indigo-400 outline-none flex-1 transition duration-200"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transform transition duration-200 disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add Student"}
        </button>
      </form>

      {/* Students List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.length ? students.map(s => (
          <div
            key={s._id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-1"
          >
            <h3 className="text-xl font-semibold text-gray-800">{s.name}</h3>
            <p className="text-gray-500 mt-1">Roll No: {s.rollNo}</p>
            <p className="text-gray-500">Class: {s.className}</p>
          </div>
        )) : (
          <div className="col-span-full p-10 text-center text-gray-400 bg-white rounded-2xl shadow">
            No students found.
          </div>
        )}
      </div>
    </section>
  );
};

export default Students;

import { useContext, useEffect, useState } from "react";
import { AppContent } from "../../context/AppContext";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const Analytics = () => {
  const { axios } = useContext(AppContent);

  // Marks
  const [overview, setOverview] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [timeline, setTimeline] = useState([]);

  // Attendance
  const [attendanceOverview, setAttendanceOverview] = useState(null);
  const [attendanceDistribution, setAttendanceDistribution] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [
        overviewRes,
        subjectsRes,
        toppersRes,
        distributionRes,
        timelineRes,
        attendanceSummaryRes,
        attendanceDistributionRes
      ] = await Promise.all([
        axios.get("/admin/analytics/overview"), 
        axios.get("/admin/analytics/subjects"), 
        axios.get("/admin/analytics/toppers"), 
        axios.get("/admin/analytics/distribution"), 
        axios.get("/admin/analytics/timeline"), 
        axios.get("/attendance/summary"), 
        axios.get("/attendance/distribution") 
      ]);

      setOverview(overviewRes.data.overview);
      setSubjects(subjectsRes.data.subjects || []);
      setTopStudents((toppersRes.data.toppers || []).slice(0, 3));
      setDistribution(distributionRes.data.histogram || []);
      setTimeline(timelineRes.data.timeline || []);
      setAttendanceOverview(attendanceSummaryRes.data);
      setAttendanceDistribution(attendanceDistributionRes.data.distribution || []);
    } catch (err) {
      console.error("Analytics fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Export attendance CSV
  const exportAttendanceCSV = () => {
    if (!attendanceDistribution.length) return;
    const header = ["Student", "Attendance %"];
    const rows = attendanceDistribution.map(a => [a.student, a.percentage]);
    const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "attendance_distribution.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div>Loading analytics...</div>;

  return (
    <section className="space-y-6 p-4">
      <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>

      {/* Marks Overview */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded shadow">
            <div className="text-gray-600">Total Students</div>
            <div className="text-xl font-bold">{overview.students}</div>
          </div>
          <div className="p-4 bg-green-50 rounded shadow">
            <div className="text-gray-600">Marks Entries</div>
            <div className="text-xl font-bold">{overview.totalEntries}</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded shadow">
            <div className="text-gray-600">Average %</div>
            <div className="text-xl font-bold">{overview.averagePercentage}</div>
          </div>
          <div className="p-4 bg-red-50 rounded shadow">
            <div className="text-gray-600">Pass Rate %</div>
            <div className="text-xl font-bold">{overview.passRate}</div>
          </div>
        </div>
      )}

      {/* Subject Averages */}
      {subjects.length > 0 && (
        <div>
          <h3 className="font-bold mt-4 mb-2">Subject Averages</h3>
          <Bar
            data={{
              labels: subjects.map((s) => s.subject),
              datasets: [
                {
                  label: "Average %",
                  data: subjects.map((s) => s.avgPercent),
                  backgroundColor: "rgba(59, 130, 246, 0.7)"
                }
              ]
            }}
            options={{ responsive: true }}
          />
        </div>
      )}

      {/* Top Students */}
      {topStudents.length > 0 && (
        <div>
          <h3 className="font-bold mt-4 mb-2">🏆 Top Students</h3>
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="w-full border-collapse border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">Rank</th>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Roll No</th>
                  <th className="border p-2 text-left">Avg %</th>
                </tr>
              </thead>
              <tbody>
                {topStudents.map((s, i) => (
                  <tr key={s.studentId}>
                    <td className="border p-2">{i + 1}</td>
                    <td className="border p-2">{s.name}</td>
                    <td className="border p-2">{s.rollNo || "—"}</td>
                    <td className="border p-2 text-indigo-600 font-semibold">{s.avgPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Score Distribution */}
      {distribution.length > 0 && (
        <div>
          <h3 className="font-bold mt-4 mb-2">Score Distribution</h3>
          <Bar
            data={{
              labels: distribution.map((d) => d.range),
              datasets: [
                {
                  label: "Students Count",
                  data: distribution.map((d) => d.count),
                  backgroundColor: "rgba(16, 185, 129, 0.7)"
                }
              ]
            }}
            options={{ responsive: true }}
          />
        </div>
      )}

      {/* Performance Timeline */}
      {timeline.length > 0 && (
        <div>
          <h3 className="font-bold mt-4 mb-2">Performance Timeline</h3>
          <Line
            data={{
              labels: timeline.map((t) => t.examLabel),
              datasets: [
                {
                  label: "Average %",
                  data: timeline.map((t) => t.avgPercent),
                  borderColor: "rgba(59, 130, 246, 0.8)",
                  backgroundColor: "rgba(59, 130, 246, 0.4)",
                  fill: true
                }
              ]
            }}
            options={{ responsive: true }}
          />
        </div>
      )}

      {/* Attendance Overview */}
      {attendanceOverview && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-purple-50 rounded shadow">
            <div className="text-gray-600">Average Attendance %</div>
            <div className="text-xl font-bold">{attendanceOverview.avgAttendance}%</div>
          </div>
          <div className="p-4 bg-pink-50 rounded shadow flex justify-between items-center">
            <div>
              <div className="text-gray-600">Students Tracked</div>
              <div className="text-xl font-bold">{attendanceDistribution.length}</div>
            </div>
            <button
              onClick={exportAttendanceCSV}
              className="bg-green-500 text-white px-3 py-1 rounded text-sm"
            >
              Export CSV
            </button>
          </div>
        </div>
      )}

      {/* Attendance Distribution */}
      {attendanceDistribution.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Attendance Distribution</h3>
          <Bar
            data={{
              labels: attendanceDistribution.map((d) => d.student),
              datasets: [
                {
                  label: "Attendance %",
                  data: attendanceDistribution.map((d) => d.percentage),
                  backgroundColor: "rgba(168, 85, 247, 0.7)"
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true, max: 100 } }
            }}
          />
        </div>
      )}
    </section>
  );
};

export default Analytics;

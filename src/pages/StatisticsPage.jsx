import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import ThemeService from "../components/apiCalls/ThemeService";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import '../css/StatisticsPage.css';

// Register required chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function StatisticsPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters for year, month, and week
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(null);
  const [week, setWeek] = useState(null);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const fetchStatistics = async () => {
    setLoading(true);
    setError(null);

    try {
      // Send selected filters to the backend
      const data = await ThemeService.fetchStatistics({ year, month, week });
      setStatistics(data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.error("Unauthorized access. Redirecting to login.");
        navigate("/login");
      } else {
        setError("Failed to fetch statistics.");
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [year, month, week]);

  // Prepare data for the chart
  const chartData = {
    labels: statistics.map((stat) => stat.themeName),
    datasets: [
      {
        label: "Theme Usage Count",
        data: statistics.map((stat) => stat.totalPlays),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Theme Statistics",
      },
    },
  };

  return (
    <div>
      <h1>Theme Statistics</h1>

      {/* Filters */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          Year:
          <select
            value={year}
            onChange={(e) => {
              setYear(Number(e.target.value));
              setMonth(null); // Reset month if year changes
              setWeek(null); // Reset week if year changes
            }}
          >
            {Array.from({ length: currentYear - 2000 + 1 }, (_, i) => (
              <option key={i} value={2000 + i}>
                {2000 + i}
              </option>
            ))}
          </select>
        </label>
        <label>
          Month:
          <select
            value={month || ""}
            onChange={(e) => {
              setMonth(Number(e.target.value));
              setWeek(null); // Reset week if month changes
            }}
            disabled={!year || year === currentYear && currentMonth < 1}
          >
            <option value="">Select Month</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option
                key={i}
                value={i + 1}
                disabled={year === currentYear && i + 1 > currentMonth}
              >
                {i + 1}
              </option>
            ))}
          </select>
        </label>
        <label>
          Week:
          <select
            value={week || ""}
            onChange={(e) => setWeek(Number(e.target.value))}
            disabled={!!month}
          >
            <option value="">Select Week</option>
            {Array.from({ length: 52 }, (_, i) => (
              <option key={i} value={i + 1}>
                {`Last ${i + 1} Week(s)`}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading && <p>Loading statistics...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
}

export default StatisticsPage;

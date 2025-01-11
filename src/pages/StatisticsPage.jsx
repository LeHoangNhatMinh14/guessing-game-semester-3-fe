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

// Register required chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function StatisticsPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const now = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);

        const startDate = oneMonthAgo.toISOString().slice(0, -1); // Remove the 'Z'
        const endDate = now.toISOString().slice(0, -1); // Remove the 'Z'

        const data = await ThemeService.fetchStatistics(startDate, endDate);
        setStatistics(data);
      } catch (error) {
        if (error.response?.status === 401) {
          console.error("Unauthorized access. Redirecting to login.");
          navigate("/login");
        } else if (error.response?.status === 400) {
          console.error("Invalid date format sent to the backend.");
          setError(error.response.data); // Display the detailed backend error message
        } else {
          setError("Failed to fetch statistics.");
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [user, navigate]);

  if (loading) return <p>Loading statistics...</p>;
  if (error) return <p>{error}</p>;

  // Prepare data for the chart
  const chartData = {
    labels: statistics.map((stat) => stat.themeName), // Theme names
    datasets: [
      {
        label: "Theme Usage Count",
        data: statistics.map((stat) => stat.totalPlays), // Usage counts
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
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default StatisticsPage;

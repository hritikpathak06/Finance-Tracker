import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Transactions Per Month",
    },
  },
};

// Mapping short month names (_id) to full names
const monthMapping: { [key: string]: string } = {
  jan: "January",
  feb: "February",
  mar: "March",
  apr: "April",
  may: "May",
  jun: "June",
  jul: "July",
  aug: "August",
  sep: "September",
  oct: "October",
  nov: "November",
  dec: "December",
};

export function LineChart({
  data,
}: {
  data?: { _id: string; count: number }[];
}) {
  const safeData = Array.isArray(data) ? data : [];

  const labels = safeData.map(
    (d) => monthMapping[d._id?.toLowerCase()] || d._id || "Unknown"
  );
  const values = safeData.map((d) => d.count ?? 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Number of Transactions",
        data: values,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <div style={{ height: "100%", width: "100%", padding: "10px" }}>
      <Line options={options} data={chartData} />
    </div>
  );
}

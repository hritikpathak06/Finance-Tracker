import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Budget vs Actual Spending Comparison',
    },
  },
};

export function AreaChart({ budgetComparison }: { budgetComparison: any[] }) {
  // Extract categories, totalBudgetAmount, and totalActualSpent from budgetComparison
  const labels = budgetComparison.map(item => item.category);
  const budgetData = budgetComparison.map(item => item.totalBudgetAmount || 0); // Handle null values
  const actualData = budgetComparison.map(item => item.totalActualSpent || 0); // Handle null values

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Total Budget Amount',
        data: budgetData,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        fill: true,
        label: 'Total Actual Spent',
        data: actualData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return <Line options={options} data={data} />;
}

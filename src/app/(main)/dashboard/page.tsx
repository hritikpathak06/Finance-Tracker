'use client';

import { AreaChart } from "@/components/charts/AreaChart";
import { LineChart } from "@/components/charts/LineChart";
import { PieChart } from "@/components/charts/PieChart";
import axios from "axios";
import React, { useEffect, useState } from "react";

const page = () => {
  const [cardsData, setCardsData] = useState<any>(null);
  const [transactionByMonth, setTransactionByMonth] = useState<any>(null);
  const [topTransactions, setTopTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`/api/dashboard`);
      setCardsData(data?.result || null);
      setTransactionByMonth(data?.result?.transactions_by_month);
      setTopTransactions(data?.result?.top_transactions || []);
      setCategories(data?.result?.categories_count || []);
      setBudgets(data?.result?.budget_comparison || []);
    })();
  }, []);

  console.log("cards data==>> ", transactionByMonth);

  return (
    <>
      <div className="p-6 flex flex-col gap-8">
        {/* Filter Div */}

        {/* Card Div */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <div className="h-40 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 rounded-lg flex items-center justify-center flex-col gap-2 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <h1 className="text-2xl font-semibold text-black drop-shadow-md">
              Total Transactions
            </h1>
            <span className="text-xl font-bold text-black drop-shadow-md">
              {cardsData?.transactions[0]?.total}
            </span>
          </div>

          <div className="h-40 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 rounded-lg flex items-center justify-center flex-col gap-2 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <h1 className="text-2xl font-semibold text-black drop-shadow-md">
              Total Categories
            </h1>
            <span className="text-xl font-bold text-black drop-shadow-md">
              {cardsData?.categories[0]?.total}
            </span>
          </div>

          <div className="h-40 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 rounded-lg flex items-center justify-center flex-col gap-2 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <h1 className="text-2xl font-semibold text-black drop-shadow-md">
              Total Budgets
            </h1>
            <span className="text-xl font-bold text-black drop-shadow-md">
              {cardsData?.budgets[0]?.total}
            </span>
          </div>
        </div>

        {/* Main Graph */}
        <div className="mt-6">
          <AreaChart budgetComparison={budgets} />
        </div>

        {/* Graphs */}
        <div className="flex flex-col sm:flex-row gap-5 mt-6">
          <div className="h-auto p-2 w-full sm:w-1/2">
            <LineChart data={transactionByMonth} />
          </div>

          <div className="overflow-x-auto p-4 w-full sm:w-1/2">
            <h2 className="text-2xl font-semibold mb-4">Top 3 Transactions</h2>
            <table className="min-w-full border-collapse table-auto shadow-md rounded-lg p-5">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-2 border-b font-medium">Amount</th>
                  <th className="px-4 py-2 border-b font-medium">Month</th>
                  <th className="px-4 py-2 border-b font-medium">Category</th>
                </tr>
              </thead>
              <tbody>
                {topTransactions.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{t.amount}</td>
                    <td className="px-4 py-2 border-b">{t.month}</td>
                    <td className="px-4 py-2 border-b">{t.categoryDetails[0].name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pie chart */}
        <div className="flex gap-6 p-2 mt-6 flex-col sm:flex-row">
          <div className="w-full sm:w-1/2">
            <PieChart categories_count={categories} />
          </div>
        </div>
      </div>
    </>
  );
};

export default page;

"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

const page = () => {
  const [cardsData, setCardsData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`/api/dashboard`);
      setCardsData(data?.result || null);
    })();
  }, []);

  console.log("cards data==>> ", cardsData);

  return (
    <>
      <div className=" p-6  flex flex-col gap-5">
        {/* Filter Div */}
        <div>Filter Div</div>

        {/* Card Div */}
        <div className=" flex items-center justify-between gap-5">
          <div className="h-40 w-full bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 rounded-lg flex items-center justify-center flex-col gap-2 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <h1 className="text-2xl font-semibold text-black drop-shadow-md">
              Total Transactions
            </h1>
            <span className="text-xl font-bold text-black drop-shadow-md">
              {cardsData?.transactions[0]?.total}
            </span>
          </div>

          <div className="h-40 w-full bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 rounded-lg flex items-center justify-center flex-col gap-2 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <h1 className="text-2xl font-semibold text-black drop-shadow-md">
              Total Categories
            </h1>
            <span className="text-xl font-bold text-black drop-shadow-md">
              {cardsData?.categories[0]?.total}
            </span>
          </div>
          <div className="h-40 w-full bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 rounded-lg flex items-center justify-center flex-col gap-2 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <h1 className="text-2xl font-semibold text-black drop-shadow-md">
              Total Budgets
            </h1>
            <span className="text-xl font-bold text-black drop-shadow-md">
              {cardsData?.budgets[0]?.total}
            </span>
          </div>
        </div>

        {/* Graphs */}
        <div>Graphs</div>
      </div>
    </>
  );
};

export default page;

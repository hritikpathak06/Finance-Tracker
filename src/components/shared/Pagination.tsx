import { MoveLeft, ChevronLeft, ChevronRight, MoveRight } from "lucide-react";
import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }: any) => {
  return (
    <div className="flex justify-end items-center space-x-2 mt-4">
      <button
        className={`p-1 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition duration-200 ${
          currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
        }`}
        onClick={() => currentPage > 1 && onPageChange(1)}
        disabled={currentPage === 1}
      >
        <MoveLeft size={10} />
      </button>

      <button
        className={`p-1 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition duration-200 ${
          currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
        }`}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={10} />
      </button>

      <span className="text-sm text-gray-700 font-medium">
        Page {currentPage} of {totalPages}
      </span>

      <button
        className={`p-1 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition duration-200 ${
          currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
        }`}
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
      >
        <ChevronRight size={10} />
      </button>

      <button
        className={`p-1 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition duration-200 ${
          currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
        }`}
        onClick={() => currentPage < totalPages && onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        <MoveRight size={10} />
      </button>
    </div>
  );
};

export default Pagination;

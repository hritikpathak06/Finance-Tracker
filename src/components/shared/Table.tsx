import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CommonTable = ({ columns, data }: { columns: any[]; data: any[] }) => {
  return (
    <div className="bg-white mt-5 p-5 rounded-md min-h-[60vh]">
      <Table className="border">
        <TableCaption>A list of your categories.</TableCaption>
        <TableHeader className="">
          <TableRow>
            {columns.map((col, index) => (
              <TableHead key={index} className="w-[150px] font-extrabold">
                {col.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <TableCell key={colIndex} className="p-2">
                    {row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center p-4">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CommonTable;

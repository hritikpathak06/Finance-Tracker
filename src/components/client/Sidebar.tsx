"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Receipt,
  PlusCircle,
  DollarSign,
  Tags,
} from "lucide-react"; // Import required icons
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

const sidebar_data = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    link: "/dashboard",
  },
  {
    name: "Transactions",
    icon: Receipt,
    link: "/transactions",
  },
  {
    name: "New Transaction",
    icon: PlusCircle,
    link: "/create-transaction",
  },
  {
    name: "Budget",
    icon: DollarSign,
    link: "/budget",
  },
  {
    name: "Categories",
    icon: Tags,
    link: "/categories",
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false); 

  return (
    <div className="w-full h-screen bg-card border-r flex flex-col bg-gray-700">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          FinanceTracker
        </h1>
      </div>

      <Sheet open={open} onOpenChange={setOpen} >
        <div className="lg:hidden p-4">
          <SheetTrigger
            
            onClick={() => setOpen(!open)}
            className="text-white"
          >
            ☰ 
          </SheetTrigger>
        </div>

        <SheetContent className="bg-gray-700 ">
        <div className="space-y-1">
          {sidebar_data.map((item, idx) => (
            <Link
              key={idx}
              href={item.link}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                pathname.includes(item.link)
                  ? "bg-white text-black"
                  : "text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="block">{item.name}</span>{" "}
            </Link>
          ))}
        </div>
        </SheetContent>
      </Sheet>
      <nav className="hidden lg:block flex-1 p-4">
        <div className="space-y-1">
          {sidebar_data.map((item, idx) => (
            <Link
              key={idx}
              href={item.link}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                pathname.includes(item.link)
                  ? "bg-white text-black"
                  : "text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="block">{item.name}</span>{" "}
              {/* Text visible only on large screens */}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;

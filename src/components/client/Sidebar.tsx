'use client';

import { CalendarSearch, CassetteTapeIcon, DatabaseIcon, LayoutDashboard, PlusCircle, Receipt, Tags } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";

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
    name: "Categories",
    icon: Tags,
    link: "/categories",
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-full h-screen bg-card border-r flex flex-col bg-gray-700 ">
      {/* Logo Section */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          FinanceTracker
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {sidebar_data.map((item, idx) => (
            <Link
              key={idx}
              href={item.link}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                pathname.includes (item.link)
                  ? "bg-white text-black"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
import Navabar from "@/components/client/Navabar";
import Sidebar from "@/components/client/Sidebar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finance Tracker",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className=" flex min-h-[100vh]">
          <div className=" w-[15%] ">
            <Sidebar />
          </div>
          <div className=" w-full">
            <Navabar />
            <div className=" p-4">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}

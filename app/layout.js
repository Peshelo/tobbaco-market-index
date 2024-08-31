import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { AntdRegistry } from "@ant-design/nextjs-registry";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tobbaco Market Index",
  description: "Realtime tobacco market index",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}><AntdRegistry>{children}<ToastContainer/></AntdRegistry></body>
    </html>
  );
}

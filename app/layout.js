import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata = {
  title: "Auto Proposal AI",
  description: "Your Vision, Our Ideas",
  icons: {
    icon: "/favicon.ico", // Add path to your favicon
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.className}>{children}</body>
    </html>
  );
}

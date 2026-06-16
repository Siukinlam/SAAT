import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SAAT 学格 — 发现你的学业倾向",
  description:
    "SAAT（Student Academic Aptitude Type）学业倾向测评。20道题，3分钟，发现你的专属学格代号，获取个性化的分科/专业推荐。",
  keywords: ["学格", "学业测评", "MBTI", "高考志愿", "选科", "专业选择", "SAAT"],
  openGraph: {
    title: "SAAT 学格 — 发现你的学业倾向",
    description: "20道题，3分钟，发现你的专属学格代号！初高中生专属的学业MBTI测评。",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

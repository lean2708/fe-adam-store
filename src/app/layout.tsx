import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Adam Store - Thời trang nam hiện đại",
  description: "Khám phá bộ sưu tập thời trang nam cao cấp tại Adam Store. Phong cách hiện đại, chất lượng tuyệt vời.",
  keywords: "thời trang nam, áo sơ mi, áo khoác, quần jean, Adam Store",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

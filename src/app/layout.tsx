import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { roboto } from "@/config/fonts"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "next-themes"
import GetMe from "./GetMe"

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
    <html lang="en">
      <link
        rel="icon"
        href="/icon?<generated>"
        type="image/png"
        sizes="32x32"
      />
      <body className={cn("bg-white dark:bg-black", roboto.className)}>
        <GetMe>
          {/* <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange> */}
            {/* <VisitCounter>{children}</VisitCounter> */}
            {children}
            <Toaster />
          {/* </ThemeProvider> */}
        </GetMe>
      </body>
    </html>

  )
}

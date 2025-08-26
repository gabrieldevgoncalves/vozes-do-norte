import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: false,
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  preload: false,
})

export const metadata: Metadata = {
  title: "Vozes do Norte - Festival de Música Gospel Paraense",
  description: "O maior festival de música gospel do Pará. Inscreva-se e participe!",
  generator: "v0.app",
  icons: {
    icon:"/favicon-wh.ico"
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable} antialiased`} suppressHydrationWarning>
      <body className="font-sans">{children}</body>
    </html>
  )
}

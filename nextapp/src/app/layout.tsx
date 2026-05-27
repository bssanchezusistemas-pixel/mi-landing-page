import type { Metadata, Viewport } from "next";
import { Outfit, Syne } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#050505",
};

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Coclí Hotel | Hotel boutique en Roldanillo",
  description:
    "Hospedaje boutique, restaurante y experiencias en Roldanillo, Valle del Cauca. Reserva tu estadía en Coclí Hotel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CO" className={`${outfit.variable} ${syne.variable}`}>
      <body className={outfit.className}>{children}</body>
    </html>
  );
}

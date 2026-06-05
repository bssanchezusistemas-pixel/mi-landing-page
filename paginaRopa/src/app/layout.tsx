import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
};

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pipe en la Calle | Streetwear Premium & Dark Luxury",
  description:
    "Tienda online oficial de Pipe en la Calle. Ropa urbana premium: Camisetas Oversize, Pantalones Cargo, Sneakers, Hoodies y Accesorios de diseño exclusivo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CO" className={`${outfit.variable}`}>
      <body className={`${outfit.className} bg-brand-black text-brand-white min-h-screen flex flex-col justify-between`}>
        <CartProvider>
          <Navbar />
          <main className="flex-grow pt-[80px]">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}


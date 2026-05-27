import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flavor House | La Experiencia Burger Definitiva",
  description:
    "Burgers artesanales premium en un ambiente cinematográfico de lujo oscuro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CO">
      <body>{children}</body>
    </html>
  );
}


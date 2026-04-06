// app/layout.tsx -> GARANTA QUE O NOME SEJA .tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InBarber Assistant",
  description: "Agendamento Inteligente",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className="h-full">
      {/* Removi as classes que forçavam fonte Geist aqui para 
          deixar o CSS do seu tema assumir o controle no body */}
      <body className="h-full bg-background text-white antialiased">
        {children}
      </body>
    </html>
  );
}
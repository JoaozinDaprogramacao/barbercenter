import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { PwaRegister } from "@/components/PwaRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BarberCenter | Gestão Inteligente para sua Barbearia",
  description: "O sistema mais completo para barbeiros: agendamento online, controle de estoque, gestão de equipe e financeiro na palma da sua mão.",
  // Configurações PWA / iOS
  appleWebApp: {
    capable: true,
    title: "SaaS Admin",
    statusBarStyle: "black-translucent",
  },

  // Mapeamento dos novos ícones
  icons: {
    icon: [
      { url: "/imgs/icons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/imgs/icons/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/imgs/icons/favicon.ico",
    apple: "/imgs/icons/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PwaRegister />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
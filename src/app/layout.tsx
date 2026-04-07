import type { Metadata } from "next";
import { Poppins, Noto_Sans_Devanagari, Noto_Sans_Tamil, Noto_Sans_Telugu, Noto_Sans_Malayalam } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-sans-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
});

const notoTamil = Noto_Sans_Tamil({
  variable: "--font-noto-sans-tamil",
  subsets: ["tamil"],
  weight: ["400", "500", "600", "700"],
});

const notoTelugu = Noto_Sans_Telugu({
  variable: "--font-noto-sans-telugu",
  subsets: ["telugu"],
  weight: ["400", "500", "600", "700"],
});

const notoMalayalam = Noto_Sans_Malayalam({
  variable: "--font-noto-sans-malayalam",
  subsets: ["malayalam"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Hasmukh — Random Joke Generator",
  description:
    "Get a daily dose of laughter in English, Hindi, Marathi, Tamil, Telugu, and Malayalam. Premium joke generator with speech synthesis and sharing.",
  keywords: ["jokes", "humor", "multilingual", "hasmukh", "random joke generator"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${poppins.variable} ${notoDevanagari.variable} ${notoTamil.variable} ${notoTelugu.variable} ${notoMalayalam.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

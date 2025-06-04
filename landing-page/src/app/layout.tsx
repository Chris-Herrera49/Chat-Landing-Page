import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { RowndProviderWrapper } from "./providers/rownd-provider";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: "IrregularChat",
  icons: {
    icon: "/irregular_chat_logo.png",
    apple: "/irregular_chat_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} antialiased`}
        style={{ 
          background: 'radial-gradient(50% 85.74% at 50% 50%, #777777 0%, #444444 100%)', 
          minHeight: '100vh',
          fontFamily: 'var(--font-roboto)'
        }}
      >
        <RowndProviderWrapper>
          {children}
        </RowndProviderWrapper>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../src/lib/theme';

export const metadata: Metadata = {
  title: 'CompareCart — Universal Real-Time Price & Partner Card Optimizer',
  description: 'Multi-store price comparison across Flipkart, Amazon, Croma, Reliance Digital and Vijay Sales with real-time price history and partner card discount unlocking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen luxury-mesh-bg antialiased selection:bg-[#d4a017] selection:text-black">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
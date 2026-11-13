import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CompareCart — Universal Real-Time Price & Partner Card Optimizer',
  description: 'Multi-store price comparison across Flipkart, Amazon, and Croma with real-time price history and partner card discount unlocking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

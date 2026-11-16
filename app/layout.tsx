import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../src/lib/theme';
import { NotificationToastContainer } from '../src/components/NotificationToastContainer';
import { AuthModal } from '../src/components/AuthModal';

export const metadata: Metadata = {
  title: 'CompareCart — Universal Real-Time Price & Partner Card Optimizer',
  description: 'Multi-store price comparison across Flipkart, Amazon, Croma, Reliance Digital and Vijay Sales with real-time price history and partner card discount unlocking.',
  icons: {
    icon: [
      { url: '/logo-icon.png?v=2', type: 'image/png' },
    ],
    shortcut: '/logo-icon.png?v=2',
    apple: '/logo-icon.png?v=2',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/logo-icon.png?v=2" />
        <link rel="shortcut icon" href="/logo-icon.png?v=2" />
        <link rel="apple-touch-icon" href="/logo-icon.png?v=2" />
      </head>
      <body className="min-h-screen luxury-mesh-bg antialiased selection:bg-[#d4a017] selection:text-black">
        <ThemeProvider>
          {children}
          <NotificationToastContainer />
          <AuthModal />
        </ThemeProvider>
      </body>
    </html>
  );
}
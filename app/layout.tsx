import type { Metadata } from 'next';
import { Playfair_Display, Manrope } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'ZazaGuide - Tours in Georgia',
  description:
    'Authentic Georgia tours: mountains, wine, culture, and local stories. Available in English, Georgian, and Russian.',
  keywords:
    'Georgia tours, Tbilisi tours, hiking Georgia, cultural tours, wine tasting, Кавказ, საქართველო',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}

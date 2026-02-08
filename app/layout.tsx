import type { Metadata } from 'next';
import { Playfair_Display, Manrope } from 'next/font/google';
import Script from 'next/script';
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
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-X2FQ5Q6EC8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-X2FQ5Q6EC8');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}

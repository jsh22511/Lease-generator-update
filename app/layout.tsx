import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Free Lease Generator - Create Residential Lease Agreements',
  description: 'Generate professional residential lease agreements in minutes. Free, secure, and jurisdiction-aware lease generator with legal disclaimers.',
  keywords: 'lease generator, rental agreement, residential lease, landlord, tenant, property management',
  authors: [{ name: 'Lease Generator Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Free Lease Generator',
    description: 'Generate professional residential lease agreements in minutes.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Lease Generator',
    description: 'Generate professional residential lease agreements in minutes.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

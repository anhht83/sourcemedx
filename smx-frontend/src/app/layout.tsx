import type { Metadata } from 'next'
import './globals.css'
import { ReactQueryProvider } from '@/providers/react-query-provider'

export const metadata: Metadata = {
  title: 'SourceMedX - Global B2B Medical Device Sourcing',
  description:
    'SourceMedX revolutionizes global medical device sourcing by empowering buyers to rapidly discover and select best-fit products. Sellers can expand reach and visibility—driving faster, smarter, and more profitable decisions for all stakeholders.',
  icons: [
    {
      url: '/favicon.png',
      type: 'image/png',
      sizes: '32x32',
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  )
}

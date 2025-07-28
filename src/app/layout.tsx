import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ADmyBRAND Insights - Digital Marketing Analytics',
  description: 'Advanced analytics dashboard for digital marketing agencies - Track campaigns, conversions, and ROI in real-time',
  keywords: 'digital marketing, analytics, dashboard, campaigns, ROI, conversion tracking',
  authors: [{ name: 'ADmyBRAND Insights Team' }],
}

import { ThemeProvider } from '../components/ThemeProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
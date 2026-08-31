import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PlatePulse | Live Kitchen Streaming Food Delivery',
  description: 'Watch your food being prepared in real-time. Order from restaurants with live kitchen cameras.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/ui/navigation'
import { AppProvider } from '@/context/AppContext'
import { Toaster } from 'react-hot-toast'
import { ErrorBoundary } from '@/components/ui/error-boundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Constructiv AI Dashboard',
  description: 'Professional AI-powered dashboard for construction industry document extraction and prompt management',
  keywords: ['construction', 'AI', 'document extraction', 'prompt management', 'dashboard'],
  authors: [{ name: 'Constructiv AI' }],
  creator: 'Constructiv AI',
  publisher: 'Constructiv AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://constructiv-ai-dashboard.com',
    title: 'Constructiv AI Dashboard',
    description: 'Professional AI-powered dashboard for construction industry document extraction and prompt management',
    siteName: 'Constructiv AI Dashboard',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification_token_here',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <AppProvider>
          <ErrorBoundary>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
              <Navigation />
              <main className="container mx-auto px-4 py-8">
                {children}
              </main>
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                className: 'glass-card text-sm font-medium',
                success: {
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
          </ErrorBoundary>
        </AppProvider>
      </body>
    </html>
  )
}
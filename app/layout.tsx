import Provider from '@/providers/provider'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import AuthWrapper from '@/providers/auth-wrapper'
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL("https://starter.rasmic.xyz"),
  title: {
    default: 'Quickfeed',
    template: `%s | Quickfeed`
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthWrapper>
      <html lang="en" suppressHydrationWarning>
        <body className={GeistSans.className}>
          <Provider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <my-widget project="cm2yp2yp600028iy9zqhe47nx"></my-widget>
              <Script
                src="https://quickfeedwidgetlight.netlify.app/widget.js"
                strategy="afterInteractive"
              />
              <Toaster />
            </ThemeProvider>
          </Provider>
        </body>
      </html>
    </AuthWrapper>
  )
}
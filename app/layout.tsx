import { type Metadata, type Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from "@/app/providers"
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'BanQR',
    description: 'Crea y comparte tus datos de transferencia bancaria.',
    metadataBase: new URL('https://qr.lepepe.dev'), // Ajusta tu URL
    alternates: {
        canonical: '/',
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: 'BanQR',
        description: 'Crea y comparte tus datos de transferencia bancaria.',
        url: 'https://qr.lepepe.dev',
        siteName: 'BanQR',
        locale: 'es_CL',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'BanQR',
        description: 'Crea y comparte tus datos de transferencia bancaria.',
    },
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 1,
    viewportFit: 'cover', // Soporte para notch (iPhones)
    colorScheme: 'light',
    themeColor: '#ffffff', // Color de la barra de estado
    // interactiveWidget: 'resizes-content' // Para widgets en Chrome
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="es-CL" suppressHydrationWarning>
        <head>
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh bg-background text-foreground`}>
        <Providers>
            <div className="min-h-dvh grid grid-rows-[auto_1fr_auto] safe-area">
                {children}
            </div>
            <Toaster richColors position="top-right" />
        </Providers>
        </body>
        </html>
    )
}

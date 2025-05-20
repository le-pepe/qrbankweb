import { type Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import {Providers} from "@/app/providers";

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'QR Bancos Chile',
    description: 'Crea y comparte tus datos de transferencia bancaria.',
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
            <html lang="en" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <Providers>
                <div className="min-h-dvh grid grid-rows-(--grid-template)">
                    {children}
                </div>
            </Providers>
            </body>
            </html>
    )
}

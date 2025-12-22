import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'The Wizard - Gym Workout Tracker',
    description: 'A Heavy/Light/Medium hypertrophy training program tracker',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <Providers>
                    <div className="min-h-screen flex flex-col">
                        <Navbar />
                        <main className="flex-1 container py-6">
                            {children}
                        </main>
                        <footer className="border-t py-4">
                            <div className="container text-center text-sm text-muted-foreground">
                                The Wizard - A Fazlifts Hypertrophy Program
                            </div>
                        </footer>
                    </div>
                </Providers>
            </body>
        </html>
    )
}

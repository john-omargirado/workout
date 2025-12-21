"use client"

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Dumbbell, Home, BookOpen, Settings, Calendar, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navbar() {
    const { data: session, status } = useSession()

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <Link href="/" className="mr-4 flex items-center gap-2">
                    <Dumbbell className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg">The Wizard</span>
                </Link>

                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    {session ? (
                        <>
                            <nav className="flex items-center gap-6 text-sm">
                                <Link
                                    href="/"
                                    className="flex items-center gap-2 text-foreground/60 transition-colors hover:text-foreground/80"
                                >
                                    <Home className="h-4 w-4" />
                                    <span className="hidden sm:inline">Dashboard</span>
                                </Link>
                                <Link
                                    href="/history"
                                    className="flex items-center gap-2 text-foreground/60 transition-colors hover:text-foreground/80"
                                >
                                    <Calendar className="h-4 w-4" />
                                    <span className="hidden sm:inline">History</span>
                                </Link>
                                <Link
                                    href="/exercises"
                                    className="flex items-center gap-2 text-foreground/60 transition-colors hover:text-foreground/80"
                                >
                                    <BookOpen className="h-4 w-4" />
                                    <span className="hidden sm:inline">Exercises</span>
                                </Link>
                                <Link
                                    href="/settings"
                                    className="flex items-center gap-2 text-foreground/60 transition-colors hover:text-foreground/80"
                                >
                                    <Settings className="h-4 w-4" />
                                    <span className="hidden sm:inline">Settings</span>
                                </Link>
                            </nav>
                            <div className="flex items-center gap-4 ml-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <User className="h-4 w-4" />
                                    <span className="hidden sm:inline">{session.user?.name || session.user?.email}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => signOut({ callbackUrl: '/login' })}
                                    className="flex items-center gap-2"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden sm:inline">Sign Out</span>
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            {status !== 'loading' && (
                                <>
                                    <Link href="/login">
                                        <Button variant="ghost" size="sm">Sign In</Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button size="sm">Get Started</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

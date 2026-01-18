"use client"

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

import { Dumbbell, Home, BookOpen, Settings, Calendar, LogOut, User, Menu, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { DarkModeToggle } from '@/components/dark-mode-toggle'


export function Navbar() {
    const { data: session, status } = useSession()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Nav links for reuse
    const navLinks = session ? (
        <>
            <Link
                href="/"
                className="flex items-center gap-2 text-foreground/60 transition-colors hover:text-foreground/80"
                onClick={() => setMobileMenuOpen(false)}
            >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link
                href="/history"
                className="flex items-center gap-2 text-foreground/60 transition-colors hover:text-foreground/80"
                onClick={() => setMobileMenuOpen(false)}
            >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">History</span>
            </Link>
            <Link
                href="/exercises"
                className="flex items-center gap-2 text-foreground/60 transition-colors hover:text-foreground/80"
                onClick={() => setMobileMenuOpen(false)}
            >
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Exercises</span>
            </Link>
            <Link
                href="/settings"
                className="flex items-center gap-2 text-foreground/60 transition-colors hover:text-foreground/80"
                onClick={() => setMobileMenuOpen(false)}
            >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
            </Link>
        </>
    ) : null

    return (
        <nav className="border-b bg-background/95 supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between">
                <Link href="/" className="mr-4 flex items-center gap-2">
                    <Dumbbell className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg">The Wizard</span>
                </Link>

                {/* Desktop nav links */}
                <div className="hidden md:flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="flex items-center gap-6">
                        <nav className="flex items-center gap-6 text-sm">
                            {navLinks}
                        </nav>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                        <DarkModeToggle />
                        {session ? (
                            <>
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

                {/* Hamburger icon for mobile - now inside container */}
                <button
                    className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-ring"
                    onClick={() => setMobileMenuOpen((open) => !open)}
                    aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile menu dropdown - positioned from the right */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute right-0 left-0 top-14 z-50 bg-background border-b shadow-lg">
                    <div className="container py-4">
                        <nav className="flex flex-col gap-2 text-base font-medium mb-4">
                            <Link href="/" className="flex items-center gap-3 py-2 px-3 rounded hover:bg-accent transition" onClick={() => setMobileMenuOpen(false)}>
                                <Home className="h-5 w-5" /> Dashboard
                            </Link>
                            <Link href="/history" className="flex items-center gap-3 py-2 px-3 rounded hover:bg-accent transition" onClick={() => setMobileMenuOpen(false)}>
                                <Calendar className="h-5 w-5" /> History
                            </Link>
                            <Link href="/exercises" className="flex items-center gap-3 py-2 px-3 rounded hover:bg-accent transition" onClick={() => setMobileMenuOpen(false)}>
                                <BookOpen className="h-5 w-5" /> Exercises
                            </Link>
                            <Link href="/settings" className="flex items-center gap-3 py-2 px-3 rounded hover:bg-accent transition" onClick={() => setMobileMenuOpen(false)}>
                                <Settings className="h-5 w-5" /> Settings
                            </Link>
                        </nav>
                        <div className="flex flex-col gap-2 pt-2 border-t">
                            <div className="px-3 py-2">
                                <DarkModeToggle />
                            </div>
                            {session ? (
                                <>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground py-2 px-3">
                                        <User className="h-5 w-5" />
                                        <span className="font-medium">{session.user?.name || session.user?.email}</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: '/login' }) }}
                                        className="flex items-center gap-2 w-full justify-start"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        <span>Sign Out</span>
                                    </Button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {status !== 'loading' && (
                                        <>
                                            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                                <Button variant="ghost" size="sm" className="w-full justify-start">Sign In</Button>
                                            </Link>
                                            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                                <Button size="sm" className="w-full justify-start">Get Started</Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
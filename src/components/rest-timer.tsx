"use client"

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatTime } from '@/lib/utils'
import { Play, Pause, RotateCcw, X, Timer } from 'lucide-react'

interface RestTimerProps {
    initialSeconds: number
    onComplete?: () => void
    dayType?: 'heavy' | 'light' | 'medium'
}

const dayTypeStyles = {
    heavy: {
        gradient: 'from-red-500 to-rose-600',
        bg: 'bg-red-50 dark:bg-red-950/30',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-600 dark:text-red-400',
        stroke: 'text-red-500',
    },
    light: {
        gradient: 'from-green-500 to-emerald-600',
        bg: 'bg-green-50 dark:bg-green-950/30',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-600 dark:text-green-400',
        stroke: 'text-green-500',
    },
    medium: {
        gradient: 'from-yellow-400 to-amber-500',
        bg: 'bg-yellow-50 dark:bg-yellow-950/30',
        border: 'border-yellow-200 dark:border-yellow-800',
        text: 'text-yellow-600 dark:text-yellow-400',
        stroke: 'text-yellow-500',
    },
}

export function RestTimer({ initialSeconds, onComplete, dayType = 'heavy' }: RestTimerProps) {
    const [seconds, setSeconds] = useState(initialSeconds)
    const [isRunning, setIsRunning] = useState(true) // Auto-start
    const [hasCompleted, setHasCompleted] = useState(false)

    const styles = dayTypeStyles[dayType]

    const playSound = useCallback(() => {
        if (typeof window !== 'undefined') {
            const audio = new Audio('/timer-complete.mp3')
            audio.play().catch(() => {
                // Fallback: use Web Audio API beep
                const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
                const oscillator = audioContext.createOscillator()
                const gainNode = audioContext.createGain()

                oscillator.connect(gainNode)
                gainNode.connect(audioContext.destination)

                oscillator.frequency.value = 800
                oscillator.type = 'sine'
                gainNode.gain.value = 0.3

                oscillator.start()
                oscillator.stop(audioContext.currentTime + 0.3)
            })
        }
    }, [])

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null

        if (isRunning && seconds > 0) {
            interval = setInterval(() => {
                setSeconds((s) => s - 1)
            }, 1000)
        } else if (seconds === 0 && isRunning) {
            setIsRunning(false)
            setHasCompleted(true)
            playSound()
            // Auto dismiss after 2 seconds
            setTimeout(() => {
                onComplete?.()
            }, 2000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isRunning, seconds, onComplete, playSound])

    const handleStart = () => {
        setIsRunning(true)
        setHasCompleted(false)
    }

    const handlePause = () => {
        setIsRunning(false)
    }

    const handleReset = () => {
        setSeconds(initialSeconds)
        setIsRunning(true)
        setHasCompleted(false)
    }

    const handleDismiss = () => {
        onComplete?.()
    }

    const progress = ((initialSeconds - seconds) / initialSeconds) * 100
    const circumference = 2 * Math.PI * 40

    return (
        <Card className={`border-2 ${hasCompleted ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50' : `${styles.border} ${styles.bg}`} shadow-lg animate-scale-in`}>
            <CardContent className="p-3">
                <div className="flex items-center gap-3">
                    {/* Circular Progress - Compact */}
                    <div className="relative w-14 h-14 shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="10"
                                fill="none"
                                className="text-muted/30"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                stroke="url(#timerGradient)"
                                strokeWidth="10"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={circumference - (circumference * progress) / 100}
                                className="transition-all duration-1000 ease-linear"
                            />
                            <defs>
                                <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor={hasCompleted ? '#22c55e' : dayType === 'heavy' ? '#ef4444' : dayType === 'light' ? '#22c55e' : '#eab308'} />
                                    <stop offset="100%" stopColor={hasCompleted ? '#10b981' : dayType === 'heavy' ? '#e11d48' : dayType === 'light' ? '#059669' : '#f59e0b'} />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-sm font-bold ${hasCompleted ? 'text-green-600 dark:text-green-400' : ''}`}>
                                {formatTime(seconds)}
                            </span>
                        </div>
                    </div>

                    {/* Content - Single row layout */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                            <Timer className={`h-3.5 w-3.5 shrink-0 ${hasCompleted ? 'text-green-600' : styles.text}`} />
                            <span className="font-semibold text-sm truncate">
                                {hasCompleted ? 'Rest Complete! 💪' : `Rest: ${initialSeconds / 60}m`}
                            </span>
                        </div>
                    </div>

                    {/* Controls - Compact buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        {!hasCompleted && (
                            <>
                                {!isRunning ? (
                                    <Button
                                        onClick={handleStart}
                                        size="icon"
                                        className={`h-8 w-8 bg-gradient-to-r ${styles.gradient} hover:opacity-90 text-white`}
                                    >
                                        <Play className="h-3.5 w-3.5" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handlePause}
                                        size="icon"
                                        variant="secondary"
                                        className="h-8 w-8"
                                    >
                                        <Pause className="h-3.5 w-3.5" />
                                    </Button>
                                )}
                                <Button
                                    onClick={handleReset}
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8"
                                >
                                    <RotateCcw className="h-3.5 w-3.5" />
                                </Button>
                            </>
                        )}
                        <Button
                            onClick={handleDismiss}
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

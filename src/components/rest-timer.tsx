"use client"

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatTime } from '@/lib/utils'
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react'

interface RestTimerProps {
  initialSeconds: number
  onComplete?: () => void
}

export function RestTimer({ initialSeconds, onComplete }: RestTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)

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
      onComplete?.()
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
    setIsRunning(false)
    setHasCompleted(false)
  }

  const progress = ((initialSeconds - seconds) / initialSeconds) * 100

  return (
    <Card className={`${hasCompleted ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''}`}>
      <CardContent className="p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={352}
                strokeDashoffset={352 - (352 * progress) / 100}
                className={`transition-all duration-1000 ${hasCompleted ? 'text-green-500' : 'text-primary'}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold">{formatTime(seconds)}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {!isRunning ? (
              <Button onClick={handleStart} size="icon" variant="default">
                <Play className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handlePause} size="icon" variant="secondary">
                <Pause className="h-4 w-4" />
              </Button>
            )}
            <Button onClick={handleReset} size="icon" variant="outline">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          
          {hasCompleted && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <Volume2 className="h-4 w-4" />
              <span className="text-sm font-medium">Rest Complete!</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

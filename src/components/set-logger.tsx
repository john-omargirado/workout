"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, Plus, Minus } from 'lucide-react'

interface SetLoggerProps {
    exerciseName: string
    muscleGroup: string
    setNumber: number
    targetReps: string
    initialWeight?: number
    initialReps?: number
    onComplete: (weight: number, reps: number) => void
    isCompleted?: boolean
    dayType?: 'heavy' | 'light' | 'medium'
}

const dayTypeGradients = {
    heavy: 'from-red-500 to-rose-600',
    light: 'from-green-500 to-emerald-600',
    medium: 'from-yellow-400 to-amber-500',
}

export function SetLogger({
    exerciseName,
    muscleGroup,
    setNumber,
    targetReps,
    initialWeight = 0,
    initialReps = 0,
    onComplete,
    isCompleted = false,
    dayType = 'heavy'
}: SetLoggerProps) {
    const [weight, setWeight] = useState(initialWeight)
    const [reps, setReps] = useState(initialReps)
    const [completed, setCompleted] = useState(isCompleted)

    const handleComplete = () => {
        if (weight === 0 && reps === 0) return
        setCompleted(true)
        onComplete(weight, reps)
    }

    const adjustWeight = (amount: number) => {
        setWeight(Math.max(0, weight + amount))
    }

    const adjustReps = (amount: number) => {
        setReps(Math.max(0, reps + amount))
    }

    const gradient = dayTypeGradients[dayType]

    return (
        <div
            className={`relative rounded-xl border-2 p-3 transition-all duration-300 ${completed
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-400'
                : 'bg-card border-border hover:border-muted-foreground/30'
                }`}
        >
            {/* Single row layout - Set info + Inputs + Complete button */}
            <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-3 items-center">
                {/* Set indicator */}
                <div className="flex items-center gap-2">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0
                        ${completed ? 'bg-gradient-to-br from-green-500 to-emerald-600' : `bg-gradient-to-br ${gradient}`}`}>
                        {completed ? <Check className="h-4 w-4" /> : setNumber}
                    </div>
                    <div className="hidden sm:block">
                        <span className="font-medium text-sm leading-none">Set {setNumber}</span>
                        <p className="text-xs text-muted-foreground">{targetReps} reps</p>
                    </div>
                </div>

                {/* Weight Input - compact */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-lg shrink-0"
                        onClick={() => adjustWeight(-2.5)}
                        disabled={completed}
                    >
                        <Minus className="h-3 w-3" />
                    </Button>
                    <div className="relative flex-1 min-w-0">
                        <Input
                            type="number"
                            value={weight || ''}
                            placeholder="0"
                            onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                            className="text-center h-9 text-base font-semibold rounded-lg pr-8"
                            disabled={completed}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">kg</span>
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-lg shrink-0"
                        onClick={() => adjustWeight(2.5)}
                        disabled={completed}
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                </div>

                {/* Reps Input - compact */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-lg shrink-0"
                        onClick={() => adjustReps(-1)}
                        disabled={completed}
                    >
                        <Minus className="h-3 w-3" />
                    </Button>
                    <div className="relative flex-1 min-w-0">
                        <Input
                            type="number"
                            value={reps || ''}
                            placeholder="0"
                            onChange={(e) => setReps(parseInt(e.target.value) || 0)}
                            className="text-center h-9 text-base font-semibold rounded-lg pr-10"
                            disabled={completed}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">reps</span>
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-lg shrink-0"
                        onClick={() => adjustReps(1)}
                        disabled={completed}
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                </div>

                {/* Complete Button */}
                <Button
                    size="icon"
                    className={`h-9 w-9 rounded-lg transition-all duration-300 shrink-0 ${completed
                        ? 'bg-green-500 hover:bg-green-600'
                        : `bg-gradient-to-br ${gradient} hover:opacity-90`
                        }`}
                    onClick={handleComplete}
                    disabled={completed || (weight === 0 && reps === 0)}
                >
                    <Check className="h-4 w-4 text-white" />
                </Button>
            </div>

            {/* Mobile: show set info below on very small screens */}
            <div className="sm:hidden flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                <span className="text-xs text-muted-foreground">Set {setNumber} • Target: {targetReps}</span>
                {completed && (
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                        <Check className="h-3 w-3" /> Done
                    </span>
                )}
            </div>
        </div>
    )
}

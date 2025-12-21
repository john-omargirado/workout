"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
}

export function SetLogger({
    exerciseName,
    muscleGroup,
    setNumber,
    targetReps,
    initialWeight = 0,
    initialReps = 0,
    onComplete,
    isCompleted = false
}: SetLoggerProps) {
    const [weight, setWeight] = useState(initialWeight)
    const [reps, setReps] = useState(initialReps)
    const [completed, setCompleted] = useState(isCompleted)

    const handleComplete = () => {
        setCompleted(true)
        onComplete(weight, reps)
    }

    const adjustWeight = (amount: number) => {
        setWeight(Math.max(0, weight + amount))
    }

    const adjustReps = (amount: number) => {
        setReps(Math.max(0, reps + amount))
    }

    return (
        <Card className={`transition-all ${completed ? 'bg-green-50 dark:bg-green-950 border-green-500' : ''}`}>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">{exerciseName}</CardTitle>
                        <p className="text-sm text-muted-foreground">Set {setNumber} • Target: {targetReps} reps</p>
                    </div>
                    <Badge variant="outline">{muscleGroup}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    {/* Weight Input */}
                    <div className="flex-1">
                        <label className="text-xs text-muted-foreground mb-1 block">Weight (kg)</label>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => adjustWeight(-2.5)}
                                disabled={completed}
                            >
                                <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                                className="text-center h-8"
                                disabled={completed}
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => adjustWeight(2.5)}
                                disabled={completed}
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>

                    {/* Reps Input */}
                    <div className="flex-1">
                        <label className="text-xs text-muted-foreground mb-1 block">Reps</label>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => adjustReps(-1)}
                                disabled={completed}
                            >
                                <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                                type="number"
                                value={reps}
                                onChange={(e) => setReps(parseInt(e.target.value) || 0)}
                                className="text-center h-8"
                                disabled={completed}
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => adjustReps(1)}
                                disabled={completed}
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>

                    {/* Complete Button */}
                    <Button
                        variant={completed ? "secondary" : "default"}
                        size="icon"
                        className="h-10 w-10 mt-5"
                        onClick={handleComplete}
                        disabled={completed}
                    >
                        <Check className={`h-4 w-4 ${completed ? 'text-green-600' : ''}`} />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

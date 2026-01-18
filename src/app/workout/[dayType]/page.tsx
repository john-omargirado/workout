"use client"

import { useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { SetLogger } from '@/components/set-logger'
import { RestTimer } from '@/components/rest-timer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getDayTypeInfo } from '@/lib/utils'
import { workoutTemplates } from '@/lib/exercises'
import { ArrowLeft, Check, Dumbbell, Timer, Target, Flame, Trophy, ChevronDown, ChevronUp, Zap, Loader2, X } from 'lucide-react'

interface WorkoutPageProps {
    params: { dayType: string }
}

interface SetData {
    exerciseIndex: number
    setNumber: number
    weight: number
    reps: number
}

const dayTypeStyles = {
    heavy: {
        gradient: 'from-red-500 to-rose-600',
        bgLight: 'bg-red-50 dark:bg-red-950/30',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-600 dark:text-red-400',
        ring: 'ring-red-500/20',
        icon: Flame,
        accent: 'bg-red-500',
    },
    light: {
        gradient: 'from-green-500 to-emerald-600',
        bgLight: 'bg-green-50 dark:bg-green-950/30',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-600 dark:text-green-400',
        ring: 'ring-green-500/20',
        icon: Zap,
        accent: 'bg-green-500',
    },
    medium: {
        gradient: 'from-yellow-400 to-amber-500',
        bgLight: 'bg-yellow-50 dark:bg-yellow-950/30',
        border: 'border-yellow-200 dark:border-yellow-800',
        text: 'text-yellow-600 dark:text-yellow-400',
        ring: 'ring-yellow-500/20',
        icon: Target,
        accent: 'bg-yellow-500',
    },
}

export default function WorkoutPage({ params }: WorkoutPageProps) {
    const { dayType } = params
    const validDayTypes = ['heavy', 'light', 'medium']
    const normalizedDayType = validDayTypes.includes(dayType) ? dayType as 'heavy' | 'light' | 'medium' : 'heavy'

    const dayInfo = getDayTypeInfo(normalizedDayType)
    const workout = workoutTemplates[normalizedDayType]
    const styles = dayTypeStyles[normalizedDayType]
    const DayIcon = styles.icon

    const [completedSets, setCompletedSets] = useState<SetData[]>([])
    const [showTimer, setShowTimer] = useState(false)
    const [workoutComplete, setWorkoutComplete] = useState(false)
    const [expandedExercise, setExpandedExercise] = useState<number | null>(0)
    const [workoutId, setWorkoutId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [savingSet, setSavingSet] = useState(false)
    const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg')
    const [missedReason, setMissedReason] = useState<string>("")
    const [missedColor, setMissedColor] = useState<string>("#facc15")
    const [workoutMissed, setWorkoutMissed] = useState(false)
    const [showMissedForm, setShowMissedForm] = useState(false)

    // Mark workout as missed
    const handleMissedWorkout = async () => {
        if (!workoutId || !missedReason) return
        setIsLoading(true)
        try {
            await fetch(`/api/workouts/${workoutId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: false, missedReason, missedReasonColor: missedColor }),
            })
            setWorkoutMissed(true)
            setShowMissedForm(false)
        } catch (error) {
            console.error('Error marking workout as missed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Fetch user settings (including weight unit)
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('/api/settings')
                if (response.ok) {
                    const data = await response.json()
                    if (data.weightUnit) {
                        setWeightUnit(data.weightUnit as 'kg' | 'lbs')
                    }
                }
            } catch (error) {
                console.error('Error fetching settings:', error)
            }
        }
        fetchSettings()
    }, [])

    // Load existing workout or create new one
    useEffect(() => {
        const loadOrCreateWorkout = async () => {
            if (workoutId) return

            setIsLoading(true)
            try {
                const existingResponse = await fetch(`/api/workouts?dayType=${normalizedDayType}&active=true`)

                if (existingResponse.ok) {
                    const existingWorkout = await existingResponse.json()

                    if (existingWorkout && existingWorkout.id) {
                        setWorkoutId(existingWorkout.id)

                        if (existingWorkout.completed) {
                            setWorkoutComplete(true)
                        }

                        if (existingWorkout.workoutSets && existingWorkout.workoutSets.length > 0) {
                            const loadedSets: SetData[] = existingWorkout.workoutSets.map((set: {
                                exercise: { name: string }
                                setNumber: number
                                weight: number
                                reps: number
                            }) => {
                                const exerciseIndex = workout.findIndex(
                                    ex => ex.exercise === set.exercise.name
                                )
                                return {
                                    exerciseIndex,
                                    setNumber: set.setNumber,
                                    weight: set.weight,
                                    reps: set.reps
                                }
                            }).filter((set: SetData) => set.exerciseIndex !== -1)

                            setCompletedSets(loadedSets)
                        }

                        setIsLoading(false)
                        return
                    }
                }

                const createResponse = await fetch('/api/workouts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        dayType: normalizedDayType,
                        isDeload: false,
                    }),
                })

                if (createResponse.ok) {
                    const data = await createResponse.json()
                    setWorkoutId(data.id)
                } else {
                    console.error('Failed to create workout')
                }
            } catch (error) {
                console.error('Error loading/creating workout:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadOrCreateWorkout()
    }, [normalizedDayType, workoutId, workout])

    const totalSets = workout.length * 3
    const completedCount = completedSets.length
    const progressPercent = (completedCount / totalSets) * 100

    const handleSetComplete = useCallback(async (exerciseIndex: number, setNumber: number, weight: number, reps: number) => {
        setCompletedSets(prev => [...prev, { exerciseIndex, setNumber, weight, reps }])
        setShowTimer(true)

        if (workoutId) {
            setSavingSet(true)
            try {
                const exercise = workout[exerciseIndex]
                const response = await fetch('/api/sets', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        workoutId,
                        exerciseName: exercise.exercise,
                        muscleGroup: exercise.muscle,
                        setNumber,
                        weight,
                        reps,
                        targetReps: parseInt(exercise.reps.split('-')[1] || exercise.reps),
                    }),
                })

                if (!response.ok) {
                    console.error('Failed to save set to database')
                }
            } catch (error) {
                console.error('Error saving set:', error)
            } finally {
                setSavingSet(false)
            }
        }

        if (completedCount + 1 === totalSets) {
            if (workoutId) {
                try {
                    await fetch(`/api/workouts/${workoutId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ completed: true }),
                    })
                } catch (error) {
                    console.error('Error marking workout complete:', error)
                }
            }
            setWorkoutComplete(true)
            setShowTimer(false)
        }
    }, [workoutId, workout, completedCount, totalSets])

    const isSetCompleted = (exerciseIndex: number, setNumber: number) => {
        return completedSets.some(s => s.exerciseIndex === exerciseIndex && s.setNumber === setNumber)
    }

    const getSetData = (exerciseIndex: number, setNumber: number): SetData | undefined => {
        const set = completedSets.find(s => s.exerciseIndex === exerciseIndex && s.setNumber === setNumber)
        if (!set) return undefined

        const displayWeight = weightUnit === 'lbs' ? Math.round(set.weight / 0.453592) : set.weight
        return {
            ...set,
            weight: displayWeight
        }
    }

    const getExerciseProgress = (exerciseIndex: number) => {
        return completedSets.filter(s => s.exerciseIndex === exerciseIndex).length
    }

    const variantMap = {
        heavy: 'heavy' as const,
        light: 'light' as const,
        medium: 'medium' as const,
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Header - More refined */}
            <div className={`bg-gradient-to-br ${styles.gradient} relative overflow-hidden mb-6 border rounded-xl shadow-lg`}>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white blur-3xl" />
                </div>

                <div className="container relative z-10 py-8">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 mb-6">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </Link>

                    <div className="flex items-start gap-4 mb-6">
                        <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
                            <DayIcon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">
                                {normalizedDayType.charAt(0).toUpperCase() + normalizedDayType.slice(1)} Day
                            </h1>
                            <p className="text-white/90">{dayInfo.description}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-white">{dayInfo.reps}</p>
                            <p className="text-xs text-white/80 mt-1">Target Reps</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-white">{dayInfo.rest / 60}m</p>
                            <p className="text-xs text-white/80 mt-1">Rest Time</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-white">{workout.length}</p>
                            <p className="text-xs text-white/80 mt-1">Exercises</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                            <p className="text-2xl font-bold text-white uppercase">{weightUnit}</p>
                            <p className="text-xs text-white/80 mt-1">Weight Unit</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Loading State */}
                {isLoading && (
                    <Card className="mb-6">
                        <CardContent className="py-12">
                            <div className="flex flex-col items-center justify-center gap-4">
                                <Loader2 className={`h-10 w-10 ${styles.text} animate-spin`} />
                                <p className="text-muted-foreground">Loading your workout...</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Progress Card - Enhanced */}
                {!isLoading && (
                    <Card className={`mb-6 border-2 ${styles.border} shadow-sm`}>
                        <CardContent className="py-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Dumbbell className={`h-5 w-5 ${styles.text}`} />
                                    <span className="font-semibold">Workout Progress</span>
                                </div>
                                <Badge variant={variantMap[normalizedDayType]} className="text-sm">
                                    {completedCount}/{totalSets} sets
                                </Badge>
                            </div>
                            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                                <div
                                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${styles.gradient} rounded-full transition-all duration-500 ease-out shadow-sm`}
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                {progressPercent.toFixed(0)}% complete
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Workout Complete Card - More celebratory */}
                {!isLoading && workoutComplete && !workoutMissed && (
                    <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 mb-6 shadow-lg">
                        <CardContent className="py-8">
                            <div className="text-center mb-6">
                                <div className="inline-flex h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 items-center justify-center mb-4 shadow-xl shadow-green-500/30 animate-bounce-once">
                                    <Trophy className="h-10 w-10 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
                                    Workout Complete! 🎉
                                </h2>
                                <p className="text-green-600 dark:text-green-400">
                                    Incredible work on your {normalizedDayType} day session!
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Link href="/" className="flex-1">
                                    <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg">
                                        Back to Dashboard
                                    </Button>
                                </Link>
                                <Link href="/history" className="flex-1">
                                    <Button variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950">
                                        View History
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Missed Workout Button */}
                {!isLoading && !workoutComplete && !workoutMissed && !showMissedForm && (
                    <div className="mb-6 text-center">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowMissedForm(true)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Can't complete this workout?
                        </Button>
                    </div>
                )}

                {/* Missed Workout Form - Modal style */}
                {!isLoading && !workoutComplete && !workoutMissed && showMissedForm && (
                    <Card className="border-2 border-orange-300 dark:border-orange-700 mb-6 shadow-lg">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Log Missed Workout</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowMissedForm(false)}
                                    className="h-8 w-8"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Why are you missing this workout?
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-background"
                                        placeholder="e.g., Sick, Too busy, Traveling..."
                                        value={missedReason}
                                        onChange={e => setMissedReason(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Select a color tag
                                    </label>
                                    <div className="flex gap-2">
                                        {[
                                            { color: '#facc15', label: 'Minor' },
                                            { color: '#f87171', label: 'Important' },
                                            { color: '#60a5fa', label: 'Planned' },
                                            { color: '#a3a3a3', label: 'Other' },
                                        ].map((option) => (
                                            <button
                                                key={option.color}
                                                className={`h-10 w-10 rounded-lg border-2 transition-all hover:scale-110 ${missedColor === option.color
                                                    ? 'border-foreground ring-2 ring-offset-2 ring-foreground/20'
                                                    : 'border-border'
                                                    }`}
                                                style={{ background: option.color }}
                                                onClick={() => setMissedColor(option.color)}
                                                title={option.label}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <Button
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                                    onClick={handleMissedWorkout}
                                    disabled={!missedReason}
                                >
                                    Log Missed Workout
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Missed Workout Confirmation */}
                {!isLoading && workoutMissed && (
                    <Card className="border-2 mb-6 shadow-lg" style={{ borderColor: missedColor }}>
                        <CardContent className="py-8 text-center">
                            <div
                                className="inline-flex h-20 w-20 rounded-full items-center justify-center mb-4 shadow-xl"
                                style={{ background: missedColor }}
                            >
                                <span className="text-4xl">😔</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Workout Logged as Missed</h2>
                            <p className="text-muted-foreground mb-1">Reason:</p>
                            <p className="font-semibold text-lg mb-6">{missedReason}</p>
                            <div className="flex gap-3">
                                <Link href="/" className="flex-1">
                                    <Button className="w-full" style={{ background: missedColor }}>
                                        Back to Dashboard
                                    </Button>
                                </Link>
                                <Link href="/history" className="flex-1">
                                    <Button variant="outline" className="w-full">
                                        View History
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Rest Timer - Enhanced positioning */}
                {showTimer && !workoutComplete && (
                    <div className="sticky top-4 z-20 mb-6">
                        <RestTimer
                            initialSeconds={dayInfo.rest}
                            onComplete={() => setShowTimer(false)}
                            dayType={normalizedDayType}
                        />
                    </div>
                )}

                {/* Exercises - Cleaner cards */}
                {!isLoading && (
                    <div className="space-y-3">
                        {workout.map((exercise, exerciseIndex) => {
                            const exerciseProgress = getExerciseProgress(exerciseIndex)
                            const isExpanded = expandedExercise === exerciseIndex
                            const isComplete = exerciseProgress === 3

                            return (
                                <Card
                                    key={exerciseIndex}
                                    className={`transition-all duration-200 ${isComplete
                                        ? 'border-green-500 bg-green-50/50 dark:bg-green-950/20 shadow-sm'
                                        : 'hover:shadow-md'
                                        } ${isExpanded ? 'ring-2 ' + styles.ring : ''}`}
                                >
                                    <CardHeader
                                        className="cursor-pointer py-4"
                                        onClick={() => setExpandedExercise(isExpanded ? null : exerciseIndex)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div
                                                    className={`h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0 shadow-sm
                                                    ${isComplete ? 'bg-gradient-to-br from-green-500 to-emerald-600' : `bg-gradient-to-br ${styles.gradient}`}`}
                                                >
                                                    {isComplete ? <Check className="h-5 w-5" /> : exerciseIndex + 1}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <CardTitle className="text-base mb-1">{exercise.exercise}</CardTitle>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="text-xs">
                                                            {exercise.muscle}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            {exercise.reps} reps
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <div className="flex gap-1">
                                                    {[1, 2, 3].map((set) => (
                                                        <div
                                                            key={set}
                                                            className={`h-2 w-6 rounded-full transition-colors ${isSetCompleted(exerciseIndex, set)
                                                                ? 'bg-green-500'
                                                                : 'bg-muted'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                {isExpanded ? (
                                                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                                ) : (
                                                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>

                                    {isExpanded && (
                                        <CardContent className="pt-0 pb-4">
                                            <div className="space-y-2">
                                                {[1, 2, 3].map((setNumber) => {
                                                    const setData = getSetData(exerciseIndex, setNumber)
                                                    return (
                                                        <SetLogger
                                                            key={`${exerciseIndex}-${setNumber}`}
                                                            exerciseName={exercise.exercise}
                                                            muscleGroup={exercise.muscle}
                                                            setNumber={setNumber}
                                                            targetReps={exercise.reps}
                                                            initialWeight={setData?.weight ?? 0}
                                                            initialReps={setData?.reps ?? 0}
                                                            onComplete={(weight, reps) =>
                                                                handleSetComplete(exerciseIndex, setNumber, weight, reps)
                                                            }
                                                            isCompleted={isSetCompleted(exerciseIndex, setNumber)}
                                                            dayType={normalizedDayType}
                                                            weightUnit={weightUnit}
                                                        />
                                                    )
                                                })}
                                            </div>
                                        </CardContent>
                                    )}
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
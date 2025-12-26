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
import { ArrowLeft, Check, Dumbbell, Timer, Target, Flame, Trophy, ChevronDown, ChevronUp, Zap, Loader2 } from 'lucide-react'

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
                // First, check for an existing active workout for today
                const existingResponse = await fetch(`/api/workouts?dayType=${normalizedDayType}&active=true`)

                if (existingResponse.ok) {
                    const existingWorkout = await existingResponse.json()

                    if (existingWorkout && existingWorkout.id) {
                        // Found existing workout - load its sets
                        setWorkoutId(existingWorkout.id)

                        if (existingWorkout.completed) {
                            setWorkoutComplete(true)
                        }

                        // Convert saved sets to our SetData format
                        if (existingWorkout.workoutSets && existingWorkout.workoutSets.length > 0) {
                            const loadedSets: SetData[] = existingWorkout.workoutSets.map((set: {
                                exercise: { name: string }
                                setNumber: number
                                weight: number
                                reps: number
                            }) => {
                                // Find the exercise index in our workout template
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

                // No existing workout found - create a new one
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

    // Group exercises by muscle
    const groupedExercises = useMemo(() => {
        const groups: { [key: string]: typeof workout } = {}
        workout.forEach((exercise, idx) => {
            if (!groups[exercise.muscle]) {
                groups[exercise.muscle] = []
            }
            groups[exercise.muscle].push({ ...exercise, originalIndex: idx } as typeof exercise & { originalIndex: number })
        })
        return groups
    }, [workout])

    const handleSetComplete = useCallback(async (exerciseIndex: number, setNumber: number, weight: number, reps: number) => {
        // Update local state immediately for responsive UI
        setCompletedSets(prev => [...prev, { exerciseIndex, setNumber, weight, reps }])
        setShowTimer(true)

        // Save to database
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
            // Mark workout as completed
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

        // Weight is stored in kg in database - convert to user's preferred unit for display
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
            {/* Hero Header */}
            <div className={`bg-gradient-to-br ${styles.gradient} -mx-2 sm:-mx-4 -mt-4 px-2 sm:px-4 pt-4 pb-8 mb-6 relative overflow-hidden`}>
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white blur-3xl transform -translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="relative z-10">
                    {/* Back button */}
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 mb-4">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>

                    {/* Title */}
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                            <DayIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                {normalizedDayType.charAt(0).toUpperCase() + normalizedDayType.slice(1)} Day
                            </h1>
                            <p className="text-white/80 text-sm">{dayInfo.description}</p>
                        </div>
                    </div>

                    {/* Stats row - horizontally scrollable on mobile */}
                    <div className="flex gap-2 sm:gap-4 mt-6 overflow-x-auto pb-2 hide-scrollbar">
                        <div className="min-w-[80px] bg-white/10 backdrop-blur rounded-xl p-3 text-center flex-shrink-0">
                            <p className="text-lg sm:text-2xl font-bold text-white">{dayInfo.reps}</p>
                            <p className="text-[11px] sm:text-xs text-white/70">Reps</p>
                        </div>
                        <div className="min-w-[80px] bg-white/10 backdrop-blur rounded-xl p-3 text-center flex-shrink-0">
                            <p className="text-lg sm:text-2xl font-bold text-white">{dayInfo.rest / 60}m</p>
                            <p className="text-[11px] sm:text-xs text-white/70">Rest</p>
                        </div>
                        <div className="min-w-[80px] bg-white/10 backdrop-blur rounded-xl p-3 text-center flex-shrink-0">
                            <p className="text-lg sm:text-2xl font-bold text-white">{workout.length}</p>
                            <p className="text-[11px] sm:text-xs text-white/70">Exercises</p>
                        </div>
                        <div className="min-w-[80px] bg-white/10 backdrop-blur rounded-xl p-3 text-center flex-shrink-0">
                            <p className="text-lg sm:text-2xl font-bold text-white uppercase">{weightUnit}</p>
                            <p className="text-[11px] sm:text-xs text-white/70">Unit</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <Card className={`mb-4 border-2 ${styles.border} ${styles.bgLight}`}>
                    <CardContent className="py-8">
                        <div className="flex flex-col items-center justify-center gap-3">
                            <Loader2 className={`h-8 w-8 ${styles.text} animate-spin`} />
                            <p className="text-muted-foreground text-sm">Loading workout...</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Progress Card - Compact */}
            {!isLoading && (
                <Card className={`mb-4 border-2 ${styles.border} ${styles.bgLight} animate-in`}>
                    <CardContent className="py-3 px-4">
                        <div className="flex items-center gap-3">
                            <Dumbbell className={`h-5 w-5 ${styles.text} shrink-0`} />
                            <div className="flex-1 min-w-0">
                                <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className={`absolute inset-y-0 left-0 bg-gradient-to-r ${styles.gradient} rounded-full transition-all duration-500 ease-out`}
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                            <Badge variant={variantMap[normalizedDayType]} className="text-xs shrink-0">
                                {completedCount}/{totalSets}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Workout Complete Card */}
            {!isLoading && workoutComplete && (
                <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 mb-6 animate-scale-in">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center animate-check shadow-lg shadow-green-500/30">
                                <Trophy className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-green-700 dark:text-green-300">
                                    Workout Complete! 💪🔥
                                </h2>
                                <p className="text-green-600 dark:text-green-400">
                                    Amazing work on your {normalizedDayType} day!
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <Link href="/" className="flex-1">
                                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                                    Back to Dashboard
                                </Button>
                            </Link>
                            <Link href="/history" className="flex-1">
                                <Button variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50">
                                    View History
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Rest Timer */}
            {showTimer && !workoutComplete && (
                <div className="sticky top-4 z-10 mb-6">
                    <RestTimer
                        initialSeconds={dayInfo.rest}
                        onComplete={() => setShowTimer(false)}
                        dayType={normalizedDayType}
                    />
                </div>
            )}

            {/* Exercises - Responsive Grid with better spacing */}
            {!isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 px-1 sm:px-0">
                    {workout.map((exercise, exerciseIndex) => {
                        const exerciseProgress = getExerciseProgress(exerciseIndex)
                        const isExpanded = expandedExercise === exerciseIndex
                        const isComplete = exerciseProgress === 3

                        return (
                            <Card
                                key={exerciseIndex}
                                className={`transition-all duration-300 overflow-hidden ${isComplete
                                    ? 'border-green-500 bg-green-50/50 dark:bg-green-950/20'
                                    : styles.border
                                    } ${isExpanded ? 'ring-2 ' + styles.ring + ' lg:col-span-2' : ''}`}
                            >
                                {/* Exercise Header - Compact */}
                                <CardHeader
                                    className={`cursor-pointer transition-colors py-3 px-4 ${isExpanded ? styles.bgLight : 'hover:bg-muted/50'}`}
                                    onClick={() => setExpandedExercise(isExpanded ? null : exerciseIndex)}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0
                                            ${isComplete ? 'bg-gradient-to-br from-green-500 to-emerald-600' : `bg-gradient-to-br ${styles.gradient}`}`}>
                                                {isComplete ? <Check className="h-4 w-4" /> : exerciseIndex + 1}
                                            </div>
                                            <div className="min-w-0">
                                                <CardTitle className="text-sm truncate">{exercise.exercise}</CardTitle>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                                        {exercise.muscle}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {/* Mini progress bar */}
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3].map((set) => (
                                                    <div
                                                        key={set}
                                                        className={`h-1.5 w-4 rounded-sm transition-colors ${isSetCompleted(exerciseIndex, set)
                                                            ? 'bg-green-500'
                                                            : 'bg-muted'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            {isExpanded ? (
                                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>

                                {/* Sets - Expandable with compact spacing */}
                                {isExpanded && (
                                    <CardContent className="pt-0 pb-3 px-3 animate-in">
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
                                                        onComplete={(weight, reps) => handleSetComplete(exerciseIndex, setNumber, weight, reps)}
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
    )
}

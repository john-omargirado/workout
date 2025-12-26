
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Check, Dumbbell, Scale, ChevronDown, ChevronUp } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { useState } from 'react'

export default async function HistoryPage() {
    const session = await auth()

    // Get user settings for training week and weight unit
    const settings = session?.user?.id ? await prisma.settings.findUnique({
        where: { userId: session.user.id }
    }) : null

    const weightUnit = settings?.weightUnit || 'kg'

    // Fetch real workout history from database
    const workouts = session?.user?.id ? await prisma.workout.findMany({
        where: {
            userId: session.user.id,
            completed: true
        },
        include: {
            workoutSets: {
                include: {
                    exercise: true
                }
            }
        },
        orderBy: {
            date: 'desc'
        },
        take: 20
    }) as unknown as Array<{
        id: string
        date: Date
        dayType: string
        notes: string | null
        completed: boolean
        workoutSets: Array<{
            id: string
            weight: number
            reps: number
            exercise: { name: string } | null
        }>
    }> : []

    // Calculate stats
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const workoutsThisWeek = workouts.filter(w => new Date(w.date) >= weekAgo)
    const totalSetsThisWeek = workoutsThisWeek.reduce((acc, w) => acc + w.workoutSets.length, 0)

    // Helper to convert and format weight
    const formatWeight = (weightKg: number) => {
        if (weightUnit === 'lbs') {
            return `${(weightKg * 2.20462).toFixed(1)} lbs`
        }
        return `${weightKg.toFixed(1)} kg`
    }

    // Calculate total volume lifted this week
    const totalVolumeThisWeek = workoutsThisWeek.reduce((acc, w) =>
        acc + w.workoutSets.reduce((setAcc, set) => setAcc + (set.weight * set.reps), 0)
        , 0)

    const variantMap = {
        heavy: 'heavy' as const,
        light: 'light' as const,
        medium: 'medium' as const,
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    // --- Group workouts by week ---
    function getWeekStart(date: Date) {
        const d = new Date(date)
        d.setHours(0, 0, 0, 0)
        d.setDate(d.getDate() - d.getDay()) // Sunday as start
        return d
    }
    const weekGroups: { weekStart: Date, workouts: typeof workouts }[] = []
    let lastWeek: string | null = null
    workouts.forEach(w => {
        const weekStart = getWeekStart(w.date)
        const weekKey = weekStart.toISOString().slice(0, 10)
        if (!lastWeek || weekGroups[weekGroups.length - 1].weekStart.toISOString().slice(0, 10) !== weekKey) {
            weekGroups.push({ weekStart, workouts: [w] })
            lastWeek = weekKey
        } else {
            weekGroups[weekGroups.length - 1].workouts.push(w)
        }
    })

    // --- Expand/collapse state for workout details ---
    // (Client-side only, so useState must be used in a client component. For now, expand all by default for SSR.)
    // If you want to make this interactive, move this page to a client component and use useState.

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Workout History</h1>
                <p className="text-muted-foreground">
                    Review your past workouts and track your progress
                </p>
            </div>

            {/* Stats Summary */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{workoutsThisWeek.length}</div>
                        <p className="text-xs text-muted-foreground">Workouts This Week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{totalSetsThisWeek}</div>
                        <p className="text-xs text-muted-foreground">Total Sets This Week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{formatWeight(totalVolumeThisWeek)}</div>
                        <p className="text-xs text-muted-foreground">Volume This Week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                            <Scale className="h-5 w-5 text-muted-foreground" />
                            <div className="text-2xl font-bold uppercase">{weightUnit}</div>
                        </div>
                        <p className="text-xs text-muted-foreground">Weight Unit</p>
                    </CardContent>
                </Card>
            </div>

            {/* Weekly Breakdown & Workout Details */}
            <div className="space-y-8">
                <h2 className="text-xl font-semibold">Weekly Breakdown</h2>
                {weekGroups.map((group, i) => {
                    const weekEnd = new Date(group.weekStart)
                    weekEnd.setDate(weekEnd.getDate() + 6)
                    const weekLabel = `${group.weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                    const weekSets = group.workouts.reduce((acc, w) => acc + w.workoutSets.length, 0)
                    const weekVolume = group.workouts.reduce((acc, w) => acc + w.workoutSets.reduce((setAcc, set) => setAcc + (set.weight * set.reps), 0), 0)
                    return (
                        <div key={group.weekStart.toISOString()} className="space-y-3">
                            <Card className="bg-muted/30">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        {weekLabel}
                                    </CardTitle>
                                    <CardDescription className="flex gap-6 mt-2">
                                        <span className="text-sm font-medium">{group.workouts.length} workouts</span>
                                        <span className="text-sm font-medium">{weekSets} sets</span>
                                        <span className="text-sm font-medium">{formatWeight(weekVolume)} volume</span>
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            <div className="space-y-2">
                                {group.workouts.map((workout) => (
                                    <Card key={workout.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="pt-6">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1 w-full">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={variantMap[workout.dayType as keyof typeof variantMap]}>
                                                            {workout.dayType.charAt(0).toUpperCase() + workout.dayType.slice(1)} Day
                                                        </Badge>
                                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {formatDate(workout.date)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Check className="h-3 w-3" />
                                                            {workout.workoutSets.length} sets
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Scale className="h-3 w-3" />
                                                            {formatWeight(workout.workoutSets.reduce((acc, s) => acc + (s.weight * s.reps), 0))} volume
                                                        </span>
                                                    </div>
                                                    {workout.notes && (
                                                        <p className="text-sm mt-2 italic text-muted-foreground">
                                                            &ldquo;{workout.notes}&rdquo;
                                                        </p>
                                                    )}
                                                    {/* Workout Details Table */}
                                                    <div className="mt-2 overflow-x-auto">
                                                        <table className="min-w-[320px] w-full text-xs border rounded-lg">
                                                            <thead>
                                                                <tr className="bg-muted">
                                                                    <th className="px-2 py-1 text-left font-semibold">Exercise</th>
                                                                    <th className="px-2 py-1 text-left font-semibold">Set</th>
                                                                    <th className="px-2 py-1 text-left font-semibold">Weight</th>
                                                                    <th className="px-2 py-1 text-left font-semibold">Reps</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {workout.workoutSets.map((set, idx) => (
                                                                    <tr key={set.id} className="border-t">
                                                                        <td className="px-2 py-1">{set.exercise?.name || '-'}</td>
                                                                        <td className="px-2 py-1">{idx + 1}</td>
                                                                        <td className="px-2 py-1">{formatWeight(set.weight)}</td>
                                                                        <td className="px-2 py-1">{set.reps}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )
                })}

                {/* Empty state for when there's no history */}
                {workouts.length === 0 && (
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">No workouts yet</h3>
                            <p className="text-muted-foreground">
                                Start your first workout to begin tracking your progress!
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

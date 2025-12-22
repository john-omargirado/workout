"use client"

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Flame, Calendar } from 'lucide-react'

interface WorkoutDay {
    date: string // YYYY-MM-DD format
    dayType: 'heavy' | 'light' | 'medium'
    completed: boolean
}

interface ContributionCalendarProps {
    workouts: WorkoutDay[]
    weeks?: number
}

const dayTypeColors = {
    heavy: {
        bg: 'bg-red-500',
        hover: 'hover:bg-red-600',
        ring: 'ring-red-400',
    },
    light: {
        bg: 'bg-green-500',
        hover: 'hover:bg-green-600',
        ring: 'ring-green-400',
    },
    medium: {
        bg: 'bg-yellow-500',
        hover: 'hover:bg-yellow-600',
        ring: 'ring-yellow-400',
    },
}

// Helper to format date as YYYY-MM-DD in UTC (consistent with server)
const formatDateUTC = (date: Date): string => {
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export function ContributionCalendar({ workouts, weeks = 12 }: ContributionCalendarProps) {
    // Debug: Log incoming workouts
    console.log('ContributionCalendar received workouts:', workouts);
    
    const calendarData = useMemo(() => {
        const today = new Date()
        // Use UTC hours to avoid timezone issues when comparing with UTC-formatted dates
        today.setUTCHours(0, 0, 0, 0)

        // Create a map of workouts by date for quick lookup
        const workoutMap = new Map<string, WorkoutDay>()
        workouts.forEach(w => {
            workoutMap.set(w.date, w)
        })
        
        // Debug: Log the workout map
        console.log('workoutMap entries:', Array.from(workoutMap.entries()));

        // Find the start of the current week (Sunday) - use UTC day
        const endOfCalendar = new Date(today)
        const currentDayOfWeek = today.getUTCDay() // 0 = Sunday, 6 = Saturday

        // Go back to get the start date (N weeks ago, starting from a Sunday)
        const startOfCalendar = new Date(today)
        startOfCalendar.setUTCDate(today.getUTCDate() - (weeks * 7) + (7 - currentDayOfWeek))

        // Adjust to start on the Sunday of that week
        const startDayOfWeek = startOfCalendar.getUTCDay()
        startOfCalendar.setUTCDate(startOfCalendar.getUTCDate() - startDayOfWeek)

        const days: { date: Date; workout?: WorkoutDay }[] = []
        const currentDate = new Date(startOfCalendar)

        // Generate all days from start to today
        while (currentDate <= today) {
            const dateStr = formatDateUTC(currentDate)
            const workout = workoutMap.get(dateStr)
            
            // Debug: Log when we find a workout match
            if (workout) {
                console.log('FOUND WORKOUT MATCH:', { dateStr, workout });
            }
            
            days.push({
                date: new Date(currentDate),
                workout: workout,
            })
            currentDate.setUTCDate(currentDate.getUTCDate() + 1)
        }

        // Add remaining days to complete the current week
        while (days.length % 7 !== 0) {
            days.push({
                date: new Date(currentDate),
                workout: undefined,
            })
            currentDate.setUTCDate(currentDate.getUTCDate() + 1)
        }

        // Group by weeks (7 days each, Sun-Sat)
        const weekGroups: typeof days[] = []
        for (let i = 0; i < days.length; i += 7) {
            weekGroups.push(days.slice(i, i + 7))
        }

        return weekGroups
    }, [workouts, weeks])

    const totalWorkouts = workouts.filter(w => w.completed).length
    const currentStreak = useMemo(() => {
        let streak = 0
        const today = new Date()
        today.setUTCHours(0, 0, 0, 0)

        // Sort workouts by date descending
        const sortedWorkouts = [...workouts]
            .filter(w => w.completed)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        if (sortedWorkouts.length === 0) return 0

        // Check if there's a workout today or yesterday to start the streak
        const lastWorkoutDate = new Date(sortedWorkouts[0].date + 'T00:00:00Z')

        const daysDiff = Math.floor((today.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24))
        if (daysDiff > 1) return 0 // Streak broken

        // Count consecutive days with workouts
        const workoutDates = new Set(sortedWorkouts.map(w => w.date))
        let checkDate = new Date(lastWorkoutDate)

        while (true) {
            const dateStr = formatDateUTC(checkDate)
            if (workoutDates.has(dateStr)) {
                streak++
                checkDate.setUTCDate(checkDate.getUTCDate() - 1)
            } else {
                // Check if it was a rest day (no workout expected)
                // For simplicity, we'll just break on any missing day
                break
            }
        }

        return streak
    }, [workouts])

    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    const monthLabels = useMemo(() => {
        const labels: { month: string; colStart: number }[] = []
        let lastMonth = -1

        calendarData.forEach((week, weekIndex) => {
            const firstDayOfWeek = week[0]?.date
            if (firstDayOfWeek) {
                const month = firstDayOfWeek.getMonth()
                if (month !== lastMonth) {
                    // Only add label if there's enough space (at least 3 weeks gap from previous)
                    const lastLabel = labels[labels.length - 1]
                    if (!lastLabel || weekIndex - lastLabel.colStart >= 3) {
                        labels.push({
                            month: firstDayOfWeek.toLocaleDateString('en-US', { month: 'short' }),
                            colStart: weekIndex,
                        })
                    }
                    lastMonth = month
                }
            }
        })

        return labels
    }, [calendarData])

    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Calendar className="h-5 w-5" />
                            Workout Activity
                        </CardTitle>
                        <CardDescription className="mt-1">
                            {totalWorkouts} workouts in the last {weeks} weeks
                        </CardDescription>
                    </div>
                    {currentStreak > 0 && (
                        <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-950/50 dark:to-amber-950/50 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full shadow-sm border border-orange-200 dark:border-orange-800">
                            <Flame className="h-4 w-4" />
                            <span className="text-sm font-bold">{currentStreak} day streak!</span>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
                {/* Calendar Grid */}
                <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6 pb-4">
                    <div className="inline-block min-w-max">
                        {/* Month labels - use relative positioning */}
                        <div className="relative h-5 mb-2 ml-8">
                            {monthLabels.map((label, idx) => (
                                <span
                                    key={idx}
                                    className="absolute text-[11px] font-medium text-muted-foreground whitespace-nowrap"
                                    style={{ left: `${label.colStart * 20}px` }}
                                >
                                    {label.month}
                                </span>
                            ))}
                        </div>

                        {/* Day rows */}
                        <div className="flex">
                            {/* Day labels */}
                            <div className="flex flex-col gap-1 mr-2">
                                {dayLabels.map((label, idx) => (
                                    <div
                                        key={idx}
                                        className="w-6 h-4 text-[11px] font-medium text-muted-foreground flex items-center justify-end pr-1"
                                    >
                                        {idx % 2 === 1 ? label : ''}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar cells */}
                            <div className="flex gap-1">
                                {calendarData.map((week, weekIndex) => (
                                    <div key={weekIndex} className="flex flex-col gap-1">
                                        {week.map((day, dayIndex) => {
                                            const isToday = day.date.toDateString() === new Date().toDateString()
                                            const isFuture = day.date > new Date()
                                            const hasWorkout = day.workout?.completed
                                            
                                            // Debug: log today's cell
                                            if (isToday) {
                                                console.log('TODAY CELL:', {
                                                    date: day.date.toISOString(),
                                                    dateStr: formatDateUTC(day.date),
                                                    workout: day.workout,
                                                    hasWorkout,
                                                    isFuture
                                                });
                                            }

                                            return (
                                                <div
                                                    key={dayIndex}
                                                    className={`w-4 h-4 rounded-[4px] transition-all cursor-pointer
                                                        ${isFuture
                                                            ? 'bg-muted/20'
                                                            : hasWorkout
                                                                ? `${dayTypeColors[day.workout!.dayType].bg} ${dayTypeColors[day.workout!.dayType].hover} shadow-sm`
                                                                : 'bg-muted/60 hover:bg-muted'
                                                        }
                                                        ${isToday ? 'ring-2 ring-offset-1 ring-offset-background ring-primary' : ''}
                                                    `}
                                                    title={`${day.date.toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}${hasWorkout ? ` - ${day.workout!.dayType.charAt(0).toUpperCase() + day.workout!.dayType.slice(1)} Day` : ''}`}
                                                />
                                            )
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legend - Responsive */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-medium">Activity:</span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 rounded-[3px] bg-muted/60" />
                            <span>None</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3.5 h-3.5 rounded-[3px] bg-green-400" />
                            <div className="w-3.5 h-3.5 rounded-[3px] bg-green-500" />
                            <div className="w-3.5 h-3.5 rounded-[3px] bg-green-600" />
                        </div>
                        <span>Active</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 rounded-[3px] bg-red-500 shadow-sm" />
                            <span className="text-muted-foreground font-medium">Heavy</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 rounded-[3px] bg-green-500 shadow-sm" />
                            <span className="text-muted-foreground font-medium">Light</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 rounded-[3px] bg-yellow-500 shadow-sm" />
                            <span className="text-muted-foreground font-medium">Medium</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

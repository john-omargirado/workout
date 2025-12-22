"use client"

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Flame , Calendar} from 'lucide-react'

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

export function ContributionCalendar({ workouts, weeks = 12 }: ContributionCalendarProps) {
    const calendarData = useMemo(() => {
        const today = new Date()
        const days: { date: Date; workout?: WorkoutDay }[] = []

        // Create a map of workouts by date for quick lookup
        const workoutMap = new Map<string, WorkoutDay>()
        workouts.forEach(w => {
            workoutMap.set(w.date, w)
        })

        // Generate days for the past N weeks (including today)
        const totalDays = weeks * 7
        for (let i = totalDays - 1; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(today.getDate() - i)
            const dateStr = date.toISOString().split('T')[0]
            days.push({
                date,
                workout: workoutMap.get(dateStr),
            })
        }

        // Group by weeks (7 days each)
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
        today.setHours(0, 0, 0, 0)

        // Sort workouts by date descending
        const sortedWorkouts = [...workouts]
            .filter(w => w.completed)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        if (sortedWorkouts.length === 0) return 0

        // Check if there's a workout today or yesterday to start the streak
        const lastWorkoutDate = new Date(sortedWorkouts[0].date)
        lastWorkoutDate.setHours(0, 0, 0, 0)

        const daysDiff = Math.floor((today.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24))
        if (daysDiff > 1) return 0 // Streak broken

        // Count consecutive days with workouts
        const workoutDates = new Set(sortedWorkouts.map(w => w.date))
        let checkDate = new Date(lastWorkoutDate)

        while (true) {
            const dateStr = checkDate.toISOString().split('T')[0]
            if (workoutDates.has(dateStr)) {
                streak++
                checkDate.setDate(checkDate.getDate() - 1)
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
                    labels.push({
                        month: firstDayOfWeek.toLocaleDateString('en-US', { month: 'short' }),
                        colStart: weekIndex,
                    })
                    lastMonth = month
                }
            }
        })

        return labels
    }, [calendarData])

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Workout Activity
                        </CardTitle>
                        <CardDescription className="mt-1">
                            {totalWorkouts} workouts in the last {weeks} weeks
                        </CardDescription>
                    </div>
                    {currentStreak > 0 && (
                        <div className="flex items-center gap-1.5 bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full">
                            <Flame className="h-4 w-4" />
                            <span className="text-sm font-semibold">{currentStreak} day streak</span>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {/* Calendar Grid */}
                <div className="overflow-x-auto pb-2">
                    <div className="min-w-fit">
                        {/* Month labels */}
                        <div className="flex gap-[3px] mb-1 ml-6">
                            {calendarData.map((_, weekIndex) => {
                                const label = monthLabels.find(l => l.colStart === weekIndex)
                                return (
                                    <div key={weekIndex} className="w-[14px] text-[10px] text-muted-foreground">
                                        {label?.month || ''}
                                    </div>
                                )
                            })}
                        </div>

                        {/* Day rows */}
                        <div className="flex">
                            {/* Day labels */}
                            <div className="flex flex-col gap-[3px] mr-1.5">
                                {dayLabels.map((label, idx) => (
                                    <div
                                        key={idx}
                                        className="w-4 h-[14px] text-[10px] text-muted-foreground flex items-center justify-end pr-0.5"
                                    >
                                        {idx % 2 === 1 ? label : ''}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar cells */}
                            <div className="flex gap-[3px]">
                                {calendarData.map((week, weekIndex) => (
                                    <div key={weekIndex} className="flex flex-col gap-[3px]">
                                        {week.map((day, dayIndex) => {
                                            const isToday = day.date.toDateString() === new Date().toDateString()
                                            const isFuture = day.date > new Date()
                                            const hasWorkout = day.workout?.completed

                                            return (
                                                <div
                                                    key={dayIndex}
                                                    className={`w-[14px] h-[14px] rounded-sm transition-all cursor-pointer
                                                        ${isFuture
                                                            ? 'bg-muted/30'
                                                            : hasWorkout
                                                                ? `${dayTypeColors[day.workout!.dayType].bg} ${dayTypeColors[day.workout!.dayType].hover}`
                                                                : 'bg-muted hover:bg-muted-foreground/20'
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

                {/* Legend */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Less</span>
                        <div className="flex gap-1">
                            <div className="w-3 h-3 rounded-sm bg-muted" />
                            <div className="w-3 h-3 rounded-sm bg-green-300" />
                            <div className="w-3 h-3 rounded-sm bg-green-500" />
                        </div>
                        <span>More</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-red-500" />
                            <span className="text-muted-foreground">Heavy</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-green-500" />
                            <span className="text-muted-foreground">Light</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-yellow-500" />
                            <span className="text-muted-foreground">Medium</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

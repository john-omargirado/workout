"use client"

import { useMemo, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Flame, Calendar } from 'lucide-react'

interface WorkoutDay {
    date: string // YYYY-MM-DD format
    dayType: 'heavy' | 'light' | 'medium'
    completed: boolean
    missedReason?: string | null
    missedReasonColor?: string | null
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


// Helper to format date as YYYY-MM-DD in local time (for client display)
const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

// Helper to build a YYYY-MM-DD key using UTC components (server canonical date)
const formatDateUTCKey = (input: Date | string): string => {
    if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
        return input
    }
    const d = typeof input === 'string' ? new Date(input) : input
    const year = d.getUTCFullYear()
    const month = String(d.getUTCMonth() + 1).padStart(2, '0')
    const day = String(d.getUTCDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export function ContributionCalendar({ workouts, weeks = 12, onMissedDayClick }: ContributionCalendarProps & { onMissedDayClick?: (date: string) => void }) {
    type CalendarDay = { date: Date; workout?: WorkoutDay }
    const [calendarData, setCalendarData] = useState<CalendarDay[][] | null>(null)
    const [currentStreak, setCurrentStreak] = useState<number | null>(null)

    useEffect(() => {
        // Calendar grid
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        // Map workouts by local YYYY-MM-DD — this matches how History formats dates
        const workoutMap = new Map<string, WorkoutDay>()
        workouts.forEach((w: WorkoutDay) => {
            const rawDateStr = w.date
            const iso = rawDateStr.includes('T') ? rawDateStr : `${rawDateStr}T00:00:00`
            const localKey = formatDateLocal(new Date(iso))
            const existing = workoutMap.get(localKey)
            if (!existing || (w.completed && !existing.completed)) {
                workoutMap.set(localKey, w)
            }
        })
        // Compute start of calendar `weeks` weeks ago and align to Sunday
        const endOfCalendar = new Date(today)
        const startOfCalendar = new Date(today)
        // Move back `weeks * 7` days
        startOfCalendar.setDate(startOfCalendar.getDate() - weeks * 7)
        // Align start to Sunday to match History's week grouping (History uses Sunday as week start)
        const startDayOfWeek = startOfCalendar.getDay()
        startOfCalendar.setDate(startOfCalendar.getDate() - startDayOfWeek)
        const days: CalendarDay[] = []
        const currentDate = new Date(startOfCalendar)
        while (currentDate <= today) {
            const localKey = formatDateLocal(currentDate)
            const workout = workoutMap.get(localKey)
            days.push({
                date: new Date(currentDate),
                workout: workout,
            })
            currentDate.setDate(currentDate.getDate() + 1)
        }
        while (days.length % 7 !== 0) {
            days.push({
                date: new Date(currentDate),
                workout: undefined,
            })
            currentDate.setDate(currentDate.getDate() + 1)
        }
        const weekGroups: CalendarDay[][] = []
        for (let i = 0; i < days.length; i += 7) {
            weekGroups.push(days.slice(i, i + 7))
        }
        setCalendarData(weekGroups)

        // Streak
        let streak = 0
        const sortedWorkouts = [...workouts]
            .filter((w: WorkoutDay) => w.completed)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        if (sortedWorkouts.length === 0) {
            setCurrentStreak(0)
            return
        }
        const lastWorkoutDate = new Date(sortedWorkouts[0].date + 'T00:00:00')
        const daysDiff = Math.floor((today.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24))
        if (daysDiff > 1) {
            setCurrentStreak(0)
            return
        }
        const workoutDates = new Set(sortedWorkouts.map((w: WorkoutDay) => w.date))
        let checkDate = new Date(lastWorkoutDate)
        while (true) {
            const dateStr = formatDateLocal(checkDate)
            if (workoutDates.has(dateStr)) {
                streak++
                checkDate.setDate(checkDate.getDate() - 1)
            } else {
                break
            }
        }
        setCurrentStreak(streak)
    }, [workouts, weeks])

    const totalWorkouts = workouts.filter((w: WorkoutDay) => w.completed).length

    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    const monthLabels = useMemo(() => {
        if (!calendarData) return []
        const labels: { month: string; colStart: number }[] = []
        let lastMonth = -1
        calendarData.forEach((week, weekIndex) => {
            const firstDayOfWeek = week[0]?.date
            if (firstDayOfWeek) {
                const month = firstDayOfWeek.getMonth()
                if (month !== lastMonth) {
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

    if (!calendarData || currentStreak === null) return null

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
                                            const now = new Date()
                                            now.setHours(0, 0, 0, 0)
                                            const isToday = day.date.toDateString() === now.toDateString()
                                            const isFuture = day.date > now
                                            const hasWorkout = day.workout?.completed
                                            const isMissed = !!day.workout && !day.workout.completed && !!(day.workout as any).missedReason

                                            return (
                                                <div
                                                    key={dayIndex}
                                                    className={`w-4 h-4 rounded-[4px] transition-all cursor-pointer
                                                        ${isFuture
                                                            ? 'bg-muted/20'
                                                            : hasWorkout
                                                                ? `${dayTypeColors[day.workout!.dayType].bg} ${dayTypeColors[day.workout!.dayType].hover} shadow-sm`
                                                                : isMissed
                                                                    ? 'shadow-sm border border-muted'
                                                                    : `bg-muted/60${onMissedDayClick ? ' hover:bg-muted/80 cursor-pointer' : ''}`
                                                        }
                                                        ${isToday ? 'ring-2 ring-offset-1 ring-offset-background ring-primary' : ''}
                                                    `}
                                                    style={isMissed ? { backgroundColor: day.workout!.missedReasonColor || undefined } : undefined}
                                                    title={`${day.date.toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}${hasWorkout ? ` - ${day.workout!.dayType.charAt(0).toUpperCase() + day.workout!.dayType.slice(1)} Day` : isMissed ? ` - Missed: ${day.workout!.missedReason}` : ''}`}
                                                    onClick={() => {
                                                        if (!hasWorkout && !isFuture && onMissedDayClick) {
                                                            onMissedDayClick(formatDateUTCKey(day.date));
                                                        }
                                                    }}
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
                <div className="flex items-center justify-end gap-4 mt-4 pt-4 border-t text-xs">
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
            </CardContent>
        </Card>
    )
}

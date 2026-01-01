
"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'
import { WorkoutCard } from '@/components/workout-card'
import { VolumeTracker } from '@/components/volume-tracker'
import { ContributionCalendar } from '@/components/contribution-calendar'
import { MissedWorkoutModal } from '@/components/missed-workout-modal'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, TrendingUp, Zap } from 'lucide-react'
// server libs are not used in client dashboard

// Force dynamic rendering to always show fresh workout data
export const dynamic = 'force-dynamic'

export default function Home() {
    // TODO: Fetch data from API or use SWR for client-side data
    // For demo, use static data and state
    const [missedModalOpen, setMissedModalOpen] = useState(false);
    const [missedDate, setMissedDate] = useState<string | null>(null);
    // Real workout data state
    const [workoutHistory, setWorkoutHistory] = useState<{
        date: string;
        dayType: 'heavy' | 'light' | 'medium';
        completed: boolean;
        missedReason?: string | null;
        missedReasonColor?: string | null;
    }[]>([]);
    const [loading, setLoading] = useState(true);
    const [weeklyVolume, setWeeklyVolume] = useState<{
        name: string;
        sets: number;
        target: number;
    }[]>([]);

    const { data: session, status } = useSession()

    // Mock settings/state (replace with real API data)
    const [currentWeek, setCurrentWeek] = useState<number>(1);
    const [weeksUntilDeload, setWeeksUntilDeload] = useState<number>(5);
    const [lastHeavyDate, setLastHeavyDate] = useState<string>('');
    const [lastLightDate, setLastLightDate] = useState<string>('');
    const [lastMediumDate, setLastMediumDate] = useState<string>('');
    const [isWorkoutDay, setIsWorkoutDay] = useState<boolean>(false);
    const [nextWorkoutType, setNextWorkoutType] = useState<'heavy' | 'light' | 'medium'>('medium');

    // Fetch workouts and settings - extracted so it can be reused after save
    const fetchAll = async () => {
        setLoading(true);
        // Fetch workouts
        const res = await fetch('/api/workouts');
        const workouts = await res.json();
        // Fetch settings
        const settingsRes = await fetch('/api/settings');
        const settings = await settingsRes.json();

        // Build workout history for calendar
        const history = workouts.map((w: any) => ({
            date: w.date.slice(0, 10),
            dayType: w.dayType,
            completed: w.completed,
            missedReason: w.missedReason,
            missedReasonColor: w.missedReasonColor,
        }));
        setWorkoutHistory(history);

        // Calculate weekly volume (last 7 days)
        const muscleMap: Record<string, { sets: number; target: number }> = {};
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        for (const w of workouts) {
            if (!w.completed) continue;
            const wDate = new Date(w.date);
            if (wDate < weekAgo) continue;
            for (const set of w.workoutSets || []) {
                const muscle = set.exercise?.muscleGroup?.name || 'Other';
                if (!muscleMap[muscle]) muscleMap[muscle] = { sets: 0, target: 12 };
                muscleMap[muscle].sets += 1;
            }
        }
        setWeeklyVolume(Object.entries(muscleMap).map(([name, v]) => ({ name, ...v })));

        // Set current week and deload info
        // If settings.currentWeek is unset or 1, derive week from workout history (based on Sunday-start weeks)
        const today = new Date()
        const todayStart = new Date(today)
        todayStart.setHours(0, 0, 0, 0)
        const getWeekStart = (d: Date) => {
            const dd = new Date(d)
            dd.setHours(0, 0, 0, 0)
            dd.setDate(dd.getDate() - dd.getDay()) // Sunday start
            return dd
        }

        let derivedWeek = 1
        const completedWorkouts = workouts.filter((w: any) => w.completed)
        if (completedWorkouts.length > 0) {
            const earliest = completedWorkouts.reduce((acc: any, w: any) => acc ? (new Date(w.date) < new Date(acc.date) ? w : acc) : w, null)
            if (earliest) {
                const firstWeekStart = getWeekStart(new Date(earliest.date))
                const diffMs = todayStart.getTime() - firstWeekStart.getTime()
                derivedWeek = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1
                if (derivedWeek < 1) derivedWeek = 1
            }
        }

        const settingsWeek = settings?.currentWeek || 1
        setCurrentWeek(Math.max(settingsWeek, derivedWeek))
        setWeeksUntilDeload(settings.weeksUntilDeload || 5);

        // Set last workout dates and next workout type
        let lastHeavy = '', lastLight = '', lastMedium = '';
        let todayType: 'heavy' | 'light' | 'medium' = 'medium';
        let isTodayWorkout = false;
        const todayStr = new Date().toISOString().slice(0, 10);
        for (const w of workouts) {
            if (w.dayType === 'heavy' && w.completed && (!lastHeavy || w.date > lastHeavy)) lastHeavy = w.date.slice(0, 10);
            if (w.dayType === 'light' && w.completed && (!lastLight || w.date > lastLight)) lastLight = w.date.slice(0, 10);
            if (w.dayType === 'medium' && w.completed && (!lastMedium || w.date > lastMedium)) lastMedium = w.date.slice(0, 10);
            if (w.date.slice(0, 10) === todayStr) {
                isTodayWorkout = true;
                todayType = w.dayType;
            }
        }
        setLastHeavyDate(lastHeavy);
        setLastLightDate(lastLight);
        setLastMediumDate(lastMedium);
        setIsWorkoutDay(isTodayWorkout);
        setNextWorkoutType(todayType);
        setLoading(false);
    }

    useEffect(() => {
        if (status === 'authenticated') {
            fetchAll()
        }
    }, [status])

    // Handler for missed day click
    const handleMissedDayClick = (date: string) => {
        setMissedDate(date);
        setMissedModalOpen(true);
    };

    // Handler for saving missed workout - POST and refresh
    const handleSaveMissed = async (reason: string, color: string) => {
        if (!missedDate) return
        try {
            await fetch('/api/workouts/missed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: missedDate, reason, color }),
            })
            // refresh data
            await fetchAll()
        } catch (err) {
            console.error('Error saving missed workout', err)
        }
        setMissedModalOpen(false);
        setMissedDate(null);
    };

    if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

    // Only allow editing for missing days (no completed or missedReason)
    const editableDates = (date: string) => {
        const found = workoutHistory.find(w => w.date === date);
        return !found || (!found.completed && !found.missedReason);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}! 💪
                </h1>
                <p className="text-muted-foreground">
                    Heavy/Light/Medium Hypertrophy Training Program
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Week</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Week {currentWeek}</div>
                        <p className="text-xs text-muted-foreground">
                            {weeksUntilDeload} weeks until deload
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Weekly Volume</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{weeklyVolume.reduce((a, v) => a + v.sets, 0)} sets</div>
                        <p className="text-xs text-muted-foreground">
                            Target: 63 sets (9 per muscle)
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Next Session</CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Medium Day</div>
                        <p className="text-xs text-muted-foreground">
                            8-12 reps, 2 min rest
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Program Overview */}
            <Card>
                <CardHeader>
                    <CardTitle>Program Structure</CardTitle>
                    <CardDescription>
                        3 non-consecutive days per week with double progression
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-2 text-sm">
                        <div className="flex items-center gap-2">
                            <Badge variant="heavy">Heavy</Badge>
                            <span>Compound exercises, 5-8 reps, 2 min rest</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="light">Light</Badge>
                            <span>Isolation exercises, 12-15 reps, 1 min rest (active recovery)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="medium">Medium</Badge>
                            <span>Moderate exercises, 8-12 reps, 2 min rest</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Workout Selection */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Start a Workout</h2>
                <div className="grid gap-4 md:grid-cols-3">
                    <WorkoutCard dayType="heavy" lastWorkoutDate={lastHeavyDate} isToday={isWorkoutDay && nextWorkoutType === 'heavy'} />
                    <WorkoutCard dayType="light" lastWorkoutDate={lastLightDate} isToday={isWorkoutDay && nextWorkoutType === 'light'} />
                    <WorkoutCard dayType="medium" lastWorkoutDate={lastMediumDate} isToday={isWorkoutDay && nextWorkoutType === 'medium'} />
                </div>
            </div>


            {/* Contribution Calendar */}
            <ContributionCalendar
                workouts={workoutHistory}
                weeks={20}
                onMissedDayClick={(date) => {
                    if (editableDates(date)) handleMissedDayClick(date);
                }}
            />
            <MissedWorkoutModal
                open={missedModalOpen}
                date={missedDate || ''}
                onClose={() => setMissedModalOpen(false)}
                onSave={handleSaveMissed}
            />

            {/* Volume Tracker */}
            <VolumeTracker muscleGroups={weeklyVolume} />
        </div>
    )
}

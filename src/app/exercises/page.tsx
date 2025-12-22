import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { muscleGroups, defaultExercises, Exercise } from '@/lib/exercises'
import { Dumbbell } from 'lucide-react'
import Image from 'next/image'

function ExerciseCard({ exercise, variant }: { exercise: Exercise; variant: 'compound' | 'isolation' }) {
    return (
        <div className={`group relative rounded-lg border bg-card p-3 transition-all hover:shadow-md ${variant === 'compound' ? 'border-red-200 hover:border-red-300' : 'border-green-200 hover:border-green-300'
            }`}>
            <div className="flex items-start gap-3">
                {exercise.image && (
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image
                            src={exercise.image}
                            alt={exercise.name}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm truncate">{exercise.name}</h5>
                    <p className="text-xs text-muted-foreground mt-1">
                        {variant === 'compound' ? 'Heavy & Medium Days' : 'Light Days'}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function ExercisesPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Exercise Library</h1>
                <p className="text-muted-foreground">
                    Browse exercises by muscle group for your Heavy, Light, and Medium days
                </p>
            </div>

            <div className="grid gap-6">
                {muscleGroups.map((group) => {
                    const exercises = defaultExercises[group.id as keyof typeof defaultExercises]

                    return (
                        <Card key={group.id}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Dumbbell className="h-5 w-5" />
                                    {group.name}
                                </CardTitle>
                                <CardDescription>
                                    {exercises.compound.length + exercises.isolation.length} exercises available
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {/* Compound Exercises */}
                                    {exercises.compound.length > 0 && (
                                        <div>
                                            <h4 className="font-medium mb-3 flex items-center gap-2">
                                                <Badge variant="heavy">Compound</Badge>
                                                <span className="text-xs text-muted-foreground">Heavy & Medium Days</span>
                                            </h4>
                                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                                {exercises.compound.map((exercise) => (
                                                    <ExerciseCard
                                                        key={exercise.name}
                                                        exercise={exercise}
                                                        variant="compound"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Isolation Exercises */}
                                    {exercises.isolation.length > 0 && (
                                        <div>
                                            <h4 className="font-medium mb-3 flex items-center gap-2">
                                                <Badge variant="light">Isolation</Badge>
                                                <span className="text-xs text-muted-foreground">Light Days</span>
                                            </h4>
                                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                                {exercises.isolation.map((exercise) => (
                                                    <ExerciseCard
                                                        key={exercise.name}
                                                        exercise={exercise}
                                                        variant="isolation"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Tips Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Exercise Selection Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>
                        <strong className="text-foreground">Heavy Day:</strong> Focus on big, basic compound exercises.
                        Think Bench Press, Squats, Pull-ups, and Overhead Press.
                    </p>
                    <p>
                        <strong className="text-foreground">Light Day:</strong> Use isolation exercises for active recovery.
                        Keep the weight lighter and focus on the pump.
                    </p>
                    <p>
                        <strong className="text-foreground">Medium Day:</strong> Choose joint-friendly variations.
                        Dumbbells and machines work great here.
                    </p>
                    <p>
                        <strong className="text-foreground">Rotation:</strong> Consider switching exercises every 3 weeks
                        to prevent overuse injuries and maintain progress (the "waves" method).
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

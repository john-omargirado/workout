"use client"

import { useState } from 'react'
import Link from 'next/link'
import { SetLogger } from '@/components/set-logger'
import { RestTimer } from '@/components/rest-timer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { getDayTypeInfo } from '@/lib/utils'
import { workoutTemplates } from '@/lib/exercises'
import { ArrowLeft, Check, Dumbbell } from 'lucide-react'

interface WorkoutPageProps {
  params: { dayType: string }
}

interface SetData {
  exerciseIndex: number
  setNumber: number
  weight: number
  reps: number
}

export default function WorkoutPage({ params }: WorkoutPageProps) {
  const { dayType } = params
  const validDayTypes = ['heavy', 'light', 'medium']
  const normalizedDayType = validDayTypes.includes(dayType) ? dayType as 'heavy' | 'light' | 'medium' : 'heavy'
  
  const dayInfo = getDayTypeInfo(normalizedDayType)
  const workout = workoutTemplates[normalizedDayType]
  
  const [completedSets, setCompletedSets] = useState<SetData[]>([])
  const [showTimer, setShowTimer] = useState(false)
  const [workoutComplete, setWorkoutComplete] = useState(false)

  const totalSets = workout.length * 3 // 3 sets per exercise
  const completedCount = completedSets.length
  const progressPercent = (completedCount / totalSets) * 100

  const handleSetComplete = (exerciseIndex: number, setNumber: number, weight: number, reps: number) => {
    setCompletedSets(prev => [...prev, { exerciseIndex, setNumber, weight, reps }])
    setShowTimer(true)
    
    if (completedCount + 1 === totalSets) {
      setWorkoutComplete(true)
    }
  }

  const isSetCompleted = (exerciseIndex: number, setNumber: number) => {
    return completedSets.some(s => s.exerciseIndex === exerciseIndex && s.setNumber === setNumber)
  }

  const variantMap = {
    heavy: 'heavy' as const,
    light: 'light' as const,
    medium: 'medium' as const,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">
              {normalizedDayType.charAt(0).toUpperCase() + normalizedDayType.slice(1)} Day Workout
            </h1>
            <Badge variant={variantMap[normalizedDayType]}>{dayInfo.type}</Badge>
          </div>
          <p className="text-muted-foreground">{dayInfo.description}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Workout Progress</span>
              <span className="text-muted-foreground">{completedCount} / {totalSets} sets</span>
            </div>
            <Progress value={progressPercent} />
          </div>
        </CardContent>
      </Card>

      {/* Workout Complete Card */}
      {workoutComplete && (
        <Card className="border-green-500 bg-green-50 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-green-700 dark:text-green-300">
                  Workout Complete! 💪
                </h2>
                <p className="text-green-600 dark:text-green-400">
                  Great job finishing your {normalizedDayType} day workout!
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Link href="/">
                <Button>Back to Dashboard</Button>
              </Link>
              <Link href="/history">
                <Button variant="outline">View History</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rest Timer */}
      {showTimer && !workoutComplete && (
        <div className="sticky top-4 z-10">
          <RestTimer
            initialSeconds={dayInfo.rest}
            onComplete={() => setShowTimer(false)}
          />
        </div>
      )}

      {/* Workout Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Workout Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{dayInfo.reps}</p>
              <p className="text-sm text-muted-foreground">Rep Range</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{dayInfo.rest / 60} min</p>
              <p className="text-sm text-muted-foreground">Rest Period</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{workout.length}</p>
              <p className="text-sm text-muted-foreground">Exercises</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercises */}
      <div className="space-y-6">
        {workout.map((exercise, exerciseIndex) => (
          <div key={exerciseIndex} className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                {exerciseIndex + 1}
              </span>
              {exercise.exercise}
            </h3>
            <div className="space-y-2">
              {[1, 2, 3].map((setNumber) => (
                <SetLogger
                  key={`${exerciseIndex}-${setNumber}`}
                  exerciseName={exercise.exercise}
                  muscleGroup={exercise.muscle}
                  setNumber={setNumber}
                  targetReps={exercise.reps}
                  onComplete={(weight, reps) => handleSetComplete(exerciseIndex, setNumber, weight, reps)}
                  isCompleted={isSetCompleted(exerciseIndex, setNumber)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

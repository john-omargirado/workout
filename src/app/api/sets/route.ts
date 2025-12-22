import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { workoutId, exerciseName, muscleGroup, setNumber, weight, reps, targetReps, notes } = body

        // Verify the workout belongs to the user
        const workout = await prisma.workout.findFirst({
            where: {
                id: workoutId,
                userId: session.user.id,
            },
        })

        if (!workout) {
            return NextResponse.json({ error: 'Workout not found' }, { status: 404 })
        }

        // Find or create the muscle group
        let muscleGroupRecord = await prisma.muscleGroup.findUnique({
            where: { name: muscleGroup },
        })

        if (!muscleGroupRecord) {
            muscleGroupRecord = await prisma.muscleGroup.create({
                data: { name: muscleGroup },
            })
        }

        // Find or create the exercise
        let exercise = await prisma.exercise.findFirst({
            where: {
                name: exerciseName,
                muscleGroupId: muscleGroupRecord.id,
            },
        })

        if (!exercise) {
            exercise = await prisma.exercise.create({
                data: {
                    name: exerciseName,
                    muscleGroupId: muscleGroupRecord.id,
                    type: 'compound', // Default to compound
                },
            })
        }

        const workoutSet = await prisma.workoutSet.create({
            data: {
                workoutId,
                exerciseId: exercise.id,
                setNumber,
                weight: parseFloat(weight.toString()),
                reps: parseInt(reps.toString()),
                targetReps: parseInt(targetReps.toString()),
                completed: true,
                notes,
            },
            include: {
                exercise: {
                    include: {
                        muscleGroup: true
                    }
                }
            }
        })

        return NextResponse.json(workoutSet, { status: 201 })
    } catch (error) {
        console.error('Error creating workout set:', error)
        return NextResponse.json({ error: 'Failed to create workout set' }, { status: 500 })
    }
}

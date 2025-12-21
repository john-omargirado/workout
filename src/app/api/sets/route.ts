import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { workoutId, exerciseId, setNumber, weight, reps, targetReps, notes } = body

        const workoutSet = await prisma.workoutSet.create({
            data: {
                workoutId,
                exerciseId,
                setNumber,
                weight,
                reps,
                targetReps,
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

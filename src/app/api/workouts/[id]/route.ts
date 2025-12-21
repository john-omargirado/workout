import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const workout = await prisma.workout.findUnique({
            where: { id },
            include: {
                workoutSets: {
                    include: {
                        exercise: {
                            include: {
                                muscleGroup: true
                            }
                        }
                    },
                    orderBy: {
                        setNumber: 'asc'
                    }
                }
            }
        })

        if (!workout) {
            return NextResponse.json({ error: 'Workout not found' }, { status: 404 })
        }

        return NextResponse.json(workout)
    } catch (error) {
        console.error('Error fetching workout:', error)
        return NextResponse.json({ error: 'Failed to fetch workout' }, { status: 500 })
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const body = await request.json()

        const workout = await prisma.workout.update({
            where: { id },
            data: body
        })

        return NextResponse.json(workout)
    } catch (error) {
        console.error('Error updating workout:', error)
        return NextResponse.json({ error: 'Failed to update workout' }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        await prisma.workout.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Workout deleted' })
    } catch (error) {
        console.error('Error deleting workout:', error)
        return NextResponse.json({ error: 'Failed to delete workout' }, { status: 500 })
    }
}

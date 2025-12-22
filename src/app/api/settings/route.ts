import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        let settings = await prisma.settings.findUnique({
            where: { userId: session.user.id }
        })

        // Create default settings if none exist
        if (!settings) {
            settings = await prisma.settings.create({
                data: {
                    userId: session.user.id,
                    currentWeek: 1,
                    weeksUntilDeload: 5,
                    heavyDayRestSeconds: 120,
                    lightDayRestSeconds: 60,
                    mediumDayRestSeconds: 120,
                    weightUnit: 'kg',
                }
            })
        }

        return NextResponse.json(settings)
    } catch (error) {
        console.error('Error fetching settings:', error)
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        // Upsert settings
        const settings = await prisma.settings.upsert({
            where: { userId: session.user.id },
            update: body,
            create: {
                userId: session.user.id,
                ...body,
            }
        })

        return NextResponse.json(settings)
    } catch (error) {
        console.error('Error updating settings:', error)
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
    }
}

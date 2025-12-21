import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function getDayTypeColor(dayType: string): string {
    switch (dayType.toLowerCase()) {
        case 'heavy':
            return 'bg-red-500 text-white'
        case 'light':
            return 'bg-green-500 text-white'
        case 'medium':
            return 'bg-yellow-500 text-black'
        default:
            return 'bg-gray-500 text-white'
    }
}

export function getDayTypeInfo(dayType: string) {
    switch (dayType.toLowerCase()) {
        case 'heavy':
            return {
                reps: '5-8',
                rest: 120,
                type: 'Compound',
                description: 'Big, basic compound exercises for lower reps'
            }
        case 'light':
            return {
                reps: '12-15',
                rest: 60,
                type: 'Isolation',
                description: 'Isolation exercises for higher reps, active recovery'
            }
        case 'medium':
            return {
                reps: '8-12',
                rest: 120,
                type: 'Compound/Machine',
                description: 'Moderate exercises, joint-friendly variations'
            }
        default:
            return {
                reps: '8-12',
                rest: 90,
                type: 'Mixed',
                description: ''
            }
    }
}

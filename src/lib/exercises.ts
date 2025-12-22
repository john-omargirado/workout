// Exercise with image reference
export interface Exercise {
    name: string
    image?: string // URL to exercise demonstration image/gif
}

// Default exercises organized by muscle group and type
export const defaultExercises = {
    chest: {
        compound: [
            { name: 'Bench Press', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bench-Press.gif' },
            { name: 'Incline Bench Press', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Barbell-Bench-Press.gif' },
            { name: 'DB Bench Press', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Press.gif' },
            { name: 'DB Incline Bench Press', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Press.gif' },
            { name: 'Hammer Strength Chest Press', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lever-Chest-Press.gif' },
            { name: 'Machine Chest Press', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lever-Chest-Press.gif' },
            { name: 'Weighted Dips', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Chest-Dips.gif' },
            { name: 'Push Ups', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-Up.gif' }
        ],
        isolation: [
            { name: 'Pec Dec', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pec-Deck-Fly.gif' },
            { name: 'Cable Crossover', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Crossover.gif' },
            { name: 'DB Flyes', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Fly.gif' },
            { name: 'Incline DB Flyes', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-dumbbell-Fly.gif' },
            { name: 'Cable Flyes', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Crossover.gif' }
        ]
    },
    upperBack: {
        compound: [
            { name: 'Pull Ups', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif' },
            { name: 'Barbell Rows', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bent-Over-Row.gif' },
            { name: 'DB Rows', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Row.gif' },
            { name: 'T-Bar Rows', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/T-Bar-Row.gif' },
            { name: 'Hammer Strength DY Row', image: 'https://fitnessprogramer.com/wp-content/uploads/2022/02/Lever-High-Row.gif' },
            { name: 'Seated Cable Rows', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Cable-Row.gif' },
            { name: 'Lat Pulldowns', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif' }
        ],
        isolation: [
            { name: 'Pullover', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Pullover.gif' },
            { name: 'DB Pullover', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/dumbbell-pullover.gif' },
            { name: 'Straight Arm Pulldowns', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Straight-Arm-Pulldown.gif' },
            { name: 'Face Pulls', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Face-Pull.gif' }
        ]
    },
    shoulders: {
        compound: [
            { name: 'Overhead Press', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Overhead-Press.gif' },
            { name: 'Seated Press', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Seated-Overhead-Press.gif' },
            { name: 'DB Seated Press', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif' },
            { name: 'Machine Shoulder Press', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lever-Shoulder-Press.gif' },
            { name: 'Arnold Press', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Arnold-Press.gif' }
        ],
        isolation: [
            { name: 'DB Laterals', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif' },
            { name: 'Cable Laterals', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Lateral-Raise.gif' },
            { name: 'Rear Delt Flyes', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Rear-Delt-Fly.gif' },
            { name: 'Face Pulls', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Face-Pull.gif' },
            { name: 'Front Raises', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Front-Raise.gif' }
        ]
    },
    quads: {
        compound: [
            { name: 'Squats', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/BARBELL-SQUAT.gif' },
            { name: 'Leg Press', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Press.gif' },
            { name: 'Hack Squat', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hack-Squat.gif' },
            { name: 'Front Squat', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Front-Squat.gif' },
            { name: 'Bulgarian Split Squat', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bulgarian-Split-Squat.gif' },
            { name: 'Lunges', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lunge.gif' }
        ],
        isolation: [
            { name: 'Leg Extensions', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/LEG-EXTENSION.gif' },
            { name: 'Sissy Squats', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Sissy-Squat.gif' }
        ]
    },
    hamstrings: {
        compound: [
            { name: 'Romanian Deadlift', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Romanian-Deadlift.gif' },
            { name: 'Stiff Leg Deadlift', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Stiff-Leg-Deadlift.gif' },
            { name: 'DB RDL', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Romanian-Deadlift.gif' },
            { name: 'Glute Bridge', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Glute-Bridge.gif' },
            { name: 'Hip Thrust', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Hip-Thrust.gif' }
        ],
        isolation: [
            { name: 'Leg Curls', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lying-Leg-Curl.gif' },
            { name: 'Seated Leg Curls', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Leg-Curl.gif' },
            { name: 'Nordic Leg Curls', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Nordic-Hamstring-Curl.gif' }
        ]
    },
    biceps: {
        compound: [] as Exercise[],
        isolation: [
            { name: 'Barbell Curl', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Curl.gif' },
            { name: 'DB Curl', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Curl.gif' },
            { name: 'Cable Curl', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Curl.gif' },
            { name: 'Machine Preacher Curl', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lever-Preacher-Curl.gif' },
            { name: 'Hammer Curl', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif' },
            { name: 'Incline DB Curl', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Curl.gif' },
            { name: 'Concentration Curl', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Concentration-Curl.gif' }
        ]
    },
    triceps: {
        compound: [
            { name: 'Close Grip Bench Press', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Close-Grip-Bench-Press.gif' },
            { name: 'Weighted Dips', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Triceps-Dips.gif' },
            { name: 'Smith CGBP', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Smith-Machine-Close-grip-Bench-Press.gif' }
        ],
        isolation: [
            { name: 'Pushdowns', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pushdown.gif' },
            { name: 'Overhead Tricep Extension', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Overhead-Triceps-Extension.gif' },
            { name: 'DB Overhead Extension', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Overhead-Triceps-Extension.gif' },
            { name: 'Skull Crushers', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Skull-Crusher.gif' },
            { name: 'Cable Kickbacks', image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Triceps-Kickback.gif' }
        ]
    }
}

export const muscleGroups = [
    { id: 'chest', name: 'Chest' },
    { id: 'upperBack', name: 'Upper Back' },
    { id: 'shoulders', name: 'Shoulders' },
    { id: 'quads', name: 'Quads' },
    { id: 'hamstrings', name: 'Hamstrings/Glutes' },
    { id: 'biceps', name: 'Biceps' },
    { id: 'triceps', name: 'Triceps' }
]

// Helper to get all exercise names for a muscle group
export function getExerciseNames(muscleId: keyof typeof defaultExercises): string[] {
    const exercises = defaultExercises[muscleId]
    return [
        ...exercises.compound.map(e => e.name),
        ...exercises.isolation.map(e => e.name)
    ]
}

// Helper to find an exercise by name
export function findExercise(name: string): Exercise | undefined {
    for (const muscleGroup of Object.values(defaultExercises)) {
        const found = [...muscleGroup.compound, ...muscleGroup.isolation].find(e => e.name === name)
        if (found) return found
    }
    return undefined
}

// The Wizard program templates - Heavy/Light/Medium day structure
export const workoutTemplates = {
    heavy: [
        { muscle: 'chest', exercise: 'Bench Press', sets: 3, reps: '5-8' },
        { muscle: 'upperBack', exercise: 'Pull Ups', sets: 3, reps: '5-8' },
        { muscle: 'quads', exercise: 'Squats', sets: 3, reps: '5-8' },
        { muscle: 'hamstrings', exercise: 'Stiff Leg Deadlift', sets: 3, reps: '5-8' },
        { muscle: 'shoulders', exercise: 'Seated Press', sets: 3, reps: '5-8' },
        { muscle: 'biceps', exercise: 'Barbell Curl', sets: 3, reps: '5-8' },
        { muscle: 'triceps', exercise: 'Weighted Dips', sets: 3, reps: '5-8' }
    ],
    light: [
        { muscle: 'chest', exercise: 'Pec Dec', sets: 3, reps: '12-15' },
        { muscle: 'upperBack', exercise: 'Pullover', sets: 3, reps: '12-15' },
        { muscle: 'quads', exercise: 'Leg Extensions', sets: 3, reps: '12-15' },
        { muscle: 'hamstrings', exercise: 'Leg Curls', sets: 3, reps: '12-15' },
        { muscle: 'shoulders', exercise: 'DB Laterals', sets: 3, reps: '12-15' },
        { muscle: 'biceps', exercise: 'Cable Curl', sets: 3, reps: '12-15' },
        { muscle: 'triceps', exercise: 'Pushdowns', sets: 3, reps: '12-15' }
    ],
    medium: [
        { muscle: 'chest', exercise: 'DB Incline Bench Press', sets: 3, reps: '8-12' },
        { muscle: 'upperBack', exercise: 'DB Rows', sets: 3, reps: '8-12' },
        { muscle: 'quads', exercise: 'Leg Press', sets: 3, reps: '8-12' },
        { muscle: 'hamstrings', exercise: 'Glute Bridge', sets: 3, reps: '8-12' },
        { muscle: 'shoulders', exercise: 'DB Seated Press', sets: 3, reps: '8-12' },
        { muscle: 'biceps', exercise: 'Machine Preacher Curl', sets: 3, reps: '8-12' },
        { muscle: 'triceps', exercise: 'Overhead Tricep Extension', sets: 3, reps: '8-12' }
    ]
}

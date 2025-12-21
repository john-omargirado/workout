// Default exercises organized by muscle group and type
export const defaultExercises = {
  chest: {
    compound: [
      'Bench Press',
      'Incline Bench Press',
      'DB Bench Press',
      'DB Incline Bench Press',
      'Hammer Strength Chest Press',
      'Machine Chest Press',
      'Weighted Dips',
      'Push Ups'
    ],
    isolation: [
      'Pec Dec',
      'Cable Crossover',
      'DB Flyes',
      'Incline DB Flyes',
      'Cable Flyes'
    ]
  },
  upperBack: {
    compound: [
      'Pull Ups',
      'Barbell Rows',
      'DB Rows',
      'T-Bar Rows',
      'Hammer Strength DY Row',
      'Seated Cable Rows',
      'Lat Pulldowns'
    ],
    isolation: [
      'Pullover',
      'DB Pullover',
      'Straight Arm Pulldowns',
      'Face Pulls'
    ]
  },
  shoulders: {
    compound: [
      'Overhead Press',
      'Seated Press',
      'DB Seated Press',
      'Machine Shoulder Press',
      'Arnold Press'
    ],
    isolation: [
      'DB Laterals',
      'Cable Laterals',
      'Rear Delt Flyes',
      'Face Pulls',
      'Front Raises'
    ]
  },
  quads: {
    compound: [
      'Squats',
      'Leg Press',
      'Hack Squat',
      'Front Squat',
      'Bulgarian Split Squat',
      'Lunges'
    ],
    isolation: [
      'Leg Extensions',
      'Sissy Squats'
    ]
  },
  hamstrings: {
    compound: [
      'Romanian Deadlift',
      'Stiff Leg Deadlift',
      'DB RDL',
      'Glute Bridge',
      'Hip Thrust'
    ],
    isolation: [
      'Leg Curls',
      'Seated Leg Curls',
      'Nordic Leg Curls'
    ]
  },
  biceps: {
    compound: [],
    isolation: [
      'Barbell Curl',
      'DB Curl',
      'Cable Curl',
      'Machine Preacher Curl',
      'Hammer Curl',
      'Incline DB Curl',
      'Concentration Curl'
    ]
  },
  triceps: {
    compound: [
      'Close Grip Bench Press',
      'Weighted Dips',
      'Smith CGBP'
    ],
    isolation: [
      'Pushdowns',
      'Overhead Tricep Extension',
      'DB Overhead Extension',
      'Skull Crushers',
      'Cable Kickbacks'
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

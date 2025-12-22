# The Wizard - Gym Workout Tracker

A modern, beautifully designed Next.js 14 application for tracking workouts based on "The Wizard" Heavy/Light/Medium hypertrophy program by Fazlifts.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma)

## ✨ Features

- 📅 **Three-Day Program**: Heavy, Light, and Medium workout days with unique theming
- ⏱️ **Smart Rest Timer**: Auto-start countdown with audio notification and day-type styling
- 📊 **Volume Tracking**: Track weekly sets per muscle group (target: 9-18 sets)
- 📈 **Double Progression**: Log weights and reps to track progress over time
- 🔄 **Deload Management**: Track training weeks and schedule deloads
- 📚 **Exercise Library**: Browse exercises by muscle group and type
- 🎨 **Modern UI/UX**: Gradient themes, smooth animations, and responsive design
- 📱 **Mobile-First**: Optimized layouts for all screen sizes

## 🎨 UI Highlights

- **Gradient Hero Headers**: Each day type (Heavy/Light/Medium) has unique color theming
- **Collapsible Exercise Cards**: Clean, organized workout view with expandable sets
- **Responsive Grid Layout**: 2-column layout on desktop, single column on mobile
- **Smooth Animations**: Entry animations, progress transitions, and completion effects
- **Compact Set Logger**: Single-row layout with inline unit labels for efficient logging

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Components**: shadcn/ui
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Gym_Tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma db push
```

4. Seed the database with exercises (optional):
```bash
# Start the dev server first, then call the seed endpoint
curl -X POST http://localhost:3000/api/seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏃 Program Structure

| Day | Focus | Rep Range | Rest | Intensity |
|-----|-------|-----------|------|-----------|
| 🔴 **Heavy** | Compound exercises | 5-8 reps | 2 min | High load |
| 🟢 **Light** | Isolation exercises | 12-15 reps | 1 min | Active recovery |
| 🟡 **Medium** | Machine/moderate | 8-12 reps | 2 min | Joint-friendly |

Each workout targets 7 muscle groups with 3 sets each (21 total sets per session).

## 💾 Database Commands

```bash
# Push schema changes to database
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio

# Generate Prisma client
npx prisma generate
```

## ☁️ Deployment to Vercel

1. Push your code to GitHub

2. Connect your repository to Vercel

3. Add environment variables:
   - `DATABASE_URL`: Your production database URL

4. Deploy!

**Note**: For production, consider using a hosted database like:
- Turso (SQLite)
- PlanetScale (MySQL)
- Supabase (PostgreSQL)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/              # API routes (auth, exercises, workouts, sets)
│   ├── exercises/        # Exercise library page
│   ├── history/          # Workout history page
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── settings/         # Settings page
│   ├── workout/[dayType] # Dynamic workout pages (heavy/light/medium)
│   ├── globals.css       # Global styles & animations
│   ├── layout.tsx        # Root layout with providers
│   └── page.tsx          # Dashboard
├── components/
│   ├── ui/               # shadcn/ui components (button, card, badge, etc.)
│   ├── navbar.tsx        # Navigation bar
│   ├── rest-timer.tsx    # Compact rest timer with auto-start
│   ├── set-logger.tsx    # Single-row set logging component
│   ├── volume-tracker.tsx# Weekly volume tracking
│   └── workout-card.tsx  # Workout day selection card
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── exercises.ts      # Exercise templates by day type
│   ├── prisma.ts         # Prisma client singleton
│   └── utils.ts          # Utility functions (formatTime, getDayTypeInfo)
├── types/
│   └── next-auth.d.ts    # NextAuth type extensions
prisma/
├── schema.prisma         # Database schema
└── wizard.db             # SQLite database file
```

## 🏋️ The Wizard Program Philosophy

Based on the Fazlifts hypertrophy program:

1. **Double Progression**: Stay at a weight until you hit the top of the rep range for all sets, then increase weight
2. **Start Low**: Begin with 9 sets per muscle/week, add volume only when progress stalls
3. **Deload Regularly**: Every 5-6 weeks, take a deload week
4. **Exercise Rotation**: Consider switching exercises every 3 weeks (waves method)
5. **Rest Period Adaptation**: The body adapts to shorter rest periods over time

## 📄 License

This project is for personal use. The Wizard program is created by Fazlifts.

---

<p align="center">
  Made with 💪 for gains
</p>

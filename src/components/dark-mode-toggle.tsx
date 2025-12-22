"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DarkModeToggle() {
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        // On mount, check localStorage or system preference
        const saved = localStorage.getItem("theme")
        if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
            document.documentElement.classList.add("dark")
            setIsDark(true)
        } else {
            document.documentElement.classList.remove("dark")
            setIsDark(false)
        }
    }, [])

    const toggle = () => {
        setIsDark((d) => {
            const next = !d
            if (next) {
                document.documentElement.classList.add("dark")
                localStorage.setItem("theme", "dark")
            } else {
                document.documentElement.classList.remove("dark")
                localStorage.setItem("theme", "light")
            }
            return next
        })
    }

    return (
        <Button variant="ghost" size="icon" aria-label="Toggle dark mode" onClick={toggle}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
    )
}

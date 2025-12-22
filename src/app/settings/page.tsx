"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Settings as SettingsIcon, Timer, Calendar, RotateCcw, Save, Scale, Loader2 } from 'lucide-react'

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        heavyDayRestSeconds: 120,
        lightDayRestSeconds: 60,
        mediumDayRestSeconds: 120,
        weeksUntilDeload: 5,
        currentWeek: 1,
        weightUnit: 'kg' as 'kg' | 'lbs',
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Fetch settings on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('/api/settings')
                if (response.ok) {
                    const data = await response.json()
                    setSettings({
                        heavyDayRestSeconds: data.heavyDayRestSeconds || 120,
                        lightDayRestSeconds: data.lightDayRestSeconds || 60,
                        mediumDayRestSeconds: data.mediumDayRestSeconds || 120,
                        weeksUntilDeload: data.weeksUntilDeload || 5,
                        currentWeek: data.currentWeek || 1,
                        weightUnit: data.weightUnit || 'kg',
                    })
                }
            } catch (error) {
                console.error('Error fetching settings:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchSettings()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        try {
            const response = await fetch('/api/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            })
            if (response.ok) {
                alert('Settings saved successfully!')
            } else {
                alert('Failed to save settings')
            }
        } catch (error) {
            console.error('Error saving settings:', error)
            alert('Error saving settings')
        } finally {
            setSaving(false)
        }
    }

    const handleReset = () => {
        setSettings({
            heavyDayRestSeconds: 120,
            lightDayRestSeconds: 60,
            mediumDayRestSeconds: 120,
            weeksUntilDeload: 5,
            currentWeek: 1,
            weightUnit: 'kg',
        })
    }

    const handleDeload = async () => {
        const newSettings = { ...settings, currentWeek: 1 }
        setSettings(newSettings)

        try {
            await fetch('/api/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentWeek: 1 }),
            })
            alert('Deload completed! Week reset to 1.')
        } catch (error) {
            console.error('Error updating deload:', error)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Customize your workout preferences and rest periods
                </p>
            </div>

            {/* Weight Unit Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Scale className="h-5 w-5" />
                        Weight Unit
                    </CardTitle>
                    <CardDescription>
                        Choose your preferred weight unit for logging exercises
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Button
                            variant={settings.weightUnit === 'kg' ? 'default' : 'outline'}
                            onClick={() => setSettings(prev => ({ ...prev, weightUnit: 'kg' }))}
                            className={settings.weightUnit === 'kg' ? 'bg-primary' : ''}
                        >
                            Kilograms (kg)
                        </Button>
                        <Button
                            variant={settings.weightUnit === 'lbs' ? 'default' : 'outline'}
                            onClick={() => setSettings(prev => ({ ...prev, weightUnit: 'lbs' }))}
                            className={settings.weightUnit === 'lbs' ? 'bg-primary' : ''}
                        >
                            Pounds (lbs)
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        {settings.weightUnit === 'kg'
                            ? 'Weight increments: 2.5 kg per adjustment'
                            : 'Weight increments: 5 lbs per adjustment'}
                    </p>
                </CardContent>
            </Card>

            {/* Rest Period Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Timer className="h-5 w-5" />
                        Rest Period Settings
                    </CardTitle>
                    <CardDescription>
                        Adjust rest times between sets for each workout day
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Badge variant="heavy">Heavy Day</Badge>
                            </label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    value={settings.heavyDayRestSeconds}
                                    onChange={(e) => setSettings(prev => ({ ...prev, heavyDayRestSeconds: parseInt(e.target.value) || 0 }))}
                                    className="w-24"
                                />
                                <span className="text-sm text-muted-foreground">seconds</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Recommended: 120 seconds (2 min)</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Badge variant="light">Light Day</Badge>
                            </label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    value={settings.lightDayRestSeconds}
                                    onChange={(e) => setSettings(prev => ({ ...prev, lightDayRestSeconds: parseInt(e.target.value) || 0 }))}
                                    className="w-24"
                                />
                                <span className="text-sm text-muted-foreground">seconds</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Recommended: 60 seconds (1 min)</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Badge variant="medium">Medium Day</Badge>
                            </label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    value={settings.mediumDayRestSeconds}
                                    onChange={(e) => setSettings(prev => ({ ...prev, mediumDayRestSeconds: parseInt(e.target.value) || 0 }))}
                                    className="w-24"
                                />
                                <span className="text-sm text-muted-foreground">seconds</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Recommended: 120 seconds (2 min)</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Deload Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Training Block & Deload
                    </CardTitle>
                    <CardDescription>
                        Manage your training weeks and schedule deloads every 5-6 weeks
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Current Week</label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={settings.currentWeek}
                                    onChange={(e) => setSettings(prev => ({ ...prev, currentWeek: parseInt(e.target.value) || 1 }))}
                                    className="w-24"
                                />
                                <span className="text-sm text-muted-foreground">of training block</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Weeks Until Deload</label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min={3}
                                    max={12}
                                    value={settings.weeksUntilDeload}
                                    onChange={(e) => setSettings(prev => ({ ...prev, weeksUntilDeload: parseInt(e.target.value) || 5 }))}
                                    className="w-24"
                                />
                                <span className="text-sm text-muted-foreground">weeks</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Recommended: 5-6 weeks</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">Quick Actions</h4>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleDeload}>
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Complete Deload Week
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Deload options: Take a full week of light work, 3-4 days off then light days,
                            or a full 7 days completely off the gym.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Program Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <SettingsIcon className="h-5 w-5" />
                        About The Wizard Program
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <p>
                        <strong>Double Progression:</strong> Stay at a weight until you hit the top of the rep range
                        for all 3 sets, then increase weight.
                    </p>
                    <p>
                        <strong>Volume:</strong> Start with 9 sets per muscle group per week (3 sets × 3 days).
                        Add volume only when progress stalls and recovery is good.
                    </p>
                    <p>
                        <strong>Exercise Rotation:</strong> Consider switching exercises every 3 weeks (waves method)
                        to prevent overuse injuries while maintaining the same structure.
                    </p>
                    <p>
                        <strong>Rest Periods:</strong> These can be adjusted over time. As work capacity improves,
                        rest periods can be shortened.
                    </p>
                </CardContent>
            </Card>

            {/* Save Buttons */}
            <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4 mr-2" />
                    )}
                    {saving ? 'Saving...' : 'Save Settings'}
                </Button>
                <Button variant="outline" onClick={handleReset}>
                    Reset to Defaults
                </Button>
            </div>
        </div>
    )
}

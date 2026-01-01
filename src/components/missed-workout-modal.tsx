"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface MissedWorkoutModalProps {
    open: boolean;
    date: string;
    onClose: () => void;
    onSave: (reason: string, color: string) => void;
    initialReason?: string | null;
    initialColor?: string | null;
    onDelete?: () => void;
}

const COLORS = [
    { color: "#facc15", label: "Yellow" },
    { color: "#f87171", label: "Red" },
    { color: "#60a5fa", label: "Blue" },
    { color: "#a3a3a3", label: "Gray" },
];

export function MissedWorkoutModal({ open, date, onClose, onSave, initialReason = '', initialColor, onDelete }: MissedWorkoutModalProps) {
    const [reason, setReason] = useState("");
    const [color, setColor] = useState(COLORS[0].color);

    useEffect(() => {
        if (!open) return;
        setReason(initialReason ?? '');
        setColor(initialColor ?? COLORS[0].color);
    }, [open, initialReason, initialColor]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Missed Workout - {date}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        placeholder="Reason (e.g. Sick, Busy, Travel)"
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                    />
                    <div className="flex gap-2 items-center">
                        <span className="text-xs">Color:</span>
                        {COLORS.map(c => (
                            <button
                                key={c.color}
                                className={`w-6 h-6 rounded-full border-2 ${color === c.color ? 'border-black' : 'border-gray-300'}`}
                                style={{ background: c.color }}
                                onClick={() => setColor(c.color)}
                                aria-label={c.label}
                            />
                        ))}
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        {initialReason && onDelete && (
                            <Button
                                variant="outline"
                                className="text-red-600 border-red-200"
                                onClick={() => {
                                    onDelete()
                                    onClose()
                                }}
                            >
                                Delete
                            </Button>
                        )}
                        <Button disabled={!reason} onClick={() => { onSave(reason, color); setReason(""); }}>Save</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

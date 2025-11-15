import React from 'react';
import { cn } from './utils';

interface DaySelectorProps {
    selectedDays: number[];
    onDayToggle: (dayValue: number) => void;
    className?: string;
}

const DAYS_OF_WEEK = [
    { name: 'Sun', fullName: 'Sunday', value: 0 },
    { name: 'Mon', fullName: 'Monday', value: 1 },
    { name: 'Tue', fullName: 'Tuesday', value: 2 },
    { name: 'Wed', fullName: 'Wednesday', value: 3 },
    { name: 'Thu', fullName: 'Thursday', value: 4 },
    { name: 'Fri', fullName: 'Friday', value: 5 },
    { name: 'Sat', fullName: 'Saturday', value: 6 },
];

export function DaySelector({ selectedDays, onDayToggle, className }: DaySelectorProps) {
    return (
        <div className={cn("flex gap-2", className)}>
            {DAYS_OF_WEEK.map((day) => {
                const isSelected = selectedDays.includes(day.value);
                return (
                    <button
                        key={day.value}
                        type="button"
                        onClick={() => onDayToggle(day.value)}
                        className={cn(
                            "flex-1 h-12 rounded-lg border-2 transition-all duration-200 font-medium text-sm",
                            "hover:scale-105 active:scale-95",
                            isSelected
                                ? "bg-orange-primary border-orange-primary text-white shadow-lg shadow-orange-primary/25"
                                : "bg-card border-orange-primary/20 text-muted-foreground hover:border-orange-primary/50 hover:bg-orange-primary/5"
                        )}
                        title={day.fullName}
                    >
                        {day.name}
                    </button>
                );
            })}
        </div>
    );
}

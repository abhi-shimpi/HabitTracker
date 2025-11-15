import React from 'react';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Calendar as CalendarIcon, Info } from 'lucide-react';
import { format } from 'date-fns';

export type DateFilterType = 'daily' | 'weekdays' | 'weekend' | 'custom';

interface SmartDatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  type?: DateFilterType;
  startDate?: Date;
  placeholder?: string;
  label?: string;
  showTypeInfo?: boolean;
  disabled?: boolean;
}

export function SmartDatePicker({
  value,
  onChange,
  type = 'daily',
  startDate = new Date(),
  placeholder = 'Pick a date',
  label,
  showTypeInfo = true,
  disabled = false
}: SmartDatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Helper function to check if a date is a weekday (Mon-Fri)
  const isWeekday = (date: Date): boolean => {
    const day = date.getDay();
    return day >= 1 && day <= 5; // Monday = 1, Friday = 5
  };

  // Helper function to check if a date is a weekend (Sat-Sun)
  const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
  };

  // Helper function to find the next valid date from today
  const getNextValidDate = (): Date | undefined => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If type is 'all', return today
    if (type === 'daily') {
      return today >= startDate ? today : startDate;
    }

    // Find the next valid date starting from today or startDate (whichever is later)
    let checkDate = new Date(Math.max(today.getTime(), startDate.getTime()));

    // Check up to 7 days ahead to find the next valid date
    for (let i = 0; i < 7; i++) {
      if (type === 'weekdays' && isWeekday(checkDate)) {
        return checkDate;
      }
      if (type === 'weekend' && isWeekend(checkDate)) {
        return checkDate;
      }
      checkDate.setDate(checkDate.getDate() + 1);
    }

    return undefined;
  };

  // Function to determine if a date should be disabled
  const isDateDisabled = (date: Date): boolean => {
    // If type is 'all', no additional filtering
    if (type === 'daily') {
      return date < new Date(new Date().setHours(0, 0, 0, 0));;
    }
    // Disable dates before start date
    if (date < startDate) {
      return true;
    }

    // Disable based on type
    if (type === 'weekdays') {
      return !isWeekday(date);
    }

    if (type === 'weekend') {
      return !isWeekend(date);
    }

    return false;
  };

  // Get helper text based on type
  const getHelperText = (): string => {
    const nextValid = getNextValidDate();
    const nextValidStr = nextValid ? format(nextValid, 'EEEE, MMM d') : 'N/A';

    switch (type) {
      case 'weekdays':
        return `Only weekdays (Mon-Fri) are available. Next: ${nextValidStr}`;
      case 'weekend':
        return `Only weekends (Sat-Sun) are available. Next: ${nextValidStr}`;
      case 'daily':
        return 'All dates are available';
      default:
        return '';
    }
  };

  // Auto-select next valid date if current value is invalid
  React.useEffect(() => {
    if (value && isDateDisabled(value)) {
      const nextValid = getNextValidDate();
      onChange(nextValid);
    }
  }, [type, startDate]);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm text-foreground">
          {label}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={`w-full justify-start text-left border-border bg-input hover:bg-input/80 hover:text-foreground ${!value && 'text-muted-foreground'
              }`}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-orange-primary" />
            {value ? format(value, 'PPP') : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-card border-orange-primary/30 shadow-xl"
          align="start"
        >
          {/* Header instruction */}
          {type !== 'daily' && (
            <div className="px-4 pt-3 pb-2 border-b border-border">
              <p className="text-xs text-center text-muted-foreground">
                {type === 'weekdays' && '🗓️ Select any Monday-Friday'}
                {type === 'weekend' && '🎉 Select any Saturday-Sunday'}
              </p>
            </div>
          )}

          <div className="relative">
            <Calendar
              mode="single"
              selected={value}
              onSelect={(date) => {
                onChange(date);
                setOpen(false);
              }}
              disabled={isDateDisabled}
              initialFocus
              className="rounded-md"
              classNames={{
                day_disabled: "text-muted-foreground/30 cursor-not-allowed hover:bg-transparent opacity-40 line-through decoration-red-500/50",
                day: "hover:bg-orange-secondary transition-colors",
                day_selected: "text-orange-primary bg-orange-primary text-black-primary hover:bg-orange-primary hover:text-white",
                day_today: "bg-orange-primary/30 text-orange-primary ring-2 ring-orange-primary/50 ring-offset-2 ring-offset-card"
              }}
            />
          </div>

          {showTypeInfo && (
            <div className="px-3 pb-3 pt-0 space-y-2">
              {type !== 'daily' && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-primary/10 border border-orange-primary/30">
                  <Info className="h-4 w-4 text-orange-primary mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    {getHelperText()}
                  </p>
                </div>
              )}

              {/* Legend */}
              <div className="p-2 rounded-lg bg-black-tertiary/50 space-y-1.5">
                <p className="text-xs text-muted-foreground mb-2">Legend:</p>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-6 h-6 rounded-md bg-orange-primary flex items-center justify-center text-white">15</div>
                  <span className="text-muted-foreground">Available & Selected</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-6 h-6 rounded-md ring-2 ring-orange-primary/50 ring-offset-2 ring-offset-card flex items-center justify-center text-orange-primary">15</div>
                  <span className="text-muted-foreground">Today</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground/30 line-through decoration-red-500/50 opacity-40">15</div>
                  <span className="text-muted-foreground">Disabled ({type === 'weekdays' ? 'Weekends' : type === 'weekend' ? 'Weekdays' : 'Past dates'})</span>
                </div>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Type Badge */}
      {showTypeInfo && type !== 'daily' && (
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${type === 'weekdays'
            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
            }`}>
            {type === 'weekdays' ? '📅 Weekdays Only' : '🎉 Weekends Only'}
          </span>
        </div>
      )}
    </div>
  );
}

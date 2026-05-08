"use client";

import { parseDate } from "chrono-node";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateInputProps {
  value?: Date;
  onChange?: (value: Date | undefined) => void;
  placeholder?: string;
}

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(date: Date | undefined) {
  if (!date) {
    return "10:30";
  }

  return date.toTimeString().slice(0, 5); // HH:MM format
}

export function DateInput({
  value,
  onChange,
  placeholder = "In 1 hour or September 23, 2025 at 09:15 AM",
}: DateInputProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(() =>
    value ? formatDate(value) : "",
  );
  const [month, setMonth] = React.useState<Date | undefined>(value);

  const handleTimeChange = (timeString: string) => {
    if (!value) return;

    const [hours, minutes] = timeString.split(":").map(Number);
    const newDate = new Date(value);
    newDate.setHours(hours, minutes, 0, 0);

    setInputValue(formatDate(newDate));
    onChange?.(newDate);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    // Preserve existing time if we have one, otherwise default to 10:30
    const currentTime = value
      ? { hours: value.getHours(), minutes: value.getMinutes() }
      : { hours: 10, minutes: 30 };

    const newDate = new Date(selectedDate);
    newDate.setHours(currentTime.hours, currentTime.minutes, 0, 0);

    setInputValue(formatDate(newDate));
    onChange?.(newDate);
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const parsedDate = parseDate(newValue);
    if (parsedDate) {
      setMonth(parsedDate);
      onChange?.(parsedDate);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={inputValue}
          placeholder={placeholder}
          className="bg-background pr-10"
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="end">
            <Calendar
              mode="single"
              selected={value}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={handleDateSelect}
            />
            <Input
              type="time"
              id="time-picker"
              value={formatTime(value)}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="w-full"
            />
          </PopoverContent>
        </Popover>
      </div>
      {value && (
        <div className="text-muted-foreground px-1 text-sm">
          On <span className="font-medium">{formatDate(value)}</span>.
        </div>
      )}
    </div>
  );
}

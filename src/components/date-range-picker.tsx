import * as React from "react"
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfToday, endOfToday, startOfYesterday, endOfYesterday } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar as CalendarIcon, ChevronRight } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  className?: string
  date: DateRange | undefined
  setDate: (date: DateRange | undefined) => void
}

export function DateRangePicker({
  className,
  date,
  setDate,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const quickOptions = [
    {
      label: "Hoy",
      getValue: () => ({ from: startOfToday(), to: endOfToday() }),
    },
    {
      label: "Ayer",
      getValue: () => ({ from: startOfYesterday(), to: endOfYesterday() }),
    },
    {
      label: "Últimos 7 días",
      getValue: () => ({ from: subDays(startOfToday(), 6), to: endOfToday() }),
    },
    {
      label: "Esta semana",
      getValue: () => ({ from: startOfWeek(startOfToday(), { weekStartsOn: 1 }), to: endOfWeek(startOfToday(), { weekStartsOn: 1 }) }),
    },
    {
      label: "Este mes hasta la fecha",
      getValue: () => ({ from: startOfMonth(startOfToday()), to: endOfToday() }),
    },
    {
      label: "Este trimestre",
      getValue: () => ({ from: subDays(startOfToday(), 90), to: endOfToday() }), // Simplified
    },
    {
      label: "Este año hasta la fecha",
      getValue: () => ({ from: startOfYear(startOfToday()), to: endOfToday() }),
    },
    {
      label: "Máximo",
      getValue: () => ({ from: new Date(2020, 0, 1), to: endOfToday() }), // Arbitrary max
    },
  ]

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-fit justify-start text-left font-semibold h-[26px] py-1 px-2.5 bg-surface text-xs border-border/70 hover:bg-surface-2",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-3.5 w-3.5" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y", { locale: es })} -{" "}
                  {format(date.to, "LLL dd, y", { locale: es })}
                </>
              ) : (
                format(date.from, "LLL dd, y", { locale: es })
              )
            ) : (
              <span>Seleccionar fechas</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex overflow-hidden rounded-xl border border-border/70 shadow-xl bg-background" align="start">
          <div className="w-[200px] border-r border-border/70 flex flex-col p-2 bg-surface">
            <div className="px-3 py-2 text-[13px] font-bold text-foreground mb-1">
              Opciones rápidas
            </div>
            {quickOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => {
                  setDate(option.getValue())
                  setIsOpen(false)
                }}
                className="w-full text-left px-3 py-2 text-[13px] font-semibold text-muted-foreground hover:bg-surface-2 hover:text-foreground rounded-lg transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="p-1">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from || new Date()}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              locale={es}
              className="bg-transparent"
              classNames={{
                months: "flex flex-row space-x-4 space-y-0",
                month: "space-y-4",
                head_cell: "text-muted-foreground rounded-md w-9 font-medium text-[0.8rem]",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(
                  "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-surface-2"
                ),
                range_start: "day-range-start bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                range_end: "day-range-end bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                range_middle:
                  "aria-selected:bg-accent aria-selected:text-accent-foreground",
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { useLocale } from "next-intl";

// Define DateRange type to match the DateRangePicker component
interface DateRange {
  from: Date;
  to: Date | undefined;
}

interface DateRangeState {
  from: string;
  to: string;
}

interface UseDateRangeReturn {
  dateRange: DateRangeState;
  handleDateRangeUpdate: (values: {
    range: DateRange;
    rangeCompare?: DateRange;
  }) => void;
  getFormattedDateRange: () => string;
  resetToDefault: () => void;
}

export function useDateRange(): UseDateRangeReturn {
  const locale = useLocale();

  // Calculate default date range (last 30 days)
  const getDefaultDateRange = () => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);

    return {
      from: lastMonth.toISOString().split("T")[0],
      to: today.toISOString().split("T")[0]
    };
  };

  const defaultRange = getDefaultDateRange();

  // State for managing date range
  const [dateRange, setDateRange] = useState<DateRangeState>({
    from: defaultRange.from,
    to: defaultRange.to
  });

  // Handle date range updates from DateRangePicker
  const handleDateRangeUpdate = (values: {
    range: DateRange;
    rangeCompare?: DateRange;
  }) => {
    console.log("Date range updated:", values);
    if (values.range?.from && values.range?.to) {
      const newDateRange = {
        from: values.range.from.toLocaleDateString('en-CA'), // YYYY-MM-DD in local time
        to: values.range.to.toLocaleDateString('en-CA')
      };

      setDateRange(newDateRange);

      const fromFormatted = formatDate(values.range.from.toISOString(), locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      const toFormatted = formatDate(values.range.to.toISOString(), locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      console.log(`Date range: ${fromFormatted} - ${toFormatted}`);
      console.log("Date range state updated:", newDateRange);
    }
  };

  // Get formatted date range for display
  const getFormattedDateRange = () => {
    const fromFormatted = formatDate(dateRange.from, locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    const toFormatted = formatDate(dateRange.to, locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    return `${fromFormatted} - ${toFormatted}`;
  };

  // Reset to default date range
  const resetToDefault = () => {
    const newDefaultRange = getDefaultDateRange();
    setDateRange({
      from: newDefaultRange.from,
      to: newDefaultRange.to
    });
  };

  return {
    dateRange,
    handleDateRangeUpdate,
    getFormattedDateRange,
    resetToDefault
  };
}

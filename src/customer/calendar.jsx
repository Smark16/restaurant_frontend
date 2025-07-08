"use client"

import { useState } from "react"
import { Box, Typography, IconButton, Grid, Paper, useTheme, alpha } from "@mui/material"
import { ChevronLeft, ChevronRight, Today } from "@mui/icons-material"

const Calendar = () => {
  const theme = useTheme()
  const [currentDate, setCurrentDate] = useState(new Date())

  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const isToday = (day) => {
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year
  }

  const renderCalendarDays = () => {
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(
        <Grid item xs key={`empty-${i}`}>
          <Box sx={{ height: 40 }} />
        </Grid>,
      )
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay = isToday(day)

      days.push(
        <Grid item xs key={day}>
          <Paper
            elevation={isCurrentDay ? 2 : 0}
            sx={{
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              bgcolor: isCurrentDay ? "primary.main" : "transparent",
              color: isCurrentDay ? "primary.contrastText" : "text.primary",
              border: isCurrentDay ? "none" : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: isCurrentDay ? "primary.dark" : alpha(theme.palette.primary.main, 0.1),
                transform: "scale(1.05)",
              },
            }}
          >
            <Typography variant="body2" fontWeight={isCurrentDay ? "bold" : "normal"}>
              {day}
            </Typography>
          </Paper>
        </Grid>,
      )
    }

    return days
  }

  return (
    <Box>
      {/* Calendar Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <IconButton onClick={goToPreviousMonth} size="small">
          <ChevronLeft />
        </IconButton>

        <Typography variant="h6" fontWeight="bold">
          {monthNames[month]} {year}
        </Typography>

        <IconButton onClick={goToNextMonth} size="small">
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Today Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <IconButton onClick={goToToday} size="small" color="primary">
          <Today sx={{ mr: 0.5 }} />
          <Typography variant="caption">Today</Typography>
        </IconButton>
      </Box>

      {/* Day Names */}
      <Grid container spacing={0.5} sx={{ mb: 1 }}>
        {dayNames.map((dayName) => (
          <Grid item xs key={dayName}>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                textAlign: "center",
                fontWeight: "bold",
                color: "text.secondary",
              }}
            >
              {dayName}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* Calendar Days */}
      <Grid container spacing={0.5}>
        {renderCalendarDays()}
      </Grid>
    </Box>
  )
}

export default Calendar
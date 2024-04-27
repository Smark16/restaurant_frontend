import React, { useState, useEffect } from 'react';

function Calendar() {
  const [currentMonth, setCurrentMonth] = useState('');
  const [day, setDay] = useState('')
  const date = new Date();
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const month = date.getMonth();
  const currentYear = date.getFullYear();

 
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfWeek = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(month, currentYear);
  const firstDayOfWeek = getFirstDayOfWeek(month, currentYear);

  // Calculate the start and end dates of the current week
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  
  const startOfWeek = currentDay - currentDate.getDay();
  const endOfWeek = startOfWeek + 6;
 
  useEffect(() => {
    setCurrentMonth(months[month]);
    setDay(currentDay)
  }, [month]);

  // Ensure the start and end dates are within the month's range
  const startDay = Math.max(1, startOfWeek);
  const endDay = Math.min(daysInMonth, endOfWeek);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  

  return (
    <>
      <div>
        <div className='text-center bg-success p-2 text-white'>
          <h5>{currentMonth}</h5>
        </div>
        <ul className='d-flex justify-content-between wk'>
          <li>Sun</li>
          <li>Mon</li>
          <li>Tue</li>
          <li>Wed</li>
          <li>Thu</li>
          <li>Fri</li>
          <li>Sat</li>
        </ul>

        <ul className='d-flex justify-content-between days'>
          {days
            .filter((day) => day >= startDay && day <= endDay)
            .map((day) => (
              <li key={day} className={day === currentDay ? 'cactive' : ''}>{day}</li>
            ))}
        </ul>
      </div>
    </>
  );
}

export default Calendar;

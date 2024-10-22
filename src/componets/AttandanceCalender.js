
import React from "react";
import "./AttendanceCalendar.css";

const AttendanceCalendar = ({ attendanceData }) => {
  return (
    <div id="attendance-calendar" className="flex w-full">
      {attendanceData.map((entry) => (
        <div
          key={entry.date}
          className="day"
          data-date={entry.date}
          data-status={entry.status}
          style={{ backgroundColor: getStatusColor(entry.status) }}
        />
      ))}
    </div>
  );
};

// Function to determine color based on attendance status
const getStatusColor = (status) => {
  switch (status) {
    case 0: // Absent
      return "#ebedf0"; // Light gray
    case 1: // Present
      return "#239a3b"; // Dark green
    case 2: // Half-day
      return "#7bc96f"; // Light green
    default:
      return "#ebedf0";
  }
};

export default AttendanceCalendar;

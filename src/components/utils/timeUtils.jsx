// utils/timeUtils.js
  // Function to format time as mm:ss
  export  const formatTime = ({ hours, minutes, seconds }) => {
    const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;
    const secondsFormatted = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesFormatted}:${secondsFormatted}`;
  };
// utils/timeUtils.js

export const calculateTimeLeft = (endTime) => {
  const now = new Date();
  const meetingEndTime = new Date(endTime);  // Convert the string date to a Date object

  // Calculate the time difference in milliseconds
  const timeDifference = meetingEndTime - now;

  // If the meeting has ended, return 0 hours, 0 minutes, and 0 seconds
  if (timeDifference <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  // Calculate hours, minutes, and seconds
  const totalSeconds = Math.floor(timeDifference / 1000);
  const hours = Math.floor(totalSeconds / 3600); // 3600 seconds in an hour
  const minutes = Math.floor((totalSeconds % 3600) / 60); // 60 seconds in a minute
  const seconds = totalSeconds % 60; // Remaining seconds

  return { hours, minutes, seconds };
};

  
  //


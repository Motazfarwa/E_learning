// utils/timeUtils.js
  // Function to format time as mm:ss
  export  const formatTime = ({ hours, minutes, seconds }) => {
    const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;
    const secondsFormatted = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesFormatted}:${secondsFormatted}`;
  };
// utils/timeUtils.js

export const calculateTimeLeft = (endTime) => {
  try {
    const now = new Date();
    const meetingEndTime = new Date(endTime);

    // Validate the date
    if (isNaN(meetingEndTime.getTime())) {
      throw new Error('Invalid endTime format');
    }

    const timeDifference = meetingEndTime - now;

    if (timeDifference <= 0) {
      return { 
        totalSeconds: 0,  // Add this
        hours: 0, 
        minutes: 0, 
        seconds: 0 
      };
    }

    const totalSeconds = Math.floor(timeDifference / 1000);
    return {
      totalSeconds,  // Include this in the return
      hours: Math.floor(totalSeconds / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60
    };
  } catch (error) {
    console.error('Time calculation error:', error);
    return { 
      totalSeconds: 0,  // Ensure this exists
      hours: 0, 
      minutes: 0, 
      seconds: 0 
    };
  }
};

  
  //
export const convertMilliseconds = (ms: number, showMinutes?: boolean) => {
  // calc the minutes
  const minutes = Math.floor(ms / 60000);

  // calc the seconds
  const seconds = Math.floor((ms % 60000) / 1000);

  // check for sec under 10
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return showMinutes
    ? `${minutes} min ${seconds} sec`
    : `${minutes}:${formattedSeconds}`;
};

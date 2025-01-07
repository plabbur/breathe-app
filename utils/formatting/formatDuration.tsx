const formatDuration = (duration: number) => {
  const formattedTimeHours = String(Math.floor((duration / (60 * 60)) % 60));
  const formattedTimeMinutes = String(
    Math.floor((duration / 60) % 60)
  ).padStart(duration < 60 * 10 ? 1 : 2, "0");
  const formattedTimeSeconds = String(duration % 60).padStart(2, "0");

  return duration < 60 * 60
    ? `${formattedTimeMinutes}:${formattedTimeSeconds}`
    : `${formattedTimeHours}:${formattedTimeMinutes}:${formattedTimeSeconds}`;
};

export default formatDuration;

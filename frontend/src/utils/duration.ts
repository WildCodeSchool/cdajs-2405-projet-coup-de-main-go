export function formatDurationToHours(durationInMinutes?: number): string {
  if (!durationInMinutes) return "Non disponible";

  const durationInHours = durationInMinutes / 60;
  const formattedDuration =
    durationInHours % 1 === 0
      ? durationInHours.toFixed(0)
      : durationInHours.toFixed(1);

  const unit = durationInHours < 2 ? "heure" : "heures";
  return `${formattedDuration} ${unit}`;
}

// Convert selected durations to min and max values (in minutes)
export function getDurationValues(durations: string[]) {
  const mins = durations.map((d) => parseInt(d.split(" - ")[0], 10) * 60);
  const maxs = durations.map((d) => parseInt(d.split(" - ")[1], 10) * 60);

  return {
    durationMin: mins.length > 0 ? Math.min(...mins) : null,
    durationMax: maxs.length > 0 ? Math.max(...maxs) : null,
  };
}

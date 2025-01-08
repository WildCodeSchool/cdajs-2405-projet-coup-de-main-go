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

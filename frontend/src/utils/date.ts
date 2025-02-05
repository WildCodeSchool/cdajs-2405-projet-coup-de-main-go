import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";

export function formatDurationToNow(date: Date): string {
  const now = new Date();
  const minutes = differenceInMinutes(now, date);
  if (minutes < 60) return `${minutes}min`;

  const hours = differenceInHours(now, date);
  if (hours < 24) return `${hours}h`;

  const days = differenceInDays(now, date);
  if (days < 7) return `${days}j`;

  if (days < 30)
    return `${Math.floor(days / 7)} semaine${Math.floor(days / 7) > 1 ? "s" : ""}`;

  const months = differenceInMonths(now, date);
  if (months < 12) return `${months} mois`;

  const years = differenceInYears(now, date);
  return `${years} an${years > 1 ? "s" : ""}`;
}

export type TimeLeftStyle = "short" | "long";

/**
 * Returns strings like:
 * - "1 day left", "2 days left"
 * - "1 hour left"
 * - "30 min left"
 * - "35 sec left"
 * - "Ended"
 */
export function formatTimeLeft(
    endsAtIso: string,
    now: Date = new Date(),
    style: TimeLeftStyle = "long"
): string {
    const endsAt = new Date(endsAtIso);

    if (Number.isNaN(endsAt.getTime())) return "";
    const diffMs = endsAt.getTime() - now.getTime();

    if (diffMs <= 0) return "Ended";

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const plural = (n: number, s: string) => (n === 1 ? s : `${s}s`);

    if (days >= 1) {
        return style === "short"
            ? `${days}d left`
            : `${days} ${plural(days, "day")} left`;
    }

    if (hours >= 1) {
        return style === "short"
            ? `${hours}h left`
            : `${hours} ${plural(hours, "hour")} left`;
    }

    if (minutes >= 1) {
        return style === "short"
            ? `${minutes}m left`
            : `${minutes} min left`;
    }

    return style === "short" ? `${seconds}s left` : `${seconds} sec left`;
}
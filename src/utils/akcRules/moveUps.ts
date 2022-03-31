import { parseJSON, getDay, previousMonday, add, isBefore, sub } from "date-fns";

export const moveUpEligible = (firstTrialDate: string | undefined | null): boolean => {
    if (!firstTrialDate) {
        return true;
    }

    const firstTrial = parseJSON(firstTrialDate);
    const dayOfWeek = getDay(firstTrial);

    const deadline = dayOfWeek >= 4 ? add(previousMonday(firstTrial), { hours: 18 }) : sub(firstTrial, { days: 6, hours: 6 });
    const now = new Date();
    return isBefore(now, deadline);
};

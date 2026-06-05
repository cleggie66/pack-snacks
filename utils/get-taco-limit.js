import { startOfDay, isTuesday } from 'date-fns';

const DAILY_LIMIT = 5;
const TUESDAY_LIMIT = 10;

export function getTacoLimit(userLimitsStorage, user, ts) {
    // Setup date in storage object if needed
    const date = startOfDay(new Date(parseFloat(ts) * 1000));
    if (!userLimitsStorage[date]) {
        userLimitsStorage[date] = {};
    }

    // Check if user has sent any tacos on the given date
    let tacosSent = 0;
    if (userLimitsStorage[date][user]) {
        tacosSent = userLimitsStorage[date][user];
    } else {
        tacosSent = 0;
        userLimitsStorage[date][user] = 0;
    }

    // Determine gift limit based on day of the week
    let dailyLimit;
    if (isTuesday(date)) {
        dailyLimit = TUESDAY_LIMIT;
    } else {
        dailyLimit = DAILY_LIMIT;
    }
    const tacoLimit = dailyLimit - tacosSent;

    // Return taco limit
    return { tacoLimit, dailyLimit };
};
import { startOfDay } from 'date-fns';
import { getTacoLimit } from './get-taco-limit.js';

export function updateTacoLimit(userLimitsStorage, user, ts, tacoCount) {
    // Setup date in storage object if needed
    const date = startOfDay(new Date(parseFloat(ts) * 1000));
    if (!userLimitsStorage[date]) {
        userLimitsStorage[date] = {};
    }

    // Update user's taco count
    if (userLimitsStorage[date][user]) {    
        userLimitsStorage[date][user] += tacoCount;
    } else {
        userLimitsStorage[date][user] = tacoCount;
    }

    // Return updated taco limit
    const { tacoLimit } = getTacoLimit(userLimitsStorage, user, ts);
    return tacoLimit;
}
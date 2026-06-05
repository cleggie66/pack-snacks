export function countTacosByRecipient(tacos) {
    const tacoCount = {};

    for (const taco of tacos) {
        if (tacoCount[taco.to]) {
            tacoCount[taco.to] += 1;
        } else {
            tacoCount[taco.to] = 1;
        }
    }

    return tacoCount;
}
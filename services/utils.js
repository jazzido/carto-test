export const CSCALE = ['#edf8fb',
                       '#b2e2e2',
                       '#66c2a4',
                       '#2ca25f',
                       '#006d2c'];

export function findBreak(breaks, val) {
    var b = breaks.findIndex(b => b > val);
    return b = b == -1 ? breaks.length - 1 : b;
}
